// frontend/src/components/Softphone.jsx
import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  Select,
  Typography,
  Space,
  Tag,
  Progress,
  Badge,
  Modal,
  InputNumber,
  message,
  Tooltip,
  Slider,
} from "antd";
import {
  AudioOutlined,
  PhoneOutlined,
  PauseCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SoundOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { UserAgent, Registerer } from "sip.js";
import { startCalling } from "./../api/api";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
const { Text, Title } = Typography;
const { Option } = Select;

export default function Softphone({ currentNumber, setCurrentNumber }) {
  // --- États principaux ---
  const [status, setStatus] = useState("Paused");
  const [callTime, setCallTime] = useState(0);
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [pauseReason, setPauseReason] = useState("");
  const [callHistory, setCallHistory] = useState([]);
  const [volume, setVolume] = useState(80);
  const [showHistory, setShowHistory] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [incomingInvitation, setIncomingInvitation] = useState(null);
  const [sipUA, setSipUA] = useState(null);

  useEffect(() => {
    socket.on("incomingCall", ({ number }) => {
      console.log("📞 Incoming call from backend:", number);
      setIncomingCall(number);

      // Stub pour accepter/rejeter si nécessaire
      setIncomingInvitation({
        accept: () => {
          setCurrentNumber(number);
          setInCall(true);
          setIncomingCall(null);
          setIncomingInvitation(null);
          setStatus("On Call");
          message.success("Call accepted");
        },
        reject: () => {
          setIncomingCall(null);
          setIncomingInvitation(null);
          message.warning("Call rejected");
        },
      });

      message.info(`Incoming call from ${number}`);
    });

    return () => {
      socket.off("incomingCall");
    };
  }, []);
  useEffect(() => {
    if (status !== "Available") return;
    if (sipUA) return;

    const SIP_SERVER = "localhost";
    const WS_SERVER = "ws://localhost:8088/ws";

    const uri = UserAgent.makeURI(`sip:agent@${SIP_SERVER}`);
    if (!uri) {
      console.error("❌ Invalid SIP URI");
      return;
    }

    const userAgent = new UserAgent({
      uri,
      transportOptions: {
        server: WS_SERVER,
      },
      authorizationUsername: "agent",
      authorizationPassword: "123456",

      sessionDescriptionHandlerFactoryOptions: {
        peerConnectionConfiguration: {
          iceServers: [],
        },
      },

      delegate: {
        onInvite: (invitation) => {
          console.log(
            "📞 Incoming call:",
            invitation.remoteIdentity.uri.toString(),
          );

          setIncomingCall(invitation.remoteIdentity.uri.user);
          setIncomingInvitation(invitation);

          message.info(
            `Incoming call from ${invitation.remoteIdentity.uri.user}`,
          );
        },
      },
    });

    const registerer = new Registerer(userAgent);

    const startUA = async () => {
      try {
        await userAgent.start();
        console.log("✅ SIP WS CONNECTED");

        await registerer.register();
        console.log("✅ REGISTER SENT");
      } catch (err) {
        console.error("❌ SIP INIT FAILED:", err);
      }
    };

    startUA();

    setSipUA({ userAgent, registerer });

    return () => {
      try {
        registerer.unregister().catch(() => {});
        userAgent.stop();
      } catch (e) {
        console.warn("cleanup error", e);
      }
    };
  }, [status]);
  // --- Timer d'appel ---
  useEffect(() => {
    let timer;
    if (inCall && !isOnHold) {
      timer = setInterval(() => setCallTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [inCall, isOnHold]);

  // --- Message pause ---
  useEffect(() => {
    if (status === "Paused") {
      message.info("Agent is paused! Switch to Available to start calling.");
    }
  }, [status]);

  // --- Auto Dialer ---
  useEffect(() => {
    if (status === "Available") {
      console.log("Agent is AVAILABLE → start auto dialing");
      startCalling()
        .then((res) => {
          console.log("Auto dialing response:", res.data);
          message.success("Auto dialing started");
        })
        .catch((err) => {
          console.error("Failed to start auto dialing:", err);
          message.error("Failed to start auto dialing");
        });
    }
  }, [status]);

  // --- Helper ---
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- Contrôles d'appel ---
  const handleStartCall = () => {
    if (status !== "Available")
      return message.error("Agent must be Available to start a call");
    if (!currentNumber) return message.warning("Please enter a phone number");
    setInCall(true);
    setStatus("On Call");
    setIncomingCall(null);
    message.success(`Calling ${currentNumber}`);
  };

  const handleEndCall = () => {
    const callDuration = callTime;
    setCallHistory((prev) =>
      [
        {
          number: currentNumber,
          duration: callDuration,
          time: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
        },
        ...prev,
      ].slice(0, 10),
    );
    setInCall(false);
    setIsMuted(false);
    setIsOnHold(false);
    setCallTime(0);
    setCurrentNumber("");
    message.info(`Call ended. Duration: ${formatTime(callDuration)}`);
    setStatus("Paused");
    message.info(
      "Agent is now Paused. Switch to Available to continue calling.",
    );
  };
  const handleAcceptCall = () => {
    if (!incomingInvitation) return;
    incomingInvitation.accept();
    setCurrentNumber(incomingCall);
    setInCall(true);
    setIncomingCall(null);
    setIncomingInvitation(null);
    setStatus("On Call");
    message.success("Call accepted");
  };

  const handleRejectCall = () => {
    if (incomingInvitation) incomingInvitation.reject();
    setIncomingCall(null);
    setIncomingInvitation(null);
    message.warning("Call rejected");
  };

  // --- Status Animation ---
  const statusAnimation = {
    Available: {
      scale: [1, 1.1, 1],
      transition: { repeat: Infinity, duration: 2 },
    },
    "On Call": {
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 1 },
    },
    Paused: {
      x: [0, -5, 5, 0],
      transition: { repeat: Infinity, duration: 0.5 },
    },
    "Wrap-up": {
      x: [0, -5, 5, 0],
      transition: { repeat: Infinity, duration: 3 },
    },
  };

  // --- UI ---
  return (
    <>
      {/* Softphone Card */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          title={
            <Space>
              <PhoneOutlined style={{ color: "#f97316" }} />
              <Title level={4} style={{ margin: 0, color: "#1a1a1a" }}>
                Softphone Pro
              </Title>
              <Badge
                status={
                  status === "Available"
                    ? "success"
                    : status === "On Call"
                      ? "processing"
                      : "error"
                }
                text={status}
              />
            </Space>
          }
          style={{ borderRadius: 16 }}
          bodyStyle={{ padding: "24px" }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Statut Agent */}
            <motion.div
              animate={statusAnimation[status]}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text strong style={{ color: "#1a1a1a" }}>
                Agent Status:
              </Text>
              <Select
                value={status}
                onChange={setStatus}
                style={{ width: 150 }}
                dropdownStyle={{ borderRadius: 12 }}
              >
                <Option value="Available">
                  <Badge status="success" /> Available
                </Option>
                <Option value="On Call">
                  <Badge status="processing" /> On Call
                </Option>
                <Option value="Paused">
                  <Badge status="error" /> Paused
                </Option>
                <Option value="Wrap-up">
                  <Badge status="warning" /> Wrap-up
                </Option>
              </Select>
            </motion.div>

            {/* Pause Reason */}
            <AnimatePresence>
              {status === "Paused" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Select
                    placeholder="Pause Reason"
                    style={{ width: "100%" }}
                    value={pauseReason}
                    onChange={setPauseReason}
                  >
                    <Option value="Coffee Break">☕ Coffee Break</Option>
                    <Option value="Lunch">🍱 Lunch Break</Option>
                    <Option value="Training">📚 Training</Option>
                    <Option value="Meeting">👥 Meeting</Option>
                    <Option value="Technical Issue">🔧 Technical Issue</Option>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Number & Timer */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <Text type="secondary" style={{ color: "#666" }}>
                  Called Number
                </Text>
                <InputNumber
                  value={currentNumber}
                  onChange={setCurrentNumber}
                  style={{ width: "100%", marginTop: 5 }}
                  placeholder="+216 XX XXX XXX"
                  disabled={inCall}
                  size="large"
                />
              </div>
              <div style={{ marginLeft: 16, textAlign: "center" }}>
                <ClockCircleOutlined
                  style={{ color: "#f97316", fontSize: 24 }}
                />
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    fontFamily: "monospace",
                    color: "#1a1a1a",
                  }}
                >
                  {formatTime(callTime)}
                </Text>
              </div>
            </motion.div>

            {/* Progression d'appel */}
            {inCall && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Progress
                  percent={(callTime % 300) / 3}
                  showInfo={false}
                  strokeWidth={8}
                  strokeColor="#f97316"
                />
              </motion.div>
            )}

            {/* Contrôles */}
            <Space
              wrap
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Tooltip title="Mute Microphone">
                <Button
                  type={isMuted ? "primary" : "default"}
                  danger={isMuted}
                  icon={<AudioOutlined />}
                  disabled={!inCall}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? "Microphone Off" : "Mute"}
                </Button>
              </Tooltip>
              <Tooltip title="Put on Hold">
                <Button
                  type={isOnHold ? "primary" : "default"}
                  icon={<PauseCircleOutlined />}
                  disabled={!inCall}
                  onClick={() => setIsOnHold(!isOnHold)}
                >
                  {isOnHold ? "En attente" : "Hold"}
                </Button>
              </Tooltip>
              <Tooltip title="Volume">
                <Button
                  icon={<AudioOutlined />}
                  onClick={() =>
                    Modal.info({
                      title: "Volume",
                      content: <Slider value={volume} onChange={setVolume} />,
                    })
                  }
                >
                  Volume
                </Button>
              </Tooltip>
              <Tooltip title="Historique">
                <Button
                  icon={<HistoryOutlined />}
                  onClick={() => setShowHistory(true)}
                >
                  History
                </Button>
              </Tooltip>

              {!inCall ? (
                <Tooltip title="Démarrer l'appel">
                  <Button
                    type="primary"
                    icon={<PhoneOutlined />}
                    onClick={handleStartCall}
                    disabled={status !== "Available" || !currentNumber}
                    style={{ background: "#f97316", borderColor: "#f97316" }}
                  >
                    Start Call
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Raccrocher">
                  <Button
                    type="primary"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={handleEndCall}
                  >
                    Hang Up
                  </Button>
                </Tooltip>
              )}
            </Space>

            {/* Tags statut */}
            <div style={{ marginTop: 8 }}>
              {isMuted && (
                <Tag icon={<SoundOutlined />} color="orange">
                  Muted
                </Tag>
              )}
              {isOnHold && (
                <Tag icon={<PauseCircleOutlined />} color="orange">
                  On Hold
                </Tag>
              )}
            </div>
          </Space>
        </Card>
      </motion.div>

      {/* Modal Appel entrant */}
      <Modal
        open={!!incomingCall}
        footer={null}
        closable={false}
        centered
        width={400}
        bodyStyle={{ textAlign: "center", padding: 24 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <PhoneOutlined
            style={{ fontSize: 60, color: "#f97316", marginBottom: 20 }}
          />
          <Title level={4} style={{ color: "#1a1a1a" }}>
            Incoming Call
          </Title>
          <Text
            style={{
              fontSize: 18,
              display: "block",
              marginBottom: 20,
              color: "#1a1a1a",
            }}
          >
            Call from: {incomingCall}
          </Text>
          <Space>
            <Button
              type="primary"
              size="large"
              icon={<PhoneOutlined />}
              onClick={handleAcceptCall}
              style={{ background: "#f97316", borderColor: "#f97316" }}
            >
              Accept
            </Button>
            <Button
              danger
              size="large"
              icon={<CloseCircleOutlined />}
              onClick={handleRejectCall}
            >
              Reject
            </Button>
          </Space>
        </motion.div>
      </Modal>

      {/* Modal Historique */}
      <Modal
        title="Call History"
        open={showHistory}
        onCancel={() => setShowHistory(false)}
        footer={null}
        width={500}
      >
        <List
          dataSource={callHistory}
          renderItem={(call, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <List.Item>
                <List.Item.Meta
                  avatar={<PhoneOutlined style={{ color: "#f97316" }} />}
                  title={
                    <Text strong style={{ color: "#1a1a1a" }}>
                      {call.number}
                    </Text>
                  }
                  description={
                    <span style={{ color: "#666" }}>
                      Duration: {formatTime(call.duration)} • {call.date}{" "}
                      {call.time}
                    </span>
                  }
                />
              </List.Item>
            </motion.div>
          )}
        />
        {callHistory.length === 0 && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Text type="secondary" style={{ color: "#666" }}>
              No call History
            </Text>
          </div>
        )}
      </Modal>
    </>
  );
}
const styles = {
  card: {
    borderRadius: 20,
    border: "none",
    background: "#ffffff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
  },
  callInfo: {
    padding: "16px",
    background: "#fafafa",
    borderRadius: 16,
    border: "1px solid #e8e8e8",
  },
  timer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    gap: 10,
    marginTop: 15,
  },
  controlButton: {
    flex: 1,
    borderRadius: 10,
    transition: "all 0.3s",
  },
  callButton: {
    flex: 1,
    borderRadius: 10,
    height: 40,
    fontWeight: "bold",
  },
  statusIndicators: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    marginTop: 10,
  },
};
