'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applyJobSchema, ApplyJobInput } from '../../lib/validations/application';
import { JobPost } from '../../types/job';
import { jobsApi } from '../../lib/api/jobs';
import { 
  X, 
  Coins, 
  Sparkles, 
  Video, 
  Send, 
  Loader2, 
  AlertCircle, 
  PlusCircle, 
  CheckCircle2 
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  job: JobPost;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CONNECTS_COST = 2;

export default function ApplyJobModal({ job, isOpen, onClose, onSuccess }: Props) {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplyJobInput>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      proposed_rate: Number(job.max_hourly_budget) || 300,
      pitch_message: '',
      video_pitch_url: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      setIsLoadingWallet(true);
      jobsApi
        .getMyWallet()
        .then((w) => setWalletBalance(w.balance))
        .catch(() => setWalletBalance(0))
        .finally(() => setIsLoadingWallet(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasInsufficientConnects = walletBalance !== null && walletBalance < CONNECTS_COST;

  const onSubmit = async (data: ApplyJobInput) => {
    setIsSubmitting(true);
    try {
      await jobsApi.applyToJob(job.id, data);
      toast.success(`Proposal submitted! ${CONNECTS_COST} Connects deducted.`);
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.status === 402 || err.statusCode === 402) {
        toast.error('Insufficient Connects balance. Please top up your wallet.');
      } else {
        toast.error(err.message || 'Failed to submit proposal');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Job Application
              </span>
              <span className="text-[11px] text-blue-200 font-semibold">
                Cost: {CONNECTS_COST} Connects
              </span>
            </div>
            <h3 className="text-lg font-black text-white leading-tight truncate max-w-md">
              {job.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Wallet Balance Strip */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Your Active Balance:</span>
            {isLoadingWallet ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
            ) : (
              <strong className="text-slate-900 font-bold">{walletBalance} Connects</strong>
            )}
          </div>

          <span className="text-[11px] text-slate-500">
            After submission: <strong className="text-slate-800">{Math.max(0, (walletBalance || 0) - CONNECTS_COST)} Connects</strong>
          </span>
        </div>

        {/* Insufficient Balance Banner */}
        {hasInsufficientConnects && (
          <div className="m-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-amber-900">
              <p className="font-bold">Insufficient Connects Balance</p>
              <p>You need at least {CONNECTS_COST} Connects to apply for this tutoring job. Your current balance is {walletBalance}.</p>
              <div className="pt-2">
                <Link
                  href="/connects/buy"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Purchase Connects
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Proposal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5" noValidate>
          
          {/* Proposed Rate */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Your Proposed Hourly Rate (ETB/hr)
              </label>
              <span className="text-[11px] text-slate-500">
                Guardian&apos;s Max Budget: <strong className="text-slate-800">{job.max_hourly_budget} ETB/hr</strong>
              </span>
            </div>
            <input
              type="number"
              step="10"
              {...register('proposed_rate', { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none min-h-[44px]"
            />
            {errors.proposed_rate && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.proposed_rate.message}</p>
            )}
          </div>

          {/* Proposal Strategy / Pitch */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Pedagogical Approach & Custom Pitch <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              {...register('pitch_message')}
              placeholder="Introduce your relevant teaching experience, how you plan to cover the student's learning objectives, and recommended weekly scheduling..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none leading-relaxed"
            />
            {errors.pitch_message && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.pitch_message.message}</p>
            )}
          </div>

          {/* Optional Video Pitch URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-blue-700" /> Custom Video Pitch Link (Optional)
              </label>
              <span className="text-[10px] text-slate-400">YouTube or Loom</span>
            </div>
            <input
              type="url"
              {...register('video_pitch_url')}
              placeholder="https://youtu.be/... or https://loom.com/share/..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none min-h-[44px]"
            />
            {errors.video_pitch_url && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.video_pitch_url.message}</p>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition min-h-[40px]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || hasInsufficientConnects || isLoadingWallet}
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2 min-h-[40px] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Proposal ({CONNECTS_COST} Connects)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}