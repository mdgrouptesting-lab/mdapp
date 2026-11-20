/* Animated blueprint-style illustration: a building rising floor by floor with a swinging crane. */
const floors = [
  { y: 380, delay: 0.2 },
  { y: 320, delay: 0.5 },
  { y: 260, delay: 0.8 },
  { y: 200, delay: 1.1 },
];

export function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 500" className="h-full w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="hi-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f57a6" />
          <stop offset="1" stopColor="#142851" />
        </linearGradient>
        <linearGradient id="hi-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1b356b" />
          <stop offset="1" stopColor="#0d1b38" />
        </linearGradient>
        <linearGradient id="hi-amber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffbb4a" />
          <stop offset="1" stopColor="#f98207" />
        </linearGradient>
        <radialGradient id="hi-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffa220" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffa220" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* glow */}
      <circle cx="270" cy="250" r="220" fill="url(#hi-glow)" />
      <circle cx="270" cy="250" r="170" stroke="#7a9dd9" strokeOpacity=".25" strokeDasharray="4 8" />
      <circle cx="270" cy="250" r="215" stroke="#7a9dd9" strokeOpacity=".15" />

      {/* ground */}
      <path d="M40 440h440" stroke="#7a9dd9" strokeOpacity=".5" strokeWidth="2" />
      <path d="M60 452h400" stroke="#7a9dd9" strokeOpacity=".2" strokeDasharray="6 10" />

      {/* building floors rising */}
      {floors.map((f, i) => (
        <g key={i} className="animate-rise" style={{ transformBox: "fill-box", transformOrigin: "bottom", animationDelay: `${f.delay}s` }}>
          <rect x="150" y={f.y} width="200" height="60" fill="url(#hi-floor)" stroke="#4c74c2" strokeOpacity=".6" />
          <path d={`M350 ${f.y} l30 -18 v60 l-30 18z`} fill="url(#hi-side)" stroke="#4c74c2" strokeOpacity=".4" />
          {[0, 1, 2, 3, 4].map((w) => (
            <rect
              key={w}
              x={165 + w * 37}
              y={f.y + 16}
              width="24"
              height="28"
              rx="2"
              fill={(i + w) % 3 === 0 ? "url(#hi-amber)" : "#aec4ea"}
              fillOpacity={(i + w) % 3 === 0 ? 0.95 : 0.18}
            />
          ))}
          <rect x="146" y={f.y - 4} width="238" height="6" fill="#0d1b38" opacity=".9" />
        </g>
      ))}
      {/* roof slab */}
      <g className="animate-rise" style={{ transformBox: "fill-box", transformOrigin: "bottom", animationDelay: "1.4s" }}>
        <path d="M146 196 h204 l30 -18 h-204z" fill="#ffbb4a" fillOpacity=".9" />
      </g>
      {/* scaffolding being built on top */}
      <g stroke="#ffbb4a" strokeOpacity=".7" strokeWidth="2" className="stroke-draw animate-draw" style={{ animationDelay: "1.6s" }}>
        <path d="M170 178V120M230 178V120M290 178V120M340 178V120M170 120h170M170 150h170M170 178l60-58M230 178l60-58M290 178l50-58" />
      </g>

      {/* entrance */}
      <rect x="232" y="400" width="36" height="40" rx="3" fill="#071026" stroke="#ffbb4a" strokeOpacity=".8" />

      {/* blueprint dimension lines */}
      <g stroke="#aec4ea" strokeOpacity=".7" strokeWidth="1.2" className="stroke-draw animate-draw" style={{ animationDelay: ".4s" }}>
        <path d="M110 440V178M104 440h12M104 178h12" />
        <path d="M150 470h200M150 464v12M350 464v12" />
      </g>
      <text x="96" y="315" fill="#aec4ea" fontSize="11" fontFamily="monospace" transform="rotate(-90 96 315)">
        H = 18.6 m
      </text>
      <text x="226" y="490" fill="#aec4ea" fontSize="11" fontFamily="monospace">
        W = 24.0 m
      </text>

      {/* crane mast */}
      <g stroke="#ffbb4a" strokeWidth="2.5">
        <path d="M420 440V96M436 440V96" />
        {Array.from({ length: 11 }).map((_, i) => (
          <path key={i} d={`M420 ${440 - i * 31} L436 ${409 - i * 31} M436 ${440 - i * 31} L420 ${409 - i * 31}`} strokeWidth="1.4" strokeOpacity=".8" />
        ))}
        <path d="M414 96h28l-14-26z" fill="#f98207" />
      </g>
      {/* crane jib + hook (swinging) */}
      <g className="animate-swing" style={{ transformBox: "view-box", transformOrigin: "428px 92px" }}>
        <path d="M200 92h290" stroke="#ffbb4a" strokeWidth="5" strokeLinecap="round" />
        <path d="M200 92L428 70L490 92" stroke="#ffbb4a" strokeWidth="1.5" strokeOpacity=".8" />
        <rect x="462" y="92" width="26" height="18" rx="2" fill="#94300c" />
        <path d="M258 92v62" stroke="#d6e2f5" strokeWidth="1.5" />
        <path d="M252 154h12l-6 8z" fill="#d6e2f5" />
        <rect x="214" y="162" width="88" height="10" rx="2" fill="url(#hi-amber)" />
      </g>

      {/* compass */}
      <g transform="translate(70 90)" stroke="#aec4ea" strokeOpacity=".6">
        <circle r="24" />
        <path d="M0-30V30M-30 0H30" strokeOpacity=".35" />
        <path d="M0-18L5 0H-5Z" fill="#ffbb4a" stroke="none" />
      </g>
      <text x="64" y="54" fill="#aec4ea" fontSize="11" fontFamily="monospace">N</text>
    </svg>
  );
}
