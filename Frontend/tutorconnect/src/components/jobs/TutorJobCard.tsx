'use client';

import { useState } from 'react';
import { JobPost } from '../../types/job';
import ApplyJobModal from './ApplyJobModal';
import { 
  Laptop, 
  MapPin, 
  Sparkles, 
  Clock 
} from 'lucide-react';

interface Props {
  job: JobPost;
  onApplicationSuccess?: () => void;
}

export default function TutorJobCard({ job, onApplicationSuccess }: Props) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {job.subject}
            </span>
            <h3 className="text-lg font-black text-slate-900 pt-1">{job.title}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>Grade: <strong>{job.grade_level}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {job.teaching_mode === 'ONLINE' ? (
                  <>
                    <Laptop className="w-3.5 h-3.5 text-blue-600" /> Virtual / Online
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {job.city || 'In-Person'}
                  </>
                )}
              </span>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-right shrink-0">
            <p className="text-xl font-black text-slate-900">{job.max_hourly_budget} <span className="text-xs font-normal text-slate-500">ETB/hr</span></p>
            <p className="text-[11px] text-slate-500 font-medium">{job.weekly_hours_commitment} hrs / week</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
          {job.learning_objectives}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Preferred Gender: <strong className="text-slate-700">{job.preferred_tutor_gender}</strong>
          </span>

          <button
            type="button"
            onClick={() => setIsApplyModalOpen(true)}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm min-h-[40px] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Apply (~2 Connects)
          </button>
        </div>
      </div>

      {/* Proposal Submission Modal */}
      <ApplyJobModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => {
          if (onApplicationSuccess) onApplicationSuccess();
        }}
      />
    </>
  );
}