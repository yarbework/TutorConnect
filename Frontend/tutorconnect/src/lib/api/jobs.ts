import { apiClient } from './client';
import { JobPost, JobStatus, ExploreJobsFilters } from '../../types/job';
import { CreateJobPostInput } from '../validations/job';

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
};