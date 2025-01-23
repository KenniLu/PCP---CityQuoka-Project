import type { Field } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const PostLinkField: Field = {
  name: 'postLink',
  type: 'group',
  admin: {
    hideGutter: true,
  },
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
