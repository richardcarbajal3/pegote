import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-paper px-6 md:px-12 pt-16 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 max-w-7xl mx-auto">
        <div className="col-span-2">
          <div className="font-display text-3xl mb-4">PEGOTE</div>
          <p className="font-serif italic opacity-70 leading-relaxed max-w-sm">
            El primer marketplace de stickers ilustrados peruanos. Hecho con humor,
            café y deadlines flexibles.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm mb-3 text-mustard">EXPLORAR</h4>
          {[
            ["Galería", "/galeria"],
            ["Artistas", "/galeria?sort=artists"],
            ["Top semanal", "/galeria?sort=top"]
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="block font-mono text-[0.85rem] mb-2 opacity-85 hover:opacity-100 hover:text-tomato"
            >
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 className="font-display text-sm mb-3 text-mustard">VENDER</h4>
          {[
            ["Cómo funciona", "/vender"],
            ["Subir arte", "/dashboard/upload"],
            ["Términos", "/terminos"]
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="block font-mono text-[0.85rem] mb-2 opacity-85 hover:opacity-100 hover:text-tomato"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-paper/20 pt-6 flex flex-wrap justify-between gap-4 font-mono text-xs opacity-60 max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} PEGOTE — Lima, Perú</span>
        <span>Hecho a mano · Pegado con cariño</span>
      </div>
    </footer>
  );
}
