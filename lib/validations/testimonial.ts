import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(1).max(100),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  quote: z.string().min(1),
  avatar: z.string().optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5).optional(),
  active: z.boolean().default(true),
});

export type CreateTestimonialData = z.infer<typeof createTestimonialSchema>;
