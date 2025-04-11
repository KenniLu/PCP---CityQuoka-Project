import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { pupulateDefaultFields } from './hooks/pupulateDefaultFields'
import { downloadReport } from './hooks/downloadReport'

export const Reports: CollectionConfig = {
  slug: 'reports',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  endpoints: [{
    path: '/download/:id',
    method: 'get',
    handler: downloadReport,
  }],
  admin: {
    defaultColumns: ['report', 'requestedAt', 'requestor', 'status'],
    useAsTitle: 'report',
    components: {
      views: {
        edit: {
          customReportView: {
            Component: '/components/customViews/reports/view/ReportCustomView.Server#ReportCustomViewServer',
            path: '/view',
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'report',
      type: 'select',
      required: true,
      admin: {
        // Reference : packages/ui/src/elements/TableColumns/buildColumnState.tsx
        // Reference : packages/ui/src/elements/TableColumns/RenderDefaultCell/index.tsx
        components: {
          Cell: '/components/customViews/reports/fields/report/ReportCustomCellView#ReportCustomCellView',
        },
      },
      options: [{ label: 'Posts Audit Report', value: 'PostsAuditReport' }],
    },
    {
      name: 'requestedAt',
      type: 'date',
      admin: {
        hidden: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'requestor',
      type: 'relationship',
      admin: {
        hidden: true,
      },
      hasMany: false,
      relationTo: 'users',
    },
    {
      name: 'status',
      type: 'select',
      admin: {
        hidden: true,
      },
      options: [
        { label: 'Requested', value: 'REQUESTED' },
        { label: 'Processing', value: 'PROCESSING' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Failed', value: 'FAILED' },
      ],
    },
    {
      name: 'errors',
      type: 'json',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'filename',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeChange: [pupulateDefaultFields],
  },
}
