// Логотип FORBSA в админке: крупный на экране входа, компактный в навигации.

export function Logo() {
  return (
    <div
      style={{
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      FORBSA<span style={{ color: '#f25a00' }}>.</span>
      <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: 0, opacity: 0.55, marginTop: 2 }}>
        Панель управления
      </div>
    </div>
  )
}

export function Icon() {
  return (
    <strong style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
      F<span style={{ color: '#f25a00' }}>.</span>
    </strong>
  )
}
