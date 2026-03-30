
import React from "react";


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Manager from "./pages/manager";
import Admin from "./pages/admin";
import Login from "./pages/Login";
import Agent from "./pages/Agent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page de login hors Layout */}
        <Route path="/login" element={<Login />} />

        {/* Toutes les autres pages avec le Layout */}
        <Route element={<Layout />}>
          <Route path="/agent" element={<Agent />} />
          <Route path="/" element={<Navigate to="/Login" replace />} />{" "}
          <Route path="/manager" element={<Manager />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
