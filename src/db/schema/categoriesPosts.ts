import {
  pgTable,
  integer,
  timestamp,
  uuid,
  index,
  text,
  boolean
} from '@payloadcms/db-postgres/drizzle/pg-core'

export const categoriesPosts = pgTable(
  'categories_posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    categoryId: integer('category_id').notNull(),
    postId: integer('post_id').notNull(),
    categoryPath: text('category_path').notNull(),
    featured: boolean('is_featured'),
    recommended: boolean('is_recommended'),
    standalone: boolean('standalone'),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
  (categoriesPosts) => [
    index('categories_posts_category_idx').on(categoriesPosts.categoryId),
    index('categories_posts_post_idx').on(categoriesPosts.postId),
    index('categories_posts_category_path_idx').on(categoriesPosts.categoryPath),
    index('categories_posts_featured_idx').on(categoriesPosts.featured),
    index('categories_posts_recommended_idx').on(categoriesPosts.recommended),
    index('categories_posts_standalone_idx').on(categoriesPosts.standalone)
  ],
)
