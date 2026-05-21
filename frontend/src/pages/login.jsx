import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  message,
  Spin,
  Badge,
  Progress,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  CustomerServiceOutlined,
  SoundOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [agentStatus, setAgentStatus] = useState("available");
  const [callVolume, setCallVolume] = useState(0);
  const [activeCalls, setActiveCalls] = useState(0);

  // Simulation du trafic d'appels en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setCallVolume(Math.floor(Math.random() * 100));
      setActiveCalls(Math.floor(Math.random() * 15));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      message.error("Please enter your email and password");
      return;
    }

    setLoading(true);

    // Petite animation pour UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // 🔹 Appel API existante
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
      );

      const user = res.data;

      // 🔹 Mettre l'utilisateur dans le state
      setUser(user);

      // 🔹 Stocker l'utilisateur pour session persistante
      localStorage.setItem("user", JSON.stringify(user));

      // 🔹 Message succès
      message.success({
        content: "Login successful! Welcome to the call center 📞",
        icon: <CustomerServiceOutlined />,
        duration: 3,
      });

      // 🔹 Redirection intelligente selon rôle
      if (user.role === "agent") {
        navigate("/agent");
      } else if (user.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/"); // fallback si rôle inconnu
      }
    } catch (err) {
      console.error(err);

      // 🔹 Message erreur propre
      message.error(err.response?.data?.error || "Login failed");
    } finally {
      // 🔹 Toujours désactiver le loading
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes ring {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(10deg); }
            75% { transform: rotate(-10deg); }
            100% { transform: rotate(0deg); }
          }
          
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1.3); opacity: 0; }
          }
          
          @keyframes wave {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes slideInLeft {
            from { transform: translateX(-100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInRight {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 5px #f97316; }
            50% { box-shadow: 0 0 20px #f97316; }
          }
          
          .wave-animation {
            animation: wave 2s ease-in-out infinite;
          }
          
          .ring-animation {
            animation: ring 0.5s ease-in-out;
          }
        `}
      </style>

      {/* Barre de statut du centre d'appels */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={styles.statusBar}
      >
        <div style={styles.statusContent}>
          <div style={styles.statusItem}>
            <Badge
              status={agentStatus === "available" ? "success" : "processing"}
              text={`Status: ${agentStatus === "available" ? "Available" : "On Call"}`}
            />
          </div>
          <div style={styles.statusItem}>
            <PhoneOutlined style={{ marginRight: 8, color: "#f97316" }} />
            <Text style={{ color: "#ffffff" }}>
              Active calls: {activeCalls}
            </Text>
          </div>
          <div style={styles.statusItem}>
            <SoundOutlined style={{ marginRight: 8, color: "#f97316" }} />
            <Text style={{ color: "#ffffff" }}>Volume: {callVolume}%</Text>
            <Progress
              percent={callVolume}
              size="small"
              showInfo={false}
              strokeColor="#f97316"
              trailColor="rgba(255,255,255,0.3)"
              style={{ width: 80, marginLeft: 8 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Animation des ondes sonores */}
      <div style={styles.waveContainer}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.wave,
              animationDelay: `${i * 0.2}s`,
              height: `${30 + i * 10}px`,
              width: `${3 + i}px`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      >
        <Card style={styles.card}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            style={{ textAlign: "center", marginBottom: 20 }}
          >
            <div style={styles.logoContainer}>
              <AudioOutlined style={styles.logoIcon} />
              <div style={styles.ringPulse} />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Title level={3} style={styles.title}>
              Call Center CRM Pro
            </Title>
            <Text type="secondary" style={styles.subtitle}>
              Professional call management solution
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Input
              size="large"
              placeholder="Professional email"
              prefix={
                <UserOutlined
                  style={{ color: emailFocused ? "#f97316" : "#999" }}
                />
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onKeyPress={handleKeyPress}
              style={{
                ...styles.input,
                transform: emailFocused ? "scale(1.02)" : "scale(1)",
                borderColor: emailFocused ? "#f97316" : "#e8e8e8",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              prefix={
                <LockOutlined
                  style={{ color: passwordFocused ? "#f97316" : "#999" }}
                />
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onKeyPress={handleKeyPress}
              style={{
                ...styles.input,
                transform: passwordFocused ? "scale(1.02)" : "scale(1)",
                borderColor: passwordFocused ? "#f97316" : "#e8e8e8",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="primary"
              block
              size="large"
              onClick={handleLogin}
              loading={loading}
              disabled={loading}
              icon={!loading && <CustomerServiceOutlined />}
              style={styles.loginButton}
            >
              {loading ? <Spin /> : "Login to Call Center"}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={styles.footerText}
          >
            <Text type="secondary" style={{ fontSize: 12, color: "#666" }}>
              <PhoneOutlined style={{ marginRight: 5, color: "#f97316" }} />
              24/7 Support • Press Enter to login
            </Text>
          </motion.div>

          {/* Métriques en temps réel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={styles.metrics}
          >
            <div style={styles.metricItem}>
              <Text type="secondary" style={{ fontSize: 11, color: "#666" }}>
                Avg wait time
              </Text>
              <Text strong style={{ color: "#f97316" }}>
                45s
              </Text>
            </div>
            <div style={styles.metricItem}>
              <Text type="secondary" style={{ fontSize: 11, color: "#666" }}>
                Customer satisfaction
              </Text>
              <Text strong style={{ color: "#f97316" }}>
                98%
              </Text>
            </div>
            <div style={styles.metricItem}>
              <Text type="secondary" style={{ fontSize: 11, color: "#666" }}>
                Calls today
              </Text>
              <Text strong style={{ color: "#f97316" }}>
                1,247
              </Text>
            </div>
          </motion.div>
        </Card>
      </motion.div>

      {/* Footer professionnel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={styles.footer}
      >
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
          © 2024 Call Center CRM Pro • ISO 27001 Certified Solution
        </Text>
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.loadingOverlay}
          >
            <div style={styles.loadingContent}>
              <Spin size="large" />
              <Text style={{ color: "#ffffff", marginTop: 20 }}>
                Connecting...
              </Text>
              <Progress
                percent={75}
                status="active"
                showInfo={false}
                strokeColor="#f97316"
                trailColor="rgba(255,255,255,0.3)"
                style={{ width: 200, marginTop: 20 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    background: "#fafafa",
  },
  statusBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    background: "#1a1a1a",
    backdropFilter: "blur(10px)",
    padding: "10px 20px",
    zIndex: 10,
  },
  statusContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 1200,
    margin: "0 auto",
  },
  statusItem: {
    display: "flex",
    alignItems: "center",
    color: "#ffffff",
  },
  waveContainer: {
    position: "absolute",
    left: 50,
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    gap: 5,
    alignItems: "center",
    zIndex: 1,
  },
  wave: {
    background: "#f97316",
    borderRadius: 10,
    animation: "wave 1.5s ease-in-out infinite",
  },
  card: {
    width: 420,
    borderRadius: 20,
    background: "#ffffff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
    zIndex: 5,
    position: "relative",
    border: "1px solid #e8e8e8",
  },
  logoContainer: {
    position: "relative",
    display: "inline-block",
  },
  logoIcon: {
    fontSize: 60,
    background: "#f97316",
    padding: 15,
    borderRadius: "50%",
    color: "#ffffff",
  },
  ringPulse: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    border: "2px solid #f97316",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse-ring 1.5s ease-out infinite",
  },
  title: {
    textAlign: "center",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  subtitle: {
    display: "block",
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  input: {
    marginBottom: 20,
    transition: "all 0.3s",
    borderRadius: 10,
  },
  loginButton: {
    background: "#f97316",
    border: "none",
    height: 48,
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 10,
    marginTop: 10,
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
  },
  metrics: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: 25,
    paddingTop: 20,
    borderTop: "1px solid #e8e8e8",
  },
  metricItem: {
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: 5,
  },
  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContent: {
    textAlign: "center",
  },
};
