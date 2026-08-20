export function formatPhone(input: string): string {
  const digits = input
    .replace(/\D/g, '')
    .replace(/^8/, '7')
    .replace(/^7?/, '7')
    .slice(0, 11)

  let out = '+7'
  if (digits.length > 1) out += ` (${digits.slice(1, 4)}`
  if (digits.length > 4) out += `) ${digits.slice(4, 7)}`
  if (digits.length > 7) out += `-${digits.slice(7, 9)}`
  if (digits.length > 9) out += `-${digits.slice(9, 11)}`
  return out
}