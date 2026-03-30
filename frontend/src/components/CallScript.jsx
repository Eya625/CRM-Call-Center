import React, { useState } from "react";
import { Card, List, Typography, Button, Space, Tag, Progress, Tooltip, Collapse, Alert, Divider } from "antd";
import { 
  SoundOutlined, 
  CopyOutlined, 
  CheckCircleOutlined,
  BulbOutlined,
  WarningOutlined,
  LikeOutlined,
  DislikeOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Paragraph, Text, Title } = Typography;
const { Panel } = Collapse;

export default function CallScript() {
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [helpful, setHelpful] = useState(null);
  const [copied, setCopied] = useState(false);

  const scripts = [
    {
      title: "Introduction",
      content: "Bonjour [Nom du client], je suis [Votre nom] du service client de Call Center Pro. Je vous appelle aujourd'hui pour vous présenter notre nouvelle offre CRM qui pourrait vous intéresser. Cela vous prendra seulement 2 minutes.",
      tips: "Soyez chaleureux et professionnel, adaptez votre ton au client"
    },
    {
      title: "Présentation offre",
      content: "Notre solution CRM permet d'augmenter votre productivité de 30% et de centraliser tous vos contacts clients. De nombreuses entreprises comme la vôtre ont déjà adopté notre solution avec succès.",
      tips: "Mettez en avant les bénéfices, pas les fonctionnalités"
    },
    {
      title: "Gestion objections",
      content: "Je comprends tout à fait votre position. Permettez-moi de vous expliquer comment notre solution a aidé des entreprises similaires à résoudre ce problème...",
      tips: "Écoutez activement, validez les préoccupations"
    },
    {
      title: "Conclusion",
      content: "Je vous propose de vous envoyer une documentation détaillée par email. Pourrions-nous planifier un rendez-vous de 15 minutes la semaine prochaine pour en discuter plus en détail ?",
      tips: "Proposez une action claire et précise"
    }
  ];

  const objections = [
    { objection: "Je n'ai pas le temps", response: "Je comprends, puis-je vous rappeler à un moment plus approprié ?" },
    { objection: "C'est trop cher", response: "Notre solution est rentabilisée en moins de 3 mois. Je peux vous montrer comment." },
    { objection: "J'ai déjà un fournisseur", response: "Je vous propose de comparer nos offres sans engagement." },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(scripts[currentScriptIndex].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHelpful = (value) => {
    setHelpful(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card
        title={
          <Space>
            <SoundOutlined style={{ color: "#f97316" }} />
            <Title level={4} style={{ margin: 0, color: "#1a1a1a" }}>Smart Call Script</Title>
          </Space>
        }
        style={styles.card}
        bodyStyle={{ padding: "20px" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Progression */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Text type="secondary" style={{ color: "#666" }}> {currentScriptIndex + 1}/{scripts.length}</Text>
              <Text type="secondary" style={{ color: "#666" }}>{Math.round((currentScriptIndex + 1) / scripts.length * 100)}%</Text>
            </div>
            <Progress 
              percent={(currentScriptIndex + 1) / scripts.length * 100} 
              showInfo={false}
              strokeColor="#f97316"
            />
          </div>

          {/* Script actuel */}
          <motion.div
            key={currentScriptIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={styles.scriptContainer}
          >
            <div style={styles.scriptHeader}>
              <Title level={5} style={{ color: "#1a1a1a" }}>{scripts[currentScriptIndex].title}</Title>
              <Space>
                <Tooltip title="Copier le script">
                  <Button 
                    icon={copied ? <CheckCircleOutlined /> : <CopyOutlined />} 
                    size="small"
                    onClick={handleCopy}
                    style={copied ? { color: "#f97316" } : {}}
                  />
                </Tooltip>
              </Space>
            </div>
            <Paragraph style={styles.scriptContent}>
              {scripts[currentScriptIndex].content}
            </Paragraph>
            <Alert
              message="💡 Conseil"
              description={scripts[currentScriptIndex].tips}
              type="info"
              showIcon
              style={{ marginTop: 12, background: "#fff7e6", borderColor: "#ffd591" }}
            />
          </motion.div>

          {/* Navigation scripts */}
          <Space style={{ justifyContent: "center", width: "100%" }}>
            <Button 
              onClick={() => setCurrentScriptIndex(Math.max(0, currentScriptIndex - 1))}
              disabled={currentScriptIndex === 0}
            >
              Précédent
            </Button>
            <Button 
              type="primary"
              onClick={() => setCurrentScriptIndex(Math.min(scripts.length - 1, currentScriptIndex + 1))}
              disabled={currentScriptIndex === scripts.length - 1}
              style={{ background: "#f97316", borderColor: "#f97316" }}
            >
              Suivant
            </Button>
          </Space>

          <Divider style={{ margin: "12px 0", borderColor: "#e8e8e8" }} />

          {/* Objections fréquentes */}
          <div>
            <div style={styles.sectionHeader}>
              <BulbOutlined style={{ marginRight: 8, color: "#f97316" }} />
              <Text strong style={{ color: "#1a1a1a" }}>Objections fréquentes</Text>
            </div>
            <Collapse ghost>
              {objections.map((obj, idx) => (
                <Panel 
                  header={<Text strong style={{ color: "#1a1a1a" }}>{obj.objection}</Text>} 
                  key={idx}
                >
                  <Paragraph style={{ color: "#f97316", margin: 0 }}>
                    💬 {obj.response}
                  </Paragraph>
                </Panel>
              ))}
            </Collapse>
          </div>

          {/* Historique 5 derniers appels */}
          <div>
            <div style={styles.sectionHeader}>
              <HistoryOutlined style={{ marginRight: 8, color: "#f97316" }} />
              <Text strong style={{ color: "#1a1a1a" }}>5 derniers appels</Text>
            </div>
            <List
              dataSource={lastCalls}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.result === "Vente" ? <LikeOutlined style={{ color: "#f97316" }} /> : <DislikeOutlined style={{ color: "#f97316" }} />}
                    title={<span style={{ color: "#1a1a1a" }}>{item.name}</span>}
                    description={<span style={{ color: "#666" }}>{item.time} • {item.result}</span>}
                  />
                </List.Item>
              )}
              style={{ maxHeight: 200, overflowY: "auto" }}
            />
          </div>

          {/* Feedback script */}
          <div style={styles.feedback}>
            <Text type="secondary" style={{ color: "#666" }}>Ce script vous a-t-il été utile ?</Text>
            <Space>
              <Tooltip title="Utile">
                <Button 
                  icon={<LikeOutlined />} 
                  type={helpful === true ? "primary" : "default"}
                  onClick={() => handleHelpful(true)}
                  style={helpful === true ? { background: "#f97316", borderColor: "#f97316" } : {}}
                />
              </Tooltip>
              <Tooltip title="Pas utile">
                <Button 
                  icon={<DislikeOutlined />} 
                  type={helpful === false ? "primary" : "default"}
                  danger={helpful === false}
                  onClick={() => handleHelpful(false)}
                />
              </Tooltip>
            </Space>
          </div>
        </Space>
      </Card>
    </motion.div>
  );
}

const lastCalls = [
  { name: "Jean Dupont", time: "10:30", result: "Vente", duration: "5:23" },
  { name: "Marie Martin", time: "11:15", result: "Rappel", duration: "3:45" },
  { name: "Pierre Durand", time: "14:20", result: "Pas intéressé", duration: "2:10" },
  { name: "Sophie Bernard", time: "15:45", result: "Vente", duration: "7:30" },
  { name: "Lucas Petit", time: "16:30", result: "NRP", duration: "1:15" },
];

const styles = {
  card: {
    borderRadius: 20,
    border: "none",
    background: "#ffffff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
    height: "100%",
  },
  scriptContainer: {
    background: "#fafafa",
    borderRadius: 12,
    padding: 16,
    border: "1px solid #e8e8e8",
  },
  scriptHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  scriptContent: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#1a1a1a",
  },
  sectionHeader: {
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
  },
  feedback: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTop: "1px solid #f0f0f0",
  }, 
};