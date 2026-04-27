const items = [
  "STICKERS CON GRACIA",
  "ARTE PEGADO",
  "+200 ARTISTAS",
  "DESCARGA INSTANTÁNEA",
  "ENVÍO A TODO EL PERÚ"
];

const colors = ["bg-tomato", "bg-mustard", "bg-mint", "bg-pink"];

export function Marquee() {
  const loop = [...items, ...items];
  return (
    <div className="bg-ink text-paper border-b-[3px] border-ink py-2.5 font-display text-sm tracking-[0.1em] overflow-hidden">
      <div className="inline-flex gap-10 whitespace-nowrap animate-scroll">
        {loop.map((text, i) => (
          <span key={i} className="inline-flex items-center gap-4">
            {text}
            <i className={`inline-block w-2.5 h-2.5 rounded-full ${colors[i % colors.length]}`} />
          </span>
        ))}
      </div>
    </div>
  );
}
