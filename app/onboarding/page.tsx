import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function completeOnboarding(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login?from=/onboarding");

  const username = String(formData.get("username") || "").toLowerCase().trim();
  const bio = String(formData.get("bio") || "").trim();
  const becomeArtist = formData.get("artist") === "on";

  if (!/^[a-z0-9_.-]{3,24}$/.test(username)) {
    redirect("/onboarding?error=username");
  }

  // Verificar disponibilidad
  const taken = await prisma.user.findFirst({
    where: { username, NOT: { id: session.user.id } }
  });
  if (taken) redirect("/onboarding?error=taken");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username, bio: bio || null, isArtist: becomeArtist }
  });

  revalidatePath("/dashboard");
  redirect(becomeArtist ? "/dashboard/upload" : "/dashboard");
}

type Props = { searchParams: { error?: string } };

export default async function OnboardingPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?from=/onboarding");

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, bio: true, isArtist: true, name: true, email: true }
  });

  // Ya completó onboarding y ya es artista: nada que hacer aquí.
  if (me?.username && me.isArtist) redirect("/dashboard");

  return (
    <section className="px-6 md:px-12 py-16 max-w-2xl mx-auto">
      <span className="font-mono text-xs uppercase tracking-[0.2em] bg-ink text-paper px-3 py-1 inline-block mb-4 -rotate-2">
        ★ Casi listo
      </span>
      <h1 className="font-display text-5xl md:text-6xl leading-[0.9] mb-4">
        Elige tu <em className="not-italic text-tomato hl-mustard">@</em>
      </h1>
      <p className="font-serif italic text-lg mb-10">
        Tu identidad pública en PEGOTE. Va a aparecer en cada sticker que compres o vendas.
      </p>

      <form action={completeOnboarding} className="space-y-6">
        <div>
          <label className="font-mono text-xs uppercase tracking-[0.15em] block mb-2">
            Username
          </label>
          <div className="flex items-center border-2 border-ink bg-paper-2 shadow-ink-sm">
            <span className="font-display text-lg px-4 py-3 bg-ink text-paper">@</span>
            <input
              name="username"
              required
              minLength={3}
              maxLength={24}
              pattern="[a-z0-9_.\-]+"
              defaultValue={me?.username ?? ""}
              placeholder="tu.nombre"
              className="font-mono text-base px-4 py-3 flex-1 bg-transparent focus:outline-none lowercase"
            />
          </div>
          {searchParams.error === "username" && (
            <p className="mt-2 font-mono text-xs text-tomato">
              Solo minúsculas, números y . _ - · entre 3 y 24 caracteres.
            </p>
          )}
          {searchParams.error === "taken" && (
            <p className="mt-2 font-mono text-xs text-tomato">
              Ese @ ya lo tomó otra persona. Probá con otro.
            </p>
          )}
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-[0.15em] block mb-2">
            Bio (opcional)
          </label>
          <textarea
            name="bio"
            rows={3}
            maxLength={280}
            defaultValue={me?.bio ?? ""}
            placeholder="Ilustradora limeña. Hago animales con problemas."
            className="w-full font-serif text-base px-4 py-3 border-2 border-ink bg-paper-2 shadow-ink-sm focus:outline-none focus:shadow-[6px_6px_0_var(--tomato)]"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer border-2 border-dashed border-ink p-5 hover:bg-paper-2">
          <input type="checkbox" name="artist" className="mt-1.5 w-5 h-5 accent-tomato" />
          <div>
            <div className="font-display text-base">Quiero vender mi arte</div>
            <p className="font-serif text-sm leading-snug mt-1">
              Activa tu estudio de artista. Vas a poder subir stickers y cobrar el 70% de
              cada venta. Lo puedes activar después también.
            </p>
          </div>
        </label>

        <button
          type="submit"
          className="w-full font-display text-base bg-tomato text-paper border-2 border-ink px-6 py-4 shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-lg transition-all"
        >
          Listo, entrar →
        </button>
      </form>
    </section>
  );
}
