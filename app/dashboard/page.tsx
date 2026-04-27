import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?from=/dashboard");

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      stickers: { orderBy: { createdAt: "desc" } },
      orders: {
        include: { items: { include: { sticker: true } } },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!me) redirect("/login");
  if (!me.username) redirect("/onboarding");

  // Ventas como artista
  const sales = me.isArtist
    ? await prisma.orderItem.findMany({
        where: { sticker: { artistId: me.id } },
        include: { sticker: true, order: true },
        orderBy: { order: { createdAt: "desc" } }
      })
    : [];
  const totalEarnings = sales.reduce((sum, s) => sum + s.artistCut, 0);

  return (
    <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
      <div className="bg-mustard border-2 border-ink p-8 shadow-ink mb-12">
        <div className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">Hola</div>
        <h1 className="font-display text-4xl md:text-5xl leading-none mt-1">
          @ {me.username}
        </h1>
        <p className="font-serif italic mt-3">
          {me.isArtist ? "Tu estudio de artista en PEGOTE." : "Tu cuenta en PEGOTE."}
        </p>
      </div>

      {me.isArtist && (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Stat label="Stickers publicados" value={me.stickers.length} color="text-tomato" />
            <Stat label="Ventas totales" value={sales.length} color="text-mint" />
            <Stat
              label="Ganado (S/)"
              value={(totalEarnings / 100).toFixed(2)}
              color="text-mustard"
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              href="/dashboard/upload"
              className="font-display px-6 py-3 border-2 border-ink bg-tomato text-paper shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              + Subir sticker
            </Link>
            <Link
              href="/dashboard/ventas"
              className="font-display px-6 py-3 border-2 border-ink bg-paper shadow-ink-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              Ver ventas
            </Link>
            {me.username && (
              <Link
                href={`/artista/${me.username}`}
                className="font-display px-6 py-3 border-2 border-ink bg-paper shadow-ink-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                Ver perfil público
              </Link>
            )}
          </div>

          <h2 className="font-display text-2xl mb-6">Tus stickers</h2>
          {me.stickers.length === 0 ? (
            <div className="border-2 border-dashed border-ink p-12 text-center font-serif italic">
              Todavía no subes nada. Empieza por aquí: <Link href="/dashboard/upload" className="underline">subir tu primer sticker</Link>.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {me.stickers.map((s) => (
                <Link
                  key={s.id}
                  href={`/sticker/${s.slug}`}
                  className="bg-paper-2 border-2 border-ink p-3 shadow-ink-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <div className="bg-paper border-2 border-dashed border-ink aspect-square p-2 mb-2 flex items-center justify-center">
                    {s.previewUrl.trim().startsWith("<svg") ? (
                      <div
                        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: s.previewUrl }}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.previewUrl} alt={s.title} className="w-full h-full object-contain" />
                    )}
                  </div>
                  <div className="font-display text-sm uppercase">{s.title}</div>
                  <div className="font-mono text-xs opacity-70 mt-1">
                    S/ {(s.priceCents / 100).toFixed(0)} · {s.published ? "Publicado" : "Borrador"}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <h2 className="font-display text-2xl mb-6 mt-16">Tus compras</h2>
      {me.orders.length === 0 ? (
        <div className="border-2 border-dashed border-ink p-12 text-center font-serif italic">
          Aún no compraste nada. <Link href="/galeria" className="underline">Mira la galería</Link>.
        </div>
      ) : (
        <div className="space-y-4">
          {me.orders.flatMap((o) =>
            o.items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-4 border-2 border-ink p-4 bg-paper-2"
              >
                <div className="w-16 h-16 bg-paper border-2 border-dashed border-ink p-1 flex items-center justify-center">
                  {it.sticker.previewUrl.trim().startsWith("<svg") ? (
                    <div
                      className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: it.sticker.previewUrl }}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.sticker.previewUrl} alt={it.sticker.title} className="w-full h-full object-contain" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-display text-base uppercase">{it.sticker.title}</div>
                  <div className="font-mono text-xs opacity-70">
                    S/ {(it.priceCents / 100).toFixed(0)} ·{" "}
                    {new Date(o.createdAt).toLocaleDateString("es-PE")}
                  </div>
                </div>
                <a
                  href={`/api/download/${it.sticker.id}`}
                  className="font-display text-xs px-4 py-2 bg-mint border-2 border-ink shadow-ink-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  Descargar
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {!me.isArtist && (
        <div className="mt-16 bg-mustard border-2 border-ink p-8 shadow-ink">
          <h3 className="font-display text-2xl mb-2">¿También dibujas?</h3>
          <p className="font-serif italic mb-4">
            Activa tu estudio de artista y empieza a vender. Te quedas con el 70% de
            cada venta.
          </p>
          <Link
            href="/onboarding"
            className="font-display inline-block px-6 py-3 border-2 border-ink bg-ink text-paper shadow-tomato hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            Activar perfil de artista →
          </Link>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="border-2 border-ink p-6 bg-paper-2 shadow-ink-sm">
      <div className={`font-display text-4xl ${color}`}>{value}</div>
      <div className="font-mono text-xs uppercase tracking-[0.15em] mt-1 opacity-70">{label}</div>
    </div>
  );
}
