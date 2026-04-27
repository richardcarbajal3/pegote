import Link from "next/link";

type Props = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  previewUrl: string;
  artistUsername: string | null;
  index?: number;
};

const tints = ["bg-paper-2", "bg-[#fff5e1]", "bg-[#ffe7e3]", "bg-[#e3f2e9]"];
const rotations = ["", "rotate-1", "-rotate-1", "rotate-[0.5deg]"];

export function StickerCard({
  slug,
  title,
  priceCents,
  previewUrl,
  artistUsername,
  index = 0
}: Props) {
  const tint = tints[index % tints.length];
  const rot = rotations[index % rotations.length];
  const price = (priceCents / 100).toFixed(0);

  return (
    <Link
      href={`/sticker/${slug}`}
      className={`group block ${tint} ${rot} border-2 border-ink p-6 shadow-ink hover:rotate-0 hover:-translate-x-1 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[10px_10px_0_var(--tomato)] hover:z-10 relative transition-all duration-300`}
      style={{ transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)" }}
    >
      <div className="bg-paper border-2 border-dashed border-ink p-6 aspect-square flex items-center justify-center mb-4">
        {previewUrl.trim().startsWith("<svg") ? (
          <div
            className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: previewUrl }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={title} className="w-full h-full object-contain" />
        )}
      </div>
      <div className="flex justify-between items-start mb-3">
        <div className="font-display text-base leading-none uppercase">{title}</div>
        <div className="font-display text-sm bg-ink text-paper px-2.5 py-1 rotate-3 whitespace-nowrap">
          S/ {price}
        </div>
      </div>
      {artistUsername && (
        <div className="font-mono text-[0.75rem] uppercase tracking-wider text-[#5a5048]">
          @ {artistUsername}
        </div>
      )}
    </Link>
  );
}
