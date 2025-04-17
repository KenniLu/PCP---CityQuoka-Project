import type { CollectionAfterChangeHook } from 'payload'
import type { Report } from '../../../payload-types'
import { sendSQSMessage } from '@/utilities/sqsUtilities'

export const requestReportGeneration: CollectionAfterChangeHook<Report> = async ({
  doc,
  operation,
}) => {
  if (process.env.NODE_ENV === 'production' && operation === 'create') {
    await sendSQSMessage(process.env.REPORTS_SQS_QUEUE_URL!, {
      reportId: doc.id,
      reportType: 'PostsAuditReport',
    })
  }
}
