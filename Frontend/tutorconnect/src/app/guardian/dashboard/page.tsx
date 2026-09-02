'use client';

import { useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ConnectsBalanceCard from '../../../components/dashboard/shared/ConnectsBalanceCard';
import GuardianMetrics from '../../../components/dashboard/guardian/GuardianMetrics';
import GuardianJobsList from '../../../components/dashboard/guardian/GuardianJobsList';
import GuardianFeaturedTutors from '../../../components/dashboard/guardian/GuardianFeaturedTutors';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function GuardianDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (user?.role !== 'GUARDIAN') {
      router.replace('/tutor/dashboard');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Guardian Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Welcome back, <strong className="text-slate-900">{user?.email}</strong>. Manage your posted tutoring jobs and review applicants.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GuardianMetrics
              activeJobsCount={1}
              totalApplicantsCount={3}
              hiredTutorsCount={1}
            />
          </div>
          <div>
            <ConnectsBalanceCard balance={10} role="GUARDIAN" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GuardianJobsList
            jobs={[
              {
                id: 'job-101',
                title: 'Grade 12 Physics & Calculus Tutor Needed',
                subject: 'Physics',
                gradeLevel: '12',
                budget: 350,
                applicantsCount: 3,
                status: 'PUBLISHED',
              },
            ]}
          />
          <GuardianFeaturedTutors
            tutors={[
              {
                id: 'tut-1',
                name: 'Samuel M.',
                subjects: ['Mathematics', 'Physics'],
                hourlyRate: 350,
                city: 'Addis Ababa, Bole',
                hasVideo: true,
              },
              {
                id: 'tut-2',
                name: 'Helen G.',
                subjects: ['Chemistry', 'Biology'],
                hourlyRate: 300,
                city: 'Addis Ababa, Yeka',
                hasVideo: true,
              },
            ]}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}