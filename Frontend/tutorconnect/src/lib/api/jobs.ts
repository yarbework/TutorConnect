import { apiClient } from './client';
import { JobPost, JobStatus, ExploreJobsFilters } from '../../types/job';
import { CreateJobPostInput } from '../validations/job';
import {JobInvitation} from '../../types/job';
import { JobApplication, ApplicationStatus, Wallet, WalletTransactionItem } from '../../types/application';
import { ApplyJobInput } from '../validations/application';

export const jobsApi = {
  createJob: (data: CreateJobPostInput) =>
    apiClient<JobPost>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyJobs: () =>
    apiClient<JobPost[]>('/jobs/my-posts', {
      method: 'GET',
    }),

  getJobById: (id: string) =>
    apiClient<JobPost>(`/jobs/${id}`, {
      method: 'GET',
    }),

  updateJobStatus: (id: string, status: JobStatus) =>
    apiClient<JobPost>(`/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),



  exploreJobs: (filters: ExploreJobsFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.grade_level) params.append('grade_level', filters.grade_level);
    if (filters.min_budget) params.append('min_budget', filters.min_budget.toString());
    if (filters.teaching_mode) params.append('teaching_mode', filters.teaching_mode);
    if (filters.city) params.append('city', filters.city);

    const queryString = params.toString();
    return apiClient<JobPost[]>(`/jobs/explore${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

sendInvitation: (data: { job_id: string; tutor_id: string; message: string }) =>
  apiClient<JobInvitation>('/jobs/invitations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

getMyInvitations: () =>
  apiClient<JobInvitation[]>('/jobs/invitations/my-invitations', {
    method: 'GET',
  }),

respondToInvitation: (id: string, status: 'ACCEPTED' | 'DECLINED') =>
  apiClient<JobInvitation>(`/jobs/invitations/${id}/respond`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),

getMyWallet: () =>
    apiClient<Wallet>('/jobs/wallet/me', {
      method: 'GET',
    }),
  
  getWalletTransactions: () =>
  apiClient<WalletTransactionItem[]>('/jobs/wallet/transactions', {
    method: 'GET',
  }),

  applyToJob: (jobId: string, data: ApplyJobInput) =>
    apiClient<JobApplication>(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyApplications: () =>
    apiClient<JobApplication[]>('/jobs/applications/my-proposals', {
      method: 'GET',
    }),

  getJobApplicants: (jobId: string) =>
    apiClient<JobApplication[]>(`/jobs/${jobId}/applicants`, {
      method: 'GET',
    }),

  reviewApplication: (applicationId: string, status: ApplicationStatus) =>
    apiClient<JobApplication>(`/jobs/applications/${applicationId}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),


};