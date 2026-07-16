import { useEffect, useRef, useState } from "react";

/**
 * Persists `value` to localStorage under `key`, debounced, and reports a
 * save-state ("idle" | "saving" | "saved") so the UI can show live feedback.
 */
export function usePersistedWrite(key, value, delay = 400) {
  const [saveState, setSaveState] = useState("idle");
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (value == null) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setSaveState("saving");
    const t = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        setSaveState("saved");
      } catch {
        setSaveState("idle");
      }
    }, delay);
    return () => clearTimeout(t);
  }, [key, value, delay]);

  return saveState;
}

export function readPersisted(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
