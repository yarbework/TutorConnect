'use client';

import Link from 'next/link';
import { JobPost } from '../../types/job';
import { Briefcase, ArrowRight, MapPin, Laptop } from 'lucide-react';

interface Props {
  jobs: JobPost[];
}

export default function RecentJobsSection({ jobs }: Props) {
  if (jobs.length === 0) return null;

  return (
    <section className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> Guardian Requirements
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Latest Tutoring Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Parents actively seeking qualified educators for in-person or virtual coaching.
            </p>
          </div>

          <Link
            href="/tutor/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group"
          >
            Explore all open jobs <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {jobs.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {job.subject}
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {job.max_hourly_budget} <span className="text-[10px] text-slate-500 font-normal">ETB/hr</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{job.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.learning_objectives}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-1">
                  {job.teaching_mode === 'ONLINE' ? (
                    <>
                      <Laptop className="w-3.5 h-3.5 text-blue-600" /> Virtual
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {job.city || 'Addis Ababa'}
                    </>
                  )}
                </span>

                <Link
                  href="/tutor/jobs"
                  className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                >
                  Apply <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}