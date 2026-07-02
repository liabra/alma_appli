import { useState } from "react";
import { useBebeStore } from "../../store/useBebeStore";
import { useCarnetStore } from "../../store/useCarnetStore";
import FormEntreeSoin from "./FormEntreeSoin";

const p = {
  terracotta: "#C4714A", terracottaL: "#D4876A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6", night: "#1E2A3A",
};

const TYPE_EMOJI = { medicament: "💊", soin: "🩹", rdv: "📅", observation: "👁" };
const MOMENT_ORDRE = ["matin", "midi", "soir", "coucher"];
const MOMENT_LABEL = { matin: "Matin", midi: "Midi", soir: "Soir", coucher: "Coucher" };

export default function CarnetSoins() {
  const [vue, setVue] = useState("liste");
  const [entryEnEdition, setEntryEnEdition] = useState(null);

  const getPrenom = useBebeStore((s) => s.getPrenom);
  const entries = useCarnetStore((s) => s.entries);
  useCarnetStore((s) => s.prises); // abonnement : re-rend au toggle d'une prise
  const togglePrise = useCarnetStore((s) => s.togglePrise);
  const getPriseFaite = useCarnetStore((s) => s.getPriseFaite);
  const updateEntry = useCarnetStore((s) => s.updateEntry);

  const prenom = getPrenom();
  const dateStrDuJour = new Date().toISOString().split("T")[0];

  const pourLabel = (e) => (e.pour === "maman" ? "Maman" : prenom);

  const actives = entries
    .filter((e) => !e.archived)
    .sort((a, b) => b.createdAt - a.createdAt);

  const actifAujourdhui = (e) => {
    if (!e.suiviActif) return false;
    if (e.dateDebut && dateStrDuJour < e.dateDebut) return false;
    if (e.dateFin && dateStrDuJour > e.dateFin) return false;
    return true;
  };
  const suiviDuJour = actives.filter(actifAujourdhui);

  const ouvrirCreation = () => { setEntryEnEdition(null); setVue("form"); };
  const ouvrirEdition = (entry) => { setEntryEnEdition(entry); setVue("form"); };
  const retourListe = () => { setEntryEnEdition(null); setVue("liste"); };

  // ── VUE FORMULAIRE ──
  if (vue === "form") {
    return <FormEntreeSoin entry={entryEnEdition} onClose={retourListe} />;
  }

  const btnAjouter = (
    <button onClick={ouvrirCreation}
      style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: p.terracotta, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
      + Ajouter une entrée
    </button>
  );

  // ── ÉTAT VIDE ──
  if (actives.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ textAlign: "center", padding: "36px 20px", color: p.textLight }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🩹</div>
          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
            Garde ici une trace des médicaments, soins et observations — pour toi et pour {prenom}.
          </div>
        </div>
        {btnAjouter}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── A) AUJOURD'HUI ── */}
      {suiviDuJour.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: p.text }}>📆 Aujourd'hui</div>
          {suiviDuJour.map((e) => {
            const moments = MOMENT_ORDRE.filter((m) => (e.moments || []).includes(m));
            return (
              <div key={e.id} style={{ background: p.white, borderRadius: 16, padding: "14px 16px", border: `1px solid ${p.linDark}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: p.text }}>{TYPE_EMOJI[e.type]} {e.titre}</div>
                <div style={{ fontSize: 11, color: p.textLight, marginBottom: 12 }}>pour {pourLabel(e)}</div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {moments.map((m) => {
                    const fait = getPriseFaite(e.id, m, dateStrDuJour);
                    return (
                      <div key={m} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <button onClick={() => togglePrise(e.id, m, dateStrDuJour)}
                          style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${fait ? p.sauge : p.linDark}`, background: fait ? p.sauge : "transparent", color: "#fff", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {fait ? "✓" : ""}
                        </button>
                        <span style={{ fontSize: 10, color: p.textLight }}>{MOMENT_LABEL[m]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── B) MES ENTRÉES ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: p.text }}>🗂 Mes entrées</div>
        {btnAjouter}

        {actives.map((e) => (
          <div key={e.id} onClick={() => ouvrirEdition(e)}
            style={{ background: p.white, borderRadius: 16, padding: "14px 16px", border: `1px solid ${p.linDark}`, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: p.text }}>{TYPE_EMOJI[e.type]} {e.titre}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: p.textLight, background: p.lin, borderRadius: 8, padding: "2px 8px" }}>{pourLabel(e)}</span>
              {e.suiviActif && (
                <span style={{ fontSize: 10, fontWeight: 700, color: p.sauge, background: p.saugePale, borderRadius: 8, padding: "2px 8px" }}>Suivi actif</span>
              )}
            </div>

            {e.type === "medicament" && e.dosage && (
              <div style={{ fontSize: 12, color: p.textLight }}>{e.dosage}</div>
            )}
            {e.type === "rdv" && (e.dateRdv || e.lieu) && (
              <div style={{ fontSize: 12, color: p.textLight }}>
                {[e.dateRdv, e.lieu].filter(Boolean).join(" · ")}
              </div>
            )}
            {e.note && (
              <div style={{ fontSize: 12, color: p.textLight, marginTop: 4, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {e.note}
              </div>
            )}

            {e.type === "observation" && (
              <button onClick={(ev) => { ev.stopPropagation(); updateEntry(e.id, { resolu: true, archived: true }); }}
                style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: p.sauge, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>
                Marquer comme résolu
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
