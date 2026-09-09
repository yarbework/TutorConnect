'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { jobsApi } from '../../../lib/api/jobs';
import { JobApplication, ApplicationStatus } from '../../../types/application';
import { useAuthStore } from '../../../store/useAuthStore';
import { 
  ChevronRight, 
  Home, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Star, 
  ArrowRight, 
  Loader2, 
  ExternalLink,
  MessageSquare,
  Coins
} from 'lucide-react';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; badge: string; icon: any }> = {
  SUBMITTED: { label: 'Under Review', badge: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  SHORTLISTED: { label: 'Shortlisted', badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: Star },
  ACCEPTED: { label: 'Hired & Accepted', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  REJECTED: { label: 'Closed / Declined', badge: 'bg-slate-100 text-slate-600 border-slate-200', icon: XCircle },
};

export default function TutorApplicationsPage() {
  const { isHydrated, isAuthenticated } = useAuthStore();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState<'ALL' | ApplicationStatus>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await jobsApi.getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      fetchApplications();
    }
  }, [isHydrated, isAuthenticated, fetchApplications]);

  const filteredApps = filter === 'ALL'
    ? applications
    : applications.filter((app) => app.status === filter);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/tutor/dashboard" className="hover:text-slate-900 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold">My Submitted Proposals</span>
        </nav>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Application Tracker</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Monitor the status of your tutoring proposals and view guardian feedback.
            </p>
          </div>

          <Link
            href="/tutor/jobs"
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-sm min-h-[44px]"
          >
            <Briefcase className="w-4 h-4" /> Browse More Jobs
          </Link>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: `All Proposals (${applications.length})` },
            { id: 'SUBMITTED', label: `Under Review (${applications.filter((a) => a.status === 'SUBMITTED').length})` },
            { id: 'SHORTLISTED', label: `Shortlisted (${applications.filter((a) => a.status === 'SHORTLISTED').length})` },
            { id: 'ACCEPTED', label: `Hired (${applications.filter((a) => a.status === 'ACCEPTED').length})` },
            { id: 'REJECTED', label: `Closed (${applications.filter((a) => a.status === 'REJECTED').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                filter === tab.id
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Proposals Stream */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No applications found in this view</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t submitted proposals with this status. Explore the marketplace to find matching tutoring requirements.
            </p>
            <Link
              href="/tutor/jobs"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              Find Tutoring Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const statusCfg = STATUS_CONFIG[app.status];
              const Icon = statusCfg.icon;

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4 hover:border-slate-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{app.job?.title || 'Tutoring Job'}</h3>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusCfg.badge}`}>
                          <Icon className="w-3 h-3" /> {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Subject: <strong className="text-slate-700">{app.job?.subject || 'General'}</strong> • Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/60 text-right self-start sm:self-auto">
                      <span className="text-sm font-black text-blue-900 block">
                        {app.proposed_rate} <span className="text-xs font-normal text-slate-500">ETB/hr</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">Your Proposed Rate</span>
                    </div>
                  </div>

                  {/* Pitch Summary */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Your Submitted Proposal:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-200/60">
                      {app.pitch_message}
                    </p>
                  </div>

                  {/* Next Step Banner if ACCEPTED */}
                  {app.status === 'ACCEPTED' && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-2 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Congratulations! The guardian accepted your proposal. Check your messages to coordinate sessions.</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}