import { useEffect, useState } from "react";

export function useNightMode() {
  const isNight = () => {
    const h = new Date().getHours();
    return h >= 22 || h < 6;
  };

  const [nightMode, setNightMode] = useState(isNight());

  useEffect(() => {
    const check = () => setNightMode(isNight());
    const interval = setInterval(check, 60000); // vérif chaque minute
    return () => clearInterval(interval);
  }, []);

  return nightMode;
}

// Palette nuit — rouge très sombre, luminosité minimale
export const nightPalette = {
  bg: "#0A0500",
  card: "#140A00",
  border: "#2A1500",
  text: "#FF6B35",
  textLight: "#8B4513",
  accent: "#FF4500",
  white: "#1A0A00",
};
