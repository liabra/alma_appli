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
import NavBar from "./components/ui/NavBar";

export default function App() {
  const { uuid, initUser, isNewUser } = useUserStore();
  const { bebe } = useBebeStore();
  useSync();

  useEffect(() => {
    initUser();
  }, []);

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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <NavBar />
    </div>
  );
}
