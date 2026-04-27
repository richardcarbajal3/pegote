"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LICENSES } from "@/lib/licenses";

export function UploadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saleMode, setSaleMode] = useState<"FIXED" | "AUCTION">("FIXED");
  const [licenseType, setLicenseType] = useState<"USAGE" | "EXCLUSIVE" | "TRANSFER">("USAGE");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/stickers/upload", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error inesperado");
      router.push(`/sticker/${data.slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo falló");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field label="Título" name="title" required maxLength={60} placeholder="PAYASO TRISTE" />

      <Field
        label="Descripción (opcional)"
        name="description"
        type="textarea"
        maxLength={500}
        placeholder="Un payaso melancólico para días grises."
      />

      {/* TIPO DE LICENCIA */}
      <div>
        <label className="font-mono text-xs uppercase tracking-[0.15em] block mb-3">
          Licencia · qué se lleva el comprador
        </label>
        <div className="grid gap-3">
          {(Object.values(LICENSES)).map((lic) => {
            const active = licenseType === lic.code;
            return (
              <label
                key={lic.code}
                className={`flex gap-3 items-start cursor-pointer border-2 border-ink p-4 transition-all ${
                  active
                    ? "bg-paper-2 shadow-ink -translate-x-0.5 -translate-y-0.5"
                    : "bg-paper hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-sm"
                }`}
              >
                <input
                  type="radio"
                  name="licenseType"
                  value={lic.code}
                  checked={active}
                  onChange={() => setLicenseType(lic.code)}
                  className="mt-1 accent-tomato"
                />
                <div>
                  <div className="font-display text-base uppercase">
                    <span className="mr-1">{lic.dot}</span> {lic.label}
                  </div>
                  <div className="font-serif text-sm leading-snug mt-1 opacity-80">{lic.body}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* MODO DE VENTA */}
      <div>
        <label className="font-mono text-xs uppercase tracking-[0.15em] block mb-3">
          Modo de venta
        </label>
        <div className="grid grid-cols-2 gap-3">
          <ModeChip
            active={saleMode === "FIXED"}
            onClick={() => setSaleMode("FIXED")}
            title="Precio fijo"
            sub="Lo compran al toque"
            value="FIXED"
          />
          <ModeChip
            active={saleMode === "AUCTION"}
            onClick={() => setSaleMode("AUCTION")}
            title="Subasta"
            sub="Mejor postor gana"
            value="AUCTION"
          />
        </div>
        <input type="hidden" name="saleMode" value={saleMode} />
      </div>

      {saleMode === "FIXED" ? (
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Precio (S/)"
            name="price"
            type="number"
            required
            min={3}
            max={50}
            placeholder="8"
          />
          <Field label="Tags" name="tags" placeholder="payaso, triste, retro" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Puja inicial (S/)"
              name="startBid"
              type="number"
              required
              min={3}
              max={500}
              placeholder="10"
            />
            <Field
              label="Comprar ya (S/, opcional)"
              name="price"
              type="number"
              min={3}
              max={500}
              placeholder="50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Cierra el (fecha y hora)"
              name="auctionEndsAt"
              type="datetime-local"
              required
            />
            <Field label="Tags" name="tags" placeholder="payaso, raro, premium" />
          </div>
          <div className="border-2 border-dashed border-ink p-4 font-serif italic text-sm bg-mustard/30">
            En subasta sólo aparece <strong className="not-italic">una venta</strong>: gana el mejor
            postor y el sticker queda con la licencia que elegiste arriba. Si nadie puja, el sticker
            vuelve a quedar disponible para republicarlo.
          </div>
        </>
      )}

      <div>
        <label className="font-mono text-xs uppercase tracking-[0.15em] block mb-2">
          Archivo del sticker (PNG / SVG, máx 5MB)
        </label>
        <input
          type="file"
          name="file"
          accept="image/png,image/svg+xml"
          required
          className="font-mono text-sm w-full bg-paper-2 border-2 border-ink p-3 file:mr-4 file:font-display file:bg-ink file:text-paper file:border-0 file:px-4 file:py-2 file:cursor-pointer"
        />
      </div>

      {error && (
        <div className="border-2 border-tomato bg-tomato/10 p-4 font-mono text-sm text-tomato">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full font-display text-base bg-tomato text-paper border-2 border-ink px-6 py-4 shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-lg transition-all disabled:opacity-50"
      >
        {loading ? "Subiendo..." : saleMode === "AUCTION" ? "Lanzar subasta →" : "Publicar sticker →"}
      </button>
    </form>
  );
}

function ModeChip({
  active,
  onClick,
  title,
  sub,
  value
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  value: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-value={value}
      className={`text-left border-2 border-ink p-4 transition-all ${
        active
          ? "bg-tomato text-paper shadow-ink -translate-x-0.5 -translate-y-0.5"
          : "bg-paper hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-sm"
      }`}
    >
      <div className="font-display text-lg leading-none">{title}</div>
      <div className="font-mono text-xs uppercase tracking-[0.12em] mt-2 opacity-80">{sub}</div>
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  min,
  max,
  maxLength
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  maxLength?: number;
}) {
  const baseCls =
    "font-mono text-base px-4 py-3 w-full border-2 border-ink bg-paper-2 shadow-ink-sm focus:outline-none focus:shadow-[6px_6px_0_var(--tomato)]";
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-[0.15em] block mb-2">{label}</label>
      {type === "textarea" ? (
        <textarea name={name} rows={3} maxLength={maxLength} placeholder={placeholder} className={baseCls} />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          min={min}
          max={max}
          maxLength={maxLength}
          placeholder={placeholder}
          className={baseCls}
        />
      )}
    </div>
  );
}
