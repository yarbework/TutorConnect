import Link from 'next/link';
import { PlusCircle, Users, ArrowRight } from 'lucide-react';

interface JobPost {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  budget: number;
  applicantsCount: number;
  status: 'PUBLISHED' | 'AWARDED' | 'DRAFT';
}

interface Props {
  jobs: JobPost[];
}

const STATUS_BADGES: Record<string, { bg: string; text: string }> = {
  PUBLISHED: { bg: 'bg-emerald-100 text-emerald-800', text: 'Active' },
  DRAFT: { bg: 'bg-slate-100 text-slate-700', text: 'Draft' },
  IN_REVIEW: { bg: 'bg-amber-100 text-amber-800', text: 'In Review' },
  AWARDED: { bg: 'bg-blue-100 text-blue-800', text: 'Awarded' },
  COMPLETED: { bg: 'bg-purple-100 text-purple-800', text: 'Completed' },
  ARCHIVED: { bg: 'bg-rose-100 text-rose-800', text: 'Archived' },
};

export default function GuardianJobsList({ jobs }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <PlusCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-bold text-slate-900">Post your first tutoring requirement</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Specify the subject, grade level, and schedule. Verified tutors will submit their video introductions to apply.
          </p>
        </div>
        <Link
          href="/guardian/jobs/new"
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-md min-h-11"
        >
          <PlusCircle className="w-4 h-4" /> Post a Tutoring Job
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Your Tutoring Job Listings</h3>
          <p className="text-xs text-slate-500">Showing recent active and draft postings</p>
        </div>
        <Link
          href="/guardian/jobs/new"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Post Another Job
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {jobs.slice(0, 5).map((job) => {
          const badge = STATUS_BADGES[job.status] || STATUS_BADGES.DRAFT;
          return (
            <div
              key={job.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{job.title}</span>
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${badge.bg}`}>
                    {badge.text}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{job.subject}</span>
                  <span>•</span>
                  <span>Grade: {job.gradeLevel}</span>
                  <span>•</span>
                  <span>Budget: <strong className="text-slate-800">{job.budget} ETB/hr</strong></span>
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Link
                  href="/guardian/jobs"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition min-h-[36px]"
                >
                  Manage Status <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {jobs.length > 5 && (
        <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
          <Link href="/guardian/jobs" className="text-xs font-bold text-slate-600 hover:text-slate-900">
            View all {jobs.length} job posts →
          </Link>
        </div>
      )}
    </div>
  );
}