import { z } from 'zod';

export const createServiceSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  icon: z.string().optional(),
  image: z.string().optional().or(z.literal('')),
  features: z.array(z.string()).optional(),
  order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export type CreateServiceData = z.infer<typeof createServiceSchema>;
