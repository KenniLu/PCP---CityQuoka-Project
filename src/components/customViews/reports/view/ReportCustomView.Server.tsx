import type { DocumentViewServerProps } from 'payload'

import { SetStepNav } from '@payloadcms/ui'
import { notFound, redirect } from 'next/navigation.js'
import React, { Fragment } from 'react'
import { Report, User } from '@/payload-types'
import { ReportCustomViewClient } from './ReportCustomView.Client'

export async function ReportCustomViewServer({ initPageResult, doc }: DocumentViewServerProps) {
  if (!initPageResult) {
    notFound()
  }

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

  const {
    permissions: { canAccessAdmin },
    req,
  } = initPageResult

  const { payload, user } = req

  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = payload

  // If an unauthorized user tries to navigate straight to this page,
  // Boot 'em out
  if (!user || (user && !canAccessAdmin)) {
    return redirect(`${adminRoute}/unauthorized`)
  }

  return (
    <Fragment>
      <SetStepNav
        nav={[
          {
            label: 'Reports',
            url: '/admin/collections/reports',
          },
          {
            label: 'Report View',
          },
        ]}
      />
      <div
        style={{
          marginTop: 'calc(var(--base) * 2)',
          paddingLeft: 'var(--gutter-h)',
          paddingRight: 'var(--gutter-h)',
        }}
      >
        <ReportCustomViewClient report={doc as Report}/>
      </div>
    </Fragment>
  )
}
