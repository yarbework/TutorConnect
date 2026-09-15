'use client';

import Link from 'next/link';
import { PublicTutorProfile } from '../../types/tutor';
import { Star, ShieldCheck, CheckCircle2, ArrowRight, Video } from 'lucide-react';

interface Props {
  tutors: PublicTutorProfile[];
}

const BG_COLORS = ['bg-blue-700', 'bg-emerald-700', 'bg-indigo-700', 'bg-purple-700'];

export default function FeaturedTutors({ tutors }: Props) {
  if (!tutors || tutors.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Top Ranked
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Featured Verified Instructors
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Educators evaluated on past student outcomes with confirmed credentials
            </p>
          </div>

          <Link
            href="/tutors"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            Explore All Tutors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.slice(0, 3).map((tutor, idx) => {
            const initials = tutor.gender === 'FEMALE' ? 'FT' : 'MT';
            const color = BG_COLORS[idx % BG_COLORS.length];
            const rating = Number(tutor.averageRating) || 0;
            const reviewCount = tutor.totalReviews || 0;
            const primarySubject = tutor.subjects?.[0] || 'General Coaching';
            const secondarySubject = tutor.subjects?.[1];

            return (
              <div
                key={tutor.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  
                  {/* Card Header: Avatar & Rate */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${color} text-white font-bold rounded-xl flex items-center justify-center text-sm shrink-0 shadow-sm`}>
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 flex items-center gap-1 text-base">
                          {tutor.gender === 'FEMALE' ? 'Female Instructor' : 'Male Instructor'}
                          <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {tutor.cityOrSubcity || 'Addis Ababa'}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full shrink-0">
                      {tutor.hourlyRate} ETB/hr
                    </span>
                  </div>

                  {/* Subject Focus */}
                  <div>
                    <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                      {primarySubject} {secondarySubject ? `& ${secondarySubject}` : ''}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {tutor.bio || 'Experienced educator offering structured academic guidance and test preparation.'}
                    </p>
                  </div>

                  {/* Rating & Video Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-900">
                        {rating > 0 ? rating.toFixed(1) : 'New'}
                      </span>
                      <span>({reviewCount} reviews)</span>
                    </div>

                    {tutor.youtubeVideoId && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Video className="w-3 h-3 text-rose-600" /> Intro Video
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ID Verified
                  </span>
                  <Link
                    href={`/tutors/${tutor.id}`}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 min-h-[44px] flex items-center"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}