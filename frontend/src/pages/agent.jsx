// frontend/src/pages/Agent.jsx
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
  // --- Stats du tableau de bord ---
  const [stats, setStats] = useState({
    callsToday: 0,
    avgCallDuration: 0,
    successRate: 0,
    waitingCalls: 0,
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // --- Numéro actuellement sélectionné, partagé entre ClientCard et Softphone ---
  const [currentNumber, setCurrentNumber] = useState("");

  // --- Simuler la mise à jour des stats toutes les 5 secondes ---
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

  // --- Formatage durée en MM:SS ---
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ padding: 20 }}>
      {/* --- Stats --- */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <AntCard>
            <Statistic
              title="Appels aujourd'hui"
              value={stats.callsToday}
              prefix={<PhoneOutlined />}
            />
            <Badge status="processing" text="en temps réel" />
          </AntCard>
        </Col>

        <Col span={6}>
          <AntCard>
            <Statistic
              title="Durée moyenne"
              value={formatDuration(stats.avgCallDuration)}
              prefix={<ClockCircleOutlined />}
            />
          </AntCard>
        </Col>

        <Col span={6}>
          <AntCard>
            <Statistic
              title="Taux de réussite"
              value={stats.successRate}
              suffix="%"
              prefix={<RiseOutlined />}
            />
            <Progress
              percent={stats.successRate}
              size="small"
              showInfo={false}
            />
          </AntCard>
        </Col>

        <Col span={6}>
          <AntCard>
            <Statistic
              title="En attente"
              value={stats.waitingCalls}
              prefix={<TeamOutlined />}
            />
          </AntCard>
        </Col>
      </Row>

      {/* --- Sections principales --- */}
      <Row gutter={20}>
        <Col span={7}>
          {/* Softphone avec state partagé pour le numéro */}
          <Softphone
            currentNumber={currentNumber}
            setCurrentNumber={setCurrentNumber}
          />
        </Col>

        <Col span={10}>
          {/* ClientCard qui met à jour le numéro dans le softphone */}
          <ClientCard setCurrentNumber={setCurrentNumber} />
        </Col>

        <Col span={7}>
          <CallScript />
        </Col>
      </Row>

      {/* --- Indicateur de mise à jour --- */}
      <motion.div style={{ position: "fixed", bottom: 20, right: 20 }}>
        <Tooltip
          title={`Dernière mise à jour: ${lastUpdate.toLocaleTimeString()}`}
        >
          <Badge status="processing" text="Temps réel" />
        </Tooltip>
      </motion.div>
    </div>
  );
}