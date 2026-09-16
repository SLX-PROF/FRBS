const GAP_Y = 300
const SEAL_Y = 336
const FLOOR_Y = 352
const CARRIER_H = 9
const GASKET_H = 13

export default function ThresholdScene({ progress, reducedMotion = false }: { progress: number; reducedMotion?: boolean }) {
  // Ход механизма: пружина слегка "продавливает" уплотнитель за отметку
  // герметизации и оседает обратно — не линейная остановка.
  const p = Math.max(0, progress)
  const settled = Math.min(p, 1)
  const overshoot = Math.max(0, Math.min(p - 1, 0.12))
  const barY = GAP_Y + (SEAL_Y - GAP_Y) * settled + overshoot * 14

  // Резиновый уплотнитель свисает с каретки и сминается о пол в момент посадки.
  const gasketTopY = barY + CARRIER_H
  const naturalBottom = gasketTopY + GASKET_H
  const compressed = Math.max(0, naturalBottom - FLOOR_Y)
  const gasketH = Math.max(5, GASKET_H - compressed)
  const gasketW = 138 + Math.min(compressed * 1.6, 14)
  const gasketBottom = Math.min(naturalBottom, FLOOR_Y)
  const seatC = Math.min(1, compressed / 8) // 0..1 — насколько плотно село

  const draftOpacity = Math.max(0, 1 - p * 1.7)
  const glowOpacity = Math.min(1, Math.max(0, p - 0.72) / 0.28)

  // Активатор у петли щёлкает внутрь резко, когда рама доходит до порога.
  const pressed = p > 0.04
  const pinTravel = Math.min(1, Math.max(0, (p - 0.02) / 0.05))
  const pinLen = 7 - pinTravel * 5

  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 320 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="room" cx="0.3" cy="0.2" r="1.1">
            <stop offset="0" stopColor="#23272e" />
            <stop offset="0.55" stopColor="#15181d" />
            <stop offset="1" stopColor="#0c0e12" />
          </radialGradient>
          <radialGradient id="vignette" cx="0.5" cy="0.42" r="0.75">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.45" />
          </radialGradient>
          <linearGradient id="carrier" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff9c4d" />
            <stop offset="0.5" stopColor="#f24e00" />
            <stop offset="1" stopColor="#c53f00" />
          </linearGradient>
          <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
          <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M26 0H0V26" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
          <clipPath id="belowSeal">
            <rect x="0" y={gasketBottom - 3} width="320" height={FLOOR_Y - gasketBottom + 6} />
          </clipPath>
        </defs>

        <rect width="320" height="400" fill="url(#room)" />
        <rect width="320" height="400" fill="url(#grid)" />

        {/* дверная коробка — двойной штрих для объёма */}
        <g>
          <rect x="60" y="30" width="200" height="14" rx="2" fill="url(#metal)" stroke="rgba(255,255,255,0.16)" />
          <rect x="60" y="30" width="16" height="312" rx="2" fill="url(#metal)" stroke="rgba(255,255,255,0.16)" />
          <rect x="244" y="30" width="16" height="312" rx="2" fill="url(#metal)" stroke="rgba(255,255,255,0.16)" />
          <line x1="61" y1="31" x2="259" y2="31" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        </g>

        {/* полотно двери */}
        <g>
          <rect x="88" y="52" width="144" height="248" rx="3" fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.2)" />
          <line x1="89" y1="53" x2="231" y2="53" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
          <line x1="88" y1="176" x2="232" y2="176" stroke="rgba(255,255,255,0.06)" />
          <circle cx="218" cy="184" r="3" fill="rgba(255,255,255,0.4)" />
        </g>

        {/* пол */}
        <line x1="40" y1={FLOOR_Y} x2="280" y2={FLOOR_Y} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        {[48, 68, 88, 108, 128, 148, 168, 188, 208, 228, 248, 268].map((x) => (
          <line key={x} x1={x} y1={FLOOR_Y} x2={x - 8} y2={FLOOR_Y + 10} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        ))}

        {/* сквозняк — течёт только в ещё открытой щели под уплотнителем */}
        <g
          clipPath="url(#belowSeal)"
          stroke="rgba(255,255,255,0.42)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity={draftOpacity}
        >
          <path d="M72 340q10-6 20 0t20 0t20 0t20 0t20 0t20 0t20 0" strokeDasharray="1 7">
            {!reducedMotion && (
              <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="0.7s" repeatCount="indefinite" />
            )}
          </path>
          <path d="M72 347q10-6 20 0t20 0t20 0t20 0t20 0t20 0t20 0" strokeDasharray="1 7" opacity="0.6">
            {!reducedMotion && (
              <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="0.9s" repeatCount="indefinite" />
            )}
          </path>
        </g>

        {/* тень уплотнителя на полу — резче по мере посадки */}
        <ellipse
          cx="160"
          cy={FLOOR_Y + 2}
          rx={54 + seatC * 26}
          ry={3 + seatC * 2}
          fill="#000"
          opacity={0.12 + seatC * 0.28}
        />

        {/* герметизация — оранжевое свечение вдоль пола */}
        <ellipse cx="160" cy={FLOOR_Y} rx={70 + seatC * 8} ry="6" fill="#ff7a1a" opacity={glowOpacity * 0.4} />

        {/* тяга от активатора к каретке */}
        <line
          x1="90"
          y1="290"
          x2="97"
          y2={barY + 4}
          stroke={pressed ? '#ff7a1a' : 'rgba(255,255,255,0.2)'}
          strokeWidth="1.5"
          strokeDasharray="2 3"
        />

        {/* резиновый уплотнитель */}
        <rect
          x={160 - gasketW / 2}
          y={gasketTopY}
          width={gasketW}
          height={gasketH}
          rx={Math.min(gasketH / 2, 5)}
          fill="#212429"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="1"
        />

        {/* каретка (алюминиевый профиль) со специальным бликом */}
        <rect x={90 - overshoot * 30} y={barY} width={140 + overshoot * 60} height={CARRIER_H} rx="2.5" fill="url(#carrier)" />
        <line x1={94 - overshoot * 30} y1={barY + 1.5} x2={226 + overshoot * 30} y2={barY + 1.5} stroke="rgba(255,255,255,0.55)" strokeWidth="1" />

        {/* дым/пыль оседает, когда щель закрылась */}
        {seatC > 0.6 && !reducedMotion && (
          <g fill="rgba(255,255,255,0.28)">
            {[108, 150, 196].map((x, i) => (
              <circle key={x} cx={x} cy={FLOOR_Y - 4} r="1.6">
                <animate attributeName="cy" values={`${FLOOR_Y - 4};${FLOOR_Y - 16}`} dur={`${1.6 + i * 0.4}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0" dur={`${1.6 + i * 0.4}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        )}

        {/* активатор у петли */}
        <rect x={88 - pinLen} y="288" width={pinLen} height="7" rx="1.5" fill={pressed ? '#ff7a1a' : 'rgba(255,255,255,0.3)'} />
        <rect x="82" y="286" width="6" height="11" rx="1" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        {pressed && p < 0.15 && !reducedMotion && (
          <circle cx="88" cy="291" r="4" fill="none" stroke="#ff7a1a" strokeWidth="1">
            <animate attributeName="r" values="3;11" dur="0.5s" fill="freeze" />
            <animate attributeName="opacity" values="0.7;0" dur="0.5s" fill="freeze" />
          </circle>
        )}

        <rect width="320" height="400" fill="url(#vignette)" pointerEvents="none" />
      </svg>
    </div>
  )
}
