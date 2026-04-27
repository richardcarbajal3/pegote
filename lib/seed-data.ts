/**
 * Los 8 stickers del modelo `pegote.html`. Sirven como:
 *  - Fallback visual cuando la DB está vacía (landing).
 *  - Datos iniciales del seed (`prisma/seed.ts`).
 */
export type FallbackSticker = {
  slug: string;
  title: string;
  priceCents: number;
  artist: string;
  artistName: string;
  artistEmail: string;
  description: string;
  tags: string;
  previewSvg: string;
};

export const FALLBACK_STICKERS: FallbackSticker[] = [
  {
    slug: "payaso-triste",
    title: "PAYASO TRISTE",
    priceCents: 800,
    artist: "milagros.draws",
    artistName: "Milagros C.",
    artistEmail: "milagros.draws@example.com",
    description: "Un payaso melancólico para los días grises.",
    tags: "payaso,triste,retro",
    previewSvg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="105" r="75" fill="#fff" stroke="#1a1410" stroke-width="5"/><path d="M 30 80 Q 50 30 100 50 Q 150 30 170 80" fill="#e63946" stroke="#1a1410" stroke-width="5" stroke-linejoin="round"/><circle cx="80" cy="95" r="8" fill="#1a1410"/><circle cx="120" cy="95" r="8" fill="#1a1410"/><circle cx="100" cy="120" r="14" fill="#e63946" stroke="#1a1410" stroke-width="4"/><path d="M 70 150 Q 100 135 130 150" fill="none" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/><path d="M 75 75 L 85 70 M 115 70 L 125 75" stroke="#1a1410" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="105" r="3" fill="#264e8a"/><circle cx="120" cy="105" r="3" fill="#264e8a"/></svg>`
  },
  {
    slug: "sol-aburrido",
    title: "SOL ABURRIDO",
    priceCents: 600,
    artist: "jorgevera.ux",
    artistName: "Jorge V.",
    artistEmail: "jorgevera.ux@example.com",
    description: "El sol cuando ya no le emociona salir.",
    tags: "sol,aburrido,minimal",
    previewSvg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g><polygon points="100,20 105,40 95,40" fill="#f4a261" stroke="#1a1410" stroke-width="3"/><polygon points="100,180 105,160 95,160" fill="#f4a261" stroke="#1a1410" stroke-width="3"/><polygon points="20,100 40,95 40,105" fill="#f4a261" stroke="#1a1410" stroke-width="3"/><polygon points="180,100 160,95 160,105" fill="#f4a261" stroke="#1a1410" stroke-width="3"/><polygon points="40,40 55,50 50,55" fill="#f4a261" stroke="#1a1410" stroke-width="3"/><polygon points="160,40 145,50 150,55" fill="#f4a261" stroke="#1a1410" stroke-width="3"/><polygon points="40,160 55,150 50,145" fill="#f4a261" stroke="#1a1410" stroke-width="3"/><polygon points="160,160 145,150 150,145" fill="#f4a261" stroke="#1a1410" stroke-width="3"/></g><circle cx="100" cy="100" r="55" fill="#f4a261" stroke="#1a1410" stroke-width="5"/><path d="M 75 90 L 90 90" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/><path d="M 110 90 L 125 90" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/><path d="M 80 115 Q 100 105 120 115" fill="none" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/></svg>`
  },
  {
    slug: "ojo-metido",
    title: "OJO METIDO",
    priceCents: 700,
    artist: "kana.ilustra",
    artistName: "Kana I.",
    artistEmail: "kana.ilustra@example.com",
    description: "El ojo que todo lo ve. Y comenta.",
    tags: "ojo,místico,verde",
    previewSvg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="100" rx="80" ry="55" fill="#fff" stroke="#1a1410" stroke-width="5"/><circle cx="100" cy="100" r="38" fill="#06b894" stroke="#1a1410" stroke-width="4"/><circle cx="100" cy="100" r="20" fill="#1a1410"/><circle cx="108" cy="92" r="6" fill="#fff"/><path d="M 30 80 Q 60 60 100 60" fill="none" stroke="#1a1410" stroke-width="3"/><path d="M 100 60 Q 140 60 170 80" fill="none" stroke="#1a1410" stroke-width="3"/><path d="M 50 50 L 60 65 M 80 40 L 85 60 M 120 40 L 115 60 M 150 50 L 140 65" stroke="#1a1410" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  {
    slug: "xp-carita",
    title: "XP CARITA",
    priceCents: 600,
    artist: "pacobravo",
    artistName: "Paco B.",
    artistEmail: "pacobravo@example.com",
    description: "Lengua afuera, hígado por fuera.",
    tags: "carita,lengua,xp",
    previewSvg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="95" r="70" fill="#f4a261" stroke="#1a1410" stroke-width="5"/><path d="M 65 80 L 80 90 M 80 80 L 65 90" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/><path d="M 120 80 L 135 90 M 135 80 L 120 90" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/><path d="M 60 115 Q 100 145 140 115 L 130 145 Q 100 165 70 145 Z" fill="#1a1410"/><path d="M 85 130 Q 100 155 115 145 L 115 165 Q 100 175 90 165 Z" fill="#ff3d8b" stroke="#1a1410" stroke-width="3"/></svg>`
  },
  {
    slug: "buuuh-party",
    title: "BUUUH PARTY",
    priceCents: 900,
    artist: "noheart.studio",
    artistName: "Noheart Studio",
    artistEmail: "noheart.studio@example.com",
    description: "Fantasma fiestero con gorrito incluido.",
    tags: "fantasma,fiesta,halloween",
    previewSvg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M 50 90 Q 50 40 100 40 Q 150 40 150 90 L 150 165 L 130 150 L 110 165 L 90 150 L 70 165 L 50 150 Z" fill="#fff" stroke="#1a1410" stroke-width="5" stroke-linejoin="round"/><circle cx="80" cy="95" r="6" fill="#1a1410"/><circle cx="120" cy="95" r="6" fill="#1a1410"/><ellipse cx="100" cy="115" rx="10" ry="6" fill="#1a1410"/><polygon points="100,40 70,10 130,10" fill="#7e3bff" stroke="#1a1410" stroke-width="4" stroke-linejoin="round"/><circle cx="100" cy="10" r="6" fill="#f4a261" stroke="#1a1410" stroke-width="3"/><circle cx="65" cy="105" r="5" fill="#ff3d8b"/><circle cx="135" cy="105" r="5" fill="#ff3d8b"/></svg>`
  },
  {
    slug: "pato-diablo",
    title: "PATO DIABLO",
    priceCents: 800,
    artist: "limarosa.ilustra",
    artistName: "Lima Rosa",
    artistEmail: "limarosa.ilustra@example.com",
    description: "El pato que sabe lo que hizo.",
    tags: "pato,diablo,humor",
    previewSvg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="130" rx="60" ry="40" fill="#f4a261" stroke="#1a1410" stroke-width="5"/><circle cx="100" cy="80" r="40" fill="#f4a261" stroke="#1a1410" stroke-width="5"/><path d="M 75 85 L 130 85 Q 145 90 130 100 L 75 100 Z" fill="#e63946" stroke="#1a1410" stroke-width="4" stroke-linejoin="round"/><circle cx="90" cy="70" r="6" fill="#1a1410"/><polygon points="80,55 75,40 88,48" fill="#e63946" stroke="#1a1410" stroke-width="3" stroke-linejoin="round"/><polygon points="115,55 110,40 122,48" fill="#e63946" stroke="#1a1410" stroke-width="3" stroke-linejoin="round"/></svg>`
  },
  {
    slug: "estrella-timida",
    title: "ESTRELLA TÍMIDA",
    priceCents: 700,
    artist: "popoarte",
    artistName: "Popo Arte",
    artistEmail: "popoarte@example.com",
    description: "La estrella que aún no le quita los rosos.",
    tags: "estrella,rosa,kawaii",
    previewSvg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><polygon points="100,20 122,80 185,80 132,118 150,180 100,142 50,180 68,118 15,80 78,80" fill="#ff3d8b" stroke="#1a1410" stroke-width="5" stroke-linejoin="round"/><circle cx="85" cy="100" r="5" fill="#1a1410"/><circle cx="115" cy="100" r="5" fill="#1a1410"/><path d="M 80 120 Q 100 135 120 120" fill="none" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/><circle cx="75" cy="115" r="5" fill="#e63946" opacity="0.7"/><circle cx="125" cy="115" r="5" fill="#e63946" opacity="0.7"/></svg>`
  },
  {
    slug: "risa-infinita",
    title: "RISA INFINITA",
    priceCents: 600,
    artist: "karenchichi",
    artistName: "Karen Ch.",
    artistEmail: "karenchichi@example.com",
    description: "Esa risa que ya no para. Lágrimas incluidas.",
    tags: "risa,carita,clásico",
    previewSvg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="75" fill="#f4a261" stroke="#1a1410" stroke-width="5"/><path d="M 60 75 Q 70 60 80 75" fill="none" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/><path d="M 120 75 Q 130 60 140 75" fill="none" stroke="#1a1410" stroke-width="5" stroke-linecap="round"/><path d="M 55 110 Q 100 165 145 110 Q 130 145 100 145 Q 70 145 55 110 Z" fill="#1a1410"/><path d="M 80 130 Q 100 145 120 130" fill="#e63946"/><path d="M 60 90 Q 50 110 55 125" fill="none" stroke="#264e8a" stroke-width="4" stroke-linecap="round"/><path d="M 140 90 Q 150 110 145 125" fill="none" stroke="#264e8a" stroke-width="4" stroke-linecap="round"/><circle cx="55" cy="130" r="5" fill="#264e8a"/><circle cx="145" cy="130" r="5" fill="#264e8a"/></svg>`
  }
];
