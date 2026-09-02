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
        <h3 className="text-sm font-bold text-slate-900">Your Tutoring Job Listings</h3>
        <Link
          href="/guardian/jobs/new"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Post Another Job
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{job.title}</span>
                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${job.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {job.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {job.subject} • Grade {job.gradeLevel} • Budget: {job.budget} ETB/hr
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/guardian/jobs/${job.id}/applicants`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition min-h-10"
              >
                <Users className="w-3.5 h-3.5" />
                {job.applicantsCount} Applicants <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}