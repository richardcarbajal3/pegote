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
          derechos forzada, sin letra chica.
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
            title="Precio fijo o subasta"
            body="Vende a precio fijo o pon tu sticker en subasta con fecha de cierre. Recibe pujas, deja un Comprar ya, y gana el mejor postor."
            color="text-mint"
          />
          <Bullet
            n="04"
            title="Tú eliges la licencia"
            body="Uso no exclusivo, uso exclusivo o transferencia total. Cada licencia define qué se lleva el comprador y qué conservas tú."
            color="text-pink"
          />
        </div>
      </section>

      {/* LICENSE TYPES */}
      <section className="bg-paper px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <span className="font-mono text-[0.8rem] uppercase tracking-[0.2em] bg-ink text-paper px-3 py-1 inline-block mb-4 -rotate-2">
            ☑ Tres licencias
          </span>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.9] mb-10">
            Tú decides <em className="not-italic text-tomato hl-mustard">qué se lleva</em> el comprador.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <LicenseCard
              dot="🟢"
              title="Uso (no exclusivo)"
              body="El artista permite que varios compren el sticker para usarlo (personal o comercial según plan). Mantiene la autoría y puede seguir vendiéndolo; nadie puede revenderlo."
              tint="bg-paper-2"
            />
            <LicenseCard
              dot="🔵"
              title="Uso exclusivo"
              body="El artista vende el diseño a un solo comprador y deja de ofrecerlo a otros. Mantiene la autoría, pero renuncia a futuras ventas de ese diseño."
              tint="bg-paper-2"
            />
            <LicenseCard
              dot="🔴"
              title="Transferencia total (premium)"
              body="El artista vende los derechos económicos del diseño al comprador. El cliente puede usarlo, modificarlo y revenderlo; el artista conserva el crédito como autor."
              tint="bg-paper-2"
            />
          </div>
        </div>
      </section>

      {/* AUCTION EXPLAINER */}
      <section className="bg-mustard border-y-2 border-ink px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="font-mono text-[0.8rem] uppercase tracking-[0.2em] bg-ink text-paper px-3 py-1 inline-block mb-4 -rotate-2">
              ⏱ Subasta
            </span>
            <h2 className="font-display text-4xl md:text-6xl leading-[0.9] mb-6">
              ¿Pieza única? <em className="not-italic text-tomato">Súbastala.</em>
            </h2>
            <p className="font-serif italic text-lg leading-snug">
              Pones puja inicial, fecha de cierre y, si quieres, un Comprar ya. Los
              compradores van pujando y, al cierre, gana el mejor postor. Ideal para
              <strong className="not-italic"> uso exclusivo</strong> y
              <strong className="not-italic"> transferencia total</strong>.
            </p>
          </div>
          <div className="border-2 border-ink bg-paper p-6 shadow-ink">
            <ul className="font-serif text-base leading-relaxed space-y-3">
              <li><strong className="not-italic">1.</strong> Eliges modo Subasta al subir.</li>
              <li><strong className="not-italic">2.</strong> Defines puja inicial y cierre.</li>
              <li><strong className="not-italic">3.</strong> La gente puja en la página del sticker.</li>
              <li><strong className="not-italic">4.</strong> Al cierre, el ganador paga y descarga.</li>
            </ul>
          </div>
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

function LicenseCard({
  dot,
  title,
  body,
  tint
}: {
  dot: string;
  title: string;
  body: string;
  tint: string;
}) {
  return (
    <div className={`${tint} border-2 border-ink p-6 shadow-ink`}>
      <div className="font-display text-2xl leading-tight mb-3">
        <span className="mr-1">{dot}</span> {title}
      </div>
      <p className="font-serif text-base leading-snug">{body}</p>
    </div>
  );
}
