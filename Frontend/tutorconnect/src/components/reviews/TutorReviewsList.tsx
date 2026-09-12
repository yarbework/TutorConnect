'use client';

import { useState } from 'react';
import { Review } from '../../types/review';
import { Star, ShieldCheck, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

interface Props {
  reviews: Review[];
}

const INITIAL_VISIBLE_COUNT = 1;

export default function TutorReviewsList({ reviews }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (reviews.length === 0) {
    return (
      <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
        <MessageSquare className="w-6 h-6 text-slate-300 mx-auto" />
        <p className="text-xs font-bold text-slate-700">No client reviews published yet</p>
        <p className="text-[11px] text-slate-400">
          Reviews from guardians following completed tutoring contracts will appear here.
        </p>
      </div>
    );
  }

  const hasMultipleReviews = reviews.length > INITIAL_VISIBLE_COUNT;
  const displayedReviews = isExpanded ? reviews : reviews.slice(0, INITIAL_VISIBLE_COUNT);
  const hiddenCount = reviews.length - INITIAL_VISIBLE_COUNT;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {displayedReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-3 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
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
                <span className="text-xs font-black text-slate-900">{rev.rating}.0</span>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Guardian
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {new Date(rev.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              &ldquo;{rev.comment}&rdquo;
            </p>

            {rev.tags && rev.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {rev.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-50 text-slate-700 border border-slate-200/80 text-[10px] font-semibold px-2.5 py-0.5 rounded-lg"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMultipleReviews && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition cursor-pointer shadow-xs min-h-[38px]"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" /> Show Fewer Reviews
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Show More Reviews (+{hiddenCount} remaining)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}