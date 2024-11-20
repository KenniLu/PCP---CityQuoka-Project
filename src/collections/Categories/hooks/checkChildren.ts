import type { CollectionBeforeDeleteHook } from 'payload'

export const checkChildren: CollectionBeforeDeleteHook = async ({ req: { payload }, id }) => {
  const children = await payload.find({
    collection: 'categories',
    where: {
      'parent.id': {
        equals: id,
      },
    },
  });

  if (children.totalDocs > 0) {
    throw new Error('Cannot delete category with children. Please remove or reassign child categories first.');
  }
}