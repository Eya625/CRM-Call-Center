import React, { useState, useEffect } from "react";
import { 
  Layout, Row, Col, Card as AntCard, Progress, List, Divider, Space, Statistic, Dropdown, Timeline, Badge, Tooltip, message
} from "antd";
import { 
  PhoneOutlined, 
  UserOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  TeamOutlined
} from "@ant-design/icons";
import Softphone from "../components/Softphone";
import ClientCard from "../components/ClientCard";
import CallScript from "../components/CallScript";
import Layout from "../components/Layout";
import { motion, AnimatePresence } from "framer-motion";

const { Content } = Layout;

export default function Dashboard() {
  const [stats, setStats] = useState({
    callsToday: 0,
    avgCallDuration: 0,
    successRate: 0,
    waitingCalls: 0
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulation de statistiques en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        callsToday: Math.floor(Math.random() * 50 + 20),
        avgCallDuration: Math.floor(Math.random() * 300 + 120),
        successRate: Math.floor(Math.random() * 30 + 60),
        waitingCalls: Math.floor(Math.random() * 5)
      });
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Layout style={styles.layout}>
      <Layout />
      <Content style={styles.content}>
        {/* Statistiques en temps réel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={6}>
              <AntCard style={styles.statCard}>
                <Statistic
                  title="Appels aujourd'hui"
                  value={stats.callsToday}
                  prefix={<PhoneOutlined />}
                  valueStyle={{ color: "#00c6fb" }}
                />
                <Badge status="processing" text="en temps réel" style={{ marginTop: 8 }} />
              </AntCard>
            </Col>
            <Col span={6}>
              <AntCard style={styles.statCard}>
                <Statistic
                  title="Durée moyenne"
                  value={formatDuration(stats.avgCallDuration)}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </AntCard>
            </Col>
            <Col span={6}>
              <AntCard style={styles.statCard}>
                <Statistic
                  title="Taux de réussite"
                  value={stats.successRate}
                  suffix="%"
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: stats.successRate > 70 ? "#52c41a" : "#faad14" }}
                />
                <Tooltip title="Objectif: 75%">
                  <Progress 
                    percent={stats.successRate} 
                    size="small" 
                    showInfo={false}
                    strokeColor={stats.successRate > 70 ? "#52c41a" : "#faad14"}
                  />
                </Tooltip>
              </AntCard>
            </Col>
            <Col span={6}>
              <AntCard style={styles.statCard}>
                <Statistic
                  title="En attente"
                  value={stats.waitingCalls}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: stats.waitingCalls > 0 ? "#ff4d4f" : "#52c41a" }}
                />
                {stats.waitingCalls > 0 && (
                  <Badge count={`${stats.waitingCalls} en attente`} style={{ backgroundColor: "#ff4d4f", marginTop: 8 }} />
                )}
              </AntCard>
            </Col>
          </Row>
        </motion.div>

        {/* Composants principaux */}
        <Row gutter={20} style={{ height: "calc(100vh - 200px)" }}>
          <Col span={7}>
            <Softphone />
          </Col>
          <Col span={10}>
            <ClientCard />
          </Col>
          <Col span={7}>
            <CallScript />
          </Col>
        </Row>

        {/* Indicateur de dernière mise à jour */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          style={styles.updateIndicator}
        >
          <Tooltip title={`Dernière mise à jour: ${lastUpdate.toLocaleTimeString()}`}>
            <Badge status="processing" text="Données en temps réel" />
          </Tooltip>
        </motion.div>
      </Content>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          .ant-statistic-content {
            font-size: 28px !important;
          }
          
          .ant-card-body {
            padding: 20px !important;
          }
        `}
      </style>
    </Layout>
  );
}

const styles = {
  layout: {
    height: "100vh",
    background: "#f0f2f5",
    overflow: "hidden"
  },
  content: {
    padding: "20px",
    overflow: "auto",
    position: "relative"
  },
  statCard: {
    borderRadius: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "all 0.3s",
    cursor: "pointer"
  },
  updateIndicator: {
    position: "fixed",
    bottom: 20,
    right: 20,
    background: "white",
    padding: "4px 12px",
    borderRadius: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 1000
  }
};