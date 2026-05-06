import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).transform(s => s.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/(^-|-$)/g, '')),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  coverImage: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/i).optional().default('#0052cc'),
  status: z.enum(['draft', 'published']).optional(),
  published: z.boolean().default(false),
}).transform((data) => {
  if (data.status === 'published') data.published = true;
  else if (data.status === 'draft') data.published = false;
  return data;
});

export type CreateJobData = z.infer<typeof createJobSchema>;
