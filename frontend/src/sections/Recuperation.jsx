import { useState } from "react";
import { isValidRecoveryPhrase } from "../lib/vaultCrypto";
import { restoreFromPhrase } from "../lib/vaultSync";

const p = {
  terracotta: "#C4714A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0",
  sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
};

export default function Recuperation() {
  const [phrase, setPhrase] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);

  const valide = isValidRecoveryPhrase(phrase);

  const restaurer = async () => {
    setLoading(true);
    setErreur("");
    try {
      await restoreFromPhrase(phrase);
      setSucces(true);
      // Rechargement complet pour que les stores relisent les données restaurées
      setTimeout(() => { window.location.href = "/"; }, 1500);
    } catch (e) {
      setErreur(String(e?.message || e));
      setLoading(false);
    }
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
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: p.text, textAlign: "center", marginBottom: 8 }}>Restaurer mes données</div>
          <div style={{ fontSize: 14, color: p.textLight, textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>
            Saisis ou colle les 12 mots de ta phrase de récupération, dans l'ordre.
          </div>

          <div style={{ width: "100%", marginBottom: 12 }}>
            <textarea
              value={phrase}
              onChange={e => { setPhrase(e.target.value); setErreur(""); }}
              placeholder="mot1 mot2 mot3 …"
              rows={4}
              style={{ width: "100%", padding: "14px", borderRadius: 14, border: `2px solid ${erreur ? "#C04040" : p.linDark}`, background: p.white, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: "none", color: p.text, resize: "vertical", boxSizing: "border-box" }}
            />
            {erreur && <div style={{ fontSize: 12, color: "#C04040", marginTop: 6, textAlign: "center" }}>{erreur}</div>}
          </div>

          <div style={{ width: "100%", padding: "12px 14px", background: p.terracottaPale, borderRadius: 12, fontSize: 12, color: p.text, lineHeight: 1.6, marginBottom: 16 }}>
            ⚠️ La restauration remplacera les données actuellement sur cet appareil par celles de ta sauvegarde.
          </div>

          <button onClick={restaurer} disabled={loading || !valide}
            style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: (!loading && valide) ? p.terracotta : p.linDark, color: "#fff", fontSize: 15, fontWeight: 700, cursor: (!loading && valide) ? "pointer" : "default", marginBottom: 16 }}>
            {loading ? "Restauration en cours..." : "Restaurer mes données"}
          </button>

          <button onClick={() => { window.location.href = "/"; }}
            style={{ fontSize: 13, color: p.textLight, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Créer un nouveau compte
          </button>
        </>
      )}
    </div>
  );
}
