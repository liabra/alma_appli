import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUserStore } from "./store/useUserStore";
import { useBebeStore } from "./store/useBebeStore";
import { useSync } from "./hooks/useSync";
import Onboarding from "./sections/Onboarding";
import Dashboard from "./sections/Dashboard";
import Bebe from "./sections/Bebe";
import Moi from "./sections/Moi";
import Info from "./sections/Info";
import Carnet from "./sections/Carnet";
import Profil from "./sections/Profil";
import Recuperation from "./sections/Recuperation";
import NavBar from "./components/ui/NavBar";

export default function App() {
  const { uuid, initUser, isNewUser } = useUserStore();
  const { getBebe } = useBebeStore();
  useSync();

  useEffect(() => { initUser(); }, []);

  const bebe = getBebe();

  // Route récupération toujours accessible
  if (window.location.pathname === "/recuperation") {
    return <Routes><Route path="/recuperation" element={<Recuperation />} /></Routes>;
  }

  if (!uuid || isNewUser || !bebe) {
    return <Onboarding />;
  }

  return (
    <div style={{ background: "#E8DDD3", minHeight: "100vh" }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bebe" element={<Bebe />} />
        <Route path="/moi" element={<Moi />} />
        <Route path="/info" element={<Info />} />
        <Route path="/carnet" element={<Carnet />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/recuperation" element={<Recuperation />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <NavBar />
    </div>
  );
}
