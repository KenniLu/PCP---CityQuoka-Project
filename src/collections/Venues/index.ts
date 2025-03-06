import { CollectionConfig, FieldHook } from "payload";
import { slugField } from '@/fields/slug'

export const Venues: CollectionConfig = {
  slug: 'venues',
  admin: {
    useAsTitle: 'name',
    components: {
      afterList: ['@/app/(admin)/venues/google-venue-search'],
    }
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
      name: 'address',
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
    {
      name: 'googlePlaceId',
      type: 'text',
      required: false,
      unique: true
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
      unique: true
    },
    {
      name: 'website',
      type: 'text',
      required: false,
      unique: true
    },
    {
      name: 'instagramHandle',
      type: 'text',
      required: false,
      unique: true
    },
    {
      name: 'tiktokHandle',
      type: 'text',
      required: false,
      unique: true
    },
    {
      name: 'xHandle',
      type: 'text',
      required: false,
      unique: true
    },
    {
      name: 'facebookUrl',
      type: 'text',
      required: false,
      unique: true
    },
    {
      name: 'linktreeUrl',
      type: 'text',
      required: false,
      unique: true
    },
    {
      name: 'linkedInUrl',
      type: 'text',
      required: false,
      unique: true
    },
    ...slugField('slug')
  ]
}