import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/", icon: "🏠", label: "Accueil" },
  { path: "/bebe", icon: "👶", label: "Bébé" },
  { path: "/moi", icon: "🌸", label: "Moi" },
  { path: "/info", icon: "📖", label: "Info" },
  { path: "/carnet", icon: "📅", label: "Carnet" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 390, background: "#FFFAF6",
      borderTop: "1px solid #EDE0D0", display: "flex",
      padding: "10px 0 20px", zIndex: 100,
    }}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.path;
        return (
          <button key={item.path} onClick={() => navigate(item.path)}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, cursor: "pointer",
              padding: "4px 0", background: "none", border: "none",
            }}>
            <span style={{ fontSize: 20, filter: active ? "none" : "grayscale(1) opacity(0.4)" }}>
              {item.icon}
            </span>
            <span style={{
              fontSize: 10, fontWeight: active ? 700 : 400,
              color: active ? "#C4714A" : "#7A6E66",
            }}>
              {item.label}
            </span>
            {active && (
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C4714A", marginTop: -2 }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
