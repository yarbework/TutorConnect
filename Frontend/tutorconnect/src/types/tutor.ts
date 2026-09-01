export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type Gender = 'MALE' | 'FEMALE';
export type DeliveryMode = 'ONLINE' | 'IN_PERSON_TUTOR_HOME' | 'IN_PERSON_STUDENT_HOME';

export interface DaySchedule {
  start: string; 
  end: string;  
}

export interface AvailabilityMatrix {
  monday?: DaySchedule[];
  tuesday?: DaySchedule[];
  wednesday?: DaySchedule[];
  thursday?: DaySchedule[];
  friday?: DaySchedule[];
  saturday?: DaySchedule[];
  sunday?: DaySchedule[];
}

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

export type PublicTutorProfile = Omit<TutorProfile, 'credentialsDocumentUrl'>;