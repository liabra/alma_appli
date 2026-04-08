import { useBebeStore } from "../../store/useBebeStore";

export default function Header() {
  const { bebe, getAgeLabel } = useBebeStore();

  return (
    <header style={{
      padding: "52px 24px 18px", background: "#FFFAF6",
      borderBottom: "1px solid #EDE0D0",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 28,
          fontWeight: 600, color: "#C4714A", letterSpacing: "-0.5px",
        }}>
          alma
        </span>
        <button style={{
          width: 38, height: 38, borderRadius: "50%", background: "#F0D5C5",
          border: "none", cursor: "pointer", fontSize: 16,
        }}>
          👤
        </button>
      </div>
      <div style={{ fontSize: 13, color: "#7A6E66" }}>Bonjour 👋</div>
      {bebe && (
        <div style={{
          fontSize: 12, color: "#6B8F71", fontWeight: 600,
          marginTop: 2, display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6B8F71", display: "inline-block" }} />
          {bebe.prenom} · {getAgeLabel()}
        </div>
      )}
    </header>
  );
}
