/* Stickers SVG flotantes del hero (replicando pegote.html) */
export function FloatingStickers() {
  return (
    <>
      <svg
        viewBox="0 0 200 200"
        className="absolute top-[8%] right-[6%] w-[170px] z-[1] pointer-events-auto bob hidden md:block"
        style={{ "--rot": "18deg", filter: "drop-shadow(4px 6px 0 rgba(26,20,16,0.9))" } as React.CSSProperties}
      >
        <circle cx="100" cy="100" r="85" fill="#ff3d8b" stroke="#1a1410" strokeWidth="6" />
        <circle cx="75" cy="90" r="10" fill="#1a1410" />
        <circle cx="125" cy="90" r="10" fill="#1a1410" />
        <path d="M 60 130 Q 100 165 140 130" fill="none" stroke="#1a1410" strokeWidth="6" strokeLinecap="round" />
        <circle cx="60" cy="115" r="8" fill="#e63946" />
        <circle cx="140" cy="115" r="8" fill="#e63946" />
      </svg>

      <svg
        viewBox="0 0 200 200"
        className="absolute top-[55%] right-[14%] w-[130px] z-[1] bob hidden md:block"
        style={{ "--rot": "-12deg", animationDelay: "0.5s", filter: "drop-shadow(4px 6px 0 rgba(26,20,16,0.9))" } as React.CSSProperties}
      >
        <path
          d="M 50 50 L 150 50 L 150 130 Q 150 160 120 160 L 80 160 Q 50 160 50 130 Z"
          fill="#06b894"
          stroke="#1a1410"
          strokeWidth="6"
        />
        <circle cx="80" cy="90" r="8" fill="#1a1410" />
        <circle cx="120" cy="90" r="8" fill="#1a1410" />
        <path d="M 70 120 L 130 120 L 130 135 Q 100 145 70 135 Z" fill="#1a1410" />
        <rect x="90" y="125" width="20" height="10" fill="#fff" />
      </svg>

      <svg
        viewBox="0 0 200 200"
        className="absolute top-[25%] right-[22%] w-[100px] z-[1] bob hidden md:block"
        style={{ "--rot": "25deg", animationDelay: "1s", filter: "drop-shadow(4px 6px 0 rgba(26,20,16,0.9))" } as React.CSSProperties}
      >
        <polygon
          points="100,20 120,75 180,80 135,120 150,180 100,150 50,180 65,120 20,80 80,75"
          fill="#f4a261"
          stroke="#1a1410"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <circle cx="85" cy="95" r="6" fill="#1a1410" />
        <circle cx="115" cy="95" r="6" fill="#1a1410" />
        <path d="M 80 115 Q 100 130 120 115" fill="none" stroke="#1a1410" strokeWidth="5" strokeLinecap="round" />
      </svg>

      <svg
        viewBox="0 0 200 200"
        className="absolute bottom-[8%] right-[38%] w-[90px] z-[1] bob hidden md:block"
        style={{ "--rot": "-20deg", animationDelay: "1.5s", filter: "drop-shadow(4px 6px 0 rgba(26,20,16,0.9))" } as React.CSSProperties}
      >
        <ellipse cx="100" cy="100" rx="80" ry="85" fill="#7e3bff" stroke="#1a1410" strokeWidth="6" />
        <ellipse cx="80" cy="90" rx="6" ry="12" fill="#fff" />
        <ellipse cx="120" cy="90" rx="6" ry="12" fill="#fff" />
        <path d="M 70 130 Q 100 110 130 130" fill="none" stroke="#1a1410" strokeWidth="6" strokeLinecap="round" />
        <path d="M 90 145 L 100 165 L 110 145 Z" fill="#e63946" stroke="#1a1410" strokeWidth="4" />
      </svg>
    </>
  );
}
