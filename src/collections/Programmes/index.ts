import { CollectionConfig, FieldHook } from "payload";
import { slugField } from '@/fields/slug'
import { defaultLexical } from '@/fields/defaultLexical'
import { adminReadWithScope } from "@/utilities/permissions";
import { injectProvider } from '@/hooks/injectProvider';

export const Programmes: CollectionConfig = {
  slug: 'programmes',
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
        slug: 'programmes',
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
        read: () => true
      }
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: defaultLexical
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: false
    },
    {
      name: 'events',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      required: true
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'providers',
    },
    ...slugField()
  ],
  hooks: {
    beforeChange: [injectProvider]
  }
}
