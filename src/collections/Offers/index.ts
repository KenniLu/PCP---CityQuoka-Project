import type { CollectionConfig } from 'payload'

import { defaultLexical } from '@/fields/defaultLexical'
import { injectProvider } from '@/hooks/injectProvider'
import { providerListFilter } from '@/utilities/permissions'
import { anyone } from '@/access/anyone'

export const Offers: CollectionConfig = {
  slug: 'offers',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'expiresAt'],
    baseListFilter: providerListFilter,
  },
  access: {
    create: () => true,
    read: anyone,
    readVersions: () => true,
  },
  // Fields that describe the public offers served to the customer app.
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Unclaimed', value: 'unclaimed' },
        { label: 'Ready to Use', value: 'ready' },
        { label: 'Claimed', value: 'claimed' },
      ],
      defaultValue: 'unclaimed',
      required: true,
    },
    {
      name: 'startsAt',
      type: 'date',
    },
    {
      name: 'expiresAt',
      type: 'date',
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Featured', value: 'featured' },
        { label: 'Nearby', value: 'nearby' },
        { label: 'This Week', value: 'this-week' },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      access: {
        read: () => true,
      },
    },
    {
      name: 'body',
      type: 'richText',
      editor: defaultLexical,
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'providers',
      admin: {
        components: {
          Field: '@/components/HiddenProviderField',
        },
        disableListColumn: true,
      },
    },
  ],
  hooks: {
    // Automatically stamp the provider based on the admin's active context.
    beforeChange: [injectProvider],
  },
}
