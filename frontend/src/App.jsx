<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Manager from "./pages/manager";
import Admin from "./pages/admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/manager" replace />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
=======
import React from "react";
import AppRouter from "./routes/AppRouter";

function App() {
  return <AppRouter />;
}

export default App;
>>>>>>> e341b5ec (Mise à jour du dialplan Asterisk et configuration PJSIP/1002)
