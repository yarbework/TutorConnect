import { apiClient } from './client';
import { Review, CreateReviewInput } from '../../types/review';

export interface EngagementReviewsResponse {
  myReview: Review | null;
  counterpartyReview: Review | null;
}

export const reviewsApi = {
  submitReview: (data: CreateReviewInput) =>
    apiClient<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getTutorReviews: (tutorUserId: string) =>
    apiClient<Review[]>(`/reviews/tutor/${tutorUserId}`, {
      method: 'GET',
    }),

  getEngagementReviewStatus: (engagementId: string) =>
    apiClient<{ hasReviewed: boolean }>(`/reviews/engagement/${engagementId}/status`, {
      method: 'GET',
    }),
  
  getEngagementReviews: (engagementId: string) =>
  apiClient<EngagementReviewsResponse>(`/reviews/engagement/${engagementId}`, {
    method: 'GET',
  }),
};