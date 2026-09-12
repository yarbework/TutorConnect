'use client';

import { Engagement } from '../../types/engagement';
import { Briefcase} from 'lucide-react';

interface Props {
  engagements: Engagement[];
  selectedId: string | null;
  currentUserId?: string;
  onSelect: (engagement: Engagement) => void;
}

export default function EngagementSidebar({
  engagements,
  selectedId,
  currentUserId,
  onSelect,
}: Props) {
  if (engagements.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-2">
        <Briefcase className="w-8 h-8 mx-auto text-slate-300" />
        <p className="text-xs font-bold text-slate-600">No engagements yet</p>
        <p className="text-[11px] text-slate-400">
          Once a proposal is accepted, the direct channel will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 overflow-y-auto max-h-[calc(100vh-220px)]">
      {engagements.map((eng) => {
        const isSelected = eng.id === selectedId;
        const isGuardian = currentUserId === eng.guardianId;
        const counterpartyEmail = isGuardian ? eng.tutor?.email : eng.guardian?.email;
        const isActive = eng.status === 'ACTIVE';

        return (
          <button
            key={eng.id}
            type="button"
            onClick={() => onSelect(eng)}
            className={`w-full text-left p-4 transition flex flex-col gap-1.5 cursor-pointer ${
              isSelected ? 'bg-blue-50/80 border-l-4 border-blue-700' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-slate-900 truncate">
                  {eng.job?.title || 'Tutoring Engagement'}
                </span>
                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {eng.status}
                </span>
              </div>

            <p className="text-xs text-slate-600 truncate">
              {isGuardian ? 'Tutor: ' : 'Guardian: '}
              <strong className="text-slate-800">{counterpartyEmail || 'Participant'}</strong>
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>{eng.job?.subject || 'Subject'}</span>
              <span className="font-bold text-slate-700">{eng.agreedHourlyRate} ETB/hr</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}