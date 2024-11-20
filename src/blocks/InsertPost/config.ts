import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const InsertPost: Block = {
  slug: 'insertPost',
  interfaceName: 'InsertPost',
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      maxDepth: 2,
      label: 'Post',
      admin: {
        allowCreate: false,
      },
      validate: async (value, { id }) => {
        if (!value) {
          return 'Post is required'
        }
        if (parseInt(value) === parseInt(id)) {
          return 'Self reference to current post is not allowed'
        }
        return true
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Summary',
      required: false,
    },
  ],
}
