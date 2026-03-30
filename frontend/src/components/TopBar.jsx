import React, { useState, useEffect } from "react";
import { Layout, Badge, Avatar, Dropdown, Space, Typography, Progress, Tooltip, Modal, Button, List } from "antd";
import { 
  BellOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  SoundOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

export default function TopBar() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Appel en attente", message: "Client #1234 en ligne", time: "il y a 2 min", read: false },
    { id: 2, title: "Rappel", message: "Appeler M. Dupont dans 5 min", time: "il y a 10 min", read: false },
    { id: 3, title: "Performance", message: "Objectif journalier atteint à 75%", time: "il y a 30 min", read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [agentName] = useState("Jean Dupont");
  const [agentScore, setAgentScore] = useState(85);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    return currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleLogout = () => {
    Modal.confirm({
      title: 'Déconnexion',
      content: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      okText: 'Oui',
      cancelText: 'Non',
      onOk: () => {
        localStorage.removeItem('token');
        navigate('/login');
      }
    });
  };

  const notificationMenu = (
    <div style={{ width: 350, maxHeight: 400, overflow: 'auto', borderRadius: 12 }}>
      <div style={{ padding: 12, borderBottom: '1px solid #f0f0f0', background: '#f7f9fc' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Text strong style={{ fontSize: 16 }}>Notifications</Text>
          <Button type="link" size="small">Marquer tout lu</Button>
        </Space>
      </div>
      <List
        dataSource={notifications}
        renderItem={item => (
          <List.Item 
            style={{ 
              background: item.read ? 'white' : '#e6f7ff',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.background = item.read ? 'white' : '#e6f7ff'}
          >
            <List.Item.Meta
              avatar={<Badge dot={!item.read}><BellOutlined style={{ fontSize: 20 }} /></Badge>}
              title={<Text strong>{item.title}</Text>}
              description={<div><div>{item.message}</div><Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text></div>}
            />
          </List.Item>
        )}
      />
    </div>
  );

  const profileMenu = (
    <div style={{ width: 280, borderRadius: 12 }}>
      <div style={{ padding: 16, textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <Avatar size={64} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
        <div style={{ marginTop: 8 }}>
          <Text strong>{agentName}</Text>
          <div><Text type="secondary" style={{ fontSize: 12 }}>Agent Senior</Text></div>
        </div>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary">Performance journalière</Text>
          <Progress percent={agentScore} strokeColor={{ from: '#00c6fb', to: '#005bea' }} />
        </div>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button icon={<SettingOutlined />} type="text" block style={{ textAlign: 'left' }}>Paramètres</Button>
          <Button icon={<BarChartOutlined />} type="text" block style={{ textAlign: 'left' }}>Mes statistiques</Button>
          <Button icon={<LogoutOutlined />} type="text" block style={{ textAlign: 'left', color: '#ff4d4f' }} onClick={handleLogout}>Déconnexion</Button>
        </Space>
      </div>
    </div>
  );

  return (
    <Header style={styles.header}>
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={styles.logo}
      >
        <PhoneOutlined style={{ fontSize: 24, color: '#00c6fb', marginRight: 10 }} />
        <Text strong style={{ fontSize: 18, color: 'white' }}>Call Center Pro</Text>
      </motion.div>

      <div style={styles.centerInfo}>
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={styles.dateTime}
        >
          <div style={styles.date}>{formatDate()}</div>
          <div style={styles.time}>
            <ClockCircleOutlined style={{ marginRight: 5 }} />
            {formatTime()}
          </div>
        </motion.div>
      </div>

      <div style={styles.rightSection}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <Tooltip title="Statistiques en temps réel">
            <Badge count={agentScore} showZero style={{ backgroundColor: '#00c6fb' }}>
              <Button icon={<BarChartOutlined />} style={styles.iconButton} />
            </Badge>
          </Tooltip>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Dropdown 
            popupRender={() => notificationMenu}
            trigger={['click']}
            open={showNotifications}
            onOpenChange={setShowNotifications}
          >
            <Badge count={notifications.filter(n => !n.read).length} style={{ backgroundColor: '#ff4d4f' }}>
              <Button icon={<BellOutlined />} style={styles.iconButton} />
            </Badge>
          </Dropdown>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <Dropdown popupRender={() => profileMenu} trigger={['click']} placement="bottomRight">
            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
          </Dropdown>
        </motion.div>
      </div>

      <style>
        {`
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1.3); opacity: 0; }
          }
        `}
      </style>
    </Header>
  );
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: 70
  },
  logo: {
    display: 'flex',
    alignItems: 'center'
  },
  centerInfo: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  dateTime: {
    textAlign: 'center',
    color: 'white'
  },
  date: {
    fontSize: 12,
    opacity: 0.8
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  rightSection: {
    display: 'flex',
    gap: 16,
    alignItems: 'center'
  },
  iconButton: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white'
  }
};