'use client'

import type { DefaultCellComponentProps } from 'payload'
import { Link } from '@payloadcms/ui'

export function ReportCustomCellStatusView(props: DefaultCellComponentProps){
  const {cellData,
  rowData} = props
  let color = '#4A72B0'
  switch (cellData) {
    case 'COMPLETED':
      color = '#4CAF50'
      break
    case 'FAILED':
      color = '#E74C3C'
      break
    case 'PROCESSING':
      color = '#E67E22'
      break
    default:
      color = '#4A72B0'
  }
  return(<span style={{display: 'inline-block', color: 'white', background: color, padding: '0px 10px 0px 10px', borderRadius: '10px'}}>
    {cellData}
  </span>)
}
