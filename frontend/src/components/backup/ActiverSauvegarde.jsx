import { useState } from "react";
import { generateRecoveryPhrase } from "../../lib/vaultCrypto";
import { enableBackup } from "../../lib/vaultSync";

const p = {
  terracotta: "#C4714A", terracottaL: "#D4876A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
};

export default function ActiverSauvegarde({ onCancel, onDone }) {
  const [phrase] = useState(() => generateRecoveryPhrase());
  const mots = phrase.split(" ");

  const [copie, setCopie] = useState(false);
  const [copieErreur, setCopieErreur] = useState(false);
  const [coche, setCoche] = useState(false);
  const [activation, setActivation] = useState(false);
  const [erreur, setErreur] = useState("");

  const copier = async () => {
    setCopieErreur(false);
    try {
      await navigator.clipboard.writeText(phrase);
      setCopie(true);
    } catch {
      setCopieErreur(true);
    }
  };

  const activer = async () => {
    setActivation(true);
    setErreur("");
    try {
      await enableBackup(phrase);
      onDone();
    } catch (e) {
      setErreur("Échec de l'activation : " + String(e?.message || e));
      setActivation(false);
    }
  };

  return (
    <div style={{ background: p.lin, borderRadius: 16, padding: "16px", border: `1.5px solid ${p.terracottaPale}`, marginTop: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: p.text, marginBottom: 12 }}>🔑 Ta phrase de récupération</div>

      {/* Grille 12 mots, 2 colonnes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {mots.map((mot, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: p.white, border: `1px solid ${p.linDark}`, borderRadius: 10, padding: "8px 10px" }}>
            <span style={{ fontSize: 11, color: p.textLight, minWidth: 16 }}>{i + 1}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: p.text }}>{mot}</span>
          </div>
        ))}
      </div>

      {/* Copier */}
      <button onClick={copier}
        style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", marginBottom: 4, fontSize: 13, fontWeight: 700, cursor: "pointer", background: copie ? p.saugePale : p.white, color: copie ? p.sauge : p.text, borderColor: p.linDark, borderWidth: 1, borderStyle: "solid" }}>
        {copie ? "✓ Copié" : "Copier les 12 mots"}
      </button>
      {copieErreur && (
        <div style={{ fontSize: 11, color: "#C04040", marginBottom: 8, textAlign: "center" }}>
          Copie impossible — recopie les mots à la main.
        </div>
      )}

      {/* Avertissement */}
      <div style={{ fontSize: 12, color: p.textLight, lineHeight: 1.6, margin: "12px 0", padding: "12px", background: p.terracottaPale, borderRadius: 10 }}>
        Note ces 12 mots dans l'ordre et garde-les en lieu sûr. C'est ta seule clé : si tu la perds, tes données sauvegardées seront définitivement irrécupérables (même nous ne pourrons pas les déchiffrer).
      </div>

      {/* Case obligatoire */}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: p.text, marginBottom: 14, cursor: "pointer" }}>
        <input type="checkbox" checked={coche} onChange={e => setCoche(e.target.checked)} style={{ marginTop: 2 }} />
        <span>J'ai noté ma phrase de récupération en lieu sûr.</span>
      </label>

      {erreur && <div style={{ fontSize: 12, color: "#C04040", marginBottom: 10 }}>{erreur}</div>}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} disabled={activation}
          style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1.5px solid ${p.linDark}`, background: "transparent", color: p.textLight, fontSize: 13, fontWeight: 600, cursor: activation ? "default" : "pointer" }}>
          Annuler
        </button>
        <button onClick={activer} disabled={!coche || activation}
          style={{ flex: 2, padding: "10px 0", borderRadius: 12, border: "none", background: (coche && !activation) ? p.terracotta : p.linDark, color: "#fff", fontSize: 13, fontWeight: 700, cursor: (coche && !activation) ? "pointer" : "default" }}>
          {activation ? "Activation..." : "Activer la sauvegarde"}
        </button>
      </div>
    </div>
  );
}
