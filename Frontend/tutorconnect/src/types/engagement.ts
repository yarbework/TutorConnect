import { JobPost } from './job';

export type EngagementStatus = 'ACTIVE' | 'COMPLETED' | 'TERMINATED';

export interface EngagementMessage {
  id: string;
  engagementId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    email: string;
  };
}

export interface Engagement {
  id: string;
  jobId: string;
  guardianId: string;
  tutorId: string;
  agreedHourlyRate: number;
  status: EngagementStatus;
  closedByUserId: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  job?: JobPost;
  guardian?: {
    id: string;
    email: string;
  };
  tutor?: {
    id: string;
    email: string;
  };
  messages?: EngagementMessage[];
}