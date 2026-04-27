import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

type Props = { searchParams: { from?: string; error?: string } };

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user) redirect(searchParams.from || "/dashboard");

  const callbackUrl = searchParams.from || "/dashboard";

  return (
    <section className="px-6 md:px-12 py-24 max-w-xl mx-auto">
      <div className="bg-paper-2 border-2 border-ink p-10 shadow-ink">
        <span className="font-mono text-xs uppercase tracking-[0.2em] bg-ink text-paper px-3 py-1 inline-block mb-4 -rotate-2">
          ★ Entrar
        </span>
        <h1 className="font-display text-4xl md:text-5xl leading-[0.9] mb-6">
          Pegate adentro.
        </h1>
        <p className="font-serif italic text-lg mb-8 leading-snug">
          Sin contraseñas, sin formularios. Un click con Google y a comprar (o vender).
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: callbackUrl });
          }}
        >
          <button
            type="submit"
            className="w-full font-display text-base bg-paper border-2 border-ink px-6 py-4 shadow-ink-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink transition-all flex items-center justify-center gap-3"
          >
            <GoogleLogo />
            Entrar con Google
          </button>
        </form>

        {searchParams.error && (
          <p className="mt-4 font-mono text-xs text-tomato">
            Algo falló al entrar. Intenta de nuevo.
          </p>
        )}

        <p className="mt-8 font-mono text-xs opacity-60 leading-relaxed">
          Al entrar aceptas que PEGOTE guarde tu correo y nombre de Google. Nada más.
        </p>
      </div>
    </section>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C17 3.5 14.7 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}
