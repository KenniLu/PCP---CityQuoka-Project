import { CollectionConfig } from 'payload'

import { defaultLexical } from '@/fields/defaultLexical'
import { slugField } from '@/fields/slug'
import { injectProvider } from '@/hooks/injectProvider'
import { providerListFilter } from "@/utilities/permissions";
import { anyone } from '@/access/anyone';

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
    baseListFilter: providerListFilter
  },
  access: {
    create: () => true,
    read: anyone,
    readVersions: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      required: false,
      access: {
        read: () => true,
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
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
        disableListColumn: true
      },
    },
    {
      name: 'venue',
      type: 'relationship',
      relationTo: 'venues',
      hasMany: false,
      required: false,
    },
    {
      name: 'event_start_datetime',
      type: 'date',
      required: false,
    },
    {
      name: 'event_end_datetime',
      type: 'date',
      required: false,
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [injectProvider],
  },
}
