import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StickerCard } from "./components/StickerCard";
import { FloatingStickers } from "./components/FloatingStickers";
import { FALLBACK_STICKERS } from "@/lib/seed-data";

export const revalidate = 60;

async function getHomeData() {
  const [topStickers, totals] = await Promise.all([
    prisma.sticker.findMany({
      where: { published: true },
      include: { artist: { select: { username: true } } },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.$transaction([
      prisma.user.count({ where: { isArtist: true } }),
      prisma.sticker.count({ where: { published: true } }),
      prisma.orderItem.count()
    ])
  ]);

  return {
    stickers: topStickers,
    artists: totals[0],
    totalStickers: totals[1],
    downloads: totals[2]
  };
}

export default async function HomePage() {
  // Si la DB todavía no fue inicializada, mostramos los 8 stickers
  // del modelo + las cifras del modelo. Otra sesión correrá db:push + seed.
  let data: Awaited<ReturnType<typeof getHomeData>>;
  let usingFallback = false;
  try {
    data = await getHomeData();
    if (data.stickers.length === 0) usingFallback = true;
  } catch {
    data = { stickers: [], artists: 237, totalStickers: 1400, downloads: 12000 };
    usingFallback = true;
  }

  const galleryItems = usingFallback
    ? FALLBACK_STICKERS.map((s, i) => ({
        id: s.slug,
        slug: s.slug,
        title: s.title,
        priceCents: s.priceCents,
        previewUrl: s.previewSvg,
        artistUsername: s.artist,
        licenseType: "USAGE" as const,
        saleMode: "FIXED" as const,
        currentBidCents: null,
        startBidCents: null
      }))
    : data.stickers.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        priceCents: s.priceCents,
        previewUrl: s.previewUrl,
        artistUsername: s.artist.username,
        licenseType: s.licenseType,
        saleMode: s.saleMode,
        currentBidCents: s.currentBidCents,
        startBidCents: s.startBidCents
      }));

  return (
    <>
      {/* HERO */}
      <section className="relative px-6 md:px-12 pt-24 pb-32 min-h-[90vh] flex flex-col justify-center overflow-hidden">
        <FloatingStickers />

        <div className="font-mono text-[0.85rem] uppercase tracking-[0.2em] mb-8 flex items-center gap-3 relative z-[2]">
          <span className="w-10 h-0.5 bg-ink" />
          MARKETPLACE DE STICKERS · LIMA, PE
        </div>

        <h1 className="font-display text-[clamp(4rem,14vw,11rem)] leading-[0.85] tracking-[-0.04em] mb-4 relative z-[2]">
          <span className="text-tomato inline-block -rotate-3">PE</span>
          <span className="text-blue inline-block">GO</span>
          <span className="text-mustard inline-block rotate-2">TE</span>
        </h1>

        <p className="font-serif italic text-xl md:text-2xl max-w-xl mt-8 mb-12 leading-snug relative z-[2]">
          Arte ilustrado por artistas peruanos con un{" "}
          <strong className="not-italic font-black bg-mustard px-2 border-2 border-ink inline-block -rotate-1">
            toque payaso
          </strong>
          . Tú lo encuentras, tú te lo pegas. Cada descarga apoya a un artista real.
        </p>

        <div className="flex gap-4 flex-wrap relative z-[2]">
          <Link
            href="/galeria"
            className="font-display px-8 py-4 text-base border-2 border-ink bg-tomato text-paper shadow-ink inline-flex items-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-lg transition-all"
          >
            Ver stickers →
          </Link>
          <Link
            href="/vender"
            className="font-display px-8 py-4 text-base border-2 border-ink bg-paper shadow-blue inline-flex items-center gap-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--blue)] transition-all"
          >
            Soy artista
          </Link>
        </div>
      </section>

      {/* STATS */}
      <div className="bg-ink text-paper px-6 md:px-12 py-8 flex flex-wrap justify-around gap-8 border-y-2 border-ink">
        {[
          { num: data.artists || 237, label: "Artistas", color: "text-mustard" },
          { num: data.totalStickers || 1400, label: "Stickers", color: "text-tomato" },
          { num: data.downloads || 12000, label: "Descargas", color: "text-mint" },
          { num: "100%", label: "Original", color: "text-pink" }
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <div className={`font-display text-4xl ${s.color}`}>
              {typeof s.num === "number" ? formatNumber(s.num) : s.num}
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.15em] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* GALLERY */}
      <section id="galeria" className="px-6 md:px-12 py-24">
        <div className="mb-16 flex flex-wrap justify-between items-end gap-8">
          <div>
            <span className="font-mono text-[0.8rem] uppercase tracking-[0.2em] bg-ink text-paper px-3 py-1 inline-block mb-4 -rotate-2">
              ★ Lo más pegado
            </span>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tight max-w-3xl">
              Stickers <em className="not-italic text-tomato hl-mustard">chistosos</em>
              <br />
              que sí valen la pena.
            </h2>
          </div>
          <p className="font-serif italic text-lg max-w-sm leading-relaxed">
            Curado a mano por nosotros. Cada sticker es de un artista verificado y la
            autoría sigue siendo suya.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
          {galleryItems.map((s, i) => (
            <StickerCard
              key={s.id}
              id={s.id}
              slug={s.slug}
              title={s.title}
              priceCents={s.priceCents}
              previewUrl={s.previewUrl}
              artistUsername={s.artistUsername}
              licenseType={s.licenseType}
              saleMode={s.saleMode}
              currentBidCents={s.currentBidCents}
              startBidCents={s.startBidCents}
              index={i}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/galeria"
            className="font-display inline-block px-8 py-4 border-2 border-ink bg-paper shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-lg transition-all"
          >
            Ver toda la galería →
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS — texto fiel a pegote.html */}
      <section id="como" className="bg-ink text-paper px-6 md:px-12 py-24 relative overflow-hidden zigzag-top">
        <div className="mb-16">
          <span className="font-mono text-[0.8rem] uppercase tracking-[0.2em] bg-mustard text-ink px-3 py-1 inline-block mb-4 -rotate-2">
            → Cómo funciona
          </span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tight max-w-3xl">
            Tres pasos. <em className="not-italic text-tomato hl-mustard hl-violet">Cero drama.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          {[
            {
              n: "01",
              h: "Explora la galería",
              p: "Filtra por estilo, color o artista. Vas a encontrar desde caritas raras hasta animales con problemas.",
              c: "text-mustard"
            },
            {
              n: "02",
              h: "Compra al toque",
              p: "Yape, Plin, tarjeta. Pagas y al instante te llega el archivo en alta resolución a tu correo.",
              c: "text-mint"
            },
            {
              n: "03",
              h: "El crédito queda",
              p: "Cada sticker mantiene la autoría del artista original. Tú lo descargas, ellos cobran su parte.",
              c: "text-pink"
            }
          ].map((step) => (
            <div key={step.n}>
              <div className={`font-display text-7xl leading-none mb-4 ${step.c}`}>{step.n}</div>
              <h3 className="font-display text-2xl mb-3">{step.h}</h3>
              <p className="font-serif text-lg leading-relaxed opacity-90">{step.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ARTIST CTA */}
      <section id="vender" className="bg-mustard border-y-2 border-ink px-6 md:px-12 py-24 relative overflow-hidden">
        <svg
          viewBox="0 0 200 200"
          className="absolute top-[8%] left-[4%] w-[90px] -rotate-[15deg] opacity-90 hidden md:block"
        >
          <circle cx="100" cy="100" r="80" fill="#264e8a" stroke="#1a1410" strokeWidth="6" />
          <circle cx="80" cy="90" r="10" fill="#fff" />
          <circle cx="120" cy="90" r="10" fill="#fff" />
          <circle cx="80" cy="90" r="5" fill="#1a1410" />
          <circle cx="120" cy="90" r="5" fill="#1a1410" />
          <path d="M 70 130 Q 100 150 130 130" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        </svg>
        <svg
          viewBox="0 0 200 200"
          className="absolute bottom-[10%] right-[5%] w-[110px] rotate-[20deg] opacity-90 hidden md:block"
        >
          <polygon
            points="100,20 130,80 195,80 145,120 165,180 100,145 35,180 55,120 5,80 70,80"
            fill="#e63946"
            stroke="#1a1410"
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </svg>

        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-7xl leading-[0.9] mb-6">
            Tu arte. <em className="not-italic text-tomato">Tu plata.</em>
            <br />
            Tu autoría.
          </h2>
          <p className="font-serif italic text-xl max-w-2xl mx-auto mb-12 leading-snug">
            Subes tus diseños, le ponemos vitrina, los clientes los descargan y tú te
            quedas con el <strong className="not-italic">70% de cada venta</strong>.
            Vendes a <strong className="not-italic">precio fijo</strong> o lo
            <strong className="not-italic"> subastas</strong> al mejor postor. Tú eliges
            qué se lleva el comprador.
          </p>
        </div>

        {/* LICENSE TYPES */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 relative z-[2]">
          <LicenseCard
            dot="🟢"
            title="Uso (no exclusivo)"
            body="Permites que varios compren el sticker para usarlo (personal o comercial según plan). Mantienes la autoría y puedes seguir vendiéndolo; nadie puede revenderlo."
            tint="bg-paper"
          />
          <LicenseCard
            dot="🔵"
            title="Uso exclusivo"
            body="Vendes el diseño a un solo comprador y dejas de ofrecerlo a otros. Mantienes la autoría, pero renuncias a futuras ventas de ese diseño."
            tint="bg-paper-2"
          />
          <LicenseCard
            dot="🔴"
            title="Transferencia total (premium)"
            body="Vendes los derechos económicos del diseño al comprador. El cliente puede usarlo, modificarlo y revenderlo; tú conservas el crédito como autor."
            tint="bg-paper"
          />
        </div>

        <div className="text-center mt-12 relative z-[2]">
          <Link
            href="/vender"
            className="font-display inline-block px-10 py-5 text-lg border-2 border-ink bg-ink text-paper shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--tomato)] transition-all"
          >
            Quiero vender →
          </Link>
        </div>
      </section>
    </>
  );
}

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toString();
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
      <div className="font-display text-2xl leading-tight mb-2">
        <span className="mr-1">{dot}</span> {title}
      </div>
      <p className="font-serif text-base leading-snug">{body}</p>
    </div>
  );
}
