import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).transform(s => s.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/(^-|-$)/g, '')),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  author: z.string().default('cluso'),
  category: z.string().optional(),
  coverImage: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional(),
  published: z.boolean().default(false),
}).transform((data) => {
  if (data.status === 'published') data.published = true;
  else if (data.status === 'draft') data.published = false;
  return data;
});

export type CreateBlogData = z.infer<typeof createBlogSchema>;
