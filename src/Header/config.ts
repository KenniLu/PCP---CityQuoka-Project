import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { isSuperAdmin } from '@/access/isSuperAdmin'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: isSuperAdmin,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'icon',
          type: 'text',
          required: false,
        }
      ],
      maxRows: 6,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
