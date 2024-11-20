import type { FieldHook } from 'payload'

export const updateChildren: FieldHook = ({ req: { payload }, originalDoc, data }) => {
  return payload
    .find({
      collection: 'categories',
      where: {
        'parent.id': {
          equals: originalDoc?.id || data?.id,
        },
      },
    })
    .then((result) => result.docs.map((doc) => doc.id))
}
