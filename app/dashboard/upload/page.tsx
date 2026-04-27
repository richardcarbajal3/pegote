import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UploadForm } from "./UploadForm";

export default async function UploadPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?from=/dashboard/upload");

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, isArtist: true }
  });

  if (!me?.username) redirect("/onboarding");
  if (!me.isArtist) {
    redirect("/onboarding");
  }

  return (
    <section className="px-6 md:px-12 py-16 max-w-2xl mx-auto">
      <span className="font-mono text-xs uppercase tracking-[0.2em] bg-blue text-paper px-3 py-1 inline-block mb-4 -rotate-2">
        ↑ Subir
      </span>
      <h1 className="font-display text-4xl md:text-5xl leading-[0.9] mb-4">
        Pega <em className="not-italic text-tomato hl-mustard">un nuevo sticker.</em>
      </h1>
      <p className="font-serif italic text-lg mb-10">
        Sube el archivo, ponle precio, y aparece en la galería al toque.
      </p>

      <UploadForm />
    </section>
  );
}
