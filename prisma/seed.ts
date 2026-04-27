/**
 * Seed: crea los 8 artistas del modelo + sus stickers correspondientes.
 * Idempotente: usa `upsert` por email/slug.
 */
import { PrismaClient } from "@prisma/client";
import { FALLBACK_STICKERS } from "../lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("→ Seedeando artistas y stickers del modelo...");

  for (const data of FALLBACK_STICKERS) {
    const artist = await prisma.user.upsert({
      where: { email: data.artistEmail },
      update: {
        username: data.artist,
        name: data.artistName,
        isArtist: true
      },
      create: {
        email: data.artistEmail,
        username: data.artist,
        name: data.artistName,
        isArtist: true,
        bio: `Artista de PEGOTE. Conocido por "${data.title}".`
      }
    });

    await prisma.sticker.upsert({
      where: { slug: data.slug },
      update: {
        title: data.title,
        description: data.description,
        priceCents: data.priceCents,
        previewUrl: data.previewSvg,
        fileUrl: data.previewSvg,
        tags: data.tags,
        published: true,
        artistId: artist.id
      },
      create: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        priceCents: data.priceCents,
        previewUrl: data.previewSvg,
        fileUrl: data.previewSvg,
        tags: data.tags,
        published: true,
        artistId: artist.id
      }
    });

    console.log(`  ✓ @${data.artist} → ${data.title}`);
  }

  console.log(`\n→ Listo. ${FALLBACK_STICKERS.length} stickers cargados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
