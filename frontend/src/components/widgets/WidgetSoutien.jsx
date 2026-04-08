import { useState } from "react";
import { useSessionStore } from "../../store/useSessionStore";

const p = { sauge: "#6B8F71", saugePale: "#C8DBC9", linDark: "#EDE0D0", lin: "#F5EDE3", text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6", terracotta: "#C4714A", terracottaPale: "#F0D5C5" };

const TAG_COLORS = {
  allaitement: { bg: "#F0D5C5", color: "#C4714A" },
  coliques: { bg: "#FDE8D8", color: "#B85C30" },
  portage: { bg: "#C8DBC9", color: "#4A7A50" },
  DME: { bg: "#D8EAF0", color: "#3A7A9A" },
  "post-partum": { bg: "#E8D8F0", color: "#7A4A9A" },
  sommeil: { bg: "#D0D8EA", color: "#3A4A8A" },
  pleurs: { bg: "#FAE0D8", color: "#A04030" },
};

const ALLIEES_DEMO = [
  { id: 1, prenom: "Emma", emoji: "👩‍🦱", tags: ["allaitement", "portage"], note: "A allaité 18 mois, elle a tout vécu 💪", creneaux: [{ debut: 9, fin: 12 }, { debut: 20, fin: 22 }], tel: "+33612345678", whatsapp: true },
  { id: 2, prenom: "Sophie", emoji: "👩‍🦰", tags: ["DME", "post-partum"], note: "Kiné périnéale, très calée récup physique", creneaux: [{ debut: 14, fin: 17 }], tel: "+33698765432", whatsapp: true },
  { id: 3, prenom: "Léa", emoji: "👱‍♀️", tags: ["sommeil", "allaitement"], note: "Nuit debout comme toi, toujours dispo 😄", creneaux: [{ debut: 0, fin: 6 }, { debut: 21, fin: 24 }], tel: "+33611223344", whatsapp: false },
];

const heureActuelle = () => new Date().getHours() + new Date().getMinutes() / 60;
const isDisponible = (a) => a.creneaux.some((c) => { const h = heureActuelle(); return h >= c.debut && h < c.fin; });
const fmtCreneau = (c) => `${Math.floor(c.debut)}h–${Math.floor(c.fin)}h`;

export default function WidgetSoutien() {
  const [alliees] = useState(ALLIEES_DEMO);
  const [ficheOuverte, setFicheOuverte] = useState(null);

  const dispo = alliees.filter(isDisponible);
  const indispo = alliees.filter((a) => !isDisponible(a));

  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.saugePale}`, boxShadow: "0 2px 12px rgba(107,143,113,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>💬 Réseau de soutien</div>
        <button style={{ fontSize: 12, fontWeight: 700, color: p.sauge, background: p.saugePale, border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>+ Ajouter</button>
      </div>

      {dispo.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, color: p.textLight, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>Disponibles maintenant</div>
          {dispo.map((a) => <AllieCard key={a.id} alliee={a} disponible ouvert={ficheOuverte === a.id} onClick={() => setFicheOuverte(ficheOuverte === a.id ? null : a.id)} />)}
        </>
      )}

      {indispo.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, color: p.textLight, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6, marginTop: dispo.length > 0 ? 12 : 0 }}>Plus tard</div>
          {indispo.map((a) => <AllieCard key={a.id} alliee={a} disponible={false} ouvert={ficheOuverte === a.id} onClick={() => setFicheOuverte(ficheOuverte === a.id ? null : a.id)} />)}
        </>
      )}
    </div>
  );
}

function AllieCard({ alliee, disponible, ouvert, onClick }) {
  const prochainCreneau = !disponible ? alliee.creneaux.find((c) => c.debut > heureActuelle()) : null;
  return (
    <div onClick={onClick} style={{ borderRadius: 14, border: `1.5px solid ${disponible ? p.saugePale : p.linDark}`, background: disponible ? "#F2F8F2" : p.lin, marginBottom: 6, overflow: "hidden", opacity: disponible ? 1 : 0.65, cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: disponible ? p.saugePale : p.linDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
          {alliee.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: disponible ? p.text : p.textLight, marginBottom: 3 }}>{alliee.prenom}</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {alliee.tags.slice(0, 3).map((tag) => {
              const tc = TAG_COLORS[tag] || { bg: p.linDark, color: p.textLight };
              return <span key={tag} style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: tc.bg, color: tc.color }}>{tag}</span>;
            })}
          </div>
        </div>
        {disponible ? (
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <a href={`tel:${alliee.tel}`} onClick={(e) => e.stopPropagation()}
              style={{ width: 34, height: 34, borderRadius: "50%", background: p.saugePale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, textDecoration: "none" }}>📞</a>
            {alliee.whatsapp && (
              <a href={`https://wa.me/${alliee.tel.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                style={{ width: 34, height: 34, borderRadius: "50%", background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, textDecoration: "none" }}>💬</a>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 11, color: p.textLight, fontWeight: 600, flexShrink: 0 }}>
            {prochainCreneau ? fmtCreneau(prochainCreneau) : "demain"}
          </div>
        )}
      </div>
      {ouvert && (
        <div style={{ padding: "0 12px 12px", borderTop: `1px solid ${p.linDark}`, paddingTop: 10 }}>
          <div style={{ fontSize: 12, color: p.text, lineHeight: 1.5, marginBottom: 6 }}>{alliee.emoji} {alliee.note}</div>
          <div style={{ fontSize: 11, color: p.sauge, fontWeight: 600 }}>
            🕐 {alliee.creneaux.map(fmtCreneau).join(" · ")}
          </div>
        </div>
      )}
    </div>
  );
}
