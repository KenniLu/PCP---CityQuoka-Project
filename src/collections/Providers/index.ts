import { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { adminReadWithScope } from '@/utilities/userUtilities'

export const Providers: CollectionConfig = {
  slug: 'providers',
  admin: {
    useAsTitle: 'name',
    components: {
      listMenuItems: ['@/components/ProviderSwitchButton']
    }
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: async (args) =>
      adminReadWithScope(args, {
        slug: 'providers',
        where: ({ currentProviderId, isSuperAdmin }) => {
          if (isSuperAdmin) {
            return true
          } else {
            return {
              id: {
                equals: currentProviderId,
              },
            }
          }
        },
      }),
    update: authenticated,
  },
  // access: {
  // admin: ({ req }) => {
  //   // Allow admin users to access providers collection in admin panel
  //   if (req.user && (
  //     // Check if the user is an admin user (from the admins collection)
  //     req.user.collection === 'admins' ||
  //     // Or check if the user is a regular user with admin role
  //     (req.user.collection === 'users' && req.user.roles && req.user.roles.includes('admin'))
  //   )) {
  //     return true
  //   }
  //   return false
  // },
  // create: () => true,
  // read: activatedOrInactivated,
  // update: ({ req: { user } }) => {
  //   // Allow admins to update any provider
  //   if (user && (
  //     user.collection === 'admins' ||
  //     (user.collection === 'users' && user.roles && user.roles.includes('admin'))
  //   )) {
  //     return true
  //   }

  //   // Allow provider owners to update their own provider
  //   if (user && user.collection === 'users' && user.roles?.includes('provider') && user.providerOwned) {
  //     return {
  //       id: {
  //         equals: user.providerOwned,
  //       },
  //     }
  //   }
  //   return false
  // },
  // delete: ({ req: { user } }) => {
  //   // Allow admins to delete any provider
  //   if (user && (
  //     user.collection === 'admins' ||
  //     (user.collection === 'users' && user.roles && user.roles.includes('admin'))
  //   )) {
  //     return true
  //   }

  //   // Allow provider owners to delete their own provider
  //   if (user && user.collection === 'users' && user.roles?.includes('provider') && user.providerOwned) {
  //     return {
  //       id: {
  //         equals: user.providerOwned,
  //       },
  //     }
  //   }
  //   return false
  // },
  // },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'altText',
          type: 'text',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'json',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'verificationStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Verified', value: 'verified' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
    },
    // {
    //    name: 'userRoles',
    //    type: 'join',
    //    collection: ''
    // }
  ],
  // hooks: {
  //   beforeDelete: [deleteAssociatedUser, deleteAssociatedProviderPage, deleteAssociatedLocations, deleteAssociatedOffers],
  // },
}
