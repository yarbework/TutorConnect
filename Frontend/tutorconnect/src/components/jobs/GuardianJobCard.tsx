import { useState } from 'react';
import { JobPost, JobStatus } from '../../types/job';
import { jobsApi } from '../../lib/api/jobs';
import { toast } from 'sonner';
import  Link  from 'next/link';
import {Users} from 'lucide-react';

interface Props {
  job: JobPost;
  onStatusChanged: (updated: JobPost) => void;
}

const STATUS_COLORS: Record<JobStatus, { bg: string; text: string }> = {
  DRAFT: { bg: 'bg-slate-100', text: 'text-slate-700' },
  PUBLISHED: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  IN_REVIEW: { bg: 'bg-amber-50', text: 'text-amber-700' },
  AWARDED: { bg: 'bg-blue-50', text: 'text-blue-700' },
  COMPLETED: { bg: 'bg-purple-50', text: 'text-purple-700' },
  ARCHIVED: { bg: 'bg-rose-50', text: 'text-rose-700' },
};

const ALLOWED_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  DRAFT: ['PUBLISHED', 'ARCHIVED'],
  PUBLISHED: ['IN_REVIEW', 'ARCHIVED', 'DRAFT'],
  IN_REVIEW: ['AWARDED', 'PUBLISHED', 'ARCHIVED'],
  AWARDED: ['COMPLETED', 'ARCHIVED'],
  COMPLETED: ['ARCHIVED'],
  ARCHIVED: [],
};

export default function GuardianJobCard({ job, onStatusChanged }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const allowedNextStates = ALLOWED_TRANSITIONS[job.status] || [];

  const handleStatusUpdate = async (nextStatus: JobStatus) => {
    setIsUpdating(true);
    try {
      const updated = await jobsApi.updateJobStatus(job.id, nextStatus);
      toast.success(`Job status updated to ${nextStatus}`);
      onStatusChanged(updated);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update job status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
            <span
              className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                STATUS_COLORS[job.status].bg
              } ${STATUS_COLORS[job.status].text}`}
            >
              {job.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Subject: <strong className="text-slate-700">{job.subject}</strong> • Grade: {job.grade_level}
          </p>
        </div>

        {/* State Transition Dropdown */}
        {allowedNextStates.length > 0 && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-xs text-slate-500 font-medium">Transition to:</span>
            <select
              disabled={isUpdating}
              value=""
              onChange={(e) => {
                if (e.target.value) handleStatusUpdate(e.target.value as JobStatus);
              }}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-300 rounded-lg outline-none cursor-pointer hover:bg-slate-100"
            >
              <option value="" disabled>
                {isUpdating ? 'Updating...' : 'Change Status'}
              </option>
              {allowedNextStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
        {job.learning_objectives}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Budget</span>
          <span className="font-black text-slate-900">{job.max_hourly_budget} ETB/hr</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Commitment</span>
          <span className="font-bold text-slate-800">{job.weekly_hours_commitment} hrs/wk</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Mode</span>
          <span className="font-bold text-slate-800">
            {job.teaching_mode === 'ONLINE' ? 'Virtual / Online' : job.city || 'In-Person'}
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Gender</span>
          <span className="font-bold text-slate-800">{job.preferred_tutor_gender}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <Link
            href={`/guardian/jobs/${job.id}/applicants`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition min-h-[36px]"
          >
            <Users className="w-4 h-4 text-blue-600" /> Review Candidateddd Proposals
          </Link>
      </div>
    </div>
  );
}