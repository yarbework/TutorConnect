import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <BookOpen className="w-10 h-10 text-emerald-400 mx-auto" />
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to Accelerate Your Academic Growth?
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
          Join thousands of students, guardians, and qualified tutors building better learning experiences across Ethiopia.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register?role=GUARDIAN"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg min-h-[44px] flex items-center justify-center"
          >
            Hire a Tutor Now
          </Link>
          <Link
            href="/register?role=TUTOR"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-3.5 rounded-xl transition-all min-h-[44px] flex items-center justify-center"
          >
            Become a Tutor
          </Link>
        </div>
      </div>
    </section>
  );
}