// frontend/src/components/ClientCard.jsx
import React, { useEffect, useState } from "react";
import { Card, Badge, Typography, Space, Spin, Button } from "antd";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
import {  updateLead ,getLeads } from "../api/api.jsx";
import { Select, DatePicker, Input, message } from "antd";
const { Text } = Typography;

export default function ClientCard({ setCurrentNumber }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // client actuel
const [qualification, setQualification] = useState("");
const [callbackDate, setCallbackDate] = useState(null);
const [note, setNote] = useState("");
  // Récupération des leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await getLeads();
        const mappedLeads = res.data.map(l => ({
          id: l.id,
          nom: l.nom,
          prenom: l.prenom,
          telephone: l.telephone,
          email: l.email || "",
          adresse: l.adresse || "",
          statut: l.statut || "",
          commentaire: l.commentaire || "",
          agent_name: l.agent_name || "",
          campagne_id: l.campagne_id,
        }));
        setClients(mappedLeads);

        // Affiche automatiquement le numéro du premier client
        if (mappedLeads.length > 0 && setCurrentNumber) {
          setCurrentNumber(mappedLeads[0].telephone);
        }
      } catch (err) {
        console.error("Erreur récupération leads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [setCurrentNumber]);

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height: "100%" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (clients.length === 0) {
    return <div>Aucun client disponible</div>;
  }

  const client = clients[currentIndex];

  // Navigation clients
  const goPrev = () => {
    setCurrentIndex(i => {
      const newIndex = Math.max(i - 1, 0);
      if (setCurrentNumber) setCurrentNumber(clients[newIndex].telephone);
      return newIndex;
    });
  };

  const goNext = () => {
    setCurrentIndex(i => {
      const newIndex = Math.min(i + 1, clients.length - 1);
      if (setCurrentNumber) setCurrentNumber(clients[newIndex].telephone);
      return newIndex;
    });
  };
const saveQualification = async () => {
  try {
    await updateLead(client.id, {
      ...client,
      statut: qualification,
      commentaire:
        qualification === "Rappeler"
          ? `Rappel prévu: ${callbackDate}`
          : note,
    });

    message.success("Qualification enregistrée");

  } catch (err) {
    console.error(err);
    message.error("Erreur lors de la sauvegarde");
  }
};
  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <Card title={`Client ${currentIndex + 1} / ${clients.length}`} style={{ borderRadius: 16, position: "relative" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong style={{ fontSize: 16 }}>
            {client.prenom} {client.nom} {client.agent_name && `(Agent: ${client.agent_name})`}
          </Text>
          <div><PhoneOutlined /> {client.telephone}</div>
          <div><MailOutlined /> {client.email || "-"}</div>
          <div><EnvironmentOutlined /> {client.adresse || "-"}</div>
          <div>Status: <Badge status={client.statut ? "processing" : "default"} text={client.statut || "N/A"} /></div>
          {client.commentaire && <div>Note: {client.commentaire}</div>}
        </Space>

        {/* Navigation Clients */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <Button 
            type="primary" 
            shape="circle" 
            icon={<LeftOutlined />} 
            onClick={goPrev} 
            disabled={currentIndex === 0} 
          />
          <Button 
            type="primary" 
            shape="circle" 
            icon={<RightOutlined />} 
            onClick={goNext} 
            disabled={currentIndex === clients.length - 1} 
          />
        </div>
      </Card>
      <Card
  title="Qualification du client"
  style={{ borderRadius: 16, marginTop: 16 }}
>
  <Space direction="vertical" style={{ width: "100%" }}>

    <Select
      placeholder="Choisir qualification"
      value={qualification}
      onChange={setQualification}
      style={{ width: "100%" }}
    >
      <Select.Option value="OK">OK</Select.Option>
      <Select.Option value="Hors cible">Hors cible</Select.Option>
      <Select.Option value="Injoignable">Injoignable</Select.Option>
      <Select.Option value="Rappeler">Rappeler</Select.Option>
      <Select.Option value="Autre">Autre</Select.Option>
    </Select>

    {/* Cas Rappeler */}
    {qualification === "Rappeler" && (
      <DatePicker
        showTime
        style={{ width: "100%" }}
        onChange={(date, dateString) => setCallbackDate(dateString)}
      />
    )}

    {/* Cas Autre */}
    {(qualification === "Autre" ||
      qualification === "OK" ||
      qualification === "Hors cible") && (
      <Input.TextArea
        placeholder="Ajouter une note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    )}

    <Button type="primary" onClick={saveQualification}>
      Enregistrer
    </Button>

  </Space>
</Card>
    </div>
  );
}