'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import GuardianJobCard from '../../../components/jobs/GuardianJobCard';
import { jobsApi } from '../../../lib/api/jobs';
import { JobPost } from '../../../types/job';
import { PlusCircle, Loader2, Briefcase } from 'lucide-react';

export default function GuardianJobsListPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobsApi.getMyJobs();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch guardian jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStatusChange = (updated: JobPost) => {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Tutoring Job Posts</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Review, transition, and manage your current listings and received applications.
            </p>
          </div>

          <Link
            href="/guardian/jobs/new"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-md min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" /> Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No job postings created yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by creating your first tutoring job post to receive applicant video pitches.
            </p>
            <Link
              href="/guardian/jobs/new"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition min-h-[40px]"
            >
              Post a Job Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <GuardianJobCard key={job.id} job={job} onStatusChanged={handleStatusChange} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}