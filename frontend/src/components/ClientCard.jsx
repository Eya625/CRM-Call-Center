import React, { useState, useEffect } from "react";
import { Card, Input, Select, Button, DatePicker, Space, Modal, message, Calendar, Badge, Tooltip, Divider, Timeline, Steps, Avatar, Typography } from "antd";
import { 
  SaveOutlined, 
  PhoneOutlined, 
  CalendarOutlined, 
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
import api from "./../api/axios"; 

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
  const [contactInfo, setContactInfo] = useState(null); // initialement null, on récupère du backend

  // Récupération des données client depuis l'API
useEffect(() => {
  const fetchClient = async () => {
    try {
      // Appel de l'API pour récupérer le prochain lead
      const res = await api.get('/leads/next'); 
      const lead = res.data;

      if(lead) {
        // Mapping des champs PostgreSQL vers contactInfo attendu par le composant
        setContactInfo({
          id: lead.id,                  // pour save/update
          nom: lead.last_name,
          prenom: lead.first_name,
          telephone: lead.phone,
          email: lead.email || '',
          ville: lead.address || '',
          campagne: lead.campaign_id,
          statut: lead.call_status
        });

        // Si tu as une table historique séparée, tu peux faire un autre fetch ici
        setCallHistory([]); // sinon on met vide pour l'instant
      }
    } catch (err) {
      console.error(err);
      message.error("Erreur lors de la récupération des données client");
    }
  };

  fetchClient();
}, []);

  const handleSave = async () => {
    if (!disposition) {
      message.warning("Veuillez sélectionner un résultat d'appel");
      return;
    }

    if (disposition === "Rappel" && !rappelDate) {
      message.warning("Veuillez sélectionner une date et heure pour le rappel");
      return;
    }

    if (!contactInfo) return;

    setIsLoading(true);
    try {
      // Envoi des informations d'appel au backend
      const payload = {
        clientId: contactInfo.id,
        disposition,
        rappelDate: rappelDate ? dayjs(rappelDate).toISOString() : null,
        notes: clientNotes,
        qualification
      };

      const res = await api.post("/calls", payload); // endpoint pour enregistrer l'appel
      if(res.data.success) {
        message.success({ content: "Contact sauvegardé avec succès !", icon: <CheckCircleOutlined />, duration: 2 });

        // Mettre à jour l'historique
        const newCall = {
          date: dayjs().format("YYYY-MM-DD"),
          time: dayjs().format("HH:mm"),
          duration: "00:00",
          result: disposition
        };
        setCallHistory([newCall, ...callHistory]);

        setCurrentStep(currentStep + 1);

        // Réinitialisation des champs
        setDisposition("");
        setRappelDate(null);
        setQualification("");
        setClientNotes("");

        // Récupérer le prochain client
        const nextClient = await api.get("/clients/next");
        if(nextClient.data) {
          setContactInfo(nextClient.data.client);
          setCallHistory(nextClient.data.callHistory || []);
          setCurrentStep(0);
        }
      }
    } catch (err) {
      console.error(err);
      message.error("Erreur lors de la sauvegarde de l'appel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQualify = () => {
    if (!qualification) {
      message.warning("Veuillez sélectionner une qualification");
      return;
    }

    const qualificationMessages = {
      "OK": "Client qualifié ✅ - Prêt pour la suite",
      "injionables": "Client injoignable 📞 - Rappel programmé",
      "occupé": "Client occupé ⏰ - Rappel ultérieur",
      "hors cible": "Client hors cible 🎯 - Désistement"
    };
    
    message.success(qualificationMessages[qualification]);
    setQualification("");
    setCurrentStep(currentStep + 1);
  };

  const getDispositionColor = () => {
    switch(disposition) {
      case "Vente": return "#f97316";
      case "Rappel": return "#f97316";
      case "Pas intéressé": return "#f97316";
      default: return "#d9d9d9";
    }
  };

  const steps = [
    { title: "Identification", icon: <UserOutlined /> },
    { title: "Qualification", icon: <StarOutlined /> },
    { title: "Result", icon: <CheckCircleOutlined /> },
  ];

  if (!contactInfo) return <div>Chargement du client...</div>;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card
          title={<Space><PhoneOutlined style={{ color: "#f97316" }} /><span style={{ fontSize: "18px", fontWeight: "bold" }}>Client Card - Call Center</span></Space>}
          extra={
            <Space>
              <Tooltip title="Script d'appel">
                <Button type="text" icon={<QuestionCircleOutlined style={{ color: "#f97316" }} />} onClick={() => message.info("Suivez le script d'appel")} />
              </Tooltip>
              <Tooltip title="Historique">
                <Button type="text" icon={<HistoryOutlined style={{ color: "#f97316" }} />} onClick={() => message.info("Affichage de l'historique")} />
              </Tooltip>
            </Space>
          }
        >
          <Steps current={currentStep} size="small" style={{ marginBottom: 24 }}>
            {steps.map(step => <Step key={step.title} title={step.title} icon={step.icon} />)}
          </Steps>

          <motion.div whileHover={{ scale: 1.02 }} style={{ display: "flex", gap: 16 }}>
            <Avatar size={64} icon={<UserOutlined />} />
            <div>
              <Text strong style={{ fontSize: 18 }}>{contactInfo.prenom} {contactInfo.nom}</Text>
              <div><PhoneOutlined /> {contactInfo.telephone}</div>
              <div><MailOutlined /> {contactInfo.email}</div>
              <div><EnvironmentOutlined /> {contactInfo.ville}</div>
              <div><Badge status="processing" /> Campagne: {contactInfo.campagne}</div>
            </div>
            <Badge count={disposition ? "✓" : 0} style={{ backgroundColor: getDispositionColor() }} />
          </motion.div>

          <Divider />

          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <PhoneOutlined /> Call Result
              <Select value={disposition} onChange={setDisposition} style={{ width: "100%" }} placeholder="Sélectionnez le résultat de l'appel" size="large">
                <Option value="Vente">Sale - Closed Client</Option>
                <Option value="Rappel">Callback - To Recontact</Option>
                <Option value="Pas intéressé">Not Interested</Option>
                <Option value="Fax">Fax - Send Documentation</Option>
                <Option value="NRP">DNC - Do Not Call</Option>
              </Select>
            </div>

            <AnimatePresence>
              {disposition === "Rappel" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                  <CalendarOutlined /> Date et heure du rappel
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

            <div>
              <StarOutlined /> Contact Qualification
              <Space style={{ width: "100%" }}>
                <Select value={qualification} onChange={setQualification} style={{ flex: 1 }} placeholder="Qualifier le client" size="large">
                  <Option value="injionables">Unreachable</Option>
                  <Option value="occupé">Busy</Option>
                  <Option value="OK">OK - Qualified</Option>
                  <Option value="hors cible">Out of Target</Option>
                </Select>
                <Button type="primary" onClick={handleQualify}>Qualify</Button>
              </Space>
            </div>

            <div>
              <ClockCircleOutlined /> Call Notes
              <Input.TextArea rows={3} placeholder="Ajoutez des notes sur cet appel..." value={clientNotes} onChange={(e) => setClientNotes(e.target.value)} />
            </div>

            <div>
              <HistoryOutlined /> Call History
              <Timeline>
                {callHistory.slice(0, 3).map((call, idx) => (
                  <Timeline.Item key={idx} color="#f97316">
                    <Text strong>{call.date} {call.time}</Text>
                    <div><Text type="secondary">Résultat: {call.result}</Text></div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>

            <Button type="primary" block icon={isLoading ? <LoadingOutlined /> : <SaveOutlined />} onClick={handleSave} loading={isLoading}>
              Save & Next Call
            </Button>
          </Space>
        </Card>
      </motion.div>
    </>
  );
}

const styles = {
  card: {
    borderRadius: 20,
    background: "#ffffff",
    border: "none",
    boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
  },
  cardBody: {
    padding: 24,
  },
  contactHeader: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: 16,
    background: "#fafafa",
    borderRadius: 16,
    marginBottom: 16,
    position: "relative",
    border: "1px solid #e8e8e8",
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
    color: "#1a1a1a",
  },
  qualifyButton: {
    background: "#f97316",
    border: "none",
  },
  saveButton: {
    height: 48,
    fontSize: 16,
    fontWeight: "bold",
    background: "#f97316",
    border: "none",
    boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
  },
  socialButtons: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  calendarEvent: {
    background: "#f97316",
    color: "white",
    padding: "2px 4px",
    borderRadius: 4,
    fontSize: 12,
    marginTop: 4,
  },
};