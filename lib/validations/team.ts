import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  photo: z.string().optional().or(z.literal('')),
  bio: z.string().max(1000).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
  socials: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

export type CreateTeamData = z.infer<typeof createTeamSchema>;
