"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BuyButton({ stickerId }: { stickerId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stickerId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error inesperado");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo falló");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={buy}
        disabled={loading}
        className="font-display px-8 py-4 border-2 border-ink bg-tomato text-paper shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-lg transition-all disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Comprar y descargar →"}
      </button>
      {error && <span className="font-mono text-xs text-tomato">{error}</span>}
      <span className="font-mono text-xs opacity-60">
        Pago simulado en dev · en prod: Yape · Plin · Tarjeta
      </span>
    </div>
  );
}
