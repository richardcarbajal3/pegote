import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Sirve el archivo de descarga de un sticker comprado.
 *  - Verifica que el usuario lo haya comprado (o sea el artista).
 *  - Si fileUrl es un SVG inline (modo seed), lo devuelve como SVG.
 *  - Si fileUrl es `/uploads/...`, lee del disco y stream-ea.
 */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const sticker = await prisma.sticker.findUnique({
    where: { id: params.id },
    select: { id: true, slug: true, fileUrl: true, artistId: true }
  });
  if (!sticker) {
    return NextResponse.json({ error: "No existe" }, { status: 404 });
  }

  // Permitido si: es el artista O lo compró
  const isArtist = sticker.artistId === session.user.id;
  const owned = !isArtist
    ? await prisma.orderItem.findFirst({
        where: { stickerId: sticker.id, order: { buyerId: session.user.id, status: "paid" } }
      })
    : null;

  if (!isArtist && !owned) {
    return NextResponse.json({ error: "Tienes que comprarlo primero" }, { status: 403 });
  }

  // Caso 1: SVG inline (datos de seed)
  if (sticker.fileUrl.trim().startsWith("<svg")) {
    return new NextResponse(sticker.fileUrl, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": `attachment; filename="${sticker.slug}.svg"`,
        "Cache-Control": "private, no-store"
      }
    });
  }

  // Caso 2: archivo en /public/uploads
  if (sticker.fileUrl.startsWith("/uploads/")) {
    const path = join(process.cwd(), "public", sticker.fileUrl);
    try {
      const buf = await readFile(path);
      const ext = sticker.fileUrl.split(".").pop()?.toLowerCase();
      const mime = ext === "svg" ? "image/svg+xml" : ext === "png" ? "image/png" : "application/octet-stream";
      return new NextResponse(buf, {
        headers: {
          "Content-Type": mime,
          "Content-Disposition": `attachment; filename="${sticker.slug}.${ext}"`,
          "Cache-Control": "private, no-store"
        }
      });
    } catch {
      return NextResponse.json({ error: "Archivo no encontrado en disco" }, { status: 404 });
    }
  }

  // Caso 3: URL externa (S3/CDN) — redirigir
  return NextResponse.redirect(sticker.fileUrl, 302);
}
