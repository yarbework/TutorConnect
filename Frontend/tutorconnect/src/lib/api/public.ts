import { apiClient } from './client';
import { PublicTutorProfile } from '../../types/tutor';
import { JobPost } from '../../types/job';
import { Review } from '../../types/review';

export interface HomepageData {
  featuredTutors: PublicTutorProfile[];
  recentJobs: JobPost[];
  featuredReviews: Review[];
  stats: {
    verifiedTutorsCount: number;
    activeJobsCount: number;
  };
}

export const publicApi = {
  getFeaturedTutors: () =>
    apiClient<PublicTutorProfile[]>('/tutor/featured', { method: 'GET' }),

  getRecentJobs: () =>
    apiClient<JobPost[]>('/jobs/explore', { method: 'GET' }),

  getFeaturedReviews: () =>
    apiClient<Review[]>('/reviews/featured', { method: 'GET' }),

  getPlatformStats: () =>
    apiClient<{ verifiedTutorsCount: number }>('/tutor/stats/public', { method: 'GET' }),
};