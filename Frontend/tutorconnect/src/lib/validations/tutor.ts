import { z } from 'zod';

export const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/;

export const DOCUMENT_URL_REGEX =
  /^(https?:\/\/)?((drive\.google\.com\/(file\/d\/|drive\/folders\/|open\?id=)[a-zA-Z0-9_-]+)|(www\.)?canva\.com\/(design\/[a-zA-Z0-9_-]+)).*$/;

export const timeSlotSchema = z.object({
  start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time format must be HH:MM'),
  end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time format must be HH:MM'),
});

export const tutorProfileSchema = z.object({
  bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional().or(z.literal('')),
  hourlyRate: z
    .number({ invalid_type_error: 'Enter a valid hourly rate' })
    .min(100, 'Minimum rate is 100 ETB/hr')
    .max(1000, 'Maximum rate is 1,000 ETB/hr'),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Select your gender' }),
  youtubeVideoUrl: z
    .string()
    .regex(YOUTUBE_URL_REGEX, 'Must be a valid YouTube link')
    .optional()
    .or(z.literal('')),
  credentialsDocumentUrl: z
    .string()
    .regex(DOCUMENT_URL_REGEX, 'Must be a valid Google Drive or Canva share URL')
    .optional()
    .or(z.literal('')),
  subjects: z.array(z.string()).min(1, 'Select at least one subject'),
  deliveryModes: z
    .array(z.enum(['ONLINE', 'IN_PERSON_TUTOR_HOME', 'IN_PERSON_STUDENT_HOME']))
    .min(1, 'Select at least one delivery mode'),
  cityOrSubcity: z.string().min(2, 'Enter your city or subcity location (e.g. Addis Ababa, Bole)'),
  availability: z.record(z.array(timeSlotSchema)).default({}),
});

export type TutorProfileFormInput = z.infer<typeof tutorProfileSchema>;