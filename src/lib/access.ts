import type { Access, FieldAccess } from 'payload'

// Payload's generated User type won't carry `role` until `payload generate:types`
// runs, so we describe just what access logic needs.
export type AuthUser = { id: string | number; role?: 'owner' | 'admin' | 'manager' | null } | null | undefined

export const isOwner = (user: AuthUser): boolean => user?.role === 'owner'
export const isProductAdmin = (user: AuthUser): boolean => user?.role === 'admin'
/** Владелец или менеджер — участники CRM-конвейера заявок. Роль admin (только товары) сюда не входит. */
export const isStaff = (user: AuthUser): boolean => isOwner(user) || user?.role === 'manager'

const u = (user: unknown) => user as AuthUser

/** owner → все строки; manager → свои или неназначенные; остальные → ничего. */
export const ownedOrUnassigned =
  (ownerField = 'owner'): Access =>
  ({ req }) => {
    const user = u(req.user)
    if (isOwner(user)) return true
    if (!isStaff(user)) return false
    return { or: [{ [ownerField]: { equals: user!.id } }, { [ownerField]: { exists: false } }] }
  }

/** owner → все строки; manager → строго свои; остальные → ничего. */
export const ownedOnly =
  (ownerField = 'owner'): Access =>
  ({ req }) => {
    const user = u(req.user)
    if (isOwner(user)) return true
    if (!isStaff(user)) return false
    return { [ownerField]: { equals: user!.id } }
  }

/** Активности: свои как автор, либо привязанные к своей сделке. */
export const activityScope: Access = ({ req }) => {
  const user = u(req.user)
  if (isOwner(user)) return true
  if (!isStaff(user)) return false
  return { or: [{ author: { equals: user!.id } }, { 'deal.owner': { equals: user!.id } }] }
}

export const staffOnly: Access = ({ req }) => isStaff(u(req.user))
export const ownerOnly: Access = ({ req }) => isOwner(u(req.user))
export const ownerFieldOnly: FieldAccess = ({ req }) => isOwner(u(req.user))

/** Владелец или администратор товаров — единственные роли, управляющие Товарами/Медиа. */
export const isProductStaff = (user: AuthUser): boolean => isOwner(user) || isProductAdmin(user)
export const productStaffOnly: Access = ({ req }) => isProductStaff(u(req.user))

/** Скрыть раздел меню админки от всех, кроме владельца. */
export const hiddenFromNonOwner = ({ user }: { user: AuthUser }) => !isOwner(user)
