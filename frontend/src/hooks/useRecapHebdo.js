import { useSessionStore } from "../store/useSessionStore";
import { useBebeStore } from "../store/useBebeStore";

export function useRecapHebdo() {
  const { tetees, periodesSommeil, couches, checkins } = useSessionStore();
  const { getBebe } = useBebeStore();
  const bebe = getBebe();

  const getJour = (ts) => new Date(ts).toDateString();
  const today = new Date();

  // 7 derniers jours
  const derniers7j = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toDateString();
  });

  // Tétées par jour
  const teteesByDay = derniers7j.map(jour => ({
    jour,
    count: tetees.filter(t => getJour(t.timestamp) === jour).length
  }));
  const moyTetees = Math.round(teteesByDay.reduce((a, b) => a + b.count, 0) / 7);

  // Sommeil par jour (en heures)
  const sommeilByDay = derniers7j.map(jour => {
    const periodes = periodesSommeil.filter(p => getJour(p.debut) === jour);
    const totalMs = periodes.reduce((a, p) => a + ((p.fin || p.debut) - p.debut), 0);
    return { jour, heures: Math.round(totalMs / 3600000 * 10) / 10 };
  });
  const moySommeil = Math.round(sommeilByDay.reduce((a, b) => a + b.heures, 0) / 7 * 10) / 10;

  // Humeur moyenne
  const checkinsRecents = checkins.filter(c => {
    const d = new Date(c.date);
    const diff = (today - d) / 86400000;
    return diff <= 7;
  });
  const moyHumeur = checkinsRecents.length > 0
    ? Math.round(checkinsRecents.reduce((a, c) => a + c.mood, 0) / checkinsRecents.length * 10) / 10
    : null;

  const moodEmojis = ["😔", "😐", "🙂", "😊", "🌟"];
  const moodLabel = moyHumeur !== null ? moodEmojis[Math.round(moyHumeur)] : null;

  // Message de tendance
  const getTendance = () => {
    if (!bebe) return null;
    const ageDays = Math.floor((Date.now() - new Date(bebe.dateNaissance).getTime()) / 86400000);
    if (moySommeil > 0 && moySommeil < 10 && ageDays < 90) return "Les nuits courtes sont normales à cet âge — tu tiens le bon cap.";
    if (moyHumeur !== null && moyHumeur < 2) return "Cette semaine a été difficile. C'est réel et valide. Prends soin de toi.";
    if (moyHumeur !== null && moyHumeur >= 3) return "Bonne semaine ! Remarque ce qui s'est bien passé.";
    return null;
  };

  return {
    moyTetees,
    moySommeil,
    moyHumeur,
    moodLabel,
    checkinsCount: checkinsRecents.length,
    tendance: getTendance(),
    teteesByDay,
    sommeilByDay,
  };
}
