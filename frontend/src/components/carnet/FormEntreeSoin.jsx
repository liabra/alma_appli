import { useState } from "react";
import { useBebeStore } from "../../store/useBebeStore";
import { useCarnetStore } from "../../store/useCarnetStore";

const p = {
  terracotta: "#C4714A", terracottaL: "#D4876A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6", night: "#1E2A3A",
};

const TYPES = [
  { id: "medicament", label: "💊 Médicament" },
  { id: "soin", label: "🩹 Soin" },
  { id: "rdv", label: "📅 RDV" },
  { id: "observation", label: "👁 Observation" },
];

const FORMES = ["comprimé", "sirop", "gouttes", "crème", "injection", "autre"];

const MOMENTS = [
  { id: "matin", label: "🌅 Matin" },
  { id: "midi", label: "☀️ Midi" },
  { id: "soir", label: "🌆 Soir" },
  { id: "coucher", label: "🌙 Coucher" },
];

const PLACEHOLDERS = {
  medicament: "Nom du médicament...",
  soin: "Quel soin ?...",
  rdv: "Quel rendez-vous ?...",
  observation: "Qu'as-tu observé ?...",
};

const pill = (active) => ({
  padding: "9px 8px", borderRadius: 12,
  border: `1.5px solid ${active ? p.terracotta : p.linDark}`,
  background: active ? p.terracottaPale : "transparent",
  color: active ? p.terracotta : p.textLight,
  fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center",
});

const input = {
  width: "100%", padding: "10px 12px", borderRadius: 12,
  border: `1.5px solid ${p.linDark}`, background: p.white, fontSize: 14,
  fontFamily: "'DM Sans', sans-serif", outline: "none", color: p.text, boxSizing: "border-box",
};

const label = { fontSize: 12, fontWeight: 700, color: p.text, marginBottom: 6 };

export default function FormEntreeSoin({ entry, onClose }) {
  const getPrenom = useBebeStore((s) => s.getPrenom);
  const addEntry = useCarnetStore((s) => s.addEntry);
  const updateEntry = useCarnetStore((s) => s.updateEntry);
  const removeEntry = useCarnetStore((s) => s.removeEntry);

  const prenom = getPrenom();
  const edition = !!entry;

  const [type, setType] = useState(entry?.type || "medicament");
  const [pour, setPour] = useState(entry?.pour || "bebe");
  const [titre, setTitre] = useState(entry?.titre || "");
  const [note, setNote] = useState(entry?.note || "");
  const [dosage, setDosage] = useState(entry?.dosage || "");
  const [forme, setForme] = useState(entry?.forme || "");
  const [prescritPar, setPrescritPar] = useState(entry?.prescritPar || "");
  const [dateRdv, setDateRdv] = useState(entry?.dateRdv || "");
  const [lieu, setLieu] = useState(entry?.lieu || "");
  const [suiviActif, setSuiviActif] = useState(entry?.suiviActif || false);
  const [moments, setMoments] = useState(entry?.moments || []);
  const [dateDebut, setDateDebut] = useState(entry?.dateDebut || "");
  const [dateFin, setDateFin] = useState(entry?.dateFin || "");

  const [detailsOuverts, setDetailsOuverts] = useState(
    !!(entry && (entry.dosage || entry.forme || entry.prescritPar))
  );

  const isMed = type === "medicament";
  const isRdv = type === "rdv";

  const toggleMoment = (m) =>
    setMoments((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  const enregistrer = () => {
    if (!titre.trim()) return;
    const payload = {
      type,
      pour,
      titre: titre.trim(),
      note,
      dosage: isMed ? dosage : "",
      forme: isMed ? forme : "",
      prescritPar: isMed ? prescritPar : "",
      dateRdv: isRdv ? (dateRdv || null) : null,
      lieu: isRdv ? lieu : "",
      suiviActif: isRdv ? false : suiviActif,
      moments: (!isRdv && suiviActif) ? moments : [],
      dateDebut: (!isRdv && suiviActif) ? (dateDebut || null) : null,
      dateFin: (!isRdv && suiviActif) ? (dateFin || null) : null,
    };
    if (edition) updateEntry(entry.id, payload);
    else addEntry(payload);
    onClose();
  };

  const supprimer = () => {
    if (window.confirm("Supprimer définitivement ?")) {
      removeEntry(entry.id);
      onClose();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: p.text }}>
        {edition ? "Modifier l'entrée" : "Nouvelle entrée"}
      </div>

      <div style={{ background: p.white, borderRadius: 16, padding: "16px", border: `1px solid ${p.linDark}`, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* a) Type */}
        <div>
          <div style={label}>Type</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TYPES.map((t) => (
              <button key={t.id} onClick={() => setType(t.id)} style={{ ...pill(type === t.id), flex: "1 1 calc(50% - 3px)" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* b) Pour */}
        <div>
          <div style={label}>Pour qui ?</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setPour("maman")} style={{ ...pill(pour === "maman"), flex: 1 }}>🤱 Maman</button>
            <button onClick={() => setPour("bebe")} style={{ ...pill(pour === "bebe"), flex: 1 }}>👶 {prenom}</button>
          </div>
        </div>

        {/* c) Titre */}
        <div>
          <div style={label}>Titre</div>
          <input style={input} type="text" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder={PLACEHOLDERS[type]} autoFocus />
        </div>

        {/* d) Détails médicament (repliable) */}
        {isMed && (
          <div style={{ background: p.lin, borderRadius: 12, border: `1px solid ${p.linDark}`, overflow: "hidden" }}>
            <button onClick={() => setDetailsOuverts((o) => !o)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: p.text }}>
              <span>Détails</span>
              <span style={{ color: p.textLight }}>{detailsOuverts ? "▲" : "▼"}</span>
            </button>
            {detailsOuverts && (
              <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={label}>Dosage</div>
                  <input style={input} type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="ex : 500 mg" />
                </div>
                <div>
                  <div style={label}>Forme</div>
                  <select style={input} value={forme} onChange={(e) => setForme(e.target.value)}>
                    <option value="">—</option>
                    {FORMES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <div style={label}>Prescrit par</div>
                  <input style={input} type="text" value={prescritPar} onChange={(e) => setPrescritPar(e.target.value)} placeholder="Dr. ..." />
                </div>
              </div>
            )}
          </div>
        )}

        {/* e) RDV */}
        {isRdv && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={label}>Date du rendez-vous</div>
              <input style={input} type="date" value={dateRdv || ""} onChange={(e) => setDateRdv(e.target.value)} />
            </div>
            <div>
              <div style={label}>Lieu</div>
              <input style={input} type="text" value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder="Cabinet, hôpital..." />
            </div>
          </div>
        )}

        {/* f) Note */}
        <div>
          <div style={label}>Note</div>
          <textarea rows={3} style={{ ...input, resize: "none", lineHeight: 1.5 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notes, consignes du médecin..." />
        </div>

        {/* g) Suivi (pas pour rdv) */}
        {!isRdv && (
          <div style={{ background: p.lin, borderRadius: 12, border: `1px solid ${p.linDark}`, padding: "12px" }}>
            <button onClick={() => setSuiviActif((v) => !v)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: p.text }}>Suivi quotidien avec cases à cocher</span>
              <span style={{ width: 42, height: 24, borderRadius: 12, background: suiviActif ? p.terracotta : p.linDark, position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
                <span style={{ position: "absolute", top: 2, left: suiviActif ? 20 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </span>
            </button>
            <div style={{ fontSize: 11, color: p.textLight, marginTop: 6, lineHeight: 1.4 }}>
              Coche chaque prise depuis l'onglet Aujourd'hui.
            </div>

            {suiviActif && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={label}>Moments</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {MOMENTS.map((m) => (
                      <button key={m.id} onClick={() => toggleMoment(m.id)} style={{ ...pill(moments.includes(m.id)), flex: "1 1 calc(50% - 3px)" }}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={label}>Du ... au ... (optionnel)</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input style={input} type="date" value={dateDebut || ""} onChange={(e) => setDateDebut(e.target.value)} />
                    <input style={input} type="date" value={dateFin || ""} onChange={(e) => setDateFin(e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* h) Actions */}
        <button onClick={enregistrer} disabled={!titre.trim()}
          style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: titre.trim() ? p.terracotta : p.linDark, color: "#fff", fontSize: 14, fontWeight: 700, cursor: titre.trim() ? "pointer" : "default" }}>
          Enregistrer
        </button>
        <button onClick={onClose}
          style={{ width: "100%", padding: "4px 0", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: p.textLight, textDecoration: "underline" }}>
          Annuler
        </button>

        {edition && (
          <button onClick={supprimer}
            style={{ width: "100%", padding: "4px 0", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#C04040", textDecoration: "underline" }}>
            Supprimer cette entrée
          </button>
        )}
      </div>
    </div>
  );
}
