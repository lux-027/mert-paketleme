export default function RobotIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} role="img" aria-label="Otomasyon teknolojisi">
      <defs>
        <linearGradient id="rmetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#52525b" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <pattern id="rgrid" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0V36" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="640" height="480" fill="#09090b" />
      <rect width="640" height="480" fill="url(#rgrid)" />
      <circle cx="320" cy="230" r="190" fill="url(#glow)" />

      {/* HUD rings */}
      <circle cx="320" cy="230" r="150" fill="none" stroke="#3f3f46" strokeDasharray="4 8" />
      <circle cx="320" cy="230" r="118" fill="none" stroke="#52525b" strokeDasharray="60 20" />
      <circle cx="320" cy="230" r="88" fill="none" stroke="#71717a" strokeWidth="1" />

      {/* robotic arm */}
      <g strokeLinecap="round">
        <rect x="290" y="330" width="60" height="26" rx="8" fill="url(#rmetal)" stroke="#71717a" />
        <rect x="304" y="270" width="14" height="62" rx="7" fill="url(#rmetal)" stroke="#71717a" transform="rotate(18 311 301)" />
        <circle cx="318" cy="268" r="14" fill="#18181b" stroke="#a1a1aa" strokeWidth="2" />
        <circle cx="318" cy="268" r="5" fill="#fafafa" />
        <rect x="318" y="200" width="14" height="66" rx="7" fill="url(#rmetal)" stroke="#71717a" transform="rotate(-30 325 233)" />
        <circle cx="354" cy="210" r="13" fill="#18181b" stroke="#a1a1aa" strokeWidth="2" />
        <circle cx="354" cy="210" r="4.5" fill="#fafafa" />
        {/* gripper */}
        <path d="M360 202l22-18M360 202l30-6" stroke="#a1a1aa" strokeWidth="5" />
        <rect x="388" y="176" width="34" height="26" rx="4" fill="#fafafa" stroke="#71717a" />
      </g>

      {/* base platform */}
      <rect x="230" y="356" width="180" height="14" rx="7" fill="#27272a" stroke="#52525b" />
      <rect x="250" y="370" width="140" height="40" rx="6" fill="#18181b" stroke="#3f3f46" />
      <rect x="268" y="384" width="104" height="6" rx="3" fill="#52525b" />
      <rect x="268" y="396" width="70" height="6" rx="3" fill="#3f3f46" />

      {/* circuit traces */}
      <g stroke="#3f3f46" strokeWidth="2" fill="none">
        <path d="M60 380h120v40h60" />
        <path d="M580 120h-90v-40h-60" />
        <path d="M70 90v70h50" />
      </g>
      <circle cx="60" cy="380" r="5" fill="#52525b" />
      <circle cx="240" cy="420" r="5" fill="#52525b" />
      <circle cx="580" cy="120" r="5" fill="#52525b" />
      <circle cx="430" cy="80" r="5" fill="#52525b" />
      <circle cx="70" cy="90" r="5" fill="#fafafa" />
      <circle cx="120" cy="160" r="5" fill="#71717a" />

      {/* HUD labels */}
      <g fontFamily="monospace">
        <text x="60" y="60" fill="#a1a1aa" fontSize="12">AUTOMATION.SYS</text>
        <text x="60" y="80" fill="#fafafa" fontSize="18" fontWeight="bold">INDUSTRY 4.0</text>
        <rect x="60" y="94" width="60" height="3" fill="#fafafa" />

        <text x="470" y="330" fill="#a1a1aa" fontSize="12">ARM.STATUS</text>
        <text x="470" y="352" fill="#fafafa" fontSize="16" fontWeight="bold">ACTIVE</text>
        <rect x="470" y="364" width="120" height="8" rx="4" fill="#27272a" />
        <rect x="470" y="364" width="96" height="8" rx="4" fill="#fafafa" />
        <text x="470" y="392" fill="#71717a" fontSize="11">PRECISION 80%</text>
      </g>

      {/* data dots */}
      {[480, 505, 530, 555, 580].map((x, i) => (
        <circle key={x} cx={x} cy={420 + (i % 2) * 10} r="3" fill="#52525b" />
      ))}
    </svg>
  );
}
