import type { CollectionBeforeChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Report } from '../../../payload-types'

export const pupulateDefaultFields: CollectionBeforeChangeHook<Report> = ({ req, data }) => {
  if (!data.requestedAt) {
    data.requestedAt = new Date().toISOString()
  }
  if (!data.requestor) {
    data.requestor = req.user?.id
  }
  if (!data.status) {
    data.status = 'REQUESTED'
  }
  return data
}
