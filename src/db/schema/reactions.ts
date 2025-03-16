import {
  pgTable,
  timestamp,
  uuid,
  uniqueIndex,
  pgEnum,
  index
} from '@payloadcms/db-postgres/drizzle/pg-core'

export const reactionTypesEnum = pgEnum('reaction_types', ['save','like']);

export const reactions = pgTable(
  'cms_user_reactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('cms_user_id').notNull(),
    postId: uuid('post_id').notNull(),
    reactionType: reactionTypesEnum().notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (reactions) => [
    uniqueIndex('reactions_user_article_index').on(
      reactions.userId,
      reactions.postId,
      reactions.reactionType
    ),
    index('reactions_user_idx').on(reactions.userId),
    index('reactions_post_idx').on(reactions.postId)
  ],
)
