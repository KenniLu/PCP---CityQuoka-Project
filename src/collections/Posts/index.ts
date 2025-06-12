import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidatePost, loadCurrentPublishedPost } from './hooks/revalidatePost'
import { updateCategoryPosts } from './hooks/updateCategoryPosts'

import { PostGroup } from '@/blocks/PostGroup/config'
import { PostContent } from '@/blocks/PostContent/config'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { adminReadWithScope } from '@/utilities/permissions'

import { slugField } from '@/fields/slug'
import { getServerSideURL } from '@/utilities/getURL'
import { injectProvider } from '@/hooks/injectProvider'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: async (args) =>
      adminReadWithScope(args, {
        slug: 'posts',
        where: ({ currentProviderId }) => {
          return {
            provider: {
              equals: currentProviderId,
            },
          }
        },
        unAuthenticated: {
          _status: {
            equals: 'published',
          },
        },
      }),
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'posts',
        })

        return `${getServerSideURL()}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'posts',
      })

      return `${getServerSideURL()}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subTitle',
      type: 'text',
      required: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      access: {
        read: () => true,
      },
    },
    {
      name: 'hero',
      type: 'checkbox',
      label: 'is Hero Post',
      defaultValue: false,
    },
    {
      name: 'hero_image',
      label: 'Hero Image',
      type: 'upload',
      relationTo: 'media',
      access: {
        read: () => true,
      },
      admin: {
        condition: (_, siblingData) => siblingData.hero,
      },
    },
    {
      name: 'hero_title',
      label: 'Hero Title',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.hero,
      },
      validate: (value, { data }) => {
        if (!value && data.hero) {
          return 'Hero Title is needed when Post is a hero'
        }
        return true
      },
    },
    {
      name: 'hero_subtitle',
      label: 'Hero Subtitle',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.hero,
      },
      validate: (value, { data }) => {
        if (!value && data.hero) {
          return 'Hero Subtitle is needed when Post is a hero'
        }
        return true
      },
    },
    {
      name: 'standalone',
      type: 'checkbox',
      label: 'is Standalone Post',
      defaultValue: false,
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'is Featured Post',
      defaultValue: false,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'content',
              type: 'blocks',
              blocks: [PostContent, PostGroup],
            },
            {
              name: 'summary',
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
            {
              name: 'programmes',
              type: 'relationship',
              relationTo: 'programmes',
              hasMany: true,
              required: false,
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
            {
              name: 'tags',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                },
              ],
              required: false,
            },
            {
              name: 'venue',
              type: 'relationship',
              relationTo: 'venues',
              hasMany: false,
              required: false,
            },
          ],
          label: 'Meta',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'providers',
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [loadCurrentPublishedPost, injectProvider],
    afterChange: [revalidatePost, updateCategoryPosts],
    afterRead: [populateAuthors],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 800,
      },
    },
    maxPerDoc: 50,
  },
}
