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
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const { Title, Text } = Typography;

// --- COMPOSANT LOGO TCC NEXUS (SVG récréé selon l'image) ---
const TccNexusLogo = ({ style }) => (
  <svg
    viewBox="0 0 100 100"
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Dégradé principal du logo */}
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF4181" /> {/* Rose vif du haut */}
        <stop offset="60%" stopColor="#9C27B0" /> {/* Violet du milieu */}
        <stop offset="100%" stopColor="#2196F3" /> {/* Bleu vif du bas */}
      </linearGradient>
      {/* Effet de lueur (Glow) interne */}
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow)">
      {/* Cercle du haut (antenne) */}
      <circle cx="50" cy="15" r="7" fill="url(#logoGradient)" />
      
      {/* Ondes radio centrales (lignes courbes) */}
      <path d="M 40 32 Q 50 25 60 32" stroke="url(#logoGradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 33 42 Q 50 32 67 42" stroke="url(#logoGradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 27 52 Q 50 38 73 52" stroke="url(#logoGradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Nœuds de réseau du bas (triangles connectés) */}
      {/* Nœud gauche */}
      <circle cx="20" cy="85" r="5" fill="#F44336" /> {/* Point rouge vif */}
      <path d="M 30 65 L 20 85" stroke="#F44336" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M 30 65 L 45 65" stroke="#9C27B0" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M 45 65 L 20 85" stroke="#9C27B0" strokeWidth="1.5" strokeDasharray="3 3"/>
      <circle cx="30" cy="65" r="4" fill="#E91E63" />

      {/* Nœud droit */}
      <circle cx="80" cy="85" r="5" fill="#2196F3" /> {/* Point bleu vif */}
      <path d="M 70 65 L 80 85" stroke="#2196F3" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M 70 65 L 55 65" stroke="#9C27B0" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M 55 65 L 80 85" stroke="#9C27B0" strokeWidth="1.5" strokeDasharray="3 3"/>
      <circle cx="70" cy="65" r="4" fill="#3F51B5" />
    </g>
  </svg>
);
// -----------------------------------------------------------

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

  // Simulation du trafic d'appels en temps réel (Logique inchangée)
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
        content: "Login successful! Welcome to the TCC Nexus 📞",
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

  // --- PALETTE DE COULEURS ÉCLAIRCIE ---
  const colors = {
    bg: "#ffffff", // Fond global blanc
    cardBg: "#ffffff", // Fond de carte blanc
    pinkNeon: "#FF4181", // Rose vif du haut
    purpleNeon: "#9C27B0", // Violet du milieu
    blueNeon: "#2196F3", // Bleu vif du bas
    textMain: "#1a1a1a", // Texte principal presque noir
    textSec: "rgba(0, 0, 0, 0.55)", // Texte secondaire gris foncé pour contraste
    border: "#e0e0e0", // Bordures claires
  };

  // Dégradé pour le bouton et éléments interactifs
  const actionGradient = `linear-gradient(135deg, ${colors.pinkNeon} 0%, ${colors.purpleNeon} 50%, ${colors.blueNeon} 100%)`;

  return (
    <div style={styles.container(colors)}>
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
            100% { transform: scale(1.4); opacity: 0; }
          }
          
          @keyframes wave {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(-10px); opacity: 1; }
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
            0%, 100% { box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3); }
            50% { box-shadow: 0 6px 25px rgba(33, 150, 243, 0.4); }
          }

          @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 5px rgba(33, 150, 243, 0.1); }
            50% { text-shadow: 0 0 15px rgba(33, 150, 243, 0.3); }
          }
          
          .wave-animation {
            animation: wave 2s ease-in-out infinite;
          }
          
          .ring-animation {
            animation: ring 0.5s ease-in-out;
          }

          /* Style custom pour Antd Progress afin d'avoir un dégradé */
          .ant-progress-bg {
            background: ${actionGradient} !important;
          }

          /* Forcer la couleur du texte saisi dans les inputs */
          .ant-input {
            color: #1a1a1a !important;
          }
          .ant-input::placeholder {
            color: #999999 !important;
          }
        `}
      </style>

      {/* Barre de statut du centre d'appels */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={styles.statusBar(colors)}
      >
        <div style={styles.statusContent}>
          <div style={styles.statusItem}>
            <Badge
              status={agentStatus === "available" ? "success" : "processing"}
              text={
                <Text style={{color: colors.textMain, marginLeft: 8}}>
                  {`Status: ${agentStatus === "available" ? "Available" : "On Call"}`}
                </Text>
              }
            />
          </div>
          <div style={styles.statusItem}>
            <PhoneOutlined style={{ marginRight: 8, color: colors.blueNeon, filter: `drop-shadow(0 0 2px rgba(33, 150, 243, 0.3))` }} />
            <Text style={{ color: colors.textMain }}>
              Active calls: {activeCalls}
            </Text>
          </div>
          <div style={styles.statusItem}>
            <div style={{display:'flex', alignItems:'center', position:'relative', marginRight: 8}}>
                <div style={{width:16, height:16, borderRadius:'50%', background:colors.pinkNeon, position:'absolute', opacity:0.3, filter:'blur(3px)'}}/>
                <CustomerServiceOutlined style={{ color: colors.pinkNeon, position:'relative', zIndex:1 }} />
            </div>
            <Text style={{ color: colors.textMain }}>Volume: {callVolume}%</Text>
            <Progress
              percent={callVolume}
              size="small"
              showInfo={false}
              railColor="rgba(0,0,0,0.06)"
              style={{ width: 80, marginLeft: 8 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Animation des ondes sonores (Style Néon) */}
      <div style={styles.waveContainer}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.wave,
              background: actionGradient,
              animationDelay: `${i * 0.2}s`,
              height: `${30 + i * 10}px`,
              width: `${3 + i}px`,
              boxShadow: `0 0 10px rgba(156, 39, 176, 0.3)`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      >
        <Card style={styles.card(colors)}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            style={{ textAlign: "center", marginBottom: 30 }}
          >
            {/* Logo TCC NEXUS Custom */}
            <div style={styles.logoContainer}>
              <TccNexusLogo style={styles.logoIcon} />
              <div style={styles.ringPulse(colors)} />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Title level={3} style={styles.title(colors)}>
                TCC <span style={{color: colors.blueNeon, animation: 'textGlow 3s infinite'}}>NEXUS</span>
            </Title>
            <Text style={styles.subtitle(colors)}>
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
                  style={{ color: emailFocused ? colors.blueNeon : "#888" }}
                />
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onKeyPress={handleKeyPress}
              style={styles.input(colors, emailFocused)}
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
                  style={{ color: passwordFocused ? colors.blueNeon : "#888" }}
                />
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onKeyPress={handleKeyPress}
              style={styles.input(colors, passwordFocused)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.02, boxShadow: `0 5px 15px rgba(33, 150, 243, 0.3)` }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="primary"
              block
              size="large"
              onClick={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton(colors, actionGradient)}
            >
              {loading ? <Spin /> : "Login to TCC Nexus"}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={styles.footerText}
          >
            <Text style={{ fontSize: 12, color: colors.textSec }}>
              24/7 Support • Press Enter to login
            </Text>
          </motion.div>

          {/* Métriques en temps réel (Style Néon) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={styles.metrics(colors)}
          >
            <div style={styles.metricItem}>
              <Text style={{ fontSize: 11, color: colors.textSec }}>
                Avg wait time
              </Text>
              <br/>
              <Text strong style={{ color: colors.pinkNeon, textShadow: `0 0 1px rgba(255, 65, 129, 0.2)` }}>
                45s
              </Text>
            </div>
            <div style={styles.metricItem}>
              <Text style={{ fontSize: 11, color: colors.textSec }}>
                Customer satisfaction
              </Text>
              <br/>
              <Text strong style={{ color: colors.purpleNeon, textShadow: `0 0 1px rgba(156, 39, 176, 0.2)` }}>
                98%
              </Text>
            </div>
            <div style={styles.metricItem}>
              <Text style={{ fontSize: 11, color: colors.textSec }}>
                Calls today
              </Text>
              <br/>
              <Text strong style={{ color: colors.blueNeon, textShadow: `0 0 1px rgba(33, 150, 243, 0.2)` }}>
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
        <Text style={{ color: "rgba(0, 0, 0, 0.35)", fontSize: 11 }}>
          © 2024 TCC Nexus • ISO 27001 Certified Call CRM
        </Text>
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.loadingOverlay(colors)}
          >
            <div style={styles.loadingContent}>
              <Spin size="large" />
              <Text style={{ color: colors.textMain, display: 'block', marginTop: 20 }}>
                Connecting to Nexus...
              </Text>
              <Progress
                percent={75}
                status="active"
                showInfo={false}
                railColor="rgba(255,255,255,0.2)"
                style={{ width: 200, marginTop: 20 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- STYLES MIS À JOUR (White Theme) ---
const styles = {
  container: (colors) => ({
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    background: colors.bg,
  }),
  statusBar: (colors) => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    background: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
    backdropFilter: "blur(15px)",
    padding: "12px 20px",
    zIndex: 10,
    borderBottom: `1px solid ${colors.border}`,
  }),
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
    opacity: 0.15, // Plus discret sur fond blanc
  },
  wave: {
    borderRadius: 10,
    animation: "wave 1.5s ease-in-out infinite",
  },
  card: (colors) => ({
    width: 420,
    borderRadius: 24,
    background: colors.cardBg,
    boxShadow: "0 10px 40px rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.02)",
    zIndex: 5,
    position: "relative",
    border: `1px solid ${colors.border}`,
    padding: 20,
  }),
  logoContainer: {
    position: "relative",
    display: "inline-block",
    padding: 10,
  },
  logoIcon: {
    width: 100,
    height: 100,
    filter: 'drop-shadow(0 2px 8px rgba(156, 39, 176, 0.25))'
  },
  ringPulse: (colors) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "110%",
    height: "110%",
    border: `2px solid ${colors.purpleNeon}`,
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse-ring 2s ease-out infinite",
    opacity: 0.2,
  }),
  title: (colors) => ({
    textAlign: "center",
    color: colors.textMain,
    marginBottom: 5,
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  }),
  subtitle: (colors) => ({
    display: "block",
    textAlign: "center",
    marginBottom: 40,
    color: colors.textSec,
    fontSize: 13,
  }),
  input: (colors, focused) => ({
    marginBottom: 20,
    transition: "all 0.3s",
    borderRadius: 12,
    background: focused ? "#ffffff" : "#fcfcfc",
    border: focused ? `1px solid ${colors.blueNeon}` : `1px solid ${colors.border}`,
    height: 48,
    boxShadow: focused ? `0 0 10px rgba(33, 150, 243, 0.15)` : 'none',
  }),
  loginButton: (colors, actionGradient) => ({
    background: actionGradient,
    border: "none",
    height: 52,
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderRadius: 12,
    marginTop: 10,
    animation: 'glowPulse 4s infinite',
  }),
  footerText: {
    textAlign: "center",
    marginTop: 25,
  },
  metrics: (colors) => ({
    display: "flex",
    justifyContent: "space-around",
    marginTop: 30,
    paddingTop: 20,
    borderTop: `1px solid ${colors.border}`,
  }),
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
  loadingOverlay: (colors) => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.85)", // On garde le loading dark pour l'ambiance TCC
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }),
  loadingContent: {
    textAlign: "center",
  },
};