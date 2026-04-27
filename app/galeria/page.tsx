import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { StickerCard } from "../components/StickerCard";

export const revalidate = 30;

type SearchParams = { q?: string; tag?: string };

type StickerWithArtist = Prisma.StickerGetPayload<{
  include: { artist: { select: { username: true } } };
}>;

export default async function GaleriaPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const q = searchParams.q?.trim() ?? "";
  const tag = searchParams.tag?.trim() ?? "";

  let stickers: StickerWithArtist[] = [];
  try {
    stickers = await prisma.sticker.findMany({
      where: {
        published: true,
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { tags: { contains: q, mode: "insensitive" } }
              ]
            }
          : {}),
        ...(tag ? { tags: { contains: tag, mode: "insensitive" } } : {})
      },
      include: { artist: { select: { username: true } } },
      orderBy: { createdAt: "desc" }
    });
  } catch {
    stickers = [];
  }

  return (
    <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="font-mono text-[0.8rem] uppercase tracking-[0.2em] bg-ink text-paper px-3 py-1 inline-block mb-4 -rotate-2">
          ★ La galería entera
        </span>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.9] tracking-tight mb-6">
          Pega lo que <em className="not-italic text-tomato hl-mustard">te gusta.</em>
        </h1>

        <form className="flex flex-wrap gap-3 mt-8">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar sticker, artista, tag..."
            className="font-mono text-sm bg-paper-2 border-2 border-ink px-4 py-3 flex-1 min-w-[260px] shadow-ink-sm focus:outline-none focus:shadow-[6px_6px_0_var(--tomato)]"
          />
          <button
            type="submit"
            className="font-display text-sm bg-ink text-paper border-2 border-ink px-6 py-3 shadow-tomato hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            Buscar →
          </button>
        </form>
      </div>

      {stickers.length === 0 ? (
        <div className="border-2 border-dashed border-ink p-16 text-center font-serif italic text-lg">
          {q ? `Nada para "${q}". Probá con otro término.` : "Galería vacía. Falta correr el seed."}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
          {stickers.map((s, i) => (
            <StickerCard
              key={s.id}
              id={s.id}
              slug={s.slug}
              title={s.title}
              priceCents={s.priceCents}
              previewUrl={s.previewUrl}
              artistUsername={s.artist.username}
              licenseType={s.licenseType}
              saleMode={s.saleMode}
              currentBidCents={s.currentBidCents}
              startBidCents={s.startBidCents}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  );
}
