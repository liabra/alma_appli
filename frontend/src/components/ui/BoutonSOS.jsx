import { useState } from "react";
import { RESSOURCES_SOUTIEN } from "../../data/postpartum";

const p = {
  terracotta: "#C4714A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0",
  sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
};

const MESSAGES_SOS = [
  "Tu tiens. Même quand ça semble impossible, tu tiens.",
  "Ce que tu vis en ce moment est réel et difficile. Tu n'es pas seule.",
  "Il n'y a pas de mauvaise mère ici — juste une maman épuisée qui fait de son mieux.",
  "La nuit la plus longue a une fin. Tu passes au travers.",
  "Demander de l'aide n'est pas une faiblesse — c'est la chose la plus courageuse que tu puisses faire.",
];

export default function BoutonSOS({ nightMode = false }) {
  const [ouvert, setOuvert] = useState(false);
  const [message] = useState(MESSAGES_SOS[Math.floor(Math.random() * MESSAGES_SOS.length)]);

  const bg = nightMode ? "#1A0500" : p.white;
  const border = nightMode ? "#3A0A00" : p.linDark;
  const textColor = nightMode ? "#FF6B35" : p.text;
  const subColor = nightMode ? "#8B3A00" : p.textLight;

  if (!ouvert) {
    return (
      <button onClick={() => setOuvert(true)}
        style={{
          width: "100%", padding: "14px 20px", borderRadius: 20,
          background: nightMode ? "#1A0000" : "#FFF0F0",
          border: `2px solid ${nightMode ? "#3A0000" : "#F0C0C0"}`,
          color: nightMode ? "#FF4444" : "#C04040",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
        <span style={{ fontSize: 20 }}>🆘</span>
        Je suis à bout
      </button>
    );
  }

  return (
    <div style={{ background: bg, borderRadius: 20, padding: "20px", border: `2px solid ${border}` }}>
      {/* Message humain */}
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: textColor, lineHeight: 1.5, marginBottom: 16, textAlign: "center" }}>
        "{message}"
      </div>

      {/* Actions immédiates */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: subColor, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
          Ce que tu peux faire maintenant
        </div>
        {[
          { icon: "📞", texte: "Appelle le 3114", desc: "Numéro national prévention — 24h/24", href: "tel:3114" },
          { icon: "💬", texte: "Maman Blues", desc: "Association soutien difficultés maternelles", href: "https://www.maman-blues.fr" },
          { icon: "🌿", texte: "Pose le téléphone", desc: "Bébé en sécurité — donne-toi 5 minutes", href: null },
        ].map((action, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: nightMode ? "#0A0500" : p.lin, borderRadius: 12 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{action.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: textColor }}>{action.texte}</div>
              <div style={{ fontSize: 11, color: subColor }}>{action.desc}</div>
            </div>
            {action.href && (
              <a href={action.href} target={action.href.startsWith("http") ? "_blank" : "_self"} rel="noreferrer"
                style={{ fontSize: 18, textDecoration: "none", flexShrink: 0 }}>→</a>
            )}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, color: subColor, textAlign: "center", fontStyle: "italic", marginBottom: 12 }}>
        Ceci n'est pas un avis médical · En cas d'urgence appelle le 15 ou le 18
      </div>

      <button onClick={() => setOuvert(false)}
        style={{ width: "100%", padding: "10px", borderRadius: 12, border: `1px solid ${border}`, background: "transparent", color: subColor, fontSize: 12, cursor: "pointer" }}>
        Fermer
      </button>
    </div>
  );
}
