import { useState } from "react";
import { useSessionStore } from "../../store/useSessionStore";

const p = { sauge: "#6B8F71", saugePale: "#C8DBC9", linDark: "#EDE0D0", lin: "#F5EDE3", text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6", terracotta: "#C4714A", terracottaPale: "#F0D5C5" };

const TAG_OPTIONS = ["allaitement", "coliques", "portage", "DME", "post-partum", "sommeil", "pleurs", "césarienne"];
const TAG_COLORS = {
  allaitement: { bg: "#F0D5C5", color: "#C4714A" },
  coliques:    { bg: "#FDE8D8", color: "#B85C30" },
  portage:     { bg: "#C8DBC9", color: "#4A7A50" },
  DME:         { bg: "#D8EAF0", color: "#3A7A9A" },
  "post-partum": { bg: "#E8D8F0", color: "#7A4A9A" },
  sommeil:     { bg: "#D0D8EA", color: "#3A4A8A" },
  pleurs:      { bg: "#FAE0D8", color: "#A04030" },
  "césarienne":{ bg: "#F0E8D8", color: "#9A7A3A" },
};

const EMOJIS = ["👩","👩‍🦱","👩‍🦰","👱‍♀️","👩‍🦳","🧑","👩‍🦲","🧕"];

const heureActuelle = () => new Date().getHours() + new Date().getMinutes() / 60;
const isDisponible = (a) => a.creneaux.some(c => { const h = heureActuelle(); return h >= c.debut && h < c.fin; });
const fmtCreneau = (c) => `${Math.floor(c.debut)}h–${Math.floor(c.fin)}h`;

function FormulaireAlliee({ onSave, onCancel }) {
  const [form, setForm] = useState({ prenom: "", emoji: "👩", tel: "", whatsapp: true, tags: [], note: "", creneaux: [{ debut: 9, fin: 12 }] });
  const [nouveauCreneau, setNouveauCreneau] = useState({ debut: "", fin: "" });

  const toggleTag = (tag) => setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  const ajouterCreneau = () => {
    if (!nouveauCreneau.debut || !nouveauCreneau.fin) return;
    setForm(f => ({ ...f, creneaux: [...f.creneaux, { debut: parseFloat(nouveauCreneau.debut), fin: parseFloat(nouveauCreneau.fin) }] }));
    setNouveauCreneau({ debut: "", fin: "" });
  };
  const supprimerCreneau = (i) => setForm(f => ({ ...f, creneaux: f.creneaux.filter((_, idx) => idx !== i) }));

  const valider = () => {
    if (!form.prenom.trim()) return;
    onSave({ ...form, id: Date.now() });
  };

  return (
    <div style={{ background: p.lin, borderRadius: 16, padding: "16px", border: `1.5px solid ${p.saugePale}`, marginBottom: 10 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: p.text, marginBottom: 12 }}>✨ Nouvelle alliée</div>

      {/* Emoji + prénom */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <select value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
          style={{ padding: "8px", borderRadius: 10, border: `1.5px solid ${p.linDark}`, background: p.white, fontSize: 20, outline: "none" }}>
          {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <input type="text" placeholder="Prénom *" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
          style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: `1.5px solid ${p.linDark}`, background: p.white, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
      </div>

      {/* Téléphone + WhatsApp */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
        <input type="tel" placeholder="Numéro de téléphone" value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))}
          style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: `1.5px solid ${p.linDark}`, background: p.white, fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
        <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: p.textLight, flexShrink: 0, cursor: "pointer" }}>
          <input type="checkbox" checked={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.checked }))} />
          WhatsApp
        </label>
      </div>

      {/* Tags compétences */}
      <div style={{ fontSize: 11, color: p.textLight, fontWeight: 600, marginBottom: 6 }}>Ses points forts</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {TAG_OPTIONS.map(tag => {
          const tc = TAG_COLORS[tag] || { bg: p.linDark, color: p.textLight };
          const actif = form.tags.includes(tag);
          return (
            <button key={tag} onClick={() => toggleTag(tag)}
              style={{ padding: "4px 10px", borderRadius: 20, border: `1.5px solid ${actif ? tc.color : p.linDark}`, background: actif ? tc.bg : "transparent", color: actif ? tc.color : p.textLight, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              {tag}
            </button>
          );
        })}
      </div>

      {/* Créneaux */}
      <div style={{ fontSize: 11, color: p.textLight, fontWeight: 600, marginBottom: 6 }}>Disponible entre</div>
      {form.creneaux.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: p.text, background: p.saugePale, padding: "4px 10px", borderRadius: 20 }}>{fmtCreneau(c)}</span>
          <button onClick={() => supprimerCreneau(i)} style={{ background: "none", border: "none", color: p.textLight, cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, alignItems: "center" }}>
        <input type="number" min="0" max="23" placeholder="De" value={nouveauCreneau.debut} onChange={e => setNouveauCreneau(n => ({ ...n, debut: e.target.value }))}
          style={{ width: 52, padding: "6px 8px", borderRadius: 8, border: `1px solid ${p.linDark}`, fontSize: 12, textAlign: "center", outline: "none" }} />
        <span style={{ fontSize: 12, color: p.textLight }}>h à</span>
        <input type="number" min="0" max="24" placeholder="À" value={nouveauCreneau.fin} onChange={e => setNouveauCreneau(n => ({ ...n, fin: e.target.value }))}
          style={{ width: 52, padding: "6px 8px", borderRadius: 8, border: `1px solid ${p.linDark}`, fontSize: 12, textAlign: "center", outline: "none" }} />
        <span style={{ fontSize: 12, color: p.textLight }}>h</span>
        <button onClick={ajouterCreneau} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: p.saugePale, color: p.sauge, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Ajouter</button>
      </div>

      {/* Note */}
      <textarea rows={2} placeholder="Note (ex: a allaité 2 ans, très calée en DME...)" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
        style={{ width: "100%", padding: "8px 10px", borderRadius: 10, border: `1.5px solid ${p.linDark}`, background: p.white, fontSize: 12, resize: "none", fontFamily: "'DM Sans', sans-serif", outline: "none", marginBottom: 10 }} />

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1.5px solid ${p.linDark}`, background: "transparent", color: p.textLight, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Annuler</button>
        <button onClick={valider} disabled={!form.prenom.trim()}
          style={{ flex: 2, padding: "10px 0", borderRadius: 12, border: "none", background: form.prenom.trim() ? p.sauge : p.linDark, color: "#fff", fontSize: 13, fontWeight: 700, cursor: form.prenom.trim() ? "pointer" : "default" }}>
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function AllieCard({ alliee, disponible, ouvert, onClick, onDelete, onEdit, modifierMode, onSaveEdit }) {
  const prochainCreneau = !disponible ? alliee.creneaux.find(c => c.debut > heureActuelle()) : null;
  return (
    <div style={{ borderRadius: 14, border: `1.5px solid ${disponible ? p.saugePale : p.linDark}`, background: disponible ? "#F2F8F2" : p.lin, marginBottom: 6, overflow: "hidden", opacity: disponible ? 1 : 0.65 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", cursor: "pointer" }} onClick={onClick}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: disponible ? p.saugePale : p.linDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
          {alliee.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: disponible ? p.text : p.textLight, marginBottom: 3 }}>{alliee.prenom}</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {alliee.tags.slice(0, 3).map(tag => {
              const tc = TAG_COLORS[tag] || { bg: p.linDark, color: p.textLight };
              return <span key={tag} style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: tc.bg, color: tc.color }}>{tag}</span>;
            })}
          </div>
        </div>
        {disponible ? (
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {alliee.tel && <a href={`tel:${alliee.tel}`} onClick={e => e.stopPropagation()}
              style={{ width: 34, height: 34, borderRadius: "50%", background: p.saugePale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, textDecoration: "none" }}>📞</a>}
            {alliee.whatsapp && alliee.tel && <a href={`https://wa.me/${alliee.tel.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
              style={{ width: 34, height: 34, borderRadius: "50%", background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, textDecoration: "none" }}>💬</a>}
          </div>
        ) : (
          <div style={{ fontSize: 11, color: p.textLight, fontWeight: 600, flexShrink: 0 }}>
            {prochainCreneau ? fmtCreneau(prochainCreneau) : "demain"}
          </div>
        )}
      </div>
      {ouvert && (
        <div style={{ padding: "0 12px 12px", borderTop: `1px solid ${p.linDark}`, paddingTop: 10 }}>
          {alliee.note && <div style={{ fontSize: 12, color: p.text, lineHeight: 1.5, marginBottom: 6 }}>{alliee.emoji} {alliee.note}</div>}
          <div style={{ fontSize: 11, color: p.sauge, fontWeight: 600, marginBottom: 8 }}>
            🕐 {alliee.creneaux.map(fmtCreneau).join(" · ")}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <button onClick={e => { e.stopPropagation(); onEdit(); }}
              style={{ fontSize: 11, color: p.sauge, background: p.saugePale, border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>
              ✎ Modifier
            </button>
            <button onClick={e => { e.stopPropagation(); onDelete(alliee.id); }}
              style={{ fontSize: 11, color: "#C04040", background: "#FFF0F0", border: "1px solid #F0C0C0", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WidgetSoutien() {
  const { alliees, addAlliee, updateAlliee, supprimerAlliee } = useSessionStore();
  const [ficheOuverte, setFicheOuverte] = useState(null);
  const [ajouterMode, setAjouterMode] = useState(false);
  const [modifierMode, setModifierMode] = useState(null); // id de l'alliée en cours de modif

  const dispo = alliees.filter(isDisponible);
  const indispo = alliees.filter(a => !isDisponible(a));

  const sauvegarder = (alliee) => { addAlliee(alliee); setAjouterMode(false); };
  const supprimer = (id) => { supprimerAlliee(id); setFicheOuverte(null); };
  const sauvegarderModif = (id, data) => { updateAlliee(id, data); setModifierMode(null); };

  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.saugePale}`, boxShadow: "0 2px 12px rgba(107,143,113,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: p.text }}>💬 Réseau de soutien</div>
        {!ajouterMode && (
          <button onClick={() => setAjouterMode(true)}
            style={{ fontSize: 12, fontWeight: 700, color: p.sauge, background: p.saugePale, border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>
            + Ajouter
          </button>
        )}
      </div>

      {ajouterMode && <FormulaireAlliee onSave={sauvegarder} onCancel={() => setAjouterMode(false)} />}

      {alliees.length === 0 && !ajouterMode && (
        <div style={{ textAlign: "center", padding: "24px 0", color: p.textLight }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🤝</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: p.text, marginBottom: 4 }}>Ton réseau de soutien</div>
          <div style={{ fontSize: 12, lineHeight: 1.5 }}>Ajoute tes alliées — amies, famille, sages-femmes — avec leurs créneaux de disponibilité et leurs points forts.</div>
        </div>
      )}

      {dispo.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, color: p.textLight, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6 }}>Disponibles maintenant</div>
          {dispo.map(a => <AllieCard key={a.id} alliee={a} disponible ouvert={ficheOuverte === a.id} onClick={() => setFicheOuverte(ficheOuverte === a.id ? null : a.id)} onDelete={supprimer} onEdit={() => setModifierMode(a.id)} modifierMode={modifierMode === a.id} onSaveEdit={(data) => sauvegarderModif(a.id, data)} />)}
        </>
      )}

      {indispo.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, color: p.textLight, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 6, marginTop: dispo.length > 0 ? 12 : 0 }}>Plus tard</div>
          {indispo.map(a => <AllieCard key={a.id} alliee={a} disponible={false} ouvert={ficheOuverte === a.id} onClick={() => setFicheOuverte(ficheOuverte === a.id ? null : a.id)} onDelete={supprimer} onEdit={() => setModifierMode(a.id)} modifierMode={modifierMode === a.id} onSaveEdit={(data) => sauvegarderModif(a.id, data)} />)}
        </>
      )}
    </div>
  );
}
