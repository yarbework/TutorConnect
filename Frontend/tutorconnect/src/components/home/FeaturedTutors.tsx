import Link from 'next/link';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

const TUTORS = [
  {
    name: 'Abebe Kebede',
    subject: 'Advanced Mathematics & EUEE Prep',
    rating: 4.9,
    reviews: 48,
    rate: '300 ETB/hr',
    badge: 'Top Educator',
    initials: 'AK',
    color: 'bg-blue-700',
  },
  {
    name: 'Sintayehu Tadesse',
    subject: 'General Physics & Applied Mechanics',
    rating: 4.95,
    reviews: 62,
    rate: '350 ETB/hr',
    badge: 'Top Rated',
    initials: 'ST',
    color: 'bg-emerald-700',
  },
  {
    name: 'Bethlehem Alemu',
    subject: 'Organic Chemistry & Biology',
    rating: 4.88,
    reviews: 35,
    rate: '280 ETB/hr',
    badge: 'Verified Specialist',
    initials: 'BA',
    color: 'bg-indigo-700',
  },
];

export default function FeaturedTutors() {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">Top Ranked</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">Featured Tutors of the Month</h2>
          <p className="text-slate-600 text-sm mt-2">Highest guardian ratings and verified background certifications</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TUTORS.map((tutor, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${tutor.color} text-white font-bold rounded-xl flex items-center justify-center text-base shrink-0 shadow-sm`}>
                      {tutor.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-1 text-base">
                        {tutor.name}
                        <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{tutor.badge}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full shrink-0">
                    {tutor.rate}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-800">{tutor.subject}</p>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-900">{tutor.rating}</span>
                  <span>({tutor.reviews} guardian reviews)</span>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ID Verified
                </span>
                <Link
                  href="/register?role=GUARDIAN"
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 min-h-[44px] flex items-center"
                >
                  Book Session →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}