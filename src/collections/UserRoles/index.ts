import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { adminReadAccessCheck, userProviderIds } from '@/utilities/userUtilities'

export const UserRoles: CollectionConfig = {
  slug: 'user-roles',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: (args) =>
      adminReadAccessCheck(args, {
        slug: 'user-roles',
        where: (user) => {
          return {
            provider: {
              in: [...userProviderIds(user), 999],
            },
          }
        },
      }),
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
      required: true,
    },
    {
      name: 'permissions',
      type: 'json',
      required: true,
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'providers',
    },
  ],
  timestamps: true,
}
