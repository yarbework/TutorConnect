import Link from 'next/link';
import { TutorProfile } from '../../../types/tutor';
import { ShieldCheck, Clock, Video, MapPin, Edit3, ArrowRight } from 'lucide-react';

interface Props {
  profile: TutorProfile | null;
}

export default function TutorProfileSummaryCard({ profile }: Props) {
  const isApproved = profile?.verificationStatus === 'APPROVED';
  const isPending = profile?.verificationStatus === 'PENDING' || !profile?.verificationStatus;
  const hasVideo = Boolean(profile?.youtubeVideoId);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Your Tutor Profile</h3>
            {isApproved && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
              </span>
            )}
            {isPending && (
              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Audit Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile?.cityOrSubcity || 'Location not set'}
          </p>
        </div>

        <Link
          href="/tutor/profile"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition min-h-10"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit Profile & Schedule
        </Link>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${hasVideo ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
          <Video className={`w-4 h-4 ${hasVideo ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span className="font-semibold">{hasVideo ? 'Video Intro Active' : 'No Video Intro Linked'}</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-between">
          <span>Subjects: <strong className="text-slate-900">{profile?.subjects?.length || 0} Listed</strong></span>
          <span className="text-[11px] text-slate-500">{profile?.deliveryModes?.join(', ') || 'Online'}</span>
        </div>
      </div>

      {profile?.id && (
        <div className="pt-1 flex justify-end">
          <Link
            href={`/tutors/${profile.id}`}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            View your public profile as guardians see it <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}