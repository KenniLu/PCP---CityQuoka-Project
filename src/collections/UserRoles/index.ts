import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { adminReadWithScope } from '@/utilities/permissions'

export const UserRoles: CollectionConfig = {
  slug: 'user-roles',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: async (args) =>
      adminReadWithScope(args, {
        slug: 'user-roles',
        where: ({ currentProviderId }) => {
          return {
            provider: {
              equals: currentProviderId,
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
      admin: {
        components: {
          Field: '@/components/PermissionsField'
        }
      }
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'providers',
    },
  ],
  timestamps: true,
}
