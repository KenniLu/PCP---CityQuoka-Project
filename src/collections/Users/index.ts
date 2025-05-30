import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { afterUserLogin } from './hooks/afterLogin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
    removeTokenFromResponses: true,
    cookies: {
      secure: true
    }
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
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
      hasMany: true
    }
  ],
  hooks: {
    afterLogin: [afterUserLogin]
  },
  timestamps: true,
}
