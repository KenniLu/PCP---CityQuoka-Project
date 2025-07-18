import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { providerListFilter } from "@/utilities/permissions";
import { authenticated } from '../../access/authenticated'
import { injectProvider } from '@/hooks/injectProvider';
import { anyone } from '@/access/anyone';

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    baseListFilter: providerListFilter
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'providers',
      admin: {
        components: {
          Field: '@/components/HiddenProviderField'
        },
        disableListColumn: true
      }
    }
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    // staticDir: path.resolve(dirname, '../../public/media'),
    mimeTypes: ['image/*'],
    focalPoint: true
  },
  hooks: {
    beforeChange: [injectProvider]
  }
}
