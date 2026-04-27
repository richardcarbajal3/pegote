import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Checkout simulado. En prod aquí entran:
 *  - Stripe / Culqi para tarjeta
 *  - Yape API para Yape
 *  - Webhook de confirmación que cambie status: pending → paid
 *
 * Por ahora creamos la orden directamente como `paid` y devolvemos
 * la referencia. Suficiente para que el botón "Comprar" tenga vida real.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const stickerId: string | undefined = body.stickerId;
  if (!stickerId) {
    return NextResponse.json({ error: "Falta stickerId" }, { status: 400 });
  }

  const sticker = await prisma.sticker.findUnique({
    where: { id: stickerId },
    select: { id: true, priceCents: true, artistId: true, published: true }
  });
  if (!sticker || !sticker.published) {
    return NextResponse.json({ error: "Sticker no disponible" }, { status: 404 });
  }
  if (sticker.artistId === session.user.id) {
    return NextResponse.json({ error: "No puedes comprar tu propio sticker" }, { status: 400 });
  }

  // ¿Ya lo tiene?
  const owned = await prisma.orderItem.findFirst({
    where: { stickerId, order: { buyerId: session.user.id, status: "paid" } }
  });
  if (owned) {
    return NextResponse.json({ ok: true, alreadyOwned: true });
  }

  const artistCut = Math.round(sticker.priceCents * 0.7);
  const platformCut = sticker.priceCents - artistCut;
  const paymentRef = `dev_${randomBytes(6).toString("hex")}`;

  const order = await prisma.order.create({
    data: {
      buyerId: session.user.id,
      totalCents: sticker.priceCents,
      status: "paid",
      paymentRef,
      items: {
        create: {
          stickerId: sticker.id,
          priceCents: sticker.priceCents,
          artistCut,
          platformCut
        }
      }
    },
    select: { id: true }
  });

  return NextResponse.json({ ok: true, orderId: order.id, paymentRef });
}
