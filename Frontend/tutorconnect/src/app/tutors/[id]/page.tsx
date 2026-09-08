'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ModernTutorProfileView from '../../../components/tutor/ModernTutorProfileView';
import { tutorApi } from '../../../lib/api/tutor';
import { PublicTutorProfile } from '../../../types/tutor';
import { useAuthStore } from '../../../store/useAuthStore';
import {ChevronRight, Home, Loader2, AlertCircle, ArrowLeft} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function PublicTutorPage({ params }: PageProps) {
  const resolvedParams = 'then' in params ? use(params) : params;
  const tutorId = resolvedParams.id;

  const { isHydrated, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<PublicTutorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated) return;

    setIsLoading(true);
    setErrorMessage(null);

    tutorApi
      .getPublicProfile(tutorId)
      .then((data) => {
        setProfile(data);
      })
      .catch((err) => {
        console.error('Failed to load tutor profile:', err);
        setErrorMessage(err.message || 'Tutor profile could not be found.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [tutorId, isHydrated]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/guardian/dashboard" className="hover:text-slate-900 flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/tutors" className="hover:text-slate-900">
            Browse Tutors
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-xs">
            {profile ? (profile.gender === 'FEMALE' ? 'Female Tutor Profile' : 'Male Tutor Profile') : 'Tutor Details'}
          </span>
        </nav>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Loading verified educator profile...
            </p>
          </div>
        ) : errorMessage || !profile ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto space-y-4 my-10 shadow-sm">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Tutor Profile Unavailable</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {errorMessage || 'The requested tutor profile does not exist or has not been approved yet.'}
              </p>
            </div>
            <Link
              href="/tutors"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Browse Tutors
            </Link>
          </div>
        ) : (
          <ModernTutorProfileView tutor={profile} />
        )}
      </main>

      <Footer />
    </div>
  );
}