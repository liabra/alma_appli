import { useState } from "react";

const MOODS = [
  { id: 0, emoji: "😔", label: "Difficile" },
  { id: 1, emoji: "😐", label: "Bof" },
  { id: 2, emoji: "🙂", label: "Ça va" },
  { id: 3, emoji: "😊", label: "Bien" },
  { id: 4, emoji: "🌟", label: "Super" },
];

const p = { terracotta: "#C4714A", terracottaPale: "#F0D5C5", lin: "#F5EDE3", linDark: "#EDE0D0", text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6" };

export default function CheckIn() {
  const [done, setDone] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [texte, setTexte] = useState("");
  const [showTexte, setShowTexte] = useState(false);

  const envoyer = () => setDone(true);

  if (done) {
    return (
      <div style={{ background: p.white, borderRadius: 20, padding: "14px 18px", border: `1px solid ${p.terracottaPale}`, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{selectedMood !== null ? MOODS[selectedMood].emoji : "🌸"}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: p.text }}>Check-in du jour noté</div>
          <div style={{ fontSize: 11, color: p.textLight, marginTop: 1 }}>Alma garde un œil sur ton moral 🌿</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.terracottaPale}`, boxShadow: "0 2px 12px rgba(196,113,74,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 600, color: p.text, lineHeight: 1.3, flex: 1, paddingRight: 8 }}>
          Comment tu te sens aujourd'hui ?
        </div>
        <span style={{ fontSize: 11, color: p.textLight, cursor: "pointer", paddingTop: 2 }} onClick={() => setDone(true)}>Plus tard</span>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {MOODS.map((m) => (
          <button key={m.id} onClick={() => { setSelectedMood(m.id); setShowTexte(true); }}
            style={{ flex: 1, padding: "10px 0", borderRadius: 14, border: `1.5px solid ${selectedMood === m.id ? p.terracotta : p.linDark}`, background: selectedMood === m.id ? p.terracottaPale : "transparent", fontSize: 20, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span>{m.emoji}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: selectedMood === m.id ? p.terracotta : p.textLight }}>{m.label}</span>
          </button>
        ))}
      </div>

      {showTexte && (
        <>
          <textarea rows={3} value={texte} onChange={(e) => setTexte(e.target.value)}
            placeholder="Tu peux écrire ce que tu veux... ou laisser vide."
            style={{ width: "100%", borderRadius: 12, border: `1.5px solid ${p.linDark}`, padding: "10px 12px", fontSize: 13, color: p.text, background: p.lin, resize: "none", fontFamily: "'DM Sans', sans-serif", outline: "none", lineHeight: 1.5 }} />
          <button onClick={envoyer}
            style={{ width: "100%", marginTop: 10, padding: "11px 0", borderRadius: 12, border: "none", background: p.terracotta, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Envoyer
          </button>
          <div style={{ fontSize: 10, color: p.textLight, textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
            Ceci n'est pas un outil médical · toujours consulter un professionnel en cas de besoin
          </div>
        </>
      )}
    </div>
  );
}
