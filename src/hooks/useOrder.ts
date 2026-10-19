import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "yaritza-navidad-2026-pedido";

export function useOrder() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const safe: Record<string, number> = {};
        for (const [id, value] of Object.entries(parsed)) {
          if (typeof value === "number" && Number.isFinite(value) && value > 0) safe[id] = Math.floor(value);
        }
        setQuantities(safe);
      }
    } catch {
      // El pedido sigue disponible en memoria si localStorage no está accesible.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
    } catch {
      // Mantener el pedido en memoria si el navegador bloquea el almacenamiento.
    }
  }, [quantities, storageReady]);

  const setQuantity = (id: string, quantity: number) => {
    const safe = Math.max(0, Math.floor(Number.isFinite(quantity) ? quantity : 0));
    setQuantities((current) => {
      const next = { ...current };
      if (safe === 0) delete next[id];
      else next[id] = safe;
      return next;
    });
  };
  const remove = (id: string) => setQuantity(id, 0);
  const total = useMemo(() => Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0), [quantities]);
  return { quantities, setQuantity, remove, total };
};
