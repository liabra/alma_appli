import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(initialValue = 0) {
  const [seconds, setSeconds] = useState(initialValue);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }, [running]);

  const pause = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSeconds(0);
  }, []);

  const toggle = useCallback(() => {
    running ? pause() : start();
  }, [running, start, pause]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const fmt = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  return { seconds, running, start, pause, reset, toggle, fmt: fmt(seconds) };
}
