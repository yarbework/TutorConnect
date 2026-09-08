'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import JobFilterBar from '../../../components/jobs/JobFilterBar';
import TutorJobCard from '../../../components/jobs/TutorJobCard';
import { jobsApi } from '../../../lib/api/jobs';
import { JobPost, ExploreJobsFilters } from '../../../types/job';
import { Loader2, Briefcase } from 'lucide-react';

export default function TutorExploreJobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ExploreJobsFilters>({});

  const loadJobs = useCallback(async (searchFilters: ExploreJobsFilters) => {
    setLoading(true);
    try {
      const data = await jobsApi.exploreJobs(searchFilters);
      setJobs(data);
    } catch (err) {
      console.error('Failed to load explore jobs', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs(filters);
  }, [loadJobs, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Explore Tutoring Jobs</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse active jobs posted by parents and guardians matching your subjects and preferred teaching format.
          </p>
        </div>

        {/* Filter Bar */}
        <JobFilterBar
          filters={filters}
          onApplyFilters={(newFilters) => {
            setFilters(newFilters);
            loadJobs(newFilters);
          }}
          onResetFilters={() => {
            setFilters({});
            loadJobs({});
          }}
        />

        {/* Results Stream */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No open jobs found matching your filters</p>
            <p className="text-xs text-slate-500">
              Try broadening your subject keywords or clearing the budget/location filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {jobs.length} Available {jobs.length === 1 ? 'Job' : 'Jobs'} Found
            </p>
            {jobs.map((job) => (
              <TutorJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}