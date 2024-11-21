import { CollectionConfig, FieldHook } from "payload";
import { slugField } from '@/fields/slug'

export const Venues: CollectionConfig = {
  slug: 'venues',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false
    },
    {
      name: 'address_line_1',
      type: 'text',
      required: false,
    },
    {
      name: 'address_line_2',
      type: 'text',
      required: false,
    },
    {
      name: 'city',
      type: 'text',
      required: false,
    },
    {
      name: 'state_province',
      type: 'text',
      required: false,
    },
    {
      name: 'country',
      type: 'text',
      required: false,
    },
    {
      name: 'postal_code',
      type: 'text',
      required: false
    },
    {
      name: 'latitude',
      type: 'text',
      required: false,

    },
    {
      name: 'longitude',
      type: 'text',
      required: false,

    },
    ...slugField()
  ]
}