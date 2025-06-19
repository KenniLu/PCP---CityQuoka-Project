import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { afterUserLogin } from './hooks/afterLogin'
import { afterForgotPassword } from './hooks/afterForgotPassword'
import { accessUsers } from '@/access/accessUsers'
import { roleListFilter } from '@/utilities/permissions'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
    removeTokenFromResponses: true,
    cookies: {
      secure: true,
    },
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: accessUsers,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
    baseListFilter: roleListFilter,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'userRoles',
      type: 'relationship',
      relationTo: 'user-roles',
      hasMany: true,
    },
  ],
  hooks: {
    afterLogin: [afterUserLogin, afterForgotPassword],
  },
  timestamps: true,
}
