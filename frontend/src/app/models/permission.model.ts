export const PERMISSIONS = [
  'create:articles',
  'update:articles',
  'delete:articles',
  'view:users',
  'create:users',
  'update:users',
  'delete:users',
  'view:roles',
  'create:roles',
  'update:roles',
  'delete:roles',
] as const

export type Permission = (typeof PERMISSIONS)[number]
