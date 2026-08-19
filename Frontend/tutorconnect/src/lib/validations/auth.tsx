import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .max(128, 'Maximum 128 characters')
    .regex(/[A-Z]/, 'At least 1 uppercase letter')
    .regex(/[a-z]/, 'At least 1 lowercase letter')
    .regex(/[0-9]/, 'At least 1 number')
    .regex(/[@$!%*?&]/, 'At least 1 special character (@$!%*?&)'),
  role: z.enum(['TUTOR', 'GUARDIAN'], {
    error: 'Please select whether you are a tutor or guardian',
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;