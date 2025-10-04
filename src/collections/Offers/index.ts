import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { providerListFilter } from '@/utilities/permissions'
import { injectProvider } from '@/hooks/injectProvider'
import { slugField } from '@/fields/slug'
import { defaultLexical } from '@/fields/defaultLexical'

export const Offers: CollectionConfig = {
  slug: 'offers',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'expiresAt'],
    baseListFilter: providerListFilter,
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
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
      admin: {
        description: 'Short copy shown in cards and previews.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'unclaimed',
      options: [
        { label: 'Unclaimed', value: 'unclaimed' },
        { label: 'Ready To Use', value: 'ready' },
        { label: 'Claimed', value: 'claimed' },
      ],
    },
    {
      name: 'startsAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Optional. Controls when the offer begins showing.',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
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
      admin: {
        description: 'Image displayed with the offer.',
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
    ...slugField('title'),
  ],
  hooks: {
    beforeChange: [injectProvider],
  },
  timestamps: true,
}
