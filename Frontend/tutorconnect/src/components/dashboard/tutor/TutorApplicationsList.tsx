import Link from 'next/link';
import { Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface Proposal {
  id: string;
  jobTitle: string;
  subject: string;
  guardianName: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
}

interface Props {
  proposals: Proposal[];
}

export default function TutorApplicationsList({ proposals }: Props) {
  if (proposals.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center py-10 space-y-3">
        <p className="text-sm font-bold text-slate-800">No active applications</p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You haven&apos;t applied to any tutoring jobs yet. Browse open jobs to find students.
        </p>
        <Link
          href="/tutor/jobs"
          className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 px-4 py-2.5 rounded-xl transition shadow-sm min-h-11"
        >
          Find Tutoring Jobs <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Recent Applications</h3>
        <Link href="/tutor/applications" className="text-xs font-bold text-blue-700 hover:underline">
          View all
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {proposals.map((item) => (
          <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-slate-900">{item.jobTitle}</p>
              <p className="text-xs text-slate-500">{item.subject} • Posted by {item.guardianName}</p>
            </div>

            <div className="flex items-center gap-3">
              {item.status === 'ACCEPTED' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                </span>
              )}
              {item.status === 'PENDING' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5" /> Under Review
                </span>
              )}
              {item.status === 'REJECTED' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <XCircle className="w-3.5 h-3.5" /> Closed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}