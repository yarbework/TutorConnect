import { apiClient } from './client';
import { TutorProfile, PublicTutorProfile } from '../../types/tutor';
import { TutorProfileFormInput } from '../../lib/validations/tutor';

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

  getPublicProfile: (profileId: string) => 
    apiClient<PublicTutorProfile>(`/tutor/profile/${profileId}`, {
      method: 'GET',
    }),
};