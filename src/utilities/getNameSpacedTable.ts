import { type BasePayload } from 'payload'

export const getNameSpacedTable = (payload: BasePayload, tableName: string): string => {
  return payload.db.schemaName ? `"${payload.db.schemaName}"."${tableName}"` : tableName
}
