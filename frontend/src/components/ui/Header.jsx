import { useNavigate } from "react-router-dom";
import { useBebeStore } from "../../store/useBebeStore";

export default function Header() {
  const { getBebe, getAgeLabel, bebes, bebeActifId, setBebeActif } = useBebeStore();
  const bebe = getBebe();
  const navigate = useNavigate();

  return (
    <header style={{ padding: "52px 24px 18px", background: "#FFFAF6", borderBottom: "1px solid #EDE0D0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "#C4714A", letterSpacing: "-0.5px" }}>
          alma
        </span>
        <button onClick={() => navigate("/profil")}
          style={{ width: 38, height: 38, borderRadius: "50%", background: "#F0D5C5", border: "none", cursor: "pointer", fontSize: 16 }}>
          👤
        </button>
      </div>
      <div style={{ fontSize: 13, color: "#7A6E66" }}>Bonjour 👋</div>
      {bebe && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
          <div style={{ fontSize: 12, color: "#6B8F71", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6B8F71", display: "inline-block" }} />
            {bebe.prenom} · {getAgeLabel()}
          </div>
          {/* Switcher si plusieurs enfants */}
          {bebes.length > 1 && bebes.map(b => (
            <button key={b.id} onClick={() => setBebeActif(b.id)}
              style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, border: `1px solid ${b.id === (bebeActifId || bebes[0]?.id) ? "#6B8F71" : "#EDE0D0"}`, background: b.id === (bebeActifId || bebes[0]?.id) ? "#C8DBC9" : "transparent", color: b.id === (bebeActifId || bebes[0]?.id) ? "#4A7A50" : "#7A6E66", cursor: "pointer", fontWeight: 600 }}>
              {b.prenom}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
