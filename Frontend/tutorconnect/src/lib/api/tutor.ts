import { apiClient } from './client';
import { TutorProfile, PublicTutorProfile } from '../../types/tutor';
import { TutorProfileFormInput } from '../../lib/validations/tutor';

export interface TutorBrowseFilters {
  subject?: string;
  city?: string;
  maxRate?: number;
  deliveryMode?: string;
  gender?: string;
}

export const tutorApi = {
  getMyProfile: () => 
    apiClient<TutorProfile>('/tutor/profile/me', {
      method: 'GET',
    }),

  updateProfile: (data: TutorProfileFormInput) => 
    apiClient<TutorProfile>('/tutor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
getFeaturedTutors: () =>
    apiClient<PublicTutorProfile[]>('/tutor/featured', {
      method: 'GET',
    }),
    
  getPublicProfile: (profileId: string) => 
    apiClient<PublicTutorProfile>(`/tutor/profile/${profileId}`, {
      method: 'GET',
    }),

    browseTutors: (filters: TutorBrowseFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.city) params.append('city', filters.city);
    if (filters.maxRate) params.append('maxRate', filters.maxRate.toString());
    if (filters.deliveryMode) params.append('deliveryMode', filters.deliveryMode);
    if (filters.gender && filters.gender !== 'ANY') params.append('gender', filters.gender);

    const queryString = params.toString();
    return apiClient<PublicTutorProfile[]>(`/tutor${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },
};