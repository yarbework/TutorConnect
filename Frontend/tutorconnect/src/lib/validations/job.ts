import { z } from 'zod';

export const createJobPostSchema = z
  .object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    subject: z
      .string()
      .min(2, 'Subject is required')
      .max(100, 'Subject cannot exceed 100 characters'),
    grade_level: z.enum([
      'KINDERGARTEN',
      'ELEMENTARY_LOWER',
      'ELEMENTARY_UPPER',
      'MIDDLE_SCHOOL',
      'HIGH_SCHOOL',
      'UNDERGRADUATE',
      'ADULT',
    ]),
    learning_objectives: z
      .string()
      .min(15, 'Please describe specific learning goals and student weaknesses'),
    max_hourly_budget: z
      .number({ error: 'Enter a valid hourly budget' })
      .positive('Hourly budget must be greater than zero')
      .min(100, 'Minimum budget is 100 ETB/hr'),
    weekly_hours_commitment: z
      .number({ error: 'Enter weekly hours' })
      .min(1, 'Minimum commitment is 1 hour/week')
      .max(80, 'Maximum commitment is 80 hours/week'),
    teaching_mode: z.enum([
      'ONLINE',
      'IN_PERSON_STUDENT_HOME',
      'IN_PERSON_TUTOR_HOME',
    ]),
    city: z.string().optional(),
    physical_address: z.string().optional(),
    virtual_meeting_link: z
      .string()
      .url('Invalid URL format for virtual meeting link')
      .optional()
      .or(z.literal('')),
    preferred_tutor_gender: z.enum(['ANY', 'MALE', 'FEMALE']),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.teaching_mode !== 'ONLINE') {
      if (!data.city || data.city.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['city'],
          message: 'City/Subcity is required for in-person tutoring',
        });
      }
      if (!data.physical_address || data.physical_address.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['physical_address'],
          message: 'Physical address/meeting location is required for in-person tutoring',
        });
      }
    }
  });

export type CreateJobPostInput = z.infer<typeof createJobPostSchema>;