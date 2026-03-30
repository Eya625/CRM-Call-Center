import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ManagerPage from "./pages/manager";
import Admin from "./pages/admin";
import Login from "./pages/Login";
import AgentPage from "./pages/Agent";
import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page de login hors Layout */}
        <Route path="/login" element={<Login />} />

        {/* Toutes les autres pages avec le Layout */}
        <Route element={<Layout />}>
          <Route
            path="/agent"
            element={
              <ProtectedRoute role="agent">
                <AgentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/Login" replace />} />{" "}
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
