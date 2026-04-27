import Link from "next/link";
import { LICENSES, isLicenseType, type LicenseType, type SaleMode } from "@/lib/licenses";

type Props = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  previewUrl: string;
  artistUsername: string | null;
  index?: number;
  licenseType?: LicenseType | string | null;
  saleMode?: SaleMode | string | null;
  currentBidCents?: number | null;
  startBidCents?: number | null;
};

const tints = ["bg-paper-2", "bg-[#fff5e1]", "bg-[#ffe7e3]", "bg-[#e3f2e9]"];
const rotations = ["", "rotate-1", "-rotate-1", "rotate-[0.5deg]"];

export function StickerCard({
  slug,
  title,
  priceCents,
  previewUrl,
  artistUsername,
  index = 0,
  licenseType,
  saleMode,
  currentBidCents,
  startBidCents
}: Props) {
  const tint = tints[index % tints.length];
  const rot = rotations[index % rotations.length];
  const license = isLicenseType(licenseType) ? LICENSES[licenseType] : LICENSES.USAGE;
  const isAuction = saleMode === "AUCTION";
  const displayCents = isAuction ? currentBidCents ?? startBidCents ?? priceCents : priceCents;
  const price = (displayCents / 100).toFixed(0);

  return (
    <Link
      href={`/sticker/${slug}`}
      className={`group block ${tint} ${rot} border-2 border-ink p-6 shadow-ink hover:rotate-0 hover:-translate-x-1 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[10px_10px_0_var(--tomato)] hover:z-10 relative transition-all duration-300`}
      style={{ transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)" }}
    >
      {isAuction && (
        <div className="absolute -top-3 -left-3 font-mono text-[0.65rem] uppercase tracking-[0.15em] bg-mustard text-ink border-2 border-ink px-2 py-1 -rotate-6">
          ⏱ Subasta
        </div>
      )}
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
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="font-display text-base leading-none uppercase">{title}</div>
        <div className="font-display text-sm bg-ink text-paper px-2.5 py-1 rotate-3 whitespace-nowrap">
          {isAuction ? "Desde " : ""}S/ {price}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        {artistUsername && (
          <div className="font-mono text-[0.75rem] uppercase tracking-wider text-[#5a5048]">
            @ {artistUsername}
          </div>
        )}
        <span
          className={`font-mono text-[0.65rem] uppercase tracking-[0.12em] border border-ink px-1.5 py-0.5 ${license.chipBg} ${license.chipText}`}
          title={license.body}
        >
          {license.dot}
        </span>
      </div>
    </Link>
  );
}
