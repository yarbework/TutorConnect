'use client';

import { useState } from 'react';
import { TutorBrowseFilters } from '../../lib/api/tutor';
import { Search, RotateCcw, Filter } from 'lucide-react';

interface Props {
  filters: TutorBrowseFilters;
  onApply: (filters: TutorBrowseFilters) => void;
  onReset: () => void;
}

export default function TutorDirectoryFilterBar({ filters, onApply, onReset }: Props) {
  const [localFilters, setLocalFilters] = useState<TutorBrowseFilters>(filters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(localFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Subject
          </label>
          <input
            type="text"
            placeholder="e.g. Physics, Math"
            value={localFilters.subject || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, subject: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none min-h-[40px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            City / Subcity
          </label>
          <input
            type="text"
            placeholder="e.g. Bole, Addis Ababa"
            value={localFilters.city || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none min-h-[40px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Max Rate (ETB/hr)
          </label>
          <input
            type="number"
            placeholder="e.g. 500"
            value={localFilters.maxRate || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                maxRate: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none min-h-[40px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Teaching Mode
          </label>
          <select
            value={localFilters.deliveryMode || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, deliveryMode: e.target.value || undefined })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none min-h-[40px]"
          >
            <option value="">Any Mode</option>
            <option value="ONLINE">Online / Virtual</option>
            <option value="IN_PERSON_STUDENT_HOME">Student's Home</option>
            <option value="IN_PERSON_TUTOR_HOME">Tutor's Home</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Gender Preference
          </label>
          <select
            value={localFilters.gender || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, gender: e.target.value || undefined })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none min-h-[40px]"
          >
            <option value="">Any Gender</option>
            <option value="FEMALE">Female Only</option>
            <option value="MALE">Male Only</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            setLocalFilters({});
            onReset();
          }}
          className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 min-h-[36px]"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>

        <button
          type="submit"
          className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm min-h-[36px]"
        >
          <Search className="w-3.5 h-3.5" /> Filter Tutors
        </button>
      </div>
    </form>
  );
}