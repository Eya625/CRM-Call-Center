import React, { useState, useEffect } from "react";
import {List, Card, Button, Select, Typography, Space, Tag, Progress, Badge, Modal, InputNumber, message, Tooltip, Slider } from "antd";
import { 
  AudioOutlined, 
  PhoneOutlined, 
  PauseCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined, 
  ClockCircleOutlined,
  SoundOutlined,
  PlusOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const { Text, Title } = Typography;
const { Option } = Select;

export default function Softphone() {
  const [status, setStatus] = useState("Available");
  const [callTime, setCallTime] = useState(0);
  const [inCall, setInCall] = useState(false);
  const [currentNumber, setCurrentNumber] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [pauseReason, setPauseReason] = useState("");
  const [callHistory, setCallHistory] = useState([]);
  const [volume, setVolume] = useState(80);
  const [showHistory, setShowHistory] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);

  // Simulation d'appels entrants
  useEffect(() => {
    const interval = setInterval(() => {
      if (!inCall && status === "Available" && Math.random() > 0.7) {
        const fakeNumber = `+216 ${Math.floor(Math.random() * 90000000 + 10000000)}`;
        setIncomingCall(fakeNumber);
        message.info(`Appel entrant de ${fakeNumber}`, 5);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [inCall, status]);

  useEffect(() => {
    let timer;
    if (inCall && !isOnHold) {
      timer = setInterval(() => setCallTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [inCall, isOnHold]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartCall = () => {
    if (!currentNumber) {
      message.warning("Veuillez entrer un numéro de téléphone");
      return;
    }
    setInCall(true);
    setIncomingCall(null);
    message.success(`Appel en cours vers ${currentNumber}`);
  };

  const handleEndCall = () => {
    const callDuration = callTime;
    setCallHistory(prev => [{
      number: currentNumber,
      duration: callDuration,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    }, ...prev].slice(0, 10));
    setInCall(false);
    setIsMuted(false);
    setIsOnHold(false);
    setCurrentNumber("");
    message.info(`Appel terminé. Durée: ${formatTime(callDuration)}`);
  };

  const handleAcceptCall = () => {
    setCurrentNumber(incomingCall);
    setInCall(true);
    setIncomingCall(null);
    message.success("Appel accepté");
  };

  const handleRejectCall = () => {
    setIncomingCall(null);
    message.warning("Appel rejeté");
  };

  const statusColor = {
    Available: "#f97316",
    "On Call": "#f97316",
    Paused: "#f97316",
    "Wrap-up": "#f97316",
  };

  const statusAnimation = {
    Available: { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 2 } },
    "On Call": { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1 } },
    Paused: { x: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 0.5 } },
    "Wrap-up": {x: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 3 } },
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          title={
            <Space>
              <PhoneOutlined style={{ color: "#f97316" }} />
              <Title level={4} style={{ margin: 0, color: "#1a1a1a" }}>Softphone Pro</Title>
              <Badge 
                status={status === "Available" ? "success" : status === "On Call" ? "processing" : "error"} 
                text={status}
              />
            </Space>
          }
          style={styles.card}
          bodyStyle={{ padding: "24px" }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Statut Agent avec animation */}
            <motion.div
              animate={statusAnimation[status]}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <Text strong style={{ color: "#1a1a1a" }}>Statut Agent:</Text>
              <Select
                value={status}
                onChange={setStatus}
                style={{ width: 150 }}
                dropdownStyle={{ borderRadius: 12 }}
              >
                <Option value="Available"><Badge status="success" /> Disponible</Option>
                <Option value="On Call"><Badge status="processing" /> En appel</Option>
                <Option value="Paused"><Badge status="error" /> En pause</Option>
                <Option value="Wrap-up"><Badge status="warning" /> Post-appel</Option>
              </Select>
            </motion.div>

            {/* Motif pause */}
            <AnimatePresence>
              {status === "Paused" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Select
                    placeholder="Motif de la pause"
                    style={{ width: "100%" }}
                    value={pauseReason}
                    onChange={setPauseReason}
                  >
                    <Option value="Coffee Break">☕ Pause café</Option>
                    <Option value="Lunch">🍱 Pause déjeuner</Option>
                    <Option value="Training">📚 Formation</Option>
                    <Option value="Meeting">👥 Réunion</Option>
                    <Option value="Technical Issue">🔧 Problème technique</Option>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Numéro + Timer */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={styles.callInfo}
            >
              <div>
                <Text type="secondary" style={{ color: "#666" }}>Numéro appelé</Text>
                <InputNumber
                  value={currentNumber}
                  onChange={setCurrentNumber}
                  style={{ width: "100%", marginTop: 5 }}
                  placeholder="+216 XX XXX XXX"
                  disabled={inCall}
                  size="large"
                />
              </div>
              <div style={styles.timer}>
                <ClockCircleOutlined style={{ color: "#f97316" }} />
                <Text style={{ fontSize: 24, fontWeight: "bold", fontFamily: "monospace", color: "#1a1a1a" }}>
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
                  strokeColor={{
                    "0%": "#f97316",
                    "50%": "#f97316",
                    "100%": "#f97316",
                  }}
                  strokeWidth={8}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                  <Text type="secondary" style={{ fontSize: 11, color: "#666" }}>Début</Text>
                  <Text type="secondary" style={{ fontSize: 11, color: "#666" }}>5 min</Text>
                </div>
              </motion.div>
            )}

            {/* Boutons de contrôle */}
            <Space wrap style={{ display: "flex", justifyContent: "space-between" }}>
              <Tooltip title="Couper le micro">
                <Button
                  type={isMuted ? "primary" : "default"}
                  danger={isMuted}
                  icon={<AudioOutlined />}
                  disabled={!inCall}
                  onClick={() => setIsMuted(!isMuted)}
                  style={styles.controlButton}
                  className={isMuted ? "orange-button" : ""}
                >
                  {isMuted ? "Micro coupé" : "Mute"}
                </Button>
              </Tooltip>

              <Tooltip title="Mettre en attente">
                <Button
                  type={isOnHold ? "primary" : "default"}
                  icon={<PauseCircleOutlined />}
                  disabled={!inCall}
                  onClick={() => setIsOnHold(!isOnHold)}
                  style={styles.controlButton}
                  className={isOnHold ? "orange-button" : ""}
                >
                  {isOnHold ? "En attente" : "Hold"}
                </Button>
              </Tooltip>

              <Tooltip title="Volume">
                <Button
                  icon={<AudioOutlined />}
                  onClick={() => Modal.info({ title: "Volume", content: <Slider value={volume} onChange={setVolume} /> })}
                  style={styles.controlButton}
                >
                  Volume
                </Button>
              </Tooltip>

              <Tooltip title="Historique">
                <Button
                  icon={<HistoryOutlined />}
                  onClick={() => setShowHistory(true)}
                  style={styles.controlButton}
                >
                  Historique
                </Button>
              </Tooltip>

              {!inCall ? (
                <Tooltip title="Démarrer l'appel">
                  <Button
                    type="primary"
                    icon={<PhoneOutlined />}
                    onClick={handleStartCall}
                    style={{ ...styles.callButton, background: "#f97316", borderColor: "#f97316" }}
                  >
                    Appeler
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Raccrocher">
                  <Button
                    type="primary"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={handleEndCall}
                    style={styles.callButton}
                  >
                    Raccrocher
                  </Button>
                </Tooltip>
              )}
            </Space>

            {/* Indicateurs de statut */}
            <div style={styles.statusIndicators}>
              {isMuted && <Tag icon={<SoundOutlined />} color="orange">Micro coupé</Tag>}
              {isOnHold && <Tag icon={<PauseCircleOutlined />} color="orange">En attente</Tag>}
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
          <PhoneOutlined style={{ fontSize: 60, color: "#f97316", marginBottom: 20 }} />
          <Title level={4} style={{ color: "#1a1a1a" }}>Appel entrant</Title>
          <Text style={{ fontSize: 18, display: "block", marginBottom: 20, color: "#1a1a1a" }}>{incomingCall}</Text>
          <Space>
            <Button type="primary" size="large" icon={<PhoneOutlined />} onClick={handleAcceptCall} style={{ background: "#f97316", borderColor: "#f97316" }}>
              Accepter
            </Button>
            <Button danger size="large" icon={<CloseCircleOutlined />} onClick={handleRejectCall}>
              Refuser
            </Button>
          </Space>
        </motion.div>
      </Modal>

      {/* Modal Historique */}
      <Modal
        title="Historique des appels"
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
                  title={<Text strong style={{ color: "#1a1a1a" }}>{call.number}</Text>}
                  description={<span style={{ color: "#666" }}>Durée: {formatTime(call.duration)} • {call.date} {call.time}</span>}
                />
              </List.Item>
            </motion.div>
          )}
        />
        {callHistory.length === 0 && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Text type="secondary" style={{ color: "#666" }}>Aucun historique d'appel</Text>
          </div>
        )}
      </Modal>

      <style jsx>{`
        :global(.ant-btn-primary) {
          background: #f97316;
          border-color: #f97316;
        }
        :global(.ant-btn-primary:hover) {
          background: #fd8b3a;
          border-color: #fd8b3a;
        }
        :global(.orange-button) {
          background: #f97316;
          border-color: #f97316;
          color: white;
        }
        :global(.orange-button:hover) {
          background: #fd8b3a;
          border-color: #fd8b3a;
        }
        :global(.ant-tag-orange) {
          background: #fff7e6;
          border-color: #ffd591;
          color: #f97316;
        }
        :global(.ant-progress-bg) {
          background: #f97316 !important;
        }
        :global(.ant-badge-status-success) {
          background-color: #f97316;
        }
        :global(.ant-badge-status-processing) {
          background-color: #f97316;
        }
        :global(.ant-badge-status-error) {
          background-color: #f97316;
        }
        :global(.ant-badge-status-warning) {
          background-color: #f97316;
        }
      `}</style>
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