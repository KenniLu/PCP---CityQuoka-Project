import { Block } from 'payload'
import { PostLinkField } from '@/fields/postLink'

export const PostGroup: Block = {
  slug: 'PostGroupBlock',
  labels: {
    plural: 'Posts',
    singular: 'Posts'
  },
  fields: [
    {
      name: 'listType',
      type: 'radio',
      admin: {
        layout: 'horizontal',
        width: '50%',
      },
      defaultValue: 'numbered',
      options: [
        {
          label: 'Numbered',
          value: 'numbered',
        },
        {
          label: 'Bulleted',
          value: 'bulleted',
        },
        {
          label: 'None',
          value: 'none',
        },
      ],
    },
    {
      name: 'useSeparator',
      type: 'checkbox',
      admin: {
        width: '50%',
      },
      defaultValue: false,
    },
    {
      name: 'postLinks',
      type: 'array',
      fields: [
        PostLinkField
      ],
      minRows: 1
    }
  ] 
}