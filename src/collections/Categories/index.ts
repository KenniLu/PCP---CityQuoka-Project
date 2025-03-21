import { CollectionConfig } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { checkChildren } from './hooks/checkChildren'
import { updateChildren } from './hooks/updateChildren'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
      // Add filtering to prevent circular references
      filterOptions: ({ id }) => {
        return {
          id: {
            not_equals: (id||0),
          },
        }
      },
    },
    // Optional: Add a field to show direct children
    {
      name: 'children',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        disabled: true, // This makes it read-only
      },
      hooks: {
        beforeChange: [updateChildren],
      },
    },
    ...slugField()
  ],
  hooks: {
    // Optional: Prevent deletion if category has children
    beforeDelete: [checkChildren],
  },
}
