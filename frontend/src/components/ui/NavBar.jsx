import { useNavigate, useLocation } from "react-router-dom";
import { useNightMode } from "../../hooks/useNightMode";

const NAV_ITEMS = [
  { path: "/", icon: "🏠", label: "Accueil" },
  { path: "/bebe", icon: "👶", label: "Bébé" },
  { path: "/moi", icon: "🌸", label: "Moi" },
  { path: "/info", icon: "📖", label: "Info" },
  { path: "/alertes", icon: "🩺", label: "Alertes" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const nightMode = useNightMode();

  const bg = nightMode ? "#0F0700" : "#FFFAF6";
  const border = nightMode ? "#1F0E00" : "#EDE0D0";
  const activeColor = nightMode ? "#FF8C35" : "#C4714A";
  const inactiveColor = nightMode ? "#5A3A00" : "#7A6E66";

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 390,
      background: bg, borderTop: `1px solid ${border}`,
      display: "flex", padding: "10px 0 20px", zIndex: 100,
      transition: "background 0.5s",
    }}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.path;
        return (
          <button key={item.path} onClick={() => navigate(item.path)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "4px 0", background: "none", border: "none" }}>
            <span style={{ fontSize: 20, filter: active ? "none" : "grayscale(1) opacity(0.4)" }}>
              {item.icon}
            </span>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? activeColor : inactiveColor }}>
              {item.label}
            </span>
            {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: activeColor, marginTop: -2 }} />}
          </button>
        );
      })}
    </nav>
  );
}
