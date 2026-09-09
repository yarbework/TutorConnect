export type JobStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'IN_REVIEW'
  | 'AWARDED'
  | 'COMPLETED'
  | 'ARCHIVED';

export type TargetGradeLevel =
  | 'KINDERGARTEN'
  | 'ELEMENTARY_LOWER'
  | 'ELEMENTARY_UPPER'
  | 'MIDDLE_SCHOOL'
  | 'HIGH_SCHOOL'
  | 'UNDERGRADUATE'
  | 'ADULT';

export type TeachingMode =
  | 'ONLINE'
  | 'IN_PERSON_STUDENT_HOME'
  | 'IN_PERSON_TUTOR_HOME';

export type PreferredGender = 'ANY' | 'MALE' | 'FEMALE';

export interface JobPost {
  id: string;
  guardian_id: string;
  title: string;
  subject: string;
  grade_level: TargetGradeLevel;
  learning_objectives: string;
  max_hourly_budget: number;
  weekly_hours_commitment: number;
  teaching_mode: TeachingMode;
  city?: string | null;
  physical_address?: string | null;
  virtual_meeting_link?: string | null;
  preferred_tutor_gender: PreferredGender;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  
}
export interface JobInvitation {
  id: string;
  job_id: string;
  guardian_id: string;
  tutor_id: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  job: {
    id: string;
    title: string;
    subject: string;
    grade_level: string;
    max_hourly_budget: number;
    teaching_mode: string;
    city?: string;
  };
  guardian: {
    id: string;
    email: string;
  };
}

export interface ExploreJobsFilters {
  subject?: string;
  grade_level?: TargetGradeLevel;
  min_budget?: number;
  teaching_mode?: TeachingMode;
  city?: string;
}