'use client';

import { Review } from '../../types/review';
import { Star, MessageSquare, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  myReview: Review | null;
  counterpartyReview: Review | null;
  counterpartyRoleLabel: string;
  onOpenReviewModal: () => void;
}

export default function EngagementReviewsCard({
  myReview,
  counterpartyReview,
  counterpartyRoleLabel,
  onOpenReviewModal,
}: Props) {
  return (
    <div className="bg-slate-50 border-t border-slate-200/80 p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Contract Feedback & Ratings
          </h4>
        </div>
        <span className="text-[11px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md">
          Completed Engagement
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-700">Your Feedback</span>
            {myReview ? (
              <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{myReview.rating}.0</span>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                Not Submitted
              </span>
            )}
          </div>

          {myReview ? (
            <>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &ldquo;{myReview.comment}&rdquo;
              </p>

              {myReview.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {myReview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-slate-400 block pt-1">
                Submitted on {new Date(myReview.createdAt).toLocaleDateString()}
              </span>
            </>
          ) : (
            <div className="py-3 text-center space-y-2">
              <p className="text-xs text-slate-500">
                You haven&apos;t shared your feedback for this {counterpartyRoleLabel.toLowerCase()} yet.
              </p>
              <button
                type="button"
                onClick={onOpenReviewModal}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-slate-950" /> Rate {counterpartyRoleLabel}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-700">
              {counterpartyRoleLabel}&apos;s Feedback
            </span>
            {counterpartyReview && (
              <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{counterpartyReview.rating}.0</span>
              </div>
            )}
          </div>

          {counterpartyReview ? (
            <>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &ldquo;{counterpartyReview.comment}&rdquo;
              </p>

              {counterpartyReview.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {counterpartyReview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Submitted on {new Date(counterpartyReview.createdAt).toLocaleDateString()}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                </span>
              </div>
            </>
          ) : (
            <div className="py-4 text-center text-slate-400 space-y-1">
              <Clock className="w-5 h-5 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-500">
                Awaiting feedback from the {counterpartyRoleLabel.toLowerCase()}
              </p>
              <p className="text-[10px] text-slate-400">
                Their rating and comments will appear here as soon as they submit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}