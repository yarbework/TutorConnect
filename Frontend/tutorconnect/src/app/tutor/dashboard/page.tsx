'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { useTutorProfileStore } from '../../../store/useTutorProfileStore';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ConnectsBalanceCard from '../../../components/dashboard/shared/ConnectsBalanceCard';
import TutorMetrics from '../../../components/dashboard/tutor/TutorMetrics';
import TutorProfileSummaryCard from '../../../components/dashboard/tutor/TutorProfileSummaryCard';
import TutorApplicationsList from '../../../components/dashboard/tutor/TutorApplicationsList';
import TutorInvitationsInbox from '../../../components/dashboard/tutor/TutorInvitationsInbox';
import { jobsApi } from '../../../lib/api/jobs';
import { JobInvitation } from '../../../types/job';
import { Loader2 } from 'lucide-react';
import { JobApplication } from '@/src/types/application';

export default function TutorDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const { profile, fetchProfile } = useTutorProfileStore();

  const [invitations, setInvitations] = useState<JobInvitation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [myApplications, setMyApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

const fetchDashboardData = useCallback(async () => {
  setIsLoadingData(true);
  try {
    const [invites, apps] = await Promise.all([
      jobsApi.getMyInvitations().catch(() => []),
      jobsApi.getMyApplications().catch(() => []),
      fetchProfile(),
    ]);
    setInvitations(invites);
    setMyApplications(apps);
  } catch (err) {
    console.error('Failed to load dashboard data:', err);
  } finally {
    setIsLoadingData(false);
  }
}, [fetchProfile]);

  useEffect(() => {
    if (!mounted) return;

    const hydrated = isHydrated ?? true;
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user?.role !== 'TUTOR') {
      router.replace('/guardian/dashboard');
      return;
    }

    fetchDashboardData();
  }, [mounted, isHydrated, isAuthenticated, user, router, fetchDashboardData]);

  if (!mounted || (isHydrated === false)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Tutor Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Welcome back, <strong className="text-slate-900">{user?.email}</strong>. Manage your direct job invitations and teaching portfolio.
          </p>
        </div>

        <TutorInvitationsInbox
          invitations={invitations}
          onInvitationUpdated={fetchDashboardData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
                <TutorMetrics
                  activeApplicationsCount={myApplications.filter((a) => a.status === 'SUBMITTED' || a.status === 'SHORTLISTED').length}
                  acceptedMatchesCount={myApplications.filter((a) => a.status === 'ACCEPTED').length + invitations.filter((i) => i.status === 'ACCEPTED').length}
                  hourlyRate={Number(profile?.hourlyRate) || 300}
                />
          </div>
          <div>
            <ConnectsBalanceCard balance={20} role="TUTOR" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TutorProfileSummaryCard profile={profile} />
          <TutorApplicationsList
            proposals={
              myApplications as unknown as React.ComponentProps<
                typeof TutorApplicationsList
              >['proposals']
            }
          />
        </div>

      </main>

      <Footer />
    </div>
  );
}