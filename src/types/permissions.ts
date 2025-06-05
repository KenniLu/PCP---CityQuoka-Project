export const PERMISSION_KEYS = [
  'categories',
  'events',
  'media',
  'pages',
  'posts',
  'programmes',
  'providers',
  'reports',
  'user-roles',
  'users',
  'venues',
] as const

type PermissionKeysType = (typeof PERMISSION_KEYS)[number]

export type RolePermissionType = {
  admin: boolean
} & {
  [k in PermissionKeysType]: { read?: boolean; admin?: boolean }
}
