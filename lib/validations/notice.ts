import { z } from 'zod';

export const createNoticeSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  date: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  active: z.boolean().default(true),
});

export type CreateNoticeData = z.infer<typeof createNoticeSchema>;
