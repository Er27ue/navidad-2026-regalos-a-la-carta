import { useEffect, useState } from "react";

const STORAGE_KEY = "yaritza-navidad-2026-seleccion";

export function useSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = value ? JSON.parse(value) : [];
      if (Array.isArray(parsed)) setSelectedIds(parsed.filter((id): id is string => typeof id === "string"));
    } catch {
      // La selección queda en memoria cuando el almacenamiento no está disponible.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch {
      // La selección sigue disponible en memoria si el navegador bloquea el almacenamiento.
    }
  }, [selectedIds, storageReady]);

  const toggle = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };
  const remove = (id: string) => setSelectedIds((current) => current.filter((item) => item !== id));

  return { selectedIds, toggle, remove };
}
