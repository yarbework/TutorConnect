import { apiClient } from './client';
import { RegisterInput } from '../../lib/validations/auth';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: 'TUTOR' | 'GUARDIAN';
    isEmailVerified: boolean;
  };
  token: string;
}

export const authApi = {
  register: (data: RegisterInput) => 
    apiClient<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) => 
    apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyEmail: (token: string) => 
    apiClient<{ message: string }>(`/auth/verify-email?token=${token}`, {
      method: 'GET',
    }),

  getCurrentUser: () => 
    apiClient<AuthResponse['user']>('/auth/me', {
      method: 'GET',
    }),
};