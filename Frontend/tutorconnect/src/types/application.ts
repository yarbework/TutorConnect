import { JobPost } from './job';

export type ApplicationStatus = 'SUBMITTED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';

export interface JobApplication {
  id: string;
  job_id: string;
  tutor_id: string;
  pitch_message: string;
  proposed_rate: number;
  video_pitch_url: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  tutor?: {
    id: string;
    email: string;
  };
  job?: JobPost;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransactionItem {
  id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT' | 'REFUND';
  reason: 'REGISTRATION_BONUS' | 'JOB_APPLICATION' | 'CONNECTS_PURCHASE' | 'ADMIN_ADJUSTMENT';
  referenceId: string | null;
  description: string | null;
  createdAt: string;
}