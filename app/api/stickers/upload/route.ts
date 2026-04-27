import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
  const priceSoles = Number(form.get("price") || 0);
  const tags = String(form.get("tags") || "").trim();
  const file = form.get("file");

  if (!title || title.length > 60) {
    return NextResponse.json({ error: "Título inválido" }, { status: 400 });
  }
  if (!Number.isFinite(priceSoles) || priceSoles < 3 || priceSoles > 50) {
    return NextResponse.json({ error: "Precio fuera de rango (S/ 3 a S/ 50)" }, { status: 400 });
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

  // En esta implementación, el preview público y el archivo de descarga
  // son el mismo (uploads se sirven públicos por Next desde /public).
  // En prod se separan: preview en CDN, archivo detrás de signed URL.
  const url = `/uploads/${filename}`;

  const sticker = await prisma.sticker.create({
    data: {
      slug,
      title,
      description: description || null,
      priceCents: Math.round(priceSoles * 100),
      previewUrl: url,
      fileUrl: url,
      tags,
      published: true,
      artistId: me.id
    }
  });

  return NextResponse.json({ ok: true, slug: sticker.slug, id: sticker.id });
}
