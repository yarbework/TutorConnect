'use client';

import { useState } from 'react';
import { PublicTutorProfile } from '../../types/tutor';
import YouTubePlayer from './YouTubePlayer';
import RequestTutoringModal from './RequestTutoringModal';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  Laptop, 
  Home, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  GraduationCap, 
  Share2, 
  BadgeCheck 
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  tutor: PublicTutorProfile;
}

export default function ModernTutorProfileView({ tutor }: Props) {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile URL copied to clipboard!');
    }
  };

  const deliveryModeLabels: Record<string, { label: string; icon: typeof Laptop }> = {
    ONLINE: { label: 'Online / Virtual (Meet/Zoom)', icon: Laptop },
    IN_PERSON_STUDENT_HOME: { label: "In-Person (Student's Residence)", icon: Home },
    IN_PERSON_TUTOR_HOME: { label: "In-Person (Tutor's Center)", icon: MapPin },
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            
            <div className="w-24 h-24 sm:w-28 sm:resize-none sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-700 to-indigo-600 border-4 border-white/10 flex items-center justify-center text-white shadow-2xl shrink-0 font-black text-3xl">
              {tutor.gender === 'FEMALE' ? '👩‍🏫' : '👨‍🏫'}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {tutor.gender === 'FEMALE' ? 'Verified Female Tutor' : 'Verified Male Tutor'}
                </h1>
                {tutor.verificationStatus === 'APPROVED' && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Identity & Degree Verified
                  </span>
                )}
              </div>

              <p className="text-slate-300 text-xs sm:text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{tutor.cityOrSubcity || 'Addis Ababa, Ethiopia'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold">Active & Accepting Students</span>
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {(tutor.subjects || []).map((subject) => (
                  <span
                    key={subject}
                    className="bg-white/10 border border-white/10 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-xl"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3 shrink-0 pt-4 md:pt-0 border-t sm:border-t-0 border-white/10">
            <div className="text-left sm:text-right">
              <p className="text-xs uppercase font-extrabold tracking-wider text-blue-300">Rate</p>
              <p className="text-3xl font-black text-white">{tutor.hourlyRate} <span className="text-sm font-normal text-blue-200">ETB/hr</span></p>
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl transition backdrop-blur-md"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Video Introduction & Teaching Style
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Listen to the tutor introduce their coaching philosophy and approach.
                </p>
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                Verified Video
              </span>
            </div>

            <YouTubePlayer videoId={tutor.youtubeVideoId} title="Tutor Introduction" />
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <GraduationCap className="w-5 h-5 text-blue-700" /> Educator Biography & Background
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
              {tutor.bio || 'This educator has not written an extended biography yet.'}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Award className="w-5 h-5 text-emerald-600" /> Supported Lesson Delivery Modes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(tutor.deliveryModes || []).map((mode) => {
                const config = deliveryModeLabels[mode] || { label: mode, icon: Laptop };
                const Icon = config.icon;
                return (
                  <div
                    key={mode}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-2"
                  >
                    <Icon className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{config.label}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Available for bookings</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-700" /> Weekly Availability Schedule
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard hours open for one-on-one sessions and entrance exam preparation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(tutor.availability || {}).map(([day, slots]) => (
                <div
                  key={day}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      {day}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {slots.length} {slots.length === 1 ? 'Slot' : 'Slots'}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {slots.map((s: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{s.start}</span>
                        <span className="text-slate-400">to</span>
                        <span className="font-semibold text-slate-900">{s.end}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md sticky top-24 space-y-6">
            
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Instruction Rate
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-blue-900">{tutor.hourlyRate}</span>
                <span className="text-sm font-semibold text-slate-600">ETB / hour</span>
              </div>
              <p className="text-xs text-slate-500">Billed per completed and confirmed session</p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified academic qualifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Trial consultation session guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>TutorConnect payment escrow protection</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsHireModalOpen(true)}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Request Tutoring / Invite
            </button>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <BadgeCheck className="w-4 h-4 text-blue-700" /> TutorConnect Guarantee
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                All tutors pass identity and credential reviews prior to badge assignment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <RequestTutoringModal
        tutor={tutor}
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
      />
    </div>
  );
}