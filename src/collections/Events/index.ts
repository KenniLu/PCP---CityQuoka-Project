import { CollectionConfig } from 'payload'

import { defaultLexical } from '@/fields/defaultLexical'
import { slugField } from '@/fields/slug'
import { adminReadWithScope } from '@/utilities/permissions'
import { injectProvider } from '@/hooks/injectProvider'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
    // livePreview: {
    //   url: ({ data }) => `http://localhost:3000/events/${data.slug}?preview=1`,
    //   breakpoints: [
    //     {
    //       label: 'Mobile',
    //       name: 'mobile',
    //       width: 375,
    //       height: 667,
    //     },
    //     {
    //       label: 'Tablet',
    //       name: 'tablet',
    //       width: 768,
    //       height: 1024,
    //     },
    //     {
    //       label: 'Desktop',
    //       name: 'desktop',
    //       width: 1440,
    //       height: 900,
    //     },
    //   ],
    // },
  },
  access: {
    create: () => true,
    read: async (args) =>
      adminReadWithScope(args, {
        slug: 'events',
        where: ({ currentProviderId }) => {
          return {
            provider: {
              equals: currentProviderId,
            },
          }
        },
      }),
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
