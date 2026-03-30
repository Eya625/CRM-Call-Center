// src/pages/Agent.jsx
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card as AntCard,
  Progress,
  Statistic,
  Badge,
  Tooltip,
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
import { motion } from "framer-motion";

export default function Agent() {
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
  );
}

const styles = {
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