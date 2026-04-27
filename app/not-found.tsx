import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-6 md:px-12 py-32 text-center max-w-2xl mx-auto">
      <div className="font-display text-[clamp(6rem,18vw,12rem)] leading-none text-tomato -rotate-3 inline-block">
        404
      </div>
      <h1 className="font-display text-3xl md:text-5xl mt-4 leading-[0.9]">
        Este pegote no existe.
      </h1>
      <p className="font-serif italic text-lg mt-6 mb-10">
        O lo despegaron, o nunca estuvo. Vuelve a la galería y prueba otro.
      </p>
      <Link
        href="/galeria"
        className="font-display inline-block px-8 py-4 border-2 border-ink bg-tomato text-paper shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-lg transition-all"
      >
        Ver la galería →
      </Link>
    </section>
  );
}
