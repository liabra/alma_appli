import { useState } from "react";
import { useBebeStore } from "../store/useBebeStore";
import Header from "../components/ui/Header";
import {
  DISCLAIMER, SIGNAUX_URGENCE, SIGNAUX_MEDECIN_JOUR,
  SIGNAUX_CONSULTATION, TABLEAU_FIEVRE, RESSOURCES_PRO
} from "../data/signauxAlertes";

const p = {
  terracotta: "#C4714A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0",
  sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
};

function CarteSignaux({ section, ouvert, onToggle }) {
  return (
    <div style={{ borderRadius: 18, border: `2px solid ${section.bordure}`, overflow: "hidden" }}>
      <button onClick={onToggle}
        style={{ width: "100%", padding: "14px 18px", background: section.fond, border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: section.couleur, textAlign: "left" }}>{section.titre}</div>
        <span style={{ color: section.couleur, fontSize: 16, flexShrink: 0 }}>{ouvert ? "▲" : "▼"}</span>
      </button>
      {ouvert && (
        <div style={{ padding: "12px 18px 16px", background: p.white }}>
          {section.signaux.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: section.couleur, flexShrink: 0, fontSize: 14, marginTop: 1 }}>•</span>
              <span style={{ fontSize: 13, color: p.text, lineHeight: 1.5 }}>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TableauFievre({ ageDays }) {
  // Trouver l'âge du bébé en mois pour surligner la bonne ligne
  const ageMois = ageDays ? Math.floor(ageDays / 30) : null;

  const getLigneActive = (age) => {
    if (!ageMois) return false;
    if (age === "< 3 mois" && ageMois < 3) return true;
    if (age === "3 à 6 mois" && ageMois >= 3 && ageMois < 6) return true;
    if (age === "> 6 mois" && ageMois >= 6) return true;
    if (age === "Tout âge") return true;
    return false;
  };

  return (
    <div style={{ background: p.white, borderRadius: 18, border: `1px solid ${p.linDark}`, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", background: "#FFF8F0", borderBottom: `1px solid #F0D080` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#C07020" }}>🌡 Fièvre — quand agir ?</div>
        <div style={{ fontSize: 11, color: "#9A6020", marginTop: 2 }}>Adapté à l'âge de ton bébé</div>
      </div>
      {TABLEAU_FIEVRE.map((ligne, i) => {
        const active = getLigneActive(ligne.age);
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", padding: "10px 18px",
            background: active ? (ligne.urgence ? "#FFF0F0" : "#F0F8F0") : p.white,
            borderBottom: i < TABLEAU_FIEVRE.length - 1 ? `1px solid ${p.linDark}` : "none",
            borderLeft: active ? `3px solid ${ligne.urgence ? "#C04040" : "#6B8F71"}` : "3px solid transparent",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: p.text }}>
                {active && "👶 "}Bébé {ligne.age}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: ligne.urgence ? "#C04040" : p.sauge }}>
                {ligne.seuil}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: ligne.urgence ? "#C04040" : p.sauge,
                background: ligne.urgence ? "#FFF0F0" : "#F0F8F0",
                padding: "4px 8px", borderRadius: 8, border: `1px solid ${ligne.urgence ? "#F0C0C0" : p.saugePale}` }}>
                {ligne.action}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RessourcesPro() {
  const [adresse, setAdresse] = useState("");
  const [ressourceActive, setRessourceActive] = useState(null);

  const ouvrirRecherche = (ressource) => {
    if (!adresse.trim()) {
      alert("Entre d'abord ton adresse ou ta ville pour la recherche.");
      return;
    }
    const query = encodeURIComponent(`${ressource.recherche} ${adresse}`);
    window.open(`https://www.google.com/maps/search/${query}`, "_blank");
  };

  return (
    <div style={{ background: p.white, borderRadius: 18, border: `1px solid ${p.linDark}` }}>
      <div style={{ padding: "16px 18px", borderBottom: `1px solid ${p.linDark}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: p.text, marginBottom: 4 }}>🗺 Trouver un professionnel</div>
        <div style={{ fontSize: 12, color: p.textLight, marginBottom: 12 }}>
          Entre ton adresse ou ta ville pour rechercher sur Google Maps.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={adresse}
            onChange={e => setAdresse(e.target.value)}
            placeholder="Ville, code postal..."
            style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${p.linDark}`, fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif", background: p.lin }}
          />
          {adresse && (
            <button onClick={() => setAdresse("")}
              style={{ padding: "10px 12px", borderRadius: 10, border: "none", background: p.linDark, color: p.textLight, cursor: "pointer", fontSize: 12 }}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: "12px 18px 16px" }}>
        {RESSOURCES_PRO.map((res) => (
          <div key={res.id} style={{ marginBottom: 10 }}>
            <button onClick={() => setRessourceActive(ressourceActive === res.id ? null : res.id)}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${ressourceActive === res.id ? p.terracotta : p.linDark}`, background: ressourceActive === res.id ? p.terracottaPale : p.lin, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{res.emoji}</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>{res.titre}</div>
                <div style={{ fontSize: 11, color: p.textLight, marginTop: 2 }}>{res.description}</div>
              </div>
              <span style={{ color: p.textLight, flexShrink: 0 }}>{ressourceActive === res.id ? "▲" : "▼"}</span>
            </button>

            {ressourceActive === res.id && (
              <div style={{ padding: "10px 14px", background: p.white, borderRadius: "0 0 14px 14px", border: `1.5px solid ${p.terracotta}`, borderTop: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => ouvrirRecherche(res)}
                  style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: p.terracotta, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span>📍</span>
                  Chercher sur Google Maps{adresse ? ` près de ${adresse}` : ""}
                </button>
                {res.lienAnnuaire && (
                  <a href={res.lienAnnuaire} target="_blank" rel="noreferrer"
                    style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1.5px solid ${p.sauge}`, background: p.saugePale, color: p.sauge, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}>
                    <span>📋</span> Annuaire officiel
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Alertes() {
  const { getAgeDays } = useBebeStore();
  const ageDays = getAgeDays();
  const [ouvert, setOuvert] = useState({ urgence: true, jour: false, consultation: false });

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: p.lin }}>
      <Header />
      <div style={{ padding: "18px 18px 110px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Titre */}
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: p.text }}>
          🩺 Quand consulter ?
        </div>

        {/* Disclaimer HAS */}
        <div style={{ background: "#F0F8FF", borderRadius: 14, padding: "12px 14px", border: "1px solid #C0D8F0" }}>
          <div style={{ fontSize: 12, color: "#3A6A9A", lineHeight: 1.6 }}>
            ℹ️ {DISCLAIMER}
          </div>
        </div>

        {/* Numéros d'urgence */}
        <div style={{ background: "#1E2A3A", borderRadius: 18, padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#E8C9A0", marginBottom: 10 }}>📞 Numéros d'urgence</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[["15","SAMU","#E57373"],["18","Pompiers","#FF8C00"],["116 117","Médecin de garde","#81C784"]].map(([num, label, color]) => (
              <a key={num} href={`tel:${num.replace(" ","")}`}
                style={{ padding: "12px 8px", borderRadius: 12, background: "rgba(255,255,255,0.08)", textDecoration: "none", textAlign: "center", display: "block" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "'Cormorant Garamond', serif" }}>{num}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{label}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Tableau fièvre adapté à l'âge */}
        <TableauFievre ageDays={ageDays} />

        {/* Signaux par niveau */}
        <CarteSignaux
          section={SIGNAUX_URGENCE}
          ouvert={ouvert.urgence}
          onToggle={() => setOuvert(o => ({ ...o, urgence: !o.urgence }))}
        />
        <CarteSignaux
          section={SIGNAUX_MEDECIN_JOUR}
          ouvert={ouvert.jour}
          onToggle={() => setOuvert(o => ({ ...o, jour: !o.jour }))}
        />
        <CarteSignaux
          section={SIGNAUX_CONSULTATION}
          ouvert={ouvert.consultation}
          onToggle={() => setOuvert(o => ({ ...o, consultation: !o.consultation }))}
        />

        {/* Recherche professionnels */}
        <RessourcesPro />

        {/* Disclaimer final */}
        <div style={{ fontSize: 11, color: p.textLight, textAlign: "center", fontStyle: "italic", padding: "8px 0" }}>
          En cas de doute, consulte toujours un professionnel de santé.<br />
          Alma ne diagnostique rien.
        </div>
      </div>
    </div>
  );
}
