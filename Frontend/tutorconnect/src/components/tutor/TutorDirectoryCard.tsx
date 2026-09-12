'use client';

import Link from 'next/link';
import { PublicTutorProfile } from '../../types/tutor';
import { ShieldCheck, Video, MapPin, ArrowRight, Star } from 'lucide-react';

interface Props {
  tutor: PublicTutorProfile;
}

export default function TutorDirectoryCard({ tutor }: Props) {
  const hasVideo = Boolean(tutor.youtubeVideoId);
  const ratingValue = Number(tutor.averageRating) || 0;
  const reviewCount = tutor.totalReviews || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {tutor.gender === 'FEMALE' ? 'Female Tutor' : 'Male Tutor'}
              </h3>
              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
              </span>

              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/80 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>{ratingValue > 0 ? ratingValue.toFixed(1) : 'New'}</span>
                {reviewCount > 0 && (
                  <span className="text-slate-400 font-semibold">({reviewCount})</span>
                )}
              </span>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {tutor.cityOrSubcity || 'Addis Ababa'}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-lg font-black text-blue-900">{tutor.hourlyRate}</span>
            <span className="text-[11px] text-slate-500 font-medium block -mt-1">ETB/hr</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {tutor.bio || 'Experienced educator offering structured academic coaching and exam prep.'}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {(tutor.subjects || []).slice(0, 4).map((sub) => (
            <span
              key={sub}
              className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
            >
              {sub}
            </span>
          ))}
          {(tutor.subjects || []).length > 4 && (
            <span className="text-[10px] font-bold text-slate-400 self-center">
              +{tutor.subjects.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        {hasVideo ? (
          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg flex items-center gap-1">
            <Video className="w-3.5 h-3.5 text-rose-600" /> Video Intro
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">Background Checked</span>
        )}

        <Link
          href={`/tutors/${tutor.id}`}
          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs min-h-[36px]"
        >
          View Full Profile <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}