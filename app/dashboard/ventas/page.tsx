import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function VentasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?from=/dashboard/ventas");

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, isArtist: true, username: true }
  });
  if (!me?.isArtist) redirect("/dashboard");

  const sales = await prisma.orderItem.findMany({
    where: { sticker: { artistId: me.id } },
    include: { sticker: true, order: { include: { buyer: { select: { username: true, name: true } } } } },
    orderBy: { order: { createdAt: "desc" } }
  });

  const total = sales.reduce((s, x) => s + x.artistCut, 0);

  return (
    <section className="px-6 md:px-12 py-16 max-w-5xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl leading-[0.9] mb-2">
        Ventas
      </h1>
      <p className="font-serif italic text-lg mb-10">
        Cada compra que cae en tus stickers, con el corte que te toca.
      </p>

      <div className="bg-mustard border-2 border-ink p-6 shadow-ink mb-10">
        <div className="font-mono text-xs uppercase tracking-[0.15em]">Ganado total</div>
        <div className="font-display text-5xl mt-1">S/ {(total / 100).toFixed(2)}</div>
      </div>

      {sales.length === 0 ? (
        <div className="border-2 border-dashed border-ink p-12 text-center font-serif italic">
          Todavía no hay ventas. Paciencia, ya van a llegar.
        </div>
      ) : (
        <div className="border-2 border-ink overflow-hidden">
          <table className="w-full font-mono text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="text-left p-3">Sticker</th>
                <th className="text-left p-3">Comprador</th>
                <th className="text-right p-3">Precio</th>
                <th className="text-right p-3">Tu corte</th>
                <th className="text-left p-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-t border-ink/20 even:bg-paper-2">
                  <td className="p-3">{s.sticker.title}</td>
                  <td className="p-3 opacity-70">@{s.order.buyer.username || "anon"}</td>
                  <td className="p-3 text-right">S/ {(s.priceCents / 100).toFixed(2)}</td>
                  <td className="p-3 text-right text-mint font-bold">
                    S/ {(s.artistCut / 100).toFixed(2)}
                  </td>
                  <td className="p-3 opacity-70">
                    {new Date(s.order.createdAt).toLocaleDateString("es-PE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
