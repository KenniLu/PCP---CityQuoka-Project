import { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { injectProvider } from '@/hooks/injectProvider'
import { providerListFilter } from "@/utilities/permissions";
import { anyone } from '@/access/anyone';

export const Venues: CollectionConfig = {
  slug: 'venues',
  admin: {
    useAsTitle: 'name',
    components: {
      afterList: ['@/app/(admin)/venues/google-venue-search'],
    },
    baseListFilter: providerListFilter
  },
  access: {
    create: () => true,
    read: anyone,
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
      required: false,
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
      required: false,
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
      required: false
    },
    {
      name: 'phone',
      type: 'text',
      required: false
    },
    {
      name: 'website',
      type: 'text',
      required: false
    },
    {
      name: 'instagramHandle',
      type: 'text',
      required: false
    },
    {
      name: 'tiktokHandle',
      type: 'text',
      required: false
    },
    {
      name: 'xHandle',
      type: 'text',
      required: false
    },
    {
      name: 'facebookUrl',
      type: 'text',
      required: false
    },
    {
      name: 'linktreeUrl',
      type: 'text',
      required: false
    },
    {
      name: 'linkedInUrl',
      type: 'text',
      required: false,
      label: 'Linkedin URL',
    },
    {
      name: 'provider',
      type: 'relationship',
      relationTo: 'providers',
    },
    ...slugField('slug'),
  ],
  hooks: {
    beforeChange: [injectProvider],
  },
}
