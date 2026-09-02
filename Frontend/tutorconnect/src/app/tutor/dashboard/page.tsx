'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { useTutorProfileStore } from '../../../store/useTutorProfileStore';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ConnectsBalanceCard from '../../../components/dashboard/shared/ConnectsBalanceCard';
import TutorMetrics from '../../../components/dashboard/tutor/TutorMetrics';
import TutorProfileSummaryCard from '../../../components/dashboard/tutor/TutorProfileSummaryCard';
import TutorApplicationsList from '../../../components/dashboard/tutor/TutorApplicationsList';
import { Loader2 } from 'lucide-react';

export default function TutorDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const { profile, fetchProfile } = useTutorProfileStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user?.role !== 'TUTOR') {
      router.replace('/guardian/dashboard');
      return;
    }

    fetchProfile();
  }, [isHydrated, isAuthenticated, user, router, fetchProfile]);

  if (!isHydrated) {
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
            Welcome back, <strong className="text-slate-900">{user?.email}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TutorMetrics
              activeApplicationsCount={0}
              acceptedMatchesCount={0}
              hourlyRate={Number(profile?.hourlyRate) || 300}
            />
          </div>
          <div>
            <ConnectsBalanceCard balance={20} role="TUTOR" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TutorProfileSummaryCard profile={profile} />
          <TutorApplicationsList proposals={[]} />
        </div>
      </main>
      <Footer />
    </div>
  );
}