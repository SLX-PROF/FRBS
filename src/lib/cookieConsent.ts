const KEY = 'forbsa-cookie-consent'
const EVENT = 'forbsa-consent-given'

export function hasConsent(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function giveConsent(): void {
  try {
    localStorage.setItem(KEY, '1')
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

export function onConsentGiven(cb: () => void): () => void {
  window.addEventListener(EVENT, cb)
  return () => window.removeEventListener(EVENT, cb)
}
