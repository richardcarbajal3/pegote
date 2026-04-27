import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isLicenseType, isSaleMode } from "@/lib/licenses";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/svg+xml"]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, isArtist: true, username: true }
  });
  if (!me?.isArtist || !me.username) {
    return NextResponse.json({ error: "Necesitas un perfil de artista" }, { status: 403 });
  }

  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const description = String(form.get("description") || "").trim();
  const priceSolesRaw = form.get("price");
  const tags = String(form.get("tags") || "").trim();
  const file = form.get("file");
  const saleModeInput = String(form.get("saleMode") || "FIXED");
  const licenseInput = String(form.get("licenseType") || "USAGE");
  const startBidRaw = form.get("startBid");
  const auctionEndsAtRaw = String(form.get("auctionEndsAt") || "").trim();

  if (!title || title.length > 60) {
    return NextResponse.json({ error: "Título inválido" }, { status: 400 });
  }
  if (!isSaleMode(saleModeInput)) {
    return NextResponse.json({ error: "Modo de venta inválido" }, { status: 400 });
  }
  if (!isLicenseType(licenseInput)) {
    return NextResponse.json({ error: "Licencia inválida" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Solo PNG o SVG" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Archivo > 5MB" }, { status: 400 });
  }

  // Validación según modo
  let priceCents = 0;
  let startBidCents: number | null = null;
  let auctionEndsAt: Date | null = null;

  if (saleModeInput === "FIXED") {
    const priceSoles = Number(priceSolesRaw || 0);
    if (!Number.isFinite(priceSoles) || priceSoles < 3 || priceSoles > 50) {
      return NextResponse.json({ error: "Precio fuera de rango (S/ 3 a S/ 50)" }, { status: 400 });
    }
    priceCents = Math.round(priceSoles * 100);
  } else {
    const startBid = Number(startBidRaw || 0);
    if (!Number.isFinite(startBid) || startBid < 3 || startBid > 500) {
      return NextResponse.json({ error: "Puja inicial fuera de rango (S/ 3 a S/ 500)" }, { status: 400 });
    }
    startBidCents = Math.round(startBid * 100);

    // "Comprar ya" opcional
    const buyNow = Number(priceSolesRaw || 0);
    if (priceSolesRaw && Number.isFinite(buyNow) && buyNow > 0) {
      if (buyNow < startBid || buyNow > 500) {
        return NextResponse.json({ error: "Comprar ya debe ser ≥ puja inicial y ≤ S/ 500" }, { status: 400 });
      }
      priceCents = Math.round(buyNow * 100);
    } else {
      priceCents = startBidCents;
    }

    if (!auctionEndsAtRaw) {
      return NextResponse.json({ error: "Falta la fecha de cierre de subasta" }, { status: 400 });
    }
    const parsed = new Date(auctionEndsAtRaw);
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Fecha de cierre inválida" }, { status: 400 });
    }
    const minEnd = Date.now() + 30 * 60 * 1000; // mínimo 30 min en el futuro
    if (parsed.getTime() < minEnd) {
      return NextResponse.json({ error: "La subasta debe cerrar al menos en 30 minutos" }, { status: 400 });
    }
    auctionEndsAt = parsed;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/svg+xml" ? "svg" : "png";
  const id = randomBytes(8).toString("hex");
  const filename = `${id}.${ext}`;

  const uploadsDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(join(uploadsDir, filename), buffer);

  // Slug a partir del título
  const baseSlug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const slug = `${baseSlug}-${id.slice(0, 4)}`;

  const url = `/uploads/${filename}`;

  const sticker = await prisma.sticker.create({
    data: {
      slug,
      title,
      description: description || null,
      priceCents,
      previewUrl: url,
      fileUrl: url,
      tags,
      published: true,
      artistId: me.id,
      licenseType: licenseInput,
      saleMode: saleModeInput,
      auctionEndsAt,
      startBidCents
    }
  });

  return NextResponse.json({ ok: true, slug: sticker.slug, id: sticker.id });
}
