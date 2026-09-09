import { z } from 'zod';

export const applyJobSchema = z.object({
  pitch_message: z
    .string()
    .min(20, 'Your pitch must be at least 20 characters explaining your approach')
    .max(3000, 'Pitch cannot exceed 3000 characters'),
  proposed_rate: z
    .number({ error: 'Enter a valid hourly rate' })
    .positive('Hourly rate must be greater than zero')
    .min(100, 'Minimum instruction rate is 100 ETB/hr'),
  video_pitch_url: z
    .string()
    .url('Must be a valid video URL (e.g., YouTube )')
    .optional()
    .or(z.literal('')),
});

export type ApplyJobInput = z.infer<typeof applyJobSchema>;