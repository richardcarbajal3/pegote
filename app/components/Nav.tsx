import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function Nav() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 border-b-2 border-ink bg-paper">
      <Link href="/" className="font-display text-2xl flex items-center gap-2 tracking-tight">
        <span className="w-[18px] h-[18px] bg-tomato rounded-full border-2 border-ink -rotate-12" />
        PEGOTE
      </Link>

      <div className="hidden md:flex gap-8 font-mono text-[0.85rem] font-medium uppercase tracking-[0.08em]">
        <Link href="/galeria" className="hover:text-tomato">Galería</Link>
        <Link href="/galeria?sort=artists" className="hover:text-tomato">Artistas</Link>
        <Link href="/#como" className="hover:text-tomato">Cómo funciona</Link>
        <Link href="/vender" className="hover:text-tomato">Vender</Link>
      </div>

      {user ? (
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="font-display text-[0.85rem] bg-paper border-2 border-ink px-3 py-2 shadow-ink-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            {user.isArtist ? "Estudio" : "Mi cuenta"}
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="font-mono text-xs uppercase opacity-60 hover:opacity-100"
              aria-label="Cerrar sesión"
            >
              Salir
            </button>
          </form>
        </div>
      ) : (
        <Link
          href="/login"
          className="bg-ink text-paper px-5 py-2.5 font-display text-[0.85rem] border-2 border-ink shadow-tomato hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
        >
          Entrar →
        </Link>
      )}
    </nav>
  );
}
