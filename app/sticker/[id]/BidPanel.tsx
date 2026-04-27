"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
  startBidCents: number;
  currentBidCents: number | null;
  auctionEndsAt: string;
  authed: boolean;
  isOwn: boolean;
};

export function BidPanel({ slug, startBidCents, currentBidCents, auctionEndsAt, authed, isOwn }: Props) {
  const minimum = ((currentBidCents ?? startBidCents) + 100) / 100;
  const [amount, setAmount] = useState<string>(String(minimum));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());
  const router = useRouter();

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const ends = new Date(auctionEndsAt).getTime();
  const ms = ends - now;
  const closed = ms <= 0;

  const dd = Math.max(0, Math.floor(ms / 86400000));
  const hh = Math.max(0, Math.floor((ms / 3600000) % 24));
  const mm = Math.max(0, Math.floor((ms / 60000) % 60));
  const ss = Math.max(0, Math.floor((ms / 1000) % 60));

  async function bid(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/stickers/${slug}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error inesperado");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo falló");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-2 border-ink bg-paper-2 p-5 shadow-ink">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] opacity-70">
            {currentBidCents ? "Puja más alta" : "Puja inicial"}
          </div>
          <div className="font-display text-3xl">
            S/ {((currentBidCents ?? startBidCents) / 100).toFixed(0)}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] opacity-70">
            {closed ? "Subasta cerrada" : "Cierra en"}
          </div>
          <div className="font-display text-2xl tabular-nums">
            {closed ? "—" : `${dd}d ${pad(hh)}:${pad(mm)}:${pad(ss)}`}
          </div>
        </div>
      </div>

      {!closed && !isOwn && authed && (
        <form onSubmit={bid} className="mt-5 flex gap-3 flex-wrap">
          <input
            type="number"
            min={minimum}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-mono text-base px-4 py-3 flex-1 min-w-[140px] border-2 border-ink bg-paper shadow-ink-sm focus:outline-none focus:shadow-[6px_6px_0_var(--tomato)]"
            aria-label="Monto de tu puja en soles"
          />
          <button
            type="submit"
            disabled={loading}
            className="font-display px-6 py-3 border-2 border-ink bg-blue text-paper shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-lg transition-all disabled:opacity-50"
          >
            {loading ? "Pujando..." : `Pujar (mín. S/ ${minimum.toFixed(0)})`}
          </button>
        </form>
      )}

      {!closed && !authed && (
        <div className="mt-5 font-mono text-xs uppercase tracking-[0.12em] opacity-70">
          Inicia sesión para pujar →
        </div>
      )}

      {!closed && isOwn && (
        <div className="mt-5 font-mono text-xs uppercase tracking-[0.12em] opacity-70">
          Es tu sticker. Sólo puedes mirar las pujas.
        </div>
      )}

      {closed && (
        <div className="mt-5 font-mono text-xs uppercase tracking-[0.12em] opacity-70">
          Esta subasta ya cerró. {currentBidCents ? "Hubo ganador." : "Quedó desierta."}
        </div>
      )}

      {error && <div className="mt-3 font-mono text-xs text-tomato">{error}</div>}
    </div>
  );
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
