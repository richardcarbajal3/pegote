import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Pujar en una subasta. La nueva puja debe superar la actual (o la inicial si no
 * hay pujas todavía) en al menos 1 sol. La subasta debe estar activa.
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const amountSoles = Number(body.amount);
  if (!Number.isFinite(amountSoles) || amountSoles <= 0) {
    return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
  }
  const amountCents = Math.round(amountSoles * 100);

  const sticker = await prisma.sticker.findFirst({
    where: { OR: [{ slug: params.id }, { id: params.id }], published: true },
    select: {
      id: true,
      artistId: true,
      saleMode: true,
      auctionEndsAt: true,
      startBidCents: true,
      currentBidCents: true
    }
  });
  if (!sticker) {
    return NextResponse.json({ error: "Sticker no encontrado" }, { status: 404 });
  }
  if (sticker.saleMode !== "AUCTION") {
    return NextResponse.json({ error: "Este sticker no está en subasta" }, { status: 400 });
  }
  if (!sticker.auctionEndsAt || sticker.auctionEndsAt.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Subasta cerrada" }, { status: 400 });
  }
  if (sticker.artistId === session.user.id) {
    return NextResponse.json({ error: "No puedes pujar en tu propio sticker" }, { status: 400 });
  }

  const minimum = (sticker.currentBidCents ?? sticker.startBidCents ?? 0) + 100;
  if (amountCents < minimum) {
    return NextResponse.json(
      { error: `La puja debe ser de al menos S/ ${(minimum / 100).toFixed(0)}` },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.bid.create({
      data: {
        stickerId: sticker.id,
        bidderId: session.user.id,
        amountCents
      }
    }),
    prisma.sticker.update({
      where: { id: sticker.id },
      data: {
        currentBidCents: amountCents,
        currentBidderId: session.user.id
      }
    })
  ]);

  return NextResponse.json({ ok: true, currentBidCents: amountCents });
}
