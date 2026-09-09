'use client';

import { useState } from 'react';
import {jobsApi } from '../../../lib/api/jobs';
import { JobInvitation } from '../../../types/job';
import { 
  Sparkles, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  MapPin, 
  Coins, 
  MessageSquare, 
  Laptop, 
  Home 
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  invitations: JobInvitation[];
  onInvitationUpdated: () => void;
}

export default function TutorInvitationsInbox({ invitations, onInvitationUpdated }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleResponse = async (id: string, status: 'ACCEPTED' | 'DECLINED') => {
    setLoadingId(id);
    try {
      await jobsApi.respondToInvitation(id, status);
      toast.success(status === 'ACCEPTED' ? 'Invitation accepted! You can now coordinate sessions.' : 'Invitation declined.');
      onInvitationUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update invitation');
    } finally {
      setLoadingId(null);
    }
  };

  const pendingInvitations = invitations.filter((inv) => inv.status === 'PENDING');

  if (pendingInvitations.length === 0) {
    return null; // Don't take up space if there are no pending invites
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-950 rounded-3xl p-6 text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-400/20 text-amber-300 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Direct Invitations from Guardians</h3>
            <p className="text-xs text-blue-200">
              Parents who reviewed your profile and requested you specifically
            </p>
          </div>
        </div>
        <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full">
          {pendingInvitations.length} Pending
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {pendingInvitations.map((inv) => (
          <div
            key={inv.id}
            className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-black text-white">{inv.job?.title}</h4>
                <p className="text-xs text-blue-200 mt-0.5">
                  From Guardian: <strong className="text-white">{inv.guardian?.email}</strong> • Grade: {inv.job?.grade_level}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-base font-black text-amber-300">
                  {inv.job?.max_hourly_budget} ETB/hr
                </span>
                <span className="text-[11px] text-blue-200 block">
                  {inv.job?.teaching_mode === 'ONLINE' ? 'Virtual' : inv.job?.city || 'In-Person'}
                </span>
              </div>
            </div>

            {/* Guardian's Personal Note */}
            <div className="bg-black/20 p-3.5 rounded-xl border border-white/5 text-xs text-slate-200 flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <p className="leading-relaxed whitespace-pre-line italic">
                &ldquo;{inv.message}&rdquo;
              </p>
            </div>

            {/* Accept / Decline Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={loadingId === inv.id}
                onClick={() => handleResponse(inv.id, 'DECLINED')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 min-h-[36px]"
              >
                <X className="w-3.5 h-3.5" /> Decline
              </button>

              <button
                type="button"
                disabled={loadingId === inv.id}
                onClick={() => handleResponse(inv.id, 'ACCEPTED')}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition shadow-md flex items-center gap-1.5 min-h-[36px]"
              >
                <Check className="w-4 h-4" /> Accept Invitation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}