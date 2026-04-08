import { useState, useRef } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Header from "../components/ui/Header";
import { useSessionStore } from "../store/useSessionStore";
import { useBebeStore } from "../store/useBebeStore";
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

const p = { terracotta: "#C4714A", terracottaPale: "#F0D5C5", lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9", textLight: "#7A6E66", white: "#FFFAF6" };

function SortableWidget({ id, editMode, onHide, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
  };
  return (
    <div ref={setNodeRef} style={style}>
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
  const { bebe, getAgeLabel, getAgeDays } = useBebeStore();
  const prenom = bebe?.prenom || "Bébé";
  const ageDays = getAgeDays() || 0;
  const tetees = getTeteesAujourdhui ? getTeteesAujourdhui() : [];

  // Message d'encouragement dynamique selon l'âge
  const getEncouragement = () => {
    if (ageDays < 14) return `Tu traverses les premiers jours avec ${prenom} — les plus intenses. Tu fais exactement ce qu'il faut.`;
    if (ageDays < 30) return `${prenom} a ${getAgeLabel()} et tu apprends à te connaître ensemble. C'est un travail remarquable.`;
    if (ageDays < 90) return `Chaque jour avec ${prenom} est un pas de plus. Tu construis quelque chose de solide.`;
    if (ageDays < 180) return `${prenom} grandit et s'épanouit grâce à toi. Tout ce que tu fais compte.`;
    if (ageDays < 365) return `${prenom} a ${getAgeLabel()} — regarde le chemin parcouru ensemble depuis le début.`;
    return `${prenom} grandit si vite. Prends un moment pour reconnaître tout ce que tu fais chaque jour.`;
  };
  const [editMode, setEditMode] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = widgetOrder.indexOf(active.id);
      const newIndex = widgetOrder.indexOf(over.id);
      setWidgetOrder(arrayMove(widgetOrder, oldIndex, newIndex));
    }
  };

  const visibleWidgets = widgetOrder.filter((id) => !hiddenWidgets.includes(id));
  const masques = hiddenWidgets.filter((id) => WIDGET_DEFS.find((w) => w.id === id));

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
    <div style={{ maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      <Header />
      <div style={{ padding: "18px 18px 110px", display: "flex", flexDirection: "column", gap: 11 }}>

        {/* Carte encouragement IA */}
        <div style={{ borderRadius: 20, padding: "18px 20px", background: "linear-gradient(135deg, #2C3E2D, #1A2E1B)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(107,143,113,0.25)", filter: "blur(30px)" }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(200,219,201,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>✦ Alma pour toi · ce matin</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500, color: "#fff", lineHeight: 1.55, marginBottom: 12 }}>
            <span style={{ color: "#C8DBC9", fontWeight: 600 }}>{getEncouragement()}</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
            Ceci n'est pas un avis médical · en cas d'inquiétude, consulte un professionnel
          </div>
        </div>

        {/* Check-in quotidien */}
        <CheckIn />

        {/* Header widgets */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: p.textLight, letterSpacing: "0.08em", textTransform: "uppercase" }}>Mes widgets</div>
          <button onClick={() => setEditMode(!editMode)} style={{ fontSize: 11, fontWeight: 700, color: editMode ? p.terracotta : p.textLight, background: editMode ? p.terracottaPale : "transparent", border: `1px solid ${editMode ? p.terracotta : p.linDark}`, borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>
            {editMode ? "✓ Terminer" : "✎ Modifier"}
          </button>
        </div>

        {/* Widgets masqués */}
        {editMode && masques.length > 0 && (
          <div style={{ padding: "10px 14px", background: p.white, borderRadius: 14, border: `1px solid ${p.linDark}` }}>
            <div style={{ fontSize: 11, color: p.textLight, fontWeight: 600, marginBottom: 8 }}>Widgets masqués</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {masques.map((id) => {
                const def = WIDGET_DEFS.find((w) => w.id === id);
                return (
                  <button key={id} onClick={() => toggleHideWidget(id)} style={{ padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${p.sauge}`, background: p.saugePale, color: p.sauge, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    + {def?.emoji} {def?.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {editMode && (
          <div style={{ padding: "10px 14px", background: "#FFF8F0", borderRadius: 12, border: "1px solid #F0C090", fontSize: 12, color: "#A0620A", display: "flex", alignItems: "center", gap: 8 }}>
            <span>⠿</span> Glisse pour réordonner · ✕ pour masquer
          </div>
        )}

        {/* DnD widgets */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleWidgets} strategy={verticalListSortingStrategy}>
            {visibleWidgets.map((id) => (
              <SortableWidget key={id} id={id} editMode={editMode} onHide={toggleHideWidget}>
                {renderWidget(id)}
              </SortableWidget>
            ))}
          </SortableContext>
        </DndContext>

        {/* Accès rapide */}
        <div style={{ fontSize: 11, fontWeight: 700, color: p.textLight, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 6 }}>Accès rapide</div>
        {[
          { bg: `linear-gradient(135deg, #C4714A, #D4876A)`, icon: "🔍", title: "Selles vertes — normal ?", sub: "Guide des selles du nouveau-né" },
          { bg: `linear-gradient(135deg, #6B8F71, #4A7A50)`, icon: "🌸", title: "Baby blues ou dépression ?", sub: "Reconnaître et agir" },
          { bg: `linear-gradient(135deg, #3A4A8A, #2A3A7A)`, icon: "🌙", title: "Sommeil physiologique", sub: "Ce qui est normal à chaque âge" },
        ].map((card, i) => (
          <div key={i} style={{ background: card.bg, borderRadius: 20, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
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
