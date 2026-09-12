'use client';

import { useState, useEffect } from 'react';
import { PublicTutorProfile } from '../../types/tutor';
import YouTubePlayer from './YouTubePlayer';
import RequestTutoringModal from './RequestTutoringModal';
import { Review } from '../../types/review';
import { reviewsApi } from '../../lib/api/reviews';
import TutorReviewsList from '../reviews/TutorReviewsList';
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
  BadgeCheck,
  Star,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  tutor: PublicTutorProfile;
}
export default function ModernTutorProfileView({ tutor }: Props) {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const ratingValue = Number(tutor.averageRating) || 0;
  const reviewCount = tutor.totalReviews || 0;

  useEffect(() => {
    const targetUserId = tutor.userId || tutor.id;
    setIsLoadingReviews(true);
    reviewsApi
      .getTutorReviews(targetUserId)
      .then((data) => setReviews(data))
      .catch((err) => console.error('Failed to load reviews:', err))
      .finally(() => setIsLoadingReviews(false));
  }, [tutor.userId, tutor.id]);

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
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-700 to-indigo-600 border-4 border-white/10 flex items-center justify-center text-white shadow-2xl shrink-0 font-black text-3xl">
              {tutor.gender === 'FEMALE' ? '👩‍🏫' : '👨‍🏫'}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {tutor.gender === 'FEMALE' ? 'Verified Female Tutor' : 'Verified Male Tutor'}
                </h1>

                <span className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{ratingValue > 0 ? `${ratingValue.toFixed(1)} / 5.0` : 'New Tutor'}</span>
                  <span className="text-blue-200 font-medium">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
                </span>

                {tutor.verificationStatus === 'APPROVED' && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Credentials
                  </span>
                )}
              </div>

              <p className="text-slate-300 text-xs sm:text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{tutor.cityOrSubcity || 'Addis Ababa, Ethiopia'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold">Accepting Students</span>
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
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl transition backdrop-blur-md cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
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

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <GraduationCap className="w-5 h-5 text-blue-700" /> Educator Biography & Background
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {tutor.bio || 'This educator has not written an extended biography yet.'}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Award className="w-5 h-5 text-emerald-600" /> Lesson Delivery Modes
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

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
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
                    {slots.map((s, idx) => (
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

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Verified Client Reviews
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct evaluations submitted by guardians after completed contracts.
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-amber-500 font-black text-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{ratingValue > 0 ? ratingValue.toFixed(1) : 'New'}</span>
                </div>
                <span className="text-[11px] text-slate-400 block -mt-1">
                  Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            {isLoadingReviews ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-700" />
              </div>
            ) : (
              <TutorReviewsList reviews={reviews} />
            )}
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
              <p className="text-xs text-slate-500">Direct settlement via Telebirr or CBE</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> Tutor Rating
              </span>
              <span className="font-black text-slate-900">
                {ratingValue > 0 ? `${ratingValue.toFixed(1)} / 5.0` : 'New Educator'}
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified academic credentials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct in-app messaging coordination</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified post-session client reviews</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsHireModalOpen(true)}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Request Tutoring / Invite
            </button>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <BadgeCheck className="w-4 h-4 text-blue-700" /> Reputation Guarantee
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Ratings are verified from actual completed contracts.
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