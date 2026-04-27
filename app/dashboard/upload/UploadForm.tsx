"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UploadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        {loading ? "Subiendo..." : "Publicar sticker →"}
      </button>
    </form>
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
