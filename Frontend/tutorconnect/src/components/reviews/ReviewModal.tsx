'use client';

import { useState } from 'react';
import { reviewsApi } from '../../lib/api/reviews';
import { Star, X, Loader2, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  engagementId: string;
  counterpartyLabel: string;
  isGuardian: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TUTOR_TAGS = [
  'Punctual',
  'Patient Explanations',
  'Deep Subject Mastery',
  'Exam Focused',
  'Interactive Methods',
  'Good Communicator',
];

const GUARDIAN_TAGS = [
  'Prompt Payment',
  'Respectful Environment',
  'Clear Expectations',
  'Great Communicator',
  'Organized Schedule',
];

export default function ReviewModal({
  engagementId,
  counterpartyLabel,
  isGuardian,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const availableTags = isGuardian ? TUTOR_TAGS : GUARDIAN_TAGS;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      toast.error('Please provide at least 10 characters of feedback');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsApi.submitReview({
        engagementId,
        rating,
        tags: selectedTags,
        comment: comment.trim(),
      });
      toast.success('Thank you! Your feedback has been verified and recorded.');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Verified Reputation Review
            </span>
            <h3 className="text-lg font-black mt-0.5">Review {counterpartyLabel}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star Rating Selector */}
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Overall Rating
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-200 hover:scale-110 transition cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-800">
              {rating === 5 && 'Outstanding Experience'}
              {rating === 4 && 'Very Good'}
              {rating === 3 && 'Average'}
              {rating === 2 && 'Below Expectations'}
              {rating === 1 && 'Unsatisfactory'}
            </span>
          </div>

          {/* Endorsement Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Endorsement Highlights:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-700 border-blue-700 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {tag} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Textarea */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Detailed Written Feedback
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe lesson clarity, punctuality, and overall impact on the student..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Publish Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}