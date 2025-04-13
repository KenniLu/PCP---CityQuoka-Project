'use client'

import React from 'react'
import { Button } from '@payloadcms/ui'
import { formatDateTime } from '@/utilities/formatDateTime'
import { Report, User } from '@/payload-types'
import { useConfig } from '@payloadcms/ui'

type ReportCustomViewClientProps = {
  report: Report
  user: User
}

export function ReportCustomViewClient({
  report,
  user,
}: ReportCustomViewClientProps) {
  const {
    id,
    report: reportName,
    status,
    requestedAt,
    errors,
    filename,
    createdAt,
    updatedAt,
  } = report

  const Badge = ({ children, color }) => {
    const badgeStyles = {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      TextTransform: 'uppercase',
      color: 'white',
      backgroundColor: color,
    }

    return <span style={badgeStyles}>{children}</span>
  }

  const renderStatusBadge = () => {
    let color = '#4A72B0'

    switch (status) {
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

    return <Badge color={color}>{status}</Badge>
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return formatDateTime(dateString)
  }

  const {
    config: { serverURL },
  } = useConfig()

  const downloadReport = () => {
    if (filename) {
      // Use the server function endpoint for downloading
      const downloadUrl = `${serverURL}/api/reports/download/${id}`

      // Open in a new tab or use direct download
      window.open(downloadUrl, '_blank')
    }
  }


  return (
    <div className="report-custom-view">
      <div className="report-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {renderStatusBadge()}
          {filename && (
            <Button onClick={downloadReport} buttonStyle="primary">
              Download Report
            </Button>
          )}
        </div>
      </div>

      <div
        className="report-details"
        style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '10px 20px' }}
      >
        <div className="label">ID:</div>
        <div>{id}</div>

        <div className="label">Report Type:</div>
        <div>{reportName}</div>

        <div className="label">Status:</div>
        <div>{status}</div>

        <div className="label">Requested At:</div>
        <div>{formatDate(requestedAt)}</div>

        <div className="label">Requested By:</div>
        <div>{user?.name}</div>

        <div className="label">Created At:</div>
        <div>{formatDate(createdAt)}</div>

        <div className="label">Updated At:</div>
        <div>{formatDate(updatedAt)}</div>

        {filename && (
          <>
            <div className="label">Filename:</div>
            <div>{filename}</div>
          </>
        )}

        {status === 'FAILED' && errors && (
          <>
            <div className="label">Errors:</div>
            <div style={{ color: 'red' }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {(errors as string[]).map((error, index) => (
                  <li key={index}>{error as string}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
