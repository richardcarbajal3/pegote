import Link from "next/link";
import { auth } from "@/auth";

export default async function VenderPage() {
  const session = await auth();
  const cta = session?.user
    ? session.user.isArtist
      ? { href: "/dashboard/upload", label: "Subir un sticker →" }
      : { href: "/onboarding", label: "Activar mi perfil de artista →" }
    : { href: "/login?from=/onboarding", label: "Entrar con Google →" };

  return (
    <>
      <section className="px-6 md:px-12 py-24 max-w-5xl mx-auto">
        <span className="font-mono text-xs uppercase tracking-[0.2em] bg-blue text-paper px-3 py-1 inline-block mb-4 -rotate-2">
          ↗ Para artistas
        </span>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tight mb-8">
          Tu arte. <em className="not-italic text-tomato hl-mustard">Tu plata.</em>
          <br />
          Tu autoría.
        </h1>
        <p className="font-serif italic text-xl max-w-2xl leading-snug">
          PEGOTE es la vitrina, tú haces el arte. Subes tus diseños, les ponemos audiencia,
          la gente los descarga, tú cobras. Sin contratos raros, sin transferencia de
          derechos, sin letra chica.
        </p>
      </section>

      <section className="bg-paper-2 border-y-2 border-ink px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <Bullet
            n="01"
            title="Te quedas con el 70%"
            body="De cada sol que paga el cliente, S/ 0.70 son tuyos. PEGOTE se lleva 30 céntimos para mantener el sitio, los servidores y el equipo."
            color="text-tomato"
          />
          <Bullet
            n="02"
            title="Tu nombre, en cada sticker"
            body="Cada descarga sale firmada con tu @ y un link a tu perfil. La autoría es tuya, los derechos también."
            color="text-mustard"
          />
          <Bullet
            n="03"
            title="Tú decides el precio"
            body="Lo que tú creas justo. Mínimo S/ 3, máximo libre. Cambias el precio cuando quieras."
            color="text-mint"
          />
          <Bullet
            n="04"
            title="Te puedes ir cuando quieras"
            body="Borras tu sticker, descargas tus archivos originales, te llevas tu data. Cero candados."
            color="text-pink"
          />
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 text-center">
        <h2 className="font-display text-4xl md:text-6xl mb-8 leading-[0.9]">
          ¿Listo para <em className="not-italic text-tomato hl-mustard">pegarla?</em>
        </h2>
        <Link
          href={cta.href}
          className="font-display inline-block px-10 py-5 text-lg border-2 border-ink bg-tomato text-paper shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-lg transition-all"
        >
          {cta.label}
        </Link>
      </section>
    </>
  );
}

function Bullet({
  n,
  title,
  body,
  color
}: {
  n: string;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div>
      <div className={`font-display text-6xl leading-none mb-3 ${color}`}>{n}</div>
      <h3 className="font-display text-2xl mb-3">{title}</h3>
      <p className="font-serif text-lg leading-relaxed">{body}</p>
    </div>
  );
}
