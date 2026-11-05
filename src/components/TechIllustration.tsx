export default function TechIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} role="img" aria-label="Üretim hattı">
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f3f46" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
        <linearGradient id="belt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#27272a" />
          <stop offset="50%" stopColor="#3f3f46" />
          <stop offset="100%" stopColor="#27272a" />
        </linearGradient>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="640" height="480" fill="#09090b" />
      <rect width="640" height="480" fill="url(#grid)" />

      {/* machine body */}
      <rect x="360" y="90" width="190" height="220" rx="10" fill="url(#metal)" stroke="#52525b" />
      <rect x="380" y="110" width="90" height="60" rx="6" fill="#0c0c0e" stroke="#52525b" />
      <rect x="392" y="124" width="66" height="8" rx="4" fill="#71717a" />
      <rect x="392" y="140" width="44" height="8" rx="4" fill="#52525b" />
      <circle cx="510" cy="140" r="18" fill="#0c0c0e" stroke="#71717a" strokeWidth="2" />
      <path d="M510 130v10l7 5" stroke="#fafafa" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="380" y="190" width="150" height="12" rx="6" fill="#52525b" />
      <rect x="380" y="212" width="110" height="12" rx="6" fill="#3f3f46" />
      <rect x="380" y="234" width="130" height="12" rx="6" fill="#3f3f46" />
      <rect x="380" y="256" width="70" height="12" rx="6" fill="#52525b" />

      {/* hopper */}
      <path d="M420 60h70l-14 30h-42Z" fill="url(#metal)" stroke="#52525b" />

      {/* conveyor */}
      <rect x="40" y="330" width="560" height="26" rx="13" fill="url(#belt)" stroke="#52525b" />
      {[70, 130, 190, 250, 310, 370, 430, 490, 550].map((x) => (
        <circle key={x} cx={x} cy={343} r="7" fill="#0c0c0e" stroke="#71717a" strokeWidth="1.5" />
      ))}
      <rect x="70" y="356" width="14" height="60" fill="#27272a" />
      <rect x="556" y="356" width="14" height="60" fill="#27272a" />

      {/* packages on belt */}
      <rect x="95" y="284" width="52" height="46" rx="4" fill="#3f3f46" stroke="#71717a" />
      <path d="M95 302h52" stroke="#71717a" strokeWidth="2" />
      <rect x="170" y="284" width="52" height="46" rx="4" fill="#3f3f46" stroke="#71717a" />
      <path d="M170 302h52" stroke="#71717a" strokeWidth="2" />
      <rect x="245" y="284" width="52" height="46" rx="4" fill="#fafafa" stroke="#a1a1aa" />
      <path d="M245 302h52" stroke="#a1a1aa" strokeWidth="2" />

      {/* drop tube from machine to belt */}
      <rect x="440" y="310" width="30" height="20" fill="#27272a" stroke="#52525b" />
      <rect x="332" y="284" width="52" height="46" rx="4" fill="#3f3f46" stroke="#71717a" />
      <path d="M332 302h52" stroke="#71717a" strokeWidth="2" />

      {/* status lights */}
      <circle cx="530" cy="72" r="6" fill="#fafafa" />
      <circle cx="506" cy="72" r="6" fill="#52525b" />
      <circle cx="482" cy="72" r="6" fill="#52525b" />

      {/* floor line */}
      <rect x="40" y="428" width="560" height="2" fill="#3f3f46" />

      {/* floating specs */}
      <g stroke="#52525b" fill="none">
        <rect x="80" y="90" width="150" height="90" rx="8" />
        <line x1="80" y1="120" x2="230" y2="120" />
      </g>
      <text x="96" y="110" fill="#a1a1aa" fontSize="13" fontFamily="monospace">SYSTEM STATUS</text>
      <text x="96" y="146" fill="#fafafa" fontSize="17" fontFamily="monospace" fontWeight="bold">0.25g - 50kg</text>
      <text x="96" y="168" fill="#71717a" fontSize="12" fontFamily="monospace">PRECISION WEIGHING</text>

      <g stroke="#52525b" fill="none">
        <rect x="80" y="200" width="150" height="52" rx="8" />
      </g>
      <text x="96" y="222" fill="#a1a1aa" fontSize="12" fontFamily="monospace">OUTPUT</text>
      <text x="96" y="241" fill="#fafafa" fontSize="15" fontFamily="monospace" fontWeight="bold">%100 QC</text>
    </svg>
  );
}
