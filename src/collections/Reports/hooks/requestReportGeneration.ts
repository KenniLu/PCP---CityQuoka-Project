import type { CollectionAfterChangeHook } from 'payload'
import type { Report } from '../../../payload-types'
import { sendSQSMessage } from '@/utilities/sqsUtilities'

export const requestReportGeneration: CollectionAfterChangeHook<Report> = async ({ req, doc }) => {
  if (process.env.NODE_ENV === 'production') {
    await sendSQSMessage(process.env.REPORTS_SQS_QUEUE_URL!, {
      reportId: doc.id,
      reportType: 'PostsAuditReport',
    })
  }
}
