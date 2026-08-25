import Link from 'next/link';
import { GraduationCap, UserCheck, ArrowRight } from 'lucide-react';

export default function RoleSelection() {
  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900">Get Started with TutorConnect</h2>
          <p className="text-sm text-slate-600 mt-1">Select how you want to use the platform today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Guardian Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-bold text-slate-900">For Parents & Guardians</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Post your student's learning goals, review applicant profiles, and hire verified tutors with flexible schedules.
                </p>
                <Link
                  href="/register?role=GUARDIAN"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 pt-1 min-h-11"
                >
                  Post a Tutoring Need <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Tutor Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:border-blue-500 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 font-bold shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-bold text-slate-900">For Tutors & Educators</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Browse open job postings, submit proposals using Connects credits, set custom hourly rates, and earn.
                </p>
                <Link
                  href="/register?role=TUTOR"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 pt-1 min-h-11"
                >
                  Apply as a Tutor <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}