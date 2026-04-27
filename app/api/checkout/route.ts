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
 * Soporta:
 *  - Stickers con saleMode = FIXED → compra directa al precio listado.
 *  - Stickers con saleMode = AUCTION:
 *      * Antes del cierre: sólo "Comprar ya" (precio fijo > puja inicial).
 *      * Después del cierre: sólo el ganador de la puja puede pagar (al monto pujado).
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
    select: {
      id: true,
      priceCents: true,
      artistId: true,
      published: true,
      saleMode: true,
      auctionEndsAt: true,
      startBidCents: true,
      currentBidCents: true,
      currentBidderId: true
    }
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

  let totalCents = sticker.priceCents;

  if (sticker.saleMode === "AUCTION") {
    const ended = sticker.auctionEndsAt && sticker.auctionEndsAt.getTime() <= Date.now();
    if (!ended) {
      // Antes del cierre, sólo "Comprar ya": exige precio mayor a puja inicial
      // y mayor a la puja actual (si existe).
      if (sticker.priceCents <= (sticker.startBidCents ?? 0)) {
        return NextResponse.json(
          { error: "Esta subasta no tiene Comprar ya. Tienes que pujar." },
          { status: 400 }
        );
      }
      if (sticker.currentBidCents && sticker.priceCents <= sticker.currentBidCents) {
        return NextResponse.json(
          { error: "La puja actual ya supera el Comprar ya. Tienes que pujar." },
          { status: 400 }
        );
      }
      totalCents = sticker.priceCents;
    } else {
      // Subasta cerrada: sólo el ganador puede pagar.
      if (!sticker.currentBidderId || sticker.currentBidderId !== session.user.id) {
        return NextResponse.json(
          { error: "La subasta ya cerró. Sólo el ganador puede comprar." },
          { status: 403 }
        );
      }
      totalCents = sticker.currentBidCents ?? sticker.priceCents;
    }
  }

  const artistCut = Math.round(totalCents * 0.7);
  const platformCut = totalCents - artistCut;
  const paymentRef = `dev_${randomBytes(6).toString("hex")}`;

  const order = await prisma.order.create({
    data: {
      buyerId: session.user.id,
      totalCents,
      status: "paid",
      paymentRef,
      items: {
        create: {
          stickerId: sticker.id,
          priceCents: totalCents,
          artistCut,
          platformCut
        }
      }
    },
    select: { id: true }
  });

  return NextResponse.json({ ok: true, orderId: order.id, paymentRef });
}
