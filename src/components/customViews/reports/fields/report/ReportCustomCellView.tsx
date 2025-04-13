'use client'

import type { DefaultCellComponentProps } from 'payload'
import { Link } from '@payloadcms/ui'

export function ReportCustomCellView(props: DefaultCellComponentProps){
  const {cellData,
  rowData} = props
  return(<Link href={`/admin/collections/reports/${rowData.id}/view`}>
    {cellData}
  </Link>)
}