import React, { useState, useEffect } from "react";
import { Card, Input, Select, Button, DatePicker, Space, Modal, message, Calendar, Badge, Tooltip, Divider, Timeline, Alert, Steps, Avatar,Typography } from "antd";
import { 
  SaveOutlined, 
  PhoneOutlined, 
  CalendarOutlined, 
  SettingOutlined, 
  QuestionCircleOutlined, 
  CheckCircleOutlined, 
  LoadingOutlined,
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  StarOutlined,
  HistoryOutlined,
  WhatsAppOutlined,
  FacebookOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";

const { Option } = Select;
const { Step } = Steps;
const { Text } = Typography;

export default function ClientCard() {
  const [disposition, setDisposition] = useState("");
  const [rappelDate, setRappelDate] = useState(null);
  const [qualification, setQualification] = useState("");
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [clientNotes, setClientNotes] = useState("");
  const [clientRating, setClientRating] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [contactInfo, setContactInfo] = useState({
    nom: "Dupont",
    prenom: "Jean",
    telephone: "+216 12 345 678",
    email: "jean.dupont@email.com",
    ville: "Tunis",
    campagne: "Vente CRM",
    statut: "Prospect"
  });

  // Simuler l'historique des appels
  useEffect(() => {
    setCallHistory([
      { date: "2024-01-15", time: "14:30", duration: "3:45", result: "Pas intéressé" },
      { date: "2024-01-10", time: "10:15", duration: "5:20", result: "Rappel demandé" },
      { date: "2024-01-05", time: "16:45", duration: "2:30", result: "Occupé" },
    ]);
  }, []);

  const handleSave = () => {
    if (!disposition) {
      message.warning("Veuillez sélectionner un résultat d'appel");
      return;
    }
    
    if (disposition === "Rappel" && !rappelDate) {
      message.warning("Veuillez sélectionner une date et heure pour le rappel");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Ajouter à l'historique
      const newCall = {
        date: dayjs().format("YYYY-MM-DD"),
        time: dayjs().format("HH:mm"),
        duration: "00:00",
        result: disposition
      };
      setCallHistory([newCall, ...callHistory]);
      
      message.success({
        content: "Contact sauvegardé avec succès !",
        icon: <CheckCircleOutlined />,
        duration: 2
      });
      
      setCurrentStep(currentStep + 1);
      setIsLoading(false);
      
      // Réinitialisation
      setTimeout(() => {
        setDisposition("");
        setRappelDate(null);
        setQualification("");
        setClientNotes("");
      }, 500);
    }, 1500);
  };

  const handleQualify = () => {
    if (!qualification) {
      message.warning("Veuillez sélectionner une qualification");
      return;
    }

    const qualificationMessages = {
      "OK": { content: "Client qualifié ✅ - Prêt pour la suite", color: "#52c41a" },
      "injionables": { content: "Client injoignable 📞 - Rappel programmé", color: "#faad14" },
      "occupé": { content: "Client occupé ⏰ - Rappel ultérieur", color: "#1890ff" },
      "hors cible": { content: "Client hors cible 🎯 - Désistement", color: "#ff4d4f" }
    };
    
    const msg = qualificationMessages[qualification];
    message.success(msg.content);
    setQualification("");
    setCurrentStep(currentStep + 1);
  };

  const getDispositionColor = () => {
    switch(disposition) {
      case "Vente": return "#52c41a";
      case "Rappel": return "#1890ff";
      case "Pas intéressé": return "#ff4d4f";
      default: return "#d9d9d9";
    }
  };

  const steps = [
    { title: "Identification", icon: <UserOutlined /> },
    { title: "Qualification", icon: <StarOutlined /> },
    { title: "Résultat", icon: <CheckCircleOutlined /> },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card
          title={
            <Space>
              <PhoneOutlined style={{ color: "#00c6fb" }} />
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>Fiche Client - Centre d'appels</span>
            </Space>
          }
          extra={
            <Space>
              <Tooltip title="Script d'appel">
                <Button type="text" icon={<QuestionCircleOutlined />} onClick={() => message.info("Suivez le script d'appel")} />
              </Tooltip>
              <Tooltip title="Historique">
                <Button type="text" icon={<HistoryOutlined />} onClick={() => message.info("Affichage de l'historique")} />
              </Tooltip>
            </Space>
          }
          style={styles.card}
          bodyStyle={styles.cardBody}
        >
          {/* Progress Steps */}
          <Steps current={currentStep} size="small" style={{ marginBottom: 24 }}>
            {steps.map(step => (
              <Step key={step.title} title={step.title} icon={step.icon} />
            ))}
          </Steps>

          {/* Informations Contact avec animation */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={styles.contactHeader}
          >
            <div style={styles.contactAvatar}>
              <Avatar size={64} icon={<UserOutlined />} style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }} />
              <Badge status="success" style={{ position: "absolute", bottom: 0, right: 0 }} />
            </div>
            <div style={styles.contactInfo}>
              <div style={styles.contactName}>
                <Text strong style={{ fontSize: 18 }}>{contactInfo.prenom} {contactInfo.nom}</Text>
                <StarOutlined style={{ color: clientRating > 0 ? "#faad14" : "#d9d9d9", marginLeft: 10 }} />
              </div>
              <div><PhoneOutlined style={{ marginRight: 8, color: "#00c6fb" }} /> {contactInfo.telephone}</div>
              <div><MailOutlined style={{ marginRight: 8, color: "#00c6fb" }} /> {contactInfo.email}</div>
              <div><EnvironmentOutlined style={{ marginRight: 8, color: "#00c6fb" }} /> {contactInfo.ville}</div>
              <div><Badge status="processing" /> Campagne: {contactInfo.campagne}</div>
            </div>
            <div>
              <Badge count={disposition ? "✓" : 0} style={{ backgroundColor: getDispositionColor() }} />
            </div>
          </motion.div>

          <Divider />

          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* Résultat appel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div style={styles.sectionLabel}>
                <PhoneOutlined style={{ marginRight: 8 }} />
                Résultat de l'appel
              </div>
              <Select
                value={disposition}
                onChange={setDisposition}
                style={{ width: "100%" }}
                placeholder="Sélectionnez le résultat de l'appel"
                size="large"
              >
                <Option value="Vente"><Badge status="success" /> Vente - Client concluant</Option>
                <Option value="Rappel"><Badge status="warning" /> Rappel - À recontacter</Option>
                <Option value="Pas intéressé"><Badge status="error" /> Pas intéressé</Option>
                <Option value="Fax">📠 Fax - Envoyer documentation</Option>
                <Option value="NRP">📵 NRP - Ne pas rappeler</Option>
              </Select>
            </motion.div>

            {/* Date de rappel conditionnelle */}
            <AnimatePresence>
              {disposition === "Rappel" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={styles.sectionLabel}>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    Date et heure du rappel
                  </div>
                  <DatePicker
                    showTime={{ format: "HH:mm" }}
                    format="DD/MM/YYYY HH:mm"
                    style={{ width: "100%" }}
                    placeholder="Sélectionnez date et heure rappel"
                    size="large"
                    value={rappelDate}
                    onChange={setRappelDate}
                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Divider style={{ margin: "8px 0" }} />

            {/* Section qualification */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div style={styles.sectionLabel}>
                <StarOutlined style={{ marginRight: 8 }} />
                Qualification du contact
              </div>
              <Space style={{ width: "100%" }}>
                <Select
                  value={qualification}
                  onChange={setQualification}
                  style={{ flex: 1 }}
                  placeholder="Qualifier le client"
                  size="large"
                >
                  <Option value="injionables">📵 Injionables</Option>
                  <Option value="occupé">⏰ Occupé</Option>
                  <Option value="OK">✅ OK - Qualifié</Option>
                  <Option value="hors cible">🎯 Hors cible</Option>
                </Select>
                <Button 
                  type="primary"
                  size="large"
                  onClick={handleQualify}
                  icon={<CheckCircleOutlined />}
                  style={styles.qualifyButton}
                >
                  Qualifier
                </Button>
              </Space>
            </motion.div>

            {/* Notes client */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div style={styles.sectionLabel}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Notes de l'appel
              </div>
              <Input.TextArea
                rows={3}
                placeholder="Ajoutez des notes sur cet appel..."
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
              />
            </motion.div>

            {/* Historique rapide */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div style={styles.sectionLabel}>
                <HistoryOutlined style={{ marginRight: 8 }} />
                Historique des appels
              </div>
              <Timeline style={{ marginTop: 10 }}>
                {callHistory.slice(0, 3).map((call, idx) => (
                  <Timeline.Item key={idx} color={call.result === "Vente" ? "green" : call.result === "Rappel" ? "blue" : "red"}>
                    <div>
                      <Text strong>{call.date} {call.time}</Text>
                      <div><Text type="secondary">Résultat: {call.result}</Text></div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </motion.div>

            {/* Bouton Sauvegarder */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="primary"
                size="large"
                block
                icon={isLoading ? <LoadingOutlined /> : <SaveOutlined />}
                onClick={handleSave}
                loading={isLoading}
                style={styles.saveButton}
              >
                Sauvegarder & Appel Suivant
              </Button>
            </motion.div>

            {/* Canaux de communication */}
            <div style={styles.socialButtons}>
              <Tooltip title="Contacter via WhatsApp">
                <Button icon={<WhatsAppOutlined />} style={{ color: "#25D366" }} />
              </Tooltip>
              <Tooltip title="Contacter via Messenger">
                <Button icon={<FacebookOutlined />} style={{ color: "#1877F2" }} />
              </Tooltip>
              <Tooltip title="Envoyer un email">
                <Button icon={<MailOutlined />} style={{ color: "#ea4335" }} />
              </Tooltip>
            </div>
          </Space>
        </Card>
      </motion.div>

      {/* Modal Calendrier */}
      <Modal
        title="📅 Calendrier des rendez-vous"
        open={isCalendarVisible}
        onCancel={() => setIsCalendarVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsCalendarVisible(false)}>
            Fermer
          </Button>
        ]}
        width={700}
      >
        <Calendar 
          fullscreen={false}
          cellRender={(date) => {
            const events = [];
            if (rappelDate && dayjs(rappelDate).isSame(date, "day")) {
              events.push(
                <div key="rappel" style={styles.calendarEvent}>
                  📞 Rappel client
                </div>
              );
            }
            return <div>{events}</div>;
          }}
        />
      </Modal>
    </>
  );
}

const styles = {
  card: {
    borderRadius: 20,
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    border: "none",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  },
  cardBody: {
    padding: 24,
  },
  contactHeader: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: 16,
    background: "linear-gradient(135deg, #667eea15, #764ba215)",
    borderRadius: 16,
    marginBottom: 16,
    position: "relative",
  },
  contactAvatar: {
    position: "relative",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    display: "flex",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionLabel: {
    marginBottom: 8,
    fontWeight: 500,
    color: "#333",
  },
  qualifyButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
  },
  saveButton: {
    height: 48,
    fontSize: 16,
    fontWeight: "bold",
    background: "linear-gradient(135deg, #00c6fb 0%, #005bea 100%)",
    border: "none",
    boxShadow: "0 2px 8px rgba(0,198,251,0.3)",
  },
  socialButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  calendarEvent: {
    background: "#1890ff",
    color: "white",
    padding: "2px 4px",
    borderRadius: 4,
    fontSize: 12,
    marginTop: 4,
  },
};