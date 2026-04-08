import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/ui/Header";
import { FICHES, CAT_COLORS_LIB, DISCLAIMER_GLOBAL } from "../data/bibliotheque";

const p = {
  terracotta: "#C4714A", terracottaL: "#D4876A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
};

const CATEGORIES = Object.keys(CAT_COLORS_LIB);

function FicheCard({ fiche, onOpen }) {
  const cat = CAT_COLORS_LIB[fiche.categorie] || { bg: p.linDark, color: p.textLight, emoji: "📄" };
  return (
    <div onClick={() => onOpen(fiche)}
      style={{ background: p.white, borderRadius: 16, padding: "14px 16px", border: `1.5px solid ${fiche.urgence ? "#F0A0A0" : p.linDark}`, cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
        {cat.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {fiche.urgence && <div style={{ fontSize: 10, fontWeight: 700, color: "#C04040", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>⚠ Consulte rapidement</div>}
        <div style={{ fontSize: 13, fontWeight: 700, color: p.text, marginBottom: 3 }}>{fiche.titre}</div>
        <div style={{ fontSize: 11, color: p.textLight, lineHeight: 1.4 }}>{fiche.resume}</div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: cat.bg, color: cat.color, marginTop: 6, display: "inline-block" }}>
          {cat.emoji} {fiche.categorie}
        </span>
      </div>
      <span style={{ color: p.textLight, fontSize: 18, flexShrink: 0 }}>›</span>
    </div>
  );
}

function FicheDetail({ fiche, onClose }) {
  const cat = CAT_COLORS_LIB[fiche.categorie] || { bg: p.linDark, color: p.textLight, emoji: "📄" };
  return (
    <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 390, height: "100vh", background: p.lin, zIndex: 200, overflowY: "auto", padding: "0 0 40px" }}>
      <div style={{ background: p.white, padding: "52px 20px 20px", borderBottom: `1px solid ${p.linDark}`, display: "flex", alignItems: "flex-start", gap: 12 }}>
        <button onClick={onClose} style={{ background: p.linDark, border: "none", borderRadius: "50%", width: 34, height: 34, fontSize: 16, cursor: "pointer", flexShrink: 0 }}>←</button>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: cat.bg, color: cat.color, display: "inline-block", marginBottom: 6 }}>
            {cat.emoji} {fiche.categorie}
          </span>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: p.text, lineHeight: 1.3 }}>{fiche.titre}</div>
          <div style={{ fontSize: 13, color: p.textLight, marginTop: 4, fontStyle: "italic" }}>{fiche.resume}</div>
        </div>
      </div>
      <div style={{ padding: "20px 20px" }}>
        {/* Disclaimer */}
        <div style={{ background: "#F0F8FF", borderRadius: 10, padding: "10px 12px", border: "1px solid #C0D8F0", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#3A6A9A", lineHeight: 1.5 }}>ℹ️ {DISCLAIMER_GLOBAL}</div>
        </div>

        {fiche.urgence && (
          <div style={{ background: "#FFF0F0", borderRadius: 12, padding: "12px 14px", border: "1.5px solid #F0A0A0", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#C04040" }}>⚠ Consulte un professionnel rapidement</div>
          </div>
        )}

        <div style={{ fontSize: 14, color: p.text, lineHeight: 1.75, marginBottom: 16 }}>{fiche.contenu}</div>

        {fiche.conseils && fiche.conseils.length > 0 && (
          <div style={{ background: p.white, borderRadius: 14, padding: "14px 16px", border: `1px solid ${p.linDark}`, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: p.textLight, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>À retenir</div>
            {fiche.conseils.map((c, i) => (
              <div key={i} style={{ fontSize: 13, color: p.text, display: "flex", gap: 8, marginBottom: 8, lineHeight: 1.5 }}>
                <span style={{ color: p.sauge, flexShrink: 0, fontWeight: 700 }}>·</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        )}

        {fiche.lien && (
          <a href={fiche.lien} target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 10, background: p.terracottaPale, borderRadius: 12, padding: "12px 14px", textDecoration: "none", marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>🔗</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: p.terracotta }}>{fiche.lienLabel}</span>
          </a>
        )}

        <div style={{ fontSize: 11, color: p.textLight, textAlign: "center", fontStyle: "italic", padding: "8px 0" }}>
          Ceci n'est pas un avis médical · Pour toute inquiétude, consulte un professionnel de santé
        </div>
      </div>
    </div>
  );
}

export default function Info() {
  const [recherche, setRecherche] = useState("");
  const [catActive, setCatActive] = useState(null);
  const [ficheOuverte, setFicheOuverte] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ficheId = searchParams.get("fiche");
    const cat = searchParams.get("cat");
    if (ficheId) {
      const fiche = FICHES.find(f => f.id === ficheId);
      if (fiche) setFicheOuverte(fiche);
    }
    if (cat) setCatActive(cat);
  }, []);

  const fichesFiltrees = useMemo(() => {
    return FICHES.filter(f => {
      const matchCat = !catActive || f.categorie === catActive;
      const q = recherche.toLowerCase();
      const matchSearch = !recherche ||
        f.titre.toLowerCase().includes(q) ||
        f.resume.toLowerCase().includes(q) ||
        f.contenu.toLowerCase().includes(q) ||
        f.categorie.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [recherche, catActive]);

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: p.lin }}>
      {ficheOuverte && <FicheDetail fiche={ficheOuverte} onClose={() => setFicheOuverte(null)} />}
      <Header />
      <div style={{ padding: "18px 18px 110px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: p.text, marginBottom: 14 }}>
          📖 Bibliothèque
        </div>

        {/* Recherche */}
        <div style={{ position: "relative", marginBottom: 14 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input type="text" value={recherche} onChange={e => setRecherche(e.target.value)}
            placeholder="Rechercher : engorgement, cododo, DME, fièvre..."
            style={{ width: "100%", padding: "11px 12px 11px 38px", borderRadius: 14, border: `1.5px solid ${p.linDark}`, background: p.white, fontSize: 13, outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
        </div>

        {/* Catégories */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
          <button onClick={() => setCatActive(null)}
            style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${!catActive ? p.terracotta : p.linDark}`, background: !catActive ? p.terracottaPale : "transparent", color: !catActive ? p.terracotta : p.textLight, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            Tout ({FICHES.length})
          </button>
          {CATEGORIES.map(cat => {
            const c = CAT_COLORS_LIB[cat];
            const count = FICHES.filter(f => f.categorie === cat).length;
            const active = catActive === cat;
            return (
              <button key={cat} onClick={() => setCatActive(active ? null : cat)}
                style={{ padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${active ? c.color : p.linDark}`, background: active ? c.bg : "transparent", color: active ? c.color : p.textLight, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                {c.emoji} {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Résultats */}
        <div style={{ fontSize: 11, color: p.textLight, fontWeight: 600, marginBottom: 10 }}>
          {fichesFiltrees.length} fiche{fichesFiltrees.length > 1 ? "s" : ""}
          {catActive && ` · ${catActive}`}
          {recherche && ` · "${recherche}"`}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {fichesFiltrees.map(f => <FicheCard key={f.id} fiche={f} onOpen={setFicheOuverte} />)}
        </div>

        {fichesFiltrees.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: p.textLight }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 14 }}>Aucun résultat pour "{recherche}"</div>
          </div>
        )}
      </div>
    </div>
  );
}
