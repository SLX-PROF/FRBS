export const METRIKA_ID = 111795186
declare global {
  interface Window {
    ym?: (...args: unknown[]) => void
  }
}

export function trackGoal(goal: string) {
  if (typeof window !== 'undefined' && window.ym && METRIKA_ID) {
    window.ym(METRIKA_ID, 'reachGoal', goal)
  }
}