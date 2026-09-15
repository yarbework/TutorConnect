'use client';

import { Review } from '../../types/review';
import { Star, ShieldCheck, MessageSquareQuote } from 'lucide-react';

interface Props {
  reviews: Review[];
}

export default function HomeReviewsSection({ reviews }: Props) {
  if (reviews.length === 0) return null;

  return (
    <section className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-amber-500" /> Authentic Client Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Real Reviews from Completed Contracts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Ratings left by guardians and students after completing verified tutoring engagements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed whitespace-pre-line">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified Guardian</span>
                <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}