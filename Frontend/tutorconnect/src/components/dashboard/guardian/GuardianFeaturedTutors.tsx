import Link from 'next/link';
import { PublicTutorProfile } from '../../../types/tutor';
import { ShieldCheck, Video, MapPin, ArrowRight, UserCheck } from 'lucide-react';

interface Props {
  tutors: PublicTutorProfile[];
}

export default function GuardianFeaturedTutors({ tutors }: Props) {
  if (tutors.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center py-10 space-y-2">
        <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-sm font-bold text-slate-800">No tutors verified yet</p>
        <p className="text-xs text-slate-500">
          Approved tutors with verified background checks and video intros will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Recommended Verified Tutors</h3>
          <p className="text-xs text-slate-500">Tutors matching high-demand subjects</p>
        </div>
        <Link href="/tutors" className="text-xs font-bold text-blue-700 hover:underline">
          Explore all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3 hover:border-blue-200 transition"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  {tutor.gender === 'FEMALE' ? 'Female Tutor' : 'Male Tutor'}
                </span>
                <span className="text-xs font-black text-blue-800">
                  {tutor.hourlyRate} <span className="text-[10px] font-normal text-slate-500">ETB/hr</span>
                </span>
              </div>

              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {tutor.cityOrSubcity || 'Addis Ababa'}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {(tutor.subjects || []).slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ID Verified
              </span>
              <Link
                href={`/tutors/${tutor.id}`}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-0.5"
              >
                Profile <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}