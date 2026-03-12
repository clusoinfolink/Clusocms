import { z } from 'zod';

export const updateSettingsSchema = z.record(z.string(), z.unknown());

export type UpdateSettingsData = z.infer<typeof updateSettingsSchema>;
