import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "yaritza-navidad-2026-order-v2";
const LEGACY_KEY = "yaritza-navidad-2026-pedido";
type SavedOrder = {
  version: 2;
  items: Record<string, number>;
  customerName: string;
  notes: string;
  updatedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function cleanQuantities(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        (entry): entry is [string, number] =>
          typeof entry[1] === "number" && Number.isFinite(entry[1]) && entry[1] > 0,
      )
      .map(([id, n]) => [id, Math.min(999, Math.floor(n))]),
  );
}

export function useOrder() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isRecord(parsed) && parsed["version"] === 2) {
          setQuantities(cleanQuantities(parsed["items"]));
          if (typeof parsed["customerName"] === "string") setCustomerName(parsed["customerName"]);
          if (typeof parsed["notes"] === "string") setNotes(parsed["notes"]);
        }
      } else {
        const legacy = window.localStorage.getItem(LEGACY_KEY);
        if (legacy) setQuantities(cleanQuantities(JSON.parse(legacy)));
      }
      const customer = window.localStorage.getItem("yaritza-navidad-2026-customer-v1");
      if (!customerName && customer) setCustomerName(customer);
    } catch {
      // El pedido sigue disponible en memoria aunque falle el almacenamiento.
    } finally {
      setStorageReady(true);
    }
    // Load once; localStorage values are intentionally the source on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    const saved: SavedOrder = {
      version: 2,
      items: quantities,
      customerName,
      notes,
      updatedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      window.localStorage.setItem("yaritza-navidad-2026-customer-v1", customerName);
    } catch {
      // Mantener el estado de la sesión si el navegador bloquea el almacenamiento.
    }
  }, [quantities, customerName, notes, storageReady]);

  const setQuantity = (id: string, quantity: number) => {
    const safe = Math.min(999, Math.max(0, Math.floor(Number.isFinite(quantity) ? quantity : 0)));
    setQuantities((current) => {
      const next = { ...current };
      if (!safe) delete next[id];
      else next[id] = safe;
      return next;
    });
  };
  const remove = (id: string) => setQuantity(id, 0);
  const total = useMemo(
    () => Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0),
    [quantities],
  );
  return { quantities, setQuantity, remove, total, customerName, setCustomerName, notes, setNotes };
}

