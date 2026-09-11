import { apiClient } from './client';
import { Engagement, EngagementMessage, EngagementStatus } from '../../types/engagement';

export const engagementsApi = {
  getMyEngagements: () =>
    apiClient<Engagement[]>('/engagements', {
      method: 'GET',
    }),

  getEngagementById: (id: string) =>
    apiClient<Engagement>(`/engagements/${id}`, {
      method: 'GET',
    }),

  getMessages: (engagementId: string) =>
    apiClient<EngagementMessage[]>(`/engagements/${engagementId}/messages`, {
      method: 'GET',
    }),

  sendMessage: (engagementId: string, content: string) =>
    apiClient<EngagementMessage>(`/engagements/${engagementId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  closeEngagement: (engagementId: string, status: 'COMPLETED' | 'TERMINATED' = 'COMPLETED') =>
    apiClient<Engagement>(`/engagements/${engagementId}/close`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};