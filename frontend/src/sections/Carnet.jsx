import { useState } from "react";
import Header from "../components/ui/Header";
import { useBebeStore } from "../store/useBebeStore";

const p = {
  terracotta: "#C4714A", terracottaL: "#D4876A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6", night: "#1E2A3A",
};

const RDV_TYPES = [
  { age: "J8", label: "Visite J8", desc: "Sage-femme ou pédiatre — obligatoire" },
  { age: "1 mois", label: "1 mois", desc: "Pédiatre — 1er bilan complet" },
  { age: "2 mois", label: "2 mois", desc: "Pédiatre + vaccins Hexavalent + Pneumocoque" },
  { age: "4 mois", label: "4 mois", desc: "Pédiatre + vaccins 2e dose" },
  { age: "5 mois", label: "5 mois", desc: "Pédiatre + vaccin Méningocoque B" },
  { age: "6 mois", label: "6 mois", desc: "Pédiatre — début diversification" },
  { age: "9 mois", label: "9 mois", desc: "Pédiatre — bilan obligatoire" },
  { age: "11 mois", label: "11 mois", desc: "Pédiatre + rappels vaccins" },
  { age: "12 mois", label: "12 mois", desc: "Pédiatre + ROR + Méningocoque C" },
];

const DEMARCHES = [
  {
    titre: "📋 Déclaration de naissance",
    delai: "Dans les 5 jours suivant la naissance",
    steps: ["À la mairie du lieu de naissance", "Acte de naissance délivré gratuitement", "Nécessaire pour toutes les démarches suivantes"],
    lien: "https://www.service-public.fr/particuliers/vosdroits/F961",
    lienLabel: "service-public.fr : déclaration naissance →",
  },
  {
    titre: "👶 Allocations familiales (CAF)",
    delai: "Dès la naissance",
    steps: ["Déclare ta naissance sur caf.fr", "PAJE (Prestation d'Accueil du Jeune Enfant) dès le 1er enfant sous conditions de ressources", "Allocation de base jusqu'aux 3 ans de l'enfant"],
    lien: "https://www.caf.fr",
    lienLabel: "caf.fr → Déclarer ma naissance →",
  },
  {
    titre: "🏥 Mutuelle bébé",
    delai: "Dans le mois suivant la naissance",
    steps: ["Rattache bébé à ta mutuelle", "Remboursements pédiatre, vaccins, kiné", "Déclaration à l'Assurance Maladie également"],
    lien: "https://www.ameli.fr",
    lienLabel: "ameli.fr → Déclarer mon enfant →",
  },
  {
    titre: "🌸 Congé maternité / paternité",
    delai: "À préparer avant l'accouchement",
    steps: ["Congé maternité : 16 semaines pour 1er et 2e enfant (6 avant + 10 après)", "Congé paternité : 28 jours calendaires (dont 7 obligatoires)", "Indemnités journalières versées par la CPAM"],
    lien: "https://www.service-public.fr/particuliers/vosdroits/F2265",
    lienLabel: "service-public.fr : congé maternité →",
  },
  {
    titre: "🏡 Mode de garde",
    delai: "S'inscrire dès la grossesse",
    steps: ["Crèche : inscription dès le 3e mois de grossesse via la mairie", "Assistante maternelle : via MonEnfant.fr", "PAJE CMG (Complément Mode de Garde) si assistante maternelle agréée"],
    lien: "https://www.monenfant.fr",
    lienLabel: "monenfant.fr : trouver un mode de garde →",
  },
];

function OngletRendezVous({ bebe }) {
  const [rdvFaits, setRdvFaits] = useState([]);
  const [noteRdv, setNoteRdv] = useState({});
  const [rdvDate, setRdvDate] = useState({});

  const toggleFait = (age) => setRdvFaits(prev => prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: p.terracottaPale, borderRadius: 14, padding: "12px 14px", border: `1px solid ${p.terracottaPale}` }}>
        <div style={{ fontSize: 12, color: p.terracotta, fontWeight: 600, lineHeight: 1.5 }}>
          📅 Consulte le carnet de santé officiel de {bebe?.prenom || "bébé"} pour les dates exactes. Ces rendez-vous sont indicatifs.
        </div>
      </div>
      {RDV_TYPES.map((rdv) => {
        const fait = rdvFaits.includes(rdv.age);
        return (
          <div key={rdv.age} style={{ background: p.white, borderRadius: 16, border: `1.5px solid ${fait ? p.sauge : p.linDark}`, overflow: "hidden", opacity: fait ? 0.75 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
              <button onClick={() => toggleFait(rdv.age)}
                style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${fait ? p.sauge : p.linDark}`, background: fait ? p.sauge : "transparent", color: "#fff", fontSize: 13, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {fait ? "✓" : ""}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: p.text }}>{rdv.label}</div>
                <div style={{ fontSize: 12, color: p.textLight }}>{rdv.desc}</div>
              </div>
              <input type="date" value={rdvDate[rdv.age] || ""}
                onChange={e => setRdvDate(d => ({ ...d, [rdv.age]: e.target.value }))}
                style={{ fontSize: 11, padding: "4px 8px", borderRadius: 8, border: `1px solid ${p.linDark}`, background: p.lin, color: p.textLight, outline: "none", width: 120 }} />
            </div>
            <div style={{ padding: "0 16px 12px" }}>
              <textarea rows={2} value={noteRdv[rdv.age] || ""}
                onChange={e => setNoteRdv(n => ({ ...n, [rdv.age]: e.target.value }))}
                placeholder="Notes pour le pédiatre..."
                style={{ width: "100%", padding: "8px 10px", borderRadius: 10, border: `1px solid ${p.linDark}`, background: p.lin, fontSize: 12, resize: "none", fontFamily: "'DM Sans', sans-serif", outline: "none", color: p.text }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OngletNotes() {
  const [notes, setNotes] = useState([]);
  const [nouvelle, setNouvelle] = useState("");

  const ajouterNote = () => {
    if (!nouvelle.trim()) return;
    setNotes(prev => [{ id: Date.now(), texte: nouvelle, date: new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) }, ...prev]);
    setNouvelle("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.terracottaPale}` }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: p.text, marginBottom: 12 }}>
          📝 Nouvelle note
        </div>
        <textarea rows={4} value={nouvelle} onChange={e => setNouvelle(e.target.value)}
          placeholder="Note pour le pédiatre, observation sur bébé, question à poser..."
          style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${p.linDark}`, background: p.lin, fontSize: 13, resize: "none", fontFamily: "'DM Sans', sans-serif", outline: "none", color: p.text, lineHeight: 1.5, marginBottom: 10 }} />
        <button onClick={ajouterNote}
          style={{ width: "100%", padding: "11px 0", borderRadius: 12, border: "none", background: p.terracotta, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Enregistrer la note
        </button>
      </div>
      {notes.map(note => (
        <div key={note.id} style={{ background: p.white, borderRadius: 16, padding: "14px 16px", border: `1px solid ${p.linDark}` }}>
          <div style={{ fontSize: 10, color: p.textLight, fontWeight: 600, marginBottom: 6 }}>🕐 {note.date}</div>
          <div style={{ fontSize: 13, color: p.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{note.texte}</div>
        </div>
      ))}
      {notes.length === 0 && (
        <div style={{ textAlign: "center", padding: "30px 0", color: p.textLight }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
          <div style={{ fontSize: 14 }}>Aucune note pour l'instant</div>
        </div>
      )}
    </div>
  );
}

function OngletDemarches() {
  const [ouvert, setOuvert] = useState(null);
  const [faites, setFaites] = useState([]);
  const toggle = (titre) => setFaites(prev => prev.includes(titre) ? prev.filter(t => t !== titre) : [...prev, titre]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: `linear-gradient(135deg, ${p.sauge}, #4A7A50)`, borderRadius: 16, padding: "14px 16px" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
          📋 Démarches administratives après la naissance. Coche au fur et à mesure. Les liens pointent vers service-public.fr et les organismes officiels.
        </div>
      </div>
      {DEMARCHES.map((d) => {
        const fait = faites.includes(d.titre);
        const est_ouvert = ouvert === d.titre;
        return (
          <div key={d.titre} style={{ background: p.white, borderRadius: 16, border: `1.5px solid ${fait ? p.sauge : p.linDark}`, overflow: "hidden", opacity: fait ? 0.75 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}
              onClick={() => setOuvert(est_ouvert ? null : d.titre)}>
              <button onClick={e => { e.stopPropagation(); toggle(d.titre); }}
                style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${fait ? p.sauge : p.linDark}`, background: fait ? p.sauge : "transparent", color: "#fff", fontSize: 13, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {fait ? "✓" : ""}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>{d.titre}</div>
                <div style={{ fontSize: 11, color: p.textLight }}>{d.delai}</div>
              </div>
              <span style={{ color: p.textLight }}>{est_ouvert ? "▲" : "▼"}</span>
            </div>
            {est_ouvert && (
              <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${p.linDark}` }}>
                <div style={{ paddingTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {d.steps.map((s, i) => (
                    <div key={i} style={{ fontSize: 12, color: p.text, display: "flex", gap: 8 }}>
                      <span style={{ color: p.sauge }}>·</span><span>{s}</span>
                    </div>
                  ))}
                  <a href={d.lien} target="_blank" rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 8, background: p.terracottaPale, borderRadius: 10, padding: "8px 10px", textDecoration: "none", marginTop: 8 }}>
                    <span style={{ fontSize: 14 }}>🔗</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: p.terracotta }}>{d.lienLabel}</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Carnet() {
  const [onglet, setOnglet] = useState("rdv");
  const { getBebe } = useBebeStore();
  const bebe = getBebe();

  const onglets = [
    { id: "rdv", label: "📅 Rendez-vous" },
    { id: "notes", label: "📝 Notes" },
    { id: "demarches", label: "📋 Démarches" },
  ];

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: p.lin }}>
      <Header />
      <div style={{ padding: "18px 18px 110px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: p.text, marginBottom: 16 }}>
          📅 Carnet
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, background: p.linDark, borderRadius: 14, padding: 4 }}>
          {onglets.map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)}
              style={{ flex: 1, padding: "9px 4px", borderRadius: 11, border: "none", background: onglet === o.id ? p.white : "transparent", color: onglet === o.id ? p.terracotta : p.textLight, fontSize: 11, fontWeight: 700, cursor: "pointer", boxShadow: onglet === o.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
              {o.label}
            </button>
          ))}
        </div>
        {onglet === "rdv" && <OngletRendezVous bebe={bebe} />}
        {onglet === "notes" && <OngletNotes />}
        {onglet === "demarches" && <OngletDemarches />}
      </div>
    </div>
  );
}
