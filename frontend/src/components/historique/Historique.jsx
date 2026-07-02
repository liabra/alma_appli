import { useState } from "react";
import { useSessionStore } from "../../store/useSessionStore";

const p = {
  terracotta: "#C4714A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
};

const SOUS_ONGLETS = [
  { id: "tetees", label: "🍼 Tétées/Biberons" },
  { id: "couches", label: "🧷 Couches" },
  { id: "pleurs", label: "😢 Pleurs" },
];

const COUCHE_EMOJI = { pipi: "💧", selle: "💩", mixte: "🔄" };
const COUCHE_LABEL = { pipi: "Pipi", selle: "Selle", mixte: "Mixte" };

const LIMITE_MS = 30 * 86400000;

const heure = (ts) =>
  new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const jourLabel = (dateStr) => {
  const today = new Date().toDateString();
  const hier = new Date(Date.now() - 86400000).toDateString();
  if (dateStr === today) return "Aujourd'hui";
  if (dateStr === hier) return "Hier";
  return new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
};

// items: [{ id, ts, ... }] -> [{ jour, items }] trié jour récent d'abord, items récents d'abord
function grouperParJour(items) {
  const map = {};
  for (const it of items) {
    const jour = new Date(it.ts).toDateString();
    (map[jour] = map[jour] || []).push(it);
  }
  return Object.keys(map)
    .sort((a, b) => new Date(b) - new Date(a))
    .map((jour) => ({ jour, items: map[jour].sort((a, b) => b.ts - a.ts) }));
}

export default function Historique() {
  const [sousOnglet, setSousOnglet] = useState("tetees");

  const tetees = useSessionStore((s) => s.tetees);
  const couches = useSessionStore((s) => s.couches);
  const pleurs = useSessionStore((s) => s.pleurs);
  const supprimerTetee = useSessionStore((s) => s.supprimerTetee);
  const supprimerCouche = useSessionStore((s) => s.supprimerCouche);
  const supprimerPleurs = useSessionStore((s) => s.supprimerPleurs);

  const cutoff = Date.now() - LIMITE_MS;

  const confirmer = (fn, id) => {
    if (window.confirm("Supprimer cette entrée ?")) fn(id);
  };

  // ── Préparation des items selon l'onglet ──
  let groupes = [];
  let vide = "";
  let recapDuJour = () => "";

  if (sousOnglet === "tetees") {
    const items = tetees
      .map((t) => ({ ...t, ts: t.timestamp ?? t.debut ?? t.id }))
      .filter((t) => t.ts >= cutoff);
    groupes = grouperParJour(items);
    vide = "Aucune tétée enregistrée pour l'instant.";
    recapDuJour = (its) => {
      const nBib = its.filter((t) => t.ml != null).length;
      const nAllait = its.length - nBib;
      return [
        nAllait > 0 && `${nAllait} tétée${nAllait > 1 ? "s" : ""}`,
        nBib > 0 && `${nBib} biberon${nBib > 1 ? "s" : ""}`,
      ].filter(Boolean).join(" · ");
    };
  } else if (sousOnglet === "couches") {
    const items = couches
      .map((c) => ({ ...c, ts: c.timestamp ?? c.id }))
      .filter((c) => c.ts >= cutoff);
    groupes = grouperParJour(items);
    vide = "Aucune couche enregistrée pour l'instant.";
    recapDuJour = (its) => `${its.length} couche${its.length > 1 ? "s" : ""}`;
  } else {
    const items = pleurs
      .map((pl) => ({ ...pl, ts: pl.debut ?? pl.id }))
      .filter((pl) => pl.ts >= cutoff);
    groupes = grouperParJour(items);
    vide = "Aucun pleur enregistré pour l'instant.";
    recapDuJour = (its) => {
      const totalMin = Math.round(its.reduce((a, pl) => a + ((pl.fin - pl.debut) / 60000), 0));
      return `${its.length} épisode${its.length > 1 ? "s" : ""} · ${totalMin} min`;
    };
  }

  // ── Rendu d'une ligne selon l'onglet ──
  const renderLigne = (it) => {
    if (sousOnglet === "tetees") {
      let detail;
      if (it.ml != null) {
        detail = `🍼 ${it.ml} ml`;
      } else {
        const dur = it.fin && it.debut ? Math.round((it.fin - it.debut) / 60000) : null;
        const sein = it.sein ? `sein ${it.sein}` : "tétée";
        detail = `🤱 ${sein}${dur != null ? ` · ${dur} min` : ""}`;
      }
      return { detail, onDelete: () => confirmer(supprimerTetee, it.id) };
    }
    if (sousOnglet === "couches") {
      const detail = `${COUCHE_EMOJI[it.type] || "🧷"} ${COUCHE_LABEL[it.type] || it.type || "Couche"}`;
      return { detail, onDelete: () => confirmer(supprimerCouche, it.id) };
    }
    const dur = Math.round((it.fin - it.debut) / 60000);
    return { detail: `😢 ${dur} min`, onDelete: () => confirmer(supprimerPleurs, it.id) };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Sous-onglets */}
      <div style={{ display: "flex", gap: 6, background: p.linDark, borderRadius: 14, padding: 4 }}>
        {SOUS_ONGLETS.map((o) => (
          <button key={o.id} onClick={() => setSousOnglet(o.id)}
            style={{ flex: 1, padding: "9px 4px", borderRadius: 11, border: "none", background: sousOnglet === o.id ? p.white : "transparent", color: sousOnglet === o.id ? p.terracotta : p.textLight, fontSize: 11, fontWeight: 700, cursor: "pointer", boxShadow: sousOnglet === o.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
            {o.label}
          </button>
        ))}
      </div>

      {groupes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "36px 20px", color: p.textLight }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🗒</div>
          <div style={{ fontSize: 14 }}>{vide}</div>
        </div>
      ) : (
        <>
          {groupes.map((g) => (
            <div key={g.jour} style={{ background: p.white, borderRadius: 16, padding: "14px 16px", border: `1px solid ${p.linDark}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: p.text, textTransform: "capitalize" }}>{jourLabel(g.jour)}</span>
                <span style={{ fontSize: 11, color: p.textLight }}>{recapDuJour(g.items)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {g.items.map((it) => {
                  const { detail, onDelete } = renderLigne(it);
                  return (
                    <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderTop: `1px solid ${p.lin}` }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: p.textLight, minWidth: 42 }}>{heure(it.ts)}</span>
                      <span style={{ flex: 1, fontSize: 13, color: p.text }}>{detail}</span>
                      <button onClick={onDelete}
                        style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: p.textLight, padding: "2px 4px" }}
                        aria-label="Supprimer">
                        🗑
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ fontSize: 11, color: p.textLight, textAlign: "center", fontStyle: "italic", padding: "4px 0" }}>
            Historique des 30 derniers jours
          </div>
        </>
      )}
    </div>
  );
}
