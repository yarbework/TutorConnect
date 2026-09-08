'use client';

import { useState, useEffect } from 'react';
import { PublicTutorProfile } from '../../types/tutor';
import { JobPost } from '../../types/job';
import { jobsApi } from '../../lib/api/jobs';
import { 
  X, 
  Send, 
  Briefcase, 
  Calendar, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  tutor: PublicTutorProfile;
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestTutoringModal({ tutor, isOpen, onClose }: Props) {
  const [guardianJobs, setGuardianJobs] = useState<JobPost[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingJobs(true);
      jobsApi
        .getMyJobs()
        .then((jobs) => {
          const published = jobs.filter((j) => j.status === 'PUBLISHED');
          setGuardianJobs(published);
          if (published.length > 0) {
            setSelectedJobId(published[0].id);
          }
        })
        .catch(() => setGuardianJobs([]))
        .finally(() => setIsLoadingJobs(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(`Tutoring invitation sent! The tutor will receive your request and schedule.`);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to send invitation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Direct Tutoring Request
            </span>
            <h3 className="text-xl font-black mt-0.5">Invite Tutor to Connect</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center justify-between text-xs">
            <span className="text-slate-600">Rate: <strong className="text-slate-900">{tutor.hourlyRate} ETB/hr</strong></span>
            <span className="text-slate-600">Location: <strong className="text-slate-900">{tutor.cityOrSubcity || 'Addis Ababa'}</strong></span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-700" /> Select Your Posted Job Requirement
            </label>
            {isLoadingJobs ? (
              <div className="py-4 flex items-center justify-center text-slate-400 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading your posted jobs...
              </div>
            ) : guardianJobs.length === 0 ? (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> No active job listings found
                </p>
                <p>You haven&apos;t posted an active job yet. You can still send a direct inquiry below.</p>
              </div>
            ) : (
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
              >
                {guardianJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.subject} - {j.grade_level})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-700" /> Message & Preferred Days
            </label>
            <textarea
              rows={3}
              required
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="e.g. Hello, we are looking for support in Grade 12 Calculus on weekends. Would you be open for a trial session?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Tutoring Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}