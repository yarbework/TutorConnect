export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type Gender = 'MALE' | 'FEMALE';
export type DeliveryMode = 'ONLINE' | 'IN_PERSON_TUTOR_HOME' | 'IN_PERSON_STUDENT_HOME';

export interface DaySchedule {
  start: string; 
  end: string;  
}

export type AvailabilityMatrix = Record<string, DaySchedule[]>;

export interface TutorProfile {
  id: string;
  userId: string;
  bio?: string;
  hourlyRate: number;
  gender?: Gender;
  youtubeVideoUrl?: string;
  youtubeVideoId?: string;
  credentialsDocumentUrl?: string;
  verificationStatus: VerificationStatus;
  subjects: string[];
  deliveryModes: DeliveryMode[];
  cityOrSubcity?: string;
  availability: AvailabilityMatrix;
  createdAt: string;
  updatedAt: string;
}


export interface PublicTutorProfile {
  id: string;
  userId?: string;
  gender: string;
  cityOrSubcity?: string;
  hourlyRate: number;
  bio?: string;
  subjects: string[];
  deliveryModes: string[];
  availability?: Record<string, { start: string; end: string }[]>;
  youtubeVideoId?: string;
  verificationStatus: string;
  averageRating?: number | string; 
  totalReviews?: number;          
}