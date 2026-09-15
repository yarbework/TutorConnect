'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Award, Star, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  stats?: {
    verifiedTutorsCount: number;
    averageRating?: number;
    activeJobsCount?: number;
  };
}

export default function HeroSection({ stats }: Props) {
  const router = useRouter();
  const [subjectQuery, setSubjectQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectQuery.trim()) {
      router.push('/tutors');
    } else {
      router.push(`/tutors?subject=${encodeURIComponent(subjectQuery.trim())}`);
    }
  };

  const tutorsCount = stats?.verifiedTutorsCount ?? 0;
  const avgRating = stats?.averageRating ? stats.averageRating.toFixed(1) : '4.9';

  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100 pt-10 pb-16 lg:py-20 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Heading & Functional Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
              <Award className="w-4 h-4 text-blue-600" /> Trusted Academic Guidance
            </span>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Find the Perfect Tutor for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-emerald-600">
                Every Subject.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect directly with credentialed educators across Addis Ababa. Whether preparing for national exams (EUEE) or mastering STEM fundamentals, TutorConnect brings personalized coaching home.
            </p>

            {/* Dynamic Search Box */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 sm:p-3 rounded-2xl shadow-xl border border-slate-200 max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={subjectQuery}
                  onChange={(e) => setSubjectQuery(e.target.value)}
                  placeholder="Search subjects (e.g., Mathematics, Physics, Chemistry)..."
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none min-h-[44px]"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[44px] shrink-0 cursor-pointer shadow-sm"
              >
                Search Tutors <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Live Stats Row */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-slate-600 border-t border-slate-200/60">
              <div>
                <p className="text-2xl font-black text-slate-900">
                  {tutorsCount > 0 ? `${tutorsCount}+` : 'Verified'}
                </p>
                <p className="text-xs text-slate-500 font-medium">Verified Instructors</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-black text-slate-900">{avgRating} ★</p>
                <p className="text-xs text-slate-500 font-medium">Average Rating</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Direct Settlement</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-gradient-to-tr from-blue-100 to-emerald-100 rounded-full blur-2xl opacity-70 -z-0" />

            <div className="relative z-10 w-full max-w-md lg:max-w-none">
              <Image
                src="/hero-tutor-student.png"
                alt="Teacher helping child draw"
                width={600}
                height={500}
                priority
                className="w-full h-auto object-contain drop-shadow-xl"
              />

              {/* Floating Trust Pill 1 */}
              <div className="absolute top-6 -left-4 sm:left-0 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Identity Checked</p>
                  <p className="text-[10px] text-slate-500">Academic Diplomas Verified</p>
                </div>
              </div>

              {/* Floating Trust Pill 2 */}
              <div className="absolute bottom-6 -right-4 sm:right-0 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <Star className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Mutual Reviews</p>
                  <p className="text-[10px] text-slate-500">Post-Contract Feedback</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}