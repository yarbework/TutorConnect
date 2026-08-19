import { Sparkles, ShieldCheck, GraduationCap } from 'lucide-react';

export default function AnnouncementBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-xs sm:text-sm py-2 px-4 overflow-hidden whitespace-nowrap border-b border-blue-700/50">
      <div className="inline-flex animate-marquee space-x-8 items-center font-medium">
        <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> #1 Verified Tutoring Marketplace in Ethiopia</span>
        <span>•</span>
        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Background-Checked Tutors</span>
        <span>•</span>
        <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-sky-400" /> EUEE & Grade 12 Prep Specialists Available</span>
      </div>
    </div>
  );
}
