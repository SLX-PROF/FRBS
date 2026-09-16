export default function ProfileGlyph({ variant = 0 }: { variant?: 0 | 1 | 2 }) {
  const angle = [-8, 0, 8][variant]
  const teeth = variant === 1 ? 4 : 6

  return (
    <svg viewBox="0 0 220 160" className="h-full w-full">
      <defs>
        <pattern id={`dots-${variant}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(35,38,43,0.06)" />
        </pattern>
        <linearGradient id={`bar-${variant}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff7a1a" />
          <stop offset="1" stopColor="#f24e00" />
        </linearGradient>
      </defs>

      <rect width="220" height="160" fill={`url(#dots-${variant})`} />

      <g transform={`rotate(${angle} 110 80)`}>
        <rect x="40" y="66" width="140" height="16" rx="3" fill={`url(#bar-${variant})`} />
        {Array.from({ length: teeth }).map((_, i) => (
          <line
            key={i}
            x1={54 + i * (120 / (teeth - 1))}
            y1="82"
            x2={54 + i * (120 / (teeth - 1))}
            y2="104"
            stroke="rgba(35,38,43,0.28)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
        <circle cx="110" cy="74" r="5.5" fill="white" stroke="rgba(35,38,43,0.4)" strokeWidth="1.5" />
      </g>

      <line x1="40" y1="122" x2="180" y2="122" stroke="rgba(35,38,43,0.2)" strokeWidth="1" />
      <line x1="40" y1="117" x2="40" y2="127" stroke="rgba(35,38,43,0.2)" strokeWidth="1" />
      <line x1="180" y1="117" x2="180" y2="127" stroke="rgba(35,38,43,0.2)" strokeWidth="1" />
    </svg>
  )
}
