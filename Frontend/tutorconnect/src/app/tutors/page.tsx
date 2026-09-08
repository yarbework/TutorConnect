'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TutorDirectoryFilterBar from '../../components/tutor/TutorDirectoryFilterBar';
import TutorDirectoryCard from '../../components/tutor/TutorDirectoryCard';
import { tutorApi, TutorBrowseFilters } from '../../lib/api/tutor';
import { PublicTutorProfile } from '../../types/tutor';
import { Loader2, GraduationCap } from 'lucide-react';

export default function BrowseTutorsPage() {
  const [tutors, setTutors] = useState<PublicTutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TutorBrowseFilters>({});

  const loadTutors = useCallback(async (currentFilters: TutorBrowseFilters) => {
    setLoading(true);
    try {
      const data = await tutorApi.browseTutors(currentFilters);
      setTutors(data);
    } catch (err) {
      console.error('Failed to load tutors', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTutors(filters);
  }, [loadTutors, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Browse Verified Tutors</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Discover credentialed, background-checked tutors across Addis Ababa with video introductions.
          </p>
        </div>

        <TutorDirectoryFilterBar
          filters={filters}
          onApply={(newFilters) => {
            setFilters(newFilters);
            loadTutors(newFilters);
          }}
          onReset={() => {
            setFilters({});
            loadTutors({});
          }}
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : tutors.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No verified tutors match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try removing the city or rate filters, or post a custom job requirement to let tutors apply directly to you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {tutors.length} Verified {tutors.length === 1 ? 'Tutor' : 'Tutors'} Available
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tutors.map((tutor) => (
                <TutorDirectoryCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}