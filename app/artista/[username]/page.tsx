import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StickerCard } from "@/app/components/StickerCard";

type Props = { params: { username: string } };

export default async function ArtistPage({ params }: Props) {
  let artist;
  try {
    artist = await prisma.user.findUnique({
      where: { username: params.username },
      include: {
        stickers: {
          where: { published: true },
          orderBy: { createdAt: "desc" },
          include: { artist: { select: { username: true } } }
        }
      }
    });
  } catch {
    artist = null;
  }

  if (!artist || !artist.isArtist) notFound();

  return (
    <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
      <div className="bg-mustard border-2 border-ink p-10 shadow-ink relative overflow-hidden">
        <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-60">Artista</span>
        <h1 className="font-display text-5xl md:text-7xl leading-none uppercase mt-2">
          @ {artist.username}
        </h1>
        {artist.name && (
          <p className="font-serif italic text-xl mt-2">{artist.name}</p>
        )}
        {artist.bio && (
          <p className="font-serif text-lg mt-6 max-w-2xl leading-relaxed">{artist.bio}</p>
        )}
        <div className="mt-6 font-mono text-sm">
          {artist.stickers.length} {artist.stickers.length === 1 ? "sticker" : "stickers"} publicados
        </div>
      </div>

      <div className="mt-16">
        {artist.stickers.length === 0 ? (
          <div className="border-2 border-dashed border-ink p-12 text-center font-serif italic">
            Este artista todavía no publica nada.
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
            {artist.stickers.map((s, i) => (
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
      </div>
    </section>
  );
}
