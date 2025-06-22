const PERMISSIONS = [
  'view:articles',
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
]

export const PermissionMap = Object.fromEntries(
  PERMISSIONS.map((p) => [p.toUpperCase().replace(/[:]/g, '_'), p])
)

export function isPermissionSupported(permission) {
  return PERMISSIONS.indexOf(permission) > -1
}
