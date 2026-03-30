import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography, message, Spin, Badge, Progress } from "antd";
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
  const [agentStatus, setAgentStatus] = useState("disponible");
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
      message.error("Veuillez entrer votre email et mot de passe");
      return;
    }

    setLoading(true);

    // Animation de connexion
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
      );

      setUser(res.data);
      message.success({
        content: "Connexion réussie ! Bienvenue dans le centre d'appels 📞",
        icon: <CustomerServiceOutlined />,
        duration: 3,
      });

      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.error || "Échec de la connexion");
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
            0%, 100% { box-shadow: 0 0 5px #00c6fb; }
            50% { box-shadow: 0 0 20px #00c6fb; }
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
              status={agentStatus === "disponible" ? "success" : "processing"} 
              text={`Statut: ${agentStatus === "disponible" ? "Disponible" : "En appel"}`}
            />
          </div>
          <div style={styles.statusItem}>
            <PhoneOutlined style={{ marginRight: 8, color: "#00c6fb" }} />
            <Text style={{ color: "white" }}>Appels actifs: {activeCalls}</Text>
          </div>
          <div style={styles.statusItem}>
            <SoundOutlined style={{ marginRight: 8, color: "#00c6fb" }} />
            <Text style={{ color: "white" }}>Volume: {callVolume}%</Text>
            <Progress 
              percent={callVolume} 
              size="small" 
              showInfo={false}
              strokeColor="#00c6fb"
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
              Solution professionnelle de gestion d'appels
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Input
              size="large"
              placeholder="Email professionnel"
              prefix={<UserOutlined style={{ color: emailFocused ? "#00c6fb" : "#999" }} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onKeyPress={handleKeyPress}
              style={{
                ...styles.input,
                transform: emailFocused ? "scale(1.02)" : "scale(1)",
                borderColor: emailFocused ? "#00c6fb" : "#d9d9d9",
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
              placeholder="Mot de passe"
              prefix={<LockOutlined style={{ color: passwordFocused ? "#00c6fb" : "#999" }} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onKeyPress={handleKeyPress}
              style={{
                ...styles.input,
                transform: passwordFocused ? "scale(1.02)" : "scale(1)",
                borderColor: passwordFocused ? "#00c6fb" : "#d9d9d9",
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
              {loading ? <Spin /> : "Connexion au centre d'appels"}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={styles.footerText}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              <PhoneOutlined style={{ marginRight: 5 }} />
              Support 24/7 • Appuyez sur Entrée pour vous connecter
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
              <Text type="secondary" style={{ fontSize: 11 }}>Temps moyen d'attente</Text>
              <Text strong style={{ color: "#00c6fb" }}>45s</Text>
            </div>
            <div style={styles.metricItem}>
              <Text type="secondary" style={{ fontSize: 11 }}>Satisfaction client</Text>
              <Text strong style={{ color: "#00c6fb" }}>98%</Text>
            </div>
            <div style={styles.metricItem}>
              <Text type="secondary" style={{ fontSize: 11 }}>Appels aujourd'hui</Text>
              <Text strong style={{ color: "#00c6fb" }}>1,247</Text>
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
          © 2024 Call Center CRM Pro • Solution certifiée ISO 27001
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
              <Text style={{ color: "white", marginTop: 20 }}>
                Connexion en cours...
              </Text>
              <Progress 
                percent={75} 
                status="active" 
                showInfo={false}
                strokeColor="#00c6fb"
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
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  },
  statusBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    background: "rgba(0,0,0,0.3)",
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
    color: "white",
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
    background: "linear-gradient(180deg, #00c6fb, #005bea)",
    borderRadius: 10,
    animation: "wave 1.5s ease-in-out infinite",
  },
  card: {
    width: 420,
    borderRadius: 20,
    background: "rgba(255,255,255,0.98)",
    boxShadow: "0 30px 50px rgba(0,0,0,0.3)",
    zIndex: 5,
    position: "relative",
  },
  logoContainer: {
    position: "relative",
    display: "inline-block",
  },
  logoIcon: {
    fontSize: 60,
    color: "#00c6fb",
    background: "linear-gradient(135deg, #00c6fb, #005bea)",
    padding: 15,
    borderRadius: "50%",
    color: "white",
  },
  ringPulse: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    border: "2px solid #00c6fb",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse-ring 1.5s ease-out infinite",
  },
  title: {
    textAlign: "center",
    background: "linear-gradient(135deg, #00c6fb, #005bea)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 5,
  },
  subtitle: {
    display: "block",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    marginBottom: 20,
    transition: "all 0.3s",
    borderRadius: 10,
  },
  loginButton: {
    background: "linear-gradient(135deg, #00c6fb, #005bea)",
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
    borderTop: "1px solid #f0f0f0",
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