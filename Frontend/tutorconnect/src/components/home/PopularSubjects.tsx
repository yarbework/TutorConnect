'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const SUBJECTS = [
  { title: 'Mathematics', query: 'Mathematics', count: 'Math & Calculus', icon: '📐', bg: 'bg-blue-50' },
  { title: 'Physics', query: 'Physics', count: 'General & Applied', icon: '⚡', bg: 'bg-purple-50' },
  { title: 'Chemistry', query: 'Chemistry', count: 'Organic & Inorganic', icon: '🧪', bg: 'bg-emerald-50' },
  { title: 'Biology', query: 'Biology', count: 'Human & Ecology', icon: '🧬', bg: 'bg-rose-50' },
  { title: 'English Language', query: 'English', count: 'Grammar & Fluency', icon: '📚', bg: 'bg-amber-50' },
  { title: 'EUEE Aptitude', query: 'Aptitude', count: 'National Exam Prep', icon: '🎯', bg: 'bg-indigo-50' },
];

export default function PopularSubjects() {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Popular Subjects</h2>
            <p className="text-slate-600 text-sm mt-1">
              Explore high-demand academic curricula with specialized instructors
            </p>
          </div>
          <Link
            href="/tutors"
            className="text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 min-h-[44px]"
          >
            Browse All Subjects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.title}
              href={`/tutors?subject=${encodeURIComponent(subject.query)}`}
              className={`p-5 rounded-2xl ${subject.bg} border border-slate-200/60 hover:border-blue-400 hover:shadow-md transition text-center flex flex-col items-center justify-center gap-2 group min-h-[140px]`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {subject.icon}
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-1">{subject.title}</h3>
              <span className="text-[11px] text-slate-500 font-medium">{subject.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}