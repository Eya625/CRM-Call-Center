import React, { useState, useEffect } from "react";
import {
  Layout as AntLayout,
  Row,
  Col,
  Card as AntCard,
  Progress,
  Tooltip,
  Statistic,
  Badge,
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
import Layout from "../components/Layout"; // ✅ Layout متاعك
import { motion } from "framer-motion";

const { Content } = AntLayout;

export default function Dashboard() {
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
  );
}

const styles = {
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