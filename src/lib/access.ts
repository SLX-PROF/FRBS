import type { Access, FieldAccess } from 'payload'

// Payload's generated User type won't carry `role` until `payload generate:types`
// runs, so we describe just what access logic needs.
export type AuthUser = { id: string | number; role?: 'admin' | 'manager' | null } | null | undefined

export const isAdmin = (user: AuthUser): boolean => user?.role === 'admin'
export const isStaff = (user: AuthUser): boolean => user?.role === 'admin' || user?.role === 'manager'

const u = (user: unknown) => user as AuthUser

/** admin → all rows; manager → own rows or unassigned ones; anyone else → nothing. */
export const ownedOrUnassigned =
  (ownerField = 'owner'): Access =>
  ({ req }) => {
    const user = u(req.user)
    if (isAdmin(user)) return true
    if (!isStaff(user)) return false
    return { or: [{ [ownerField]: { equals: user!.id } }, { [ownerField]: { exists: false } }] }
  }

/** admin → all rows; manager → strictly own rows; anyone else → nothing. */
export const ownedOnly =
  (ownerField = 'owner'): Access =>
  ({ req }) => {
    const user = u(req.user)
    if (isAdmin(user)) return true
    if (!isStaff(user)) return false
    return { [ownerField]: { equals: user!.id } }
  }

/** Activities: mine as author, or attached to a deal I own. */
export const activityScope: Access = ({ req }) => {
  const user = u(req.user)
  if (isAdmin(user)) return true
  if (!isStaff(user)) return false
  return { or: [{ author: { equals: user!.id } }, { 'deal.owner': { equals: user!.id } }] }
}

export const staffOnly: Access = ({ req }) => isStaff(u(req.user))
export const adminOnly: Access = ({ req }) => isAdmin(u(req.user))
export const adminFieldOnly: FieldAccess = ({ req }) => isAdmin(u(req.user))
