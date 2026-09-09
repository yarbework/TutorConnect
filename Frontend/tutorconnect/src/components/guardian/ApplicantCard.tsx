'use client';

import { useState } from 'react';
import { JobApplication, ApplicationStatus } from '../../types/application';
import { jobsApi } from '../../lib/api/jobs';
import { 
  Star, 
  Check, 
  X, 
  Video, 
  ExternalLink, 
  Coins, 
  Clock, 
  MessageSquare, 
  Loader2 
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  application: JobApplication;
  maxBudget: number;
  onStatusChanged: (updated: JobApplication) => void;
}

const STATUS_BADGES: Record<ApplicationStatus, { bg: string; text: string; label: string }> = {
  SUBMITTED: { bg: 'bg-blue-50 text-blue-700', text: 'border-blue-200', label: 'New Proposal' },
  SHORTLISTED: { bg: 'bg-amber-50 text-amber-800', text: 'border-amber-200', label: 'Shortlisted' },
  ACCEPTED: { bg: 'bg-emerald-50 text-emerald-800', text: 'border-emerald-200', label: 'Hired / Accepted' },
  REJECTED: { bg: 'bg-slate-100 text-slate-600', text: 'border-slate-200', label: 'Declined' },
};

export default function ApplicantCard({ application, maxBudget, onStatusChanged }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReview = async (nextStatus: ApplicationStatus) => {
    setIsUpdating(true);
    try {
      const updated = await jobsApi.reviewApplication(application.id, nextStatus);
      toast.success(`Applicant marked as ${STATUS_BADGES[nextStatus].label}`);
      onStatusChanged(updated);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update applicant status');
    } finally {
      setIsUpdating(false);
    }
  };

  const badge = STATUS_BADGES[application.status];
  const rateDiff = Number(application.proposed_rate) - Number(maxBudget);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4 hover:border-slate-300 transition">
      
      {/* Header: Tutor Identity + Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-slate-900">
              {application.tutor?.email || 'Applicant Tutor'}
            </h4>
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Applied on {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Rate Comparison Box */}
        <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/60 text-right self-start sm:self-auto">
          <span className="text-sm font-black text-slate-900 block">
            {application.proposed_rate} <span className="text-xs font-normal text-slate-500">ETB/hr</span>
          </span>
          <span className={`text-[10px] font-bold ${rateDiff <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {rateDiff <= 0 ? `${Math.abs(rateDiff)} ETB under budget` : `+${rateDiff} ETB over budget`}
          </span>
        </div>
      </div>

      {/* Pitch / Strategy Message */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Teaching Strategy & Approach:
        </span>
        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-2xl border border-slate-200/60">
          {application.pitch_message}
        </p>
      </div>

      {/* Video Pitch Link (If Provided) */}
      {application.video_pitch_url && (
        <div className="flex items-center justify-between p-3 bg-rose-50/60 border border-rose-200/60 rounded-xl text-xs">
          <span className="font-semibold text-rose-900 flex items-center gap-1.5">
            <Video className="w-4 h-4 text-rose-600" /> Tailored Video Pitch Included
          </span>
          <a
            href={application.video_pitch_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1"
          >
            Watch Video <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Review Action Controls */}
      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
        {application.status !== 'REJECTED' && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleReview('REJECTED')}
            className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center gap-1 min-h-[36px]"
          >
            <X className="w-3.5 h-3.5" /> Decline
          </button>
        )}

        {application.status !== 'SHORTLISTED' && application.status !== 'ACCEPTED' && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleReview('SHORTLISTED')}
            className="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition flex items-center gap-1.5 min-h-[36px]"
          >
            <Star className="w-3.5 h-3.5" /> Shortlist
          </button>
        )}

        {application.status !== 'ACCEPTED' && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => handleReview('ACCEPTED')}
            className="px-5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-md flex items-center gap-1.5 min-h-[36px]"
          >
            {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Hire / Accept Tutor
          </button>
        )}
      </div>
    </div>
  );
}