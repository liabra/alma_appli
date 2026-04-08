import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useBebeStore } from "../store/useBebeStore";
import { useSessionStore } from "../store/useSessionStore";
import { restoreFromCode } from "../hooks/useSync";

const p = {
  terracotta: "#C4714A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0",
  sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
};

export default function Recuperation() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);

  const { uuid, initUser } = useUserStore();
  const navigate = useNavigate();

  const handleCode = (val) => {
    // Formater automatiquement ALMA-XXXX-XXXX
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
    let formatted = clean;
    if (clean.length > 4) formatted = "ALMA-" + clean.slice(4, 8);
    if (clean.length > 8) formatted = "ALMA-" + clean.slice(4, 8) + "-" + clean.slice(8, 12);
    if (!val.startsWith("ALMA")) formatted = val.toUpperCase();
    setCode(formatted);
    setErreur("");
  };

  const restaurer = async () => {
    if (!code.includes("ALMA")) { setErreur("Le code doit commencer par ALMA-"); return; }
    setLoading(true);
    const result = await restoreFromCode(code);
    setLoading(false);
    if (!result.success) { setErreur(result.error); return; }

    // Restaurer les données dans les stores
    const { data } = result.data;
    if (data.bebes) useBebeStore.setState({ bebes: data.bebes, bebeActifId: data.bebeActifId });
    if (data.session) useSessionStore.setState(data.session);
    // Mettre à jour l'UUID
    useUserStore.setState({ uuid: result.data.uuid, isNewUser: false });

    setSucces(true);
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: p.lin, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>

      {succes ? (
        <>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✨</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: p.text, textAlign: "center", marginBottom: 8 }}>Compte restauré !</div>
          <div style={{ fontSize: 14, color: p.textLight, textAlign: "center" }}>Toutes tes données sont de retour. Redirection...</div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: p.text, textAlign: "center", marginBottom: 8 }}>Restaurer mon compte</div>
          <div style={{ fontSize: 14, color: p.textLight, textAlign: "center", lineHeight: 1.6, marginBottom: 32 }}>
            Entre ton code de récupération Alma pour retrouver toutes tes données.
          </div>

          <div style={{ width: "100%", marginBottom: 12 }}>
            <input
              type="text"
              value={code}
              onChange={e => handleCode(e.target.value)}
              placeholder="ALMA-XXXX-XXXX"
              maxLength={14}
              style={{ width: "100%", padding: "16px", borderRadius: 14, border: `2px solid ${erreur ? "#C04040" : p.linDark}`, background: p.white, fontSize: 20, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, textAlign: "center", letterSpacing: "2px", outline: "none", color: p.text }}
            />
            {erreur && <div style={{ fontSize: 12, color: "#C04040", marginTop: 6, textAlign: "center" }}>{erreur}</div>}
          </div>

          <button onClick={restaurer} disabled={loading || code.length < 12}
            style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: (!loading && code.length >= 12) ? p.terracotta : p.linDark, color: "#fff", fontSize: 15, fontWeight: 700, cursor: (!loading && code.length >= 12) ? "pointer" : "default", marginBottom: 16 }}>
            {loading ? "Recherche en cours..." : "Restaurer mes données"}
          </button>

          <button onClick={() => navigate("/")}
            style={{ fontSize: 13, color: p.textLight, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Créer un nouveau compte
          </button>

          <div style={{ marginTop: 24, padding: "14px 16px", background: p.white, borderRadius: 14, border: `1px solid ${p.linDark}`, fontSize: 12, color: p.textLight, lineHeight: 1.6, textAlign: "center" }}>
            💡 Ton code de récupération est disponible dans <strong>Profil → Compte anonyme</strong>. Note-le ou prends-en une photo.
          </div>
        </>
      )}
    </div>
  );
}
