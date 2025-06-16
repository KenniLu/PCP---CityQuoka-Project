import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedAsAdmin } from '@/access/authenticatedAsAdmin'
import { providerListFilter } from '@/utilities/permissions'

export const UserRoles: CollectionConfig = {
  slug: 'user-roles',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticatedAsAdmin,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
    baseListFilter: providerListFilter,
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
          Field: '@/components/PermissionsField',
        },
      },
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'providers',
      admin: {
        components: {
          Field: '@/components/HiddenProviderField',
        },
      },
    },
  ],
  timestamps: true,
}
