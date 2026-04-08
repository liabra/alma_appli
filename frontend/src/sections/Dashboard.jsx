import { useState, useEffect } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Header from "../components/ui/Header";
import BoutonSOS from "../components/ui/BoutonSOS";
import ModeRelais from "../components/ui/ModeRelais";
import { useSessionStore } from "../store/useSessionStore";
import { useBebeStore } from "../store/useBebeStore";
import { useNightMode } from "../hooks/useNightMode";
import { useRecapHebdo } from "../hooks/useRecapHebdo";
import { getNormalAgeData } from "../data/normalAge";
import { getArticlesPourAge } from "../data/articlesAge";
import { useNavigate } from "react-router-dom";
import WidgetAlimentation from "../components/widgets/WidgetAlimentation";
import WidgetCouches from "../components/widgets/WidgetCouches";
import WidgetSommeil from "../components/widgets/WidgetSommeil";
import WidgetSante from "../components/widgets/WidgetSante";
import WidgetSoutien from "../components/widgets/WidgetSoutien";
import CheckIn from "../components/checkin/CheckIn";

const WIDGET_DEFS = [
  { id: "alimentation", label: "Alimentation", emoji: "🤱" },
  { id: "couches", label: "Couches", emoji: "🧷" },
  { id: "sommeil", label: "Sommeil", emoji: "🌙" },
  { id: "sante", label: "Santé", emoji: "🌡" },
  { id: "soutien", label: "Réseau soutien", emoji: "💬" },
];

function SortableWidget({ id, editMode, onHide, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, position: "relative" }}>
      {editMode && (
        <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10, display: "flex", gap: 6 }}>
          <div {...attributes} {...listeners} style={{ background: "rgba(0,0,0,0.1)", borderRadius: 6, padding: "4px 7px", fontSize: 14, cursor: "grab", touchAction: "none" }}>⠿</div>
          <button onClick={() => onHide(id)} style={{ background: "rgba(196,113,74,0.85)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 11, cursor: "pointer" }}>✕</button>
        </div>
      )}
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { widgetOrder, hiddenWidgets, setWidgetOrder, toggleHideWidget, getTeteesAujourdhui } = useSessionStore();
  const { getBebe, getAgeLabel, getAgeDays } = useBebeStore();
  const [editMode, setEditMode] = useState(false);
  const [normalOuvert, setNormalOuvert] = useState(null);
  const [articleOuvert, setArticleOuvert] = useState(null);
  const nightMode = useNightMode();
  const recap = useRecapHebdo();
  const navigate = useNavigate();

  const bebe = getBebe();
  const prenom = bebe?.prenom || "Bébé";
  const ageDays = getAgeDays() || 0;
  const tetees = getTeteesAujourdhui ? getTeteesAujourdhui() : [];

  const normalData = getNormalAgeData(ageDays);
  const articles = getArticlesPourAge(ageDays, 4);

  const getEncouragement = () => {
    if (ageDays < 14) return `Tu traverses les premiers jours avec ${prenom} — les plus intenses. Tu fais exactement ce qu'il faut.`;
    if (ageDays < 30) return `${prenom} a ${getAgeLabel()} et tu apprends à vous connaître. C'est un travail remarquable.`;
    if (ageDays < 90) return `Chaque jour avec ${prenom} est un pas de plus. Tu construis quelque chose de solide.`;
    if (ageDays < 180) return `${prenom} grandit et s'épanouit grâce à toi. Tout ce que tu fais compte.`;
    if (ageDays < 365) return `${prenom} a ${getAgeLabel()} — regarde le chemin parcouru ensemble depuis le début.`;
    return `${prenom} grandit si vite. Prends un moment pour reconnaître tout ce que tu fais chaque jour.`;
  };

  // Palette selon mode nuit
  const c = nightMode ? {
    bg: "#070300", card: "#0F0700", border: "#1F0E00",
    text: "#FF8C35", textLight: "#8B4A00", accent: "#FF6B00",
    sectionLabel: "#5A3000", white: "#0F0700",
  } : {
    bg: "#F5EDE3", card: "#FFFAF6", border: "#EDE0D0",
    text: "#2C2C2C", textLight: "#7A6E66", accent: "#C4714A",
    sectionLabel: "#7A6E66", white: "#FFFAF6",
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = widgetOrder.indexOf(active.id);
      const newIndex = widgetOrder.indexOf(over.id);
      setWidgetOrder(arrayMove(widgetOrder, oldIndex, newIndex));
    }
  };

  const visibleWidgets = widgetOrder.filter(id => !hiddenWidgets.includes(id));
  const masques = hiddenWidgets.filter(id => WIDGET_DEFS.find(w => w.id === id));

  const renderWidget = (id) => {
    switch (id) {
      case "alimentation": return <WidgetAlimentation />;
      case "couches": return <WidgetCouches />;
      case "sommeil": return <WidgetSommeil />;
      case "sante": return <WidgetSante />;
      case "soutien": return <WidgetSoutien />;
      default: return null;
    }
  };

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", background: c.bg, minHeight: "100vh", transition: "background 0.5s" }}>
      {nightMode && (
        <div style={{ background: "#0A0300", padding: "8px 20px", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <span style={{ fontSize: 14 }}>🌙</span>
          <span style={{ fontSize: 11, color: "#8B4A00", fontWeight: 600 }}>Mode nuit activé — luminosité réduite</span>
        </div>
      )}
      <Header />
      <div style={{ padding: "18px 18px 110px", display: "flex", flexDirection: "column", gap: 11 }}>

        {/* BOUTON SOS */}
        <BoutonSOS nightMode={nightMode} />

        {/* CARTE ENCOURAGEMENT */}
        <div style={{ borderRadius: 20, padding: "18px 20px", background: nightMode ? "linear-gradient(135deg, #1A0A00, #0A0500)" : "linear-gradient(135deg, #2C3E2D, #1A2E1B)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(107,143,113,0.2)", filter: "blur(30px)" }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: nightMode ? "#5A3A00" : "rgba(200,219,201,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>✦ Alma pour toi</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500, color: nightMode ? "#FF8C35" : "#fff", lineHeight: 1.55, marginBottom: 8 }}>
            <span style={{ color: nightMode ? "#FFB870" : "#C8DBC9", fontWeight: 600 }}>{getEncouragement()}</span>
          </div>
          {/* Récap express */}
          {recap.moyTetees > 0 && (
            <div style={{ display: "flex", gap: 12, paddingTop: 8, borderTop: `1px solid rgba(255,255,255,0.08)` }}>
              {[
                recap.moyTetees > 0 && `🤱 ${recap.moyTetees} tétées/j en moy.`,
                recap.moySommeil > 0 && `🌙 ${recap.moySommeil}h sommeil/j`,
                recap.moodLabel && `${recap.moodLabel} cette semaine`,
              ].filter(Boolean).map((item, i) => (
                <div key={i} style={{ fontSize: 11, color: nightMode ? "#8B4A00" : "rgba(255,255,255,0.5)" }}>{item}</div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 10, color: nightMode ? "#5A3000" : "rgba(255,255,255,0.25)", fontStyle: "italic", marginTop: 8 }}>
            Ceci n'est pas un avis médical
          </div>
        </div>

        {/* CHECK-IN */}
        <CheckIn nightMode={nightMode} />

        {/* MODE RELAIS */}
        <ModeRelais nightMode={nightMode} />

        {/* NORMAL À CET ÂGE */}
        {normalData && (
          <div style={{ background: c.card, borderRadius: 20, padding: "16px 20px", border: `1px solid ${c.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>🎯 Normal à {getAgeLabel()} ?</div>
              <span style={{ fontSize: 11, color: c.textLight }}>{normalData.questions.length} questions fréquentes</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {normalData.questions.map((qa, i) => (
                <div key={i}>
                  <button onClick={() => setNormalOuvert(normalOuvert === i ? null : i)}
                    style={{ width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 12, border: `1px solid ${normalOuvert === i ? c.accent : c.border}`, background: normalOuvert === i ? (nightMode ? "#1A0800" : "#FFF8F0") : "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: c.text, flex: 1, textAlign: "left" }}>{qa.q}</span>
                    <span style={{ color: c.textLight, flexShrink: 0, fontSize: 14 }}>{normalOuvert === i ? "▲" : "▼"}</span>
                  </button>
                  {normalOuvert === i && (
                    <div style={{ padding: "10px 14px", background: nightMode ? "#0F0500" : "#FFFDF8", borderRadius: "0 0 12px 12px", fontSize: 13, color: c.textLight, lineHeight: 1.6, border: `1px solid ${c.border}`, borderTop: "none" }}>
                      ✓ {qa.r}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ARTICLES ADAPTÉS À L'ÂGE */}
        {articles.length > 0 && (
          <div style={{ background: c.card, borderRadius: 20, padding: "16px 20px", border: `1px solid ${c.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 10 }}>📖 Pour toi maintenant</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {articles.map((art) => (
                <button key={art.id} onClick={() => setArticleOuvert(articleOuvert === art.id ? null : art.id)}
                  style={{ width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 14, border: `1px solid ${articleOuvert === art.id ? c.accent : c.border}`, background: articleOuvert === art.id ? (nightMode ? "#1A0800" : "#FFF8F0") : "transparent", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{art.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 2 }}>{art.titre}</div>
                      <div style={{ fontSize: 11, color: c.textLight }}>{art.resume}</div>
                    </div>
                    <span style={{ color: c.textLight, fontSize: 14 }}>{articleOuvert === art.id ? "▲" : "›"}</span>
                  </div>
                  {articleOuvert === art.id && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${c.border}` }}>
                      <div style={{ fontSize: 12, color: c.textLight, lineHeight: 1.6, marginBottom: 8 }}>
                        Retrouve la fiche complète dans la bibliothèque Alma.
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); navigate("/info"); }}
                        style={{ fontSize: 12, fontWeight: 700, color: c.accent, background: "transparent", border: `1px solid ${c.accent}`, borderRadius: 8, padding: "5px 12px", cursor: "pointer" }}>
                        Voir dans la bibliothèque →
                      </button>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* WIDGETS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: c.sectionLabel, letterSpacing: "0.08em", textTransform: "uppercase" }}>Mes widgets</div>
          <button onClick={() => setEditMode(!editMode)}
            style={{ fontSize: 11, fontWeight: 700, color: editMode ? c.accent : c.textLight, background: editMode ? (nightMode ? "#1A0800" : "#F0D5C5") : "transparent", border: `1px solid ${editMode ? c.accent : c.border}`, borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>
            {editMode ? "✓ Terminer" : "✎ Modifier"}
          </button>
        </div>

        {editMode && masques.length > 0 && (
          <div style={{ padding: "10px 14px", background: c.card, borderRadius: 14, border: `1px solid ${c.border}` }}>
            <div style={{ fontSize: 11, color: c.textLight, fontWeight: 600, marginBottom: 8 }}>Widgets masqués</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {masques.map(id => {
                const def = WIDGET_DEFS.find(w => w.id === id);
                return (
                  <button key={id} onClick={() => toggleHideWidget(id)}
                    style={{ padding: "5px 12px", borderRadius: 20, border: `1.5px solid #6B8F71`, background: "#C8DBC9", color: "#4A7A50", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    + {def?.emoji} {def?.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {editMode && (
          <div style={{ padding: "10px 14px", background: nightMode ? "#0F0500" : "#FFF8F0", borderRadius: 12, border: `1px solid ${nightMode ? "#2A0A00" : "#F0C090"}`, fontSize: 12, color: nightMode ? "#FF8C35" : "#A0620A", display: "flex", alignItems: "center", gap: 8 }}>
            <span>⠿</span> Glisse pour réordonner · ✕ pour masquer
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleWidgets} strategy={verticalListSortingStrategy}>
            {visibleWidgets.map(id => (
              <SortableWidget key={id} id={id} editMode={editMode} onHide={toggleHideWidget}>
                {renderWidget(id)}
              </SortableWidget>
            ))}
          </SortableContext>
        </DndContext>

        {/* ACCÈS RAPIDE */}
        <div style={{ fontSize: 11, fontWeight: 700, color: c.sectionLabel, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 6 }}>Accès rapide</div>
        {[
          { bg: `linear-gradient(135deg, #C4714A, #D4876A)`, icon: "🔍", title: "Selles vertes — normal ?", sub: "Guide des selles du nouveau-né" },
          { bg: `linear-gradient(135deg, #6B8F71, #4A7A50)`, icon: "🌸", title: "Baby blues ou dépression ?", sub: "Reconnaître et agir" },
          { bg: `linear-gradient(135deg, #3A4A8A, #2A3A7A)`, icon: "🌙", title: "Sommeil physiologique", sub: "Ce qui est normal à chaque âge" },
          { bg: `linear-gradient(135deg, #8A3A3A, #6A2A2A)`, icon: "🩺", title: "Quand appeler le médecin ?", sub: "Signaux d'alerte · IBCLC · PMI · Sage-femme", path: "/alertes" },
        ].map((card, i) => (
          <div key={i} onClick={() => navigate(card.path || "/info")}
            style={{ background: card.bg, borderRadius: 20, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
            <span style={{ fontSize: 24 }}>{card.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{card.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{card.sub}</div>
            </div>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
