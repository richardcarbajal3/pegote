import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { BuyButton } from "./BuyButton";
import { BidPanel } from "./BidPanel";
import { LICENSES, isLicenseType } from "@/lib/licenses";

type Props = { params: { id: string } };

export default async function StickerPage({ params }: Props) {
  let sticker;
  try {
    sticker = await prisma.sticker.findFirst({
      where: { OR: [{ slug: params.id }, { id: params.id }], published: true },
      include: { artist: true }
    });
  } catch {
    sticker = null;
  }

  if (!sticker) notFound();

  const session = await auth();

  // ¿Ya lo compró?
  let alreadyOwned = false;
  if (session?.user?.id) {
    const own = await prisma.orderItem.findFirst({
      where: { stickerId: sticker.id, order: { buyerId: session.user.id, status: "paid" } }
    });
    alreadyOwned = !!own;
  }

  const price = (sticker.priceCents / 100).toFixed(0);
  const license = isLicenseType(sticker.licenseType) ? LICENSES[sticker.licenseType] : LICENSES.USAGE;
  const isAuction = sticker.saleMode === "AUCTION";
  const auctionClosed = isAuction && sticker.auctionEndsAt
    ? sticker.auctionEndsAt.getTime() <= Date.now()
    : false;
  const isOwn = session?.user?.id === sticker.artistId;

  return (
    <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
      <Link href="/galeria" className="font-mono text-xs uppercase tracking-[0.15em] opacity-60 hover:opacity-100">
        ← Volver a la galería
      </Link>

      <div className="grid md:grid-cols-2 gap-12 mt-8">
        <div className="bg-paper-2 border-2 border-ink p-10 shadow-ink">
          <div className="bg-paper border-2 border-dashed border-ink aspect-square flex items-center justify-center p-8">
            {sticker.previewUrl.trim().startsWith("<svg") ? (
              <div
                className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: sticker.previewUrl }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sticker.previewUrl} alt={sticker.title} className="w-full h-full object-contain" />
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-mono text-xs uppercase tracking-[0.15em] opacity-60">
              Sticker · {sticker.tags || "sin categoría"}
            </span>
            <span
              className={`font-mono text-[0.7rem] uppercase tracking-[0.15em] border-2 border-ink px-2 py-0.5 ${license.chipBg} ${license.chipText}`}
              title={license.body}
            >
              {license.dot} {license.short}
            </span>
            {isAuction && (
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] border-2 border-ink px-2 py-0.5 bg-mustard text-ink">
                ⏱ Subasta
              </span>
            )}
          </div>

          <h1 className="font-display text-5xl md:text-6xl mt-2 leading-none uppercase">{sticker.title}</h1>

          <Link
            href={sticker.artist.username ? `/artista/${sticker.artist.username}` : "#"}
            className="font-mono text-sm uppercase tracking-wider mt-4 inline-block hover:text-tomato"
          >
            @ {sticker.artist.username ?? "anónimo"}
          </Link>

          {sticker.description && (
            <p className="font-serif text-lg mt-6 leading-relaxed">{sticker.description}</p>
          )}

          {!isAuction && (
            <div className="bg-ink text-paper inline-block font-display text-3xl px-5 py-2 rotate-1 mt-8">
              S/ {price}
            </div>
          )}

          {isAuction && sticker.auctionEndsAt && (
            <div className="mt-8">
              <BidPanel
                slug={sticker.slug}
                startBidCents={sticker.startBidCents ?? sticker.priceCents}
                currentBidCents={sticker.currentBidCents}
                auctionEndsAt={sticker.auctionEndsAt.toISOString()}
                authed={!!session?.user}
                isOwn={isOwn}
              />
              {sticker.priceCents > (sticker.startBidCents ?? 0) && !auctionClosed && (
                <div className="mt-4 font-mono text-xs uppercase tracking-[0.12em] opacity-70">
                  Comprar ya disponible por <span className="font-display text-base">S/ {price}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            {alreadyOwned ? (
              <a
                href={`/api/download/${sticker.id}`}
                className="font-display px-8 py-4 border-2 border-ink bg-mint shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-lg transition-all"
              >
                Descargar archivo →
              </a>
            ) : session?.user ? (
              isAuction && !auctionClosed && sticker.priceCents <= (sticker.startBidCents ?? 0) ? null : isAuction && auctionClosed ? (
                <span className="font-mono text-xs uppercase tracking-[0.12em] opacity-70">
                  Subasta finalizada
                </span>
              ) : (
                <BuyButton stickerId={sticker.id} />
              )
            ) : (
              <Link
                href={`/login?from=/sticker/${sticker.slug}`}
                className="font-display px-8 py-4 border-2 border-ink bg-tomato text-paper shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-lg transition-all"
              >
                Entra con Google para {isAuction ? "pujar" : "comprar"}
              </Link>
            )}
          </div>

          <div className="mt-10 border-t-2 border-dashed border-ink pt-6 font-serif italic text-sm leading-relaxed opacity-80">
            <strong className="not-italic">{license.dot} {license.label}.</strong> {license.body} La autoría
            y el crédito siguen siendo de <strong className="not-italic">@{sticker.artist.username}</strong>.
          </div>
        </div>
      </div>
    </section>
  );
}
