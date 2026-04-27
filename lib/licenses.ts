/**
 * Tipos de licencia de uso de PEGOTE.
 *  🟢 USAGE     — uso no exclusivo. Varios compradores, sin reventas, autoría del artista.
 *  🔵 EXCLUSIVE — uso exclusivo. Un solo comprador, el artista deja de venderlo, mantiene autoría.
 *  🔴 TRANSFER  — transferencia total (premium). Derechos económicos al comprador, crédito de autor al artista.
 */

export type LicenseType = "USAGE" | "EXCLUSIVE" | "TRANSFER";

export type SaleMode = "FIXED" | "AUCTION";

export const LICENSES: Record<
  LicenseType,
  {
    code: LicenseType;
    dot: string;
    label: string;
    short: string;
    body: string;
    chipBg: string;
    chipText: string;
  }
> = {
  USAGE: {
    code: "USAGE",
    dot: "🟢",
    label: "Uso (no exclusivo)",
    short: "Uso · no exclusivo",
    body: "Varios pueden comprar y usar el sticker. El artista mantiene la autoría y puede seguir vendiéndolo. Nadie puede revenderlo.",
    chipBg: "bg-mint",
    chipText: "text-ink"
  },
  EXCLUSIVE: {
    code: "EXCLUSIVE",
    dot: "🔵",
    label: "Uso exclusivo",
    short: "Uso · exclusivo",
    body: "Un solo comprador. El artista deja de ofrecerlo a otros, pero conserva la autoría. Sin reventas.",
    chipBg: "bg-blue",
    chipText: "text-paper"
  },
  TRANSFER: {
    code: "TRANSFER",
    dot: "🔴",
    label: "Transferencia total (premium)",
    short: "Transferencia total · premium",
    body: "El artista vende los derechos económicos. El comprador puede usarlo, modificarlo y revenderlo. El artista mantiene el crédito como autor.",
    chipBg: "bg-tomato",
    chipText: "text-paper"
  }
};

export function isLicenseType(value: unknown): value is LicenseType {
  return value === "USAGE" || value === "EXCLUSIVE" || value === "TRANSFER";
}

export function isSaleMode(value: unknown): value is SaleMode {
  return value === "FIXED" || value === "AUCTION";
}
