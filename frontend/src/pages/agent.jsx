// src/pages/Agent.jsx
import React, { useState, useEffect } from "react";
import {
<<<<<<< HEAD
=======
  Layout as AntLayout,
>>>>>>> e81c63df99f7d6130dce3af6bd39bbf8de20f394
  Row,
  Col,
  Card as AntCard,
  Progress,
<<<<<<< HEAD
  Statistic,
  Badge,
  Tooltip,
=======
  Tooltip,
  Statistic,
  Badge,
>>>>>>> e81c63df99f7d6130dce3af6bd39bbf8de20f394
} from "antd";
import {
  PhoneOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import Softphone from "../components/Softphone";
import ClientCard from "../components/ClientCard";
import CallScript from "../components/CallScript";
<<<<<<< HEAD
import { motion } from "framer-motion";

export default function Agent() {
=======
import Layout from "../components/Layout"; // ✅ Layout متاعك
import { motion } from "framer-motion";

const { Content } = AntLayout;

export default function Dashboard() {
>>>>>>> e81c63df99f7d6130dce3af6bd39bbf8de20f394
  const [stats, setStats] = useState({
    callsToday: 0,
    avgCallDuration: 0,
    successRate: 0,
    waitingCalls: 0,
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        callsToday: Math.floor(Math.random() * 50 + 20),
        avgCallDuration: Math.floor(Math.random() * 300 + 120),
        successRate: Math.floor(Math.random() * 30 + 60),
        waitingCalls: Math.floor(Math.random() * 5),
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
<<<<<<< HEAD
    <div style={styles.pageContainer}>
      {/* Statistiques */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6} style={{ marginBottom: 16 }}>
            <AntCard style={styles.statCard} hoverable>
              <Statistic
                title={<span style={styles.statTitle}>Appels aujourd'hui</span>}
                value={stats.callsToday}
                prefix={<PhoneOutlined style={styles.statIcon} />}
                valueStyle={styles.statValue}
              />
              <div style={{ marginTop: 8 }}>
                <Badge 
                  status="processing" 
                  text={<span style={{ color: "#f97316" }}>en temps réel</span>} 
                />
              </div>
            </AntCard>
          </Col>
          <Col xs={24} sm={12} lg={6} style={{ marginBottom: 16 }}>
            <AntCard style={styles.statCard} hoverable>
              <Statistic
                title={<span style={styles.statTitle}>Durée moyenne</span>}
                value={formatDuration(stats.avgCallDuration)}
                prefix={<ClockCircleOutlined style={styles.statIcon} />}
                valueStyle={styles.statValue}
              />
            </AntCard>
          </Col>
          <Col xs={24} sm={12} lg={6} style={{ marginBottom: 16 }}>
            <AntCard style={styles.statCard} hoverable>
              <Statistic
                title={<span style={styles.statTitle}>Taux de réussite</span>}
                value={stats.successRate}
                suffix="%"
                prefix={<RiseOutlined style={styles.statIcon} />}
                valueStyle={styles.statValue}
              />
              <Progress 
                percent={stats.successRate} 
                size="small" 
                showInfo={false}
                strokeColor="#f97316"
                trailColor="#f0f0f0"
                style={{ marginTop: 12 }}
              />
            </AntCard>
          </Col>
          <Col xs={24} sm={12} lg={6} style={{ marginBottom: 16 }}>
            <AntCard style={styles.statCard} hoverable>
              <Statistic
                title={<span style={styles.statTitle}>En attente</span>}
                value={stats.waitingCalls}
                prefix={<TeamOutlined style={styles.statIcon} />}
                valueStyle={styles.statValue}
              />
              {stats.waitingCalls > 0 && (
                <div style={{ marginTop: 8 }}>
                  <Badge 
                    count={`${stats.waitingCalls} en attente`}
                    style={{ backgroundColor: "#f97316" }}
                  />
                </div>
              )}
            </AntCard>
          </Col>
        </Row>
      </motion.div>

      {/* Composants principaux */}
      <Row gutter={[20, 20]} style={styles.mainRow}>
        <Col xs={24} lg={7}>
          <Softphone />
        </Col>
        <Col xs={24} lg={10}>
          <ClientCard />
        </Col>
        <Col xs={24} lg={7}>
          <CallScript />
        </Col>
      </Row>

      {/* Indicateur de dernière mise à jour */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 0.6 }} 
        style={styles.updateIndicator}
        whileHover={{ opacity: 1 }}
      >
        <Tooltip title={`Dernière mise à jour: ${lastUpdate.toLocaleTimeString()}`}>
          <Badge 
            status="processing" 
            text={<span style={{ color: "#f97316" }}>Données en temps réel</span>}
          />
        </Tooltip>
      </motion.div>

      <style jsx>{`
        :global(.ant-card) {
          transition: all 0.3s ease;
        }
        :global(.ant-card:hover) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        :global(.ant-statistic-content) {
          font-size: 28px;
        }
        :global(.ant-badge-status-processing) {
          background-color: #f97316;
        }
        :global(.ant-progress-bg) {
          background-color: #f97316 !important;
        }
      `}</style>
    </div>
=======
    <Layout>
      <AntLayout style={styles.layout}>
        <Content style={styles.content}>
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={6}>
                <AntCard style={styles.statCard}>
                  <Statistic
                    title="Appels aujourd'hui"
                    value={stats.callsToday}
                    prefix={<PhoneOutlined />}
                  />
                  <Badge status="processing" text="en temps réel" />
                </AntCard>
              </Col>

              <Col span={6}>
                <AntCard style={styles.statCard}>
                  <Statistic
                    title="Durée moyenne"
                    value={formatDuration(stats.avgCallDuration)}
                    prefix={<ClockCircleOutlined />}
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
                  />
                  <Tooltip title="Objectif: 75%">
                    <Progress percent={stats.successRate} size="small" />
                  </Tooltip>
                </AntCard>
              </Col>

              <Col span={6}>
                <AntCard style={styles.statCard}>
                  <Statistic
                    title="En attente"
                    value={stats.waitingCalls}
                    prefix={<TeamOutlined />}
                  />
                  {stats.waitingCalls > 0 && (
                    <Badge count={`${stats.waitingCalls} en attente`} />
                  )}
                </AntCard>
              </Col>
            </Row>
          </motion.div>

          {/* Main */}
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

          {/* Update */}
          <div style={styles.updateIndicator}>
            <Tooltip
              title={`Dernière mise à jour: ${lastUpdate.toLocaleTimeString()}`}
            >
              <Badge status="processing" text="Données en temps réel" />
            </Tooltip>
          </div>
        </Content>
      </AntLayout>
    </Layout>
>>>>>>> e81c63df99f7d6130dce3af6bd39bbf8de20f394
  );
}

const styles = {
<<<<<<< HEAD
  pageContainer: {
    padding: 24,
    height: "100%",
    overflow: "auto",
    background: "#fafafa",
  },
  statCard: {
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid #e8e8e8",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
  },
  statTitle: {
    color: "#666",
    fontSize: 14,
    fontWeight: 500,
  },
  statIcon: {
    color: "#f97316",
    fontSize: 20,
  },
  statValue: {
    color: "#1a1a1a",
    fontWeight: "bold",
    fontSize: 28,
  },
  mainRow: {
    height: "calc(100vh - 200px)",
    minHeight: 600,
  },
  updateIndicator: {
    position: "fixed",
    bottom: 24,
    right: 24,
    cursor: "pointer",
    transition: "opacity 0.3s ease",
  },
};

// Styles supplémentaires pour la responsivité
const responsiveStyles = `
  @media (max-width: 768px) {
    .ant-statistic-content {
      font-size: 20px !important;
    }
    .ant-card-body {
      padding: 16px !important;
    }
  }
`;

// Injecter les styles responsifs
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = responsiveStyles;
  document.head.appendChild(styleSheet);
}
=======
  layout: {
    height: "100vh",
    background: "#f0f2f5",
  },
  content: {
    padding: "20px",
  },
  statCard: {
    borderRadius: 16,
  },
  updateIndicator: {
    position: "fixed",
    bottom: 20,
    right: 20,
    background: "white",
    padding: "5px 10px",
    borderRadius: 20,
  },
};
>>>>>>> e81c63df99f7d6130dce3af6bd39bbf8de20f394
