import { PublicTutorProfile } from '../../types/tutor';
import YouTubePlayer from './YouTubePlayer';
import { ShieldCheck, Star, MapPin, Laptop, Home, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PublicTutorProfileView({ profile }: { profile: PublicTutorProfile }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900">Verified Tutor</span>
            {profile.verificationStatus === 'APPROVED' && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> ID & Degree Verified
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.cityOrSubcity || 'Addis Ababa'}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {profile.subjects.map((s) => (
              <span key={s} className="bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1 rounded-lg">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center shrink-0 space-y-2">
          <p className="text-3xl font-black text-blue-800">{profile.hourlyRate} <span className="text-xs text-slate-500 font-normal">ETB/hr</span></p>
          <Link
            href={`/guardian/hire?tutorId=${profile.id}`}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition flex items-center justify-center min-h-11"
          >
            Request Tutoring
          </Link>
        </div>
      </div>

      {/* Video Intro */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Video Introduction</h3>
        <YouTubePlayer videoId={profile.youtubeVideoId} />
      </div>

      {/* Bio & Philosophy */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-lg font-bold text-slate-900">About the Tutor</h3>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {profile.bio || 'No bio provided.'}
        </p>
      </div>

      {/* Weekly Schedule Preview */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-700" /> Availability Matrix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(profile.availability || {}).map(([day, slots]) => (
            <div key={day} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <p className="font-bold uppercase text-slate-800 tracking-wider">{day}</p>
              {slots.map((slot:any, idx:any) => (
                <p key={idx} className="text-slate-600 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" /> {slot.start} - {slot.end}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}