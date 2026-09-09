'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/Footer';
import ApplicantCard from '../../../../../components/guardian/ApplicantCard';
import { jobsApi } from '../../../../../lib/api/jobs';
import { JobPost } from '../../../../../types/job';
import { JobApplication, ApplicationStatus } from '../../../../../types/application';
import { useAuthStore } from '../../../../../store/useAuthStore';
import { 
  ChevronRight, 
  Home, 
  Briefcase, 
  Users, 
  Loader2, 
  ArrowLeft, 
  Filter 
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function JobApplicantsPage({ params }: PageProps) {
  const resolvedParams = 'then' in params ? use(params) : params;
  const jobId = resolvedParams.id;

  const { isHydrated, isAuthenticated } = useAuthStore();
  const [job, setJob] = useState<JobPost | null>(null);
  const [applicants, setApplicants] = useState<JobApplication[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | ApplicationStatus>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [jobData, applicantsData] = await Promise.all([
        jobsApi.getJobById(jobId),
        jobsApi.getJobApplicants(jobId).catch((err) => {
          console.error('Error fetching applicants:', err.message || err);
          return [] as JobApplication[];
        }),
      ]);
      setJob(jobData);
      setApplicants(applicantsData);

    } catch (err: any) {
      console.error('Failed to load applicant board data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      loadData();
    }
  }, [isHydrated, isAuthenticated, loadData]);

  const handleStatusUpdate = (updated: JobApplication) => {
    setApplicants((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const filteredApplicants = activeFilter === 'ALL'
    ? applicants
    : applicants.filter((a) => a.status === activeFilter);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/guardian/dashboard" className="hover:text-slate-900 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/guardian/jobs" className="hover:text-slate-900">
            My Job Posts
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-xs">
            {job?.title || 'Applicant Review Board'}
          </span>
        </nav>

        {job && (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/20 px-3 py-1 rounded-full">
                  {job.status}
                </span>
                <h1 className="text-2xl font-black mt-2 text-white">{job.title}</h1>
                <p className="text-xs text-blue-200 mt-1">
                  Subject: <strong className="text-white">{job.subject}</strong> • Grade: {job.grade_level} • Budget: {job.max_hourly_budget} ETB/hr
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-right">
                <span className="text-2xl font-black text-amber-300">{applicants.length}</span>
                <p className="text-[11px] font-bold text-blue-200">Proposals Received</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: `All Proposals (${applicants.length})` },
            { id: 'SUBMITTED', label: `New (${applicants.filter((a) => a.status === 'SUBMITTED').length})` },
            { id: 'SHORTLISTED', label: `Shortlisted (${applicants.filter((a) => a.status === 'SHORTLISTED').length})` },
            { id: 'ACCEPTED', label: `Hired (${applicants.filter((a) => a.status === 'ACCEPTED').length})` },
            { id: 'REJECTED', label: `Declined (${applicants.filter((a) => a.status === 'REJECTED').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                activeFilter === tab.id
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No proposals in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tutors applying from the marketplace will appear here with their strategy pitches and hourly rates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((app) => (
              <ApplicantCard
                key={app.id}
                application={app}
                maxBudget={Number(job?.max_hourly_budget) || 300}
                onStatusChanged={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}