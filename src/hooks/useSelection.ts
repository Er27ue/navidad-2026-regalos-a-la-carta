import { useEffect, useState } from "react";

const STORAGE_KEY = "yaritza-navidad-2026-seleccion";

export function useSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = value ? JSON.parse(value) : [];
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch {
      // La selección sigue disponible en memoria cuando el almacenamiento no está disponible.
    }
  }, [selectedIds]);

  const toggle = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };
  const remove = (id: string) => setSelectedIds((current) => current.filter((item) => item !== id));

  return { selectedIds, toggle, remove };
}
