'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ConnectsBalanceCard from '../../../components/dashboard/shared/ConnectsBalanceCard';
import GuardianMetrics from '../../../components/dashboard/guardian/GuardianMetrics';
import GuardianJobsList from '../../../components/dashboard/guardian/GuardianJobsList';
import GuardianFeaturedTutors from '../../../components/dashboard/guardian/GuardianFeaturedTutors';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { jobsApi } from '../../../lib/api/jobs';
import { tutorApi } from '../../../lib/api/tutor';
import { JobPost } from '../../../types/job';
import { PublicTutorProfile } from '../../../types/tutor';
import { Loader2 } from 'lucide-react';

export default function GuardianDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [featuredTutors, setFeaturedTutors] = useState<PublicTutorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [jobsData, tutorsData] = await Promise.all([
        jobsApi.getMyJobs().catch(() => [] as JobPost[]),
        tutorApi.getFeaturedTutors().catch(() => [] as PublicTutorProfile[]),
      ]);
      setJobs(jobsData);
      setFeaturedTutors(tutorsData);
    } catch (err) {
      console.error('Failed to load guardian dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user?.role !== 'GUARDIAN') {
      router.replace('/tutor/dashboard');
      return;
    }

    fetchDashboardData();
  }, [isHydrated, isAuthenticated, user, router, fetchDashboardData]);

  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Dynamic KPI calculations directly from database state
  const activeJobsCount = jobs.filter((j) => j.status === 'PUBLISHED').length;
  const inReviewJobsCount = jobs.filter((j) => j.status === 'IN_REVIEW').length;
  const hiredJobsCount = jobs.filter(
    (j) => j.status === 'AWARDED' || j.status === 'COMPLETED'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Guardian Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Welcome back, <strong className="text-slate-900">{user?.email}</strong>. Manage your posted tutoring jobs and explore verified educators.
          </p>
        </div>

        {/* Top Section: Real-time Metrics + Connects Wallet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GuardianMetrics
              activeJobsCount={activeJobsCount}
              inReviewJobsCount={inReviewJobsCount}
              hiredJobsCount={hiredJobsCount}
            />
          </div>
          <div>
            <ConnectsBalanceCard balance={15} role="GUARDIAN" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GuardianJobsList
            jobs={jobs as unknown as Parameters<typeof GuardianJobsList>[0]['jobs']}
          />
          <GuardianFeaturedTutors tutors={featuredTutors} />
        </div>
      </main>
      <Footer />
    </div>
  );
}