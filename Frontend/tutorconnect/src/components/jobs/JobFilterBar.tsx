'use client';

import { useState } from 'react';
import { ExploreJobsFilters, TargetGradeLevel, TeachingMode } from '../../types/job';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface Props {
  filters: ExploreJobsFilters;
  onApplyFilters: (filters: ExploreJobsFilters) => void;
  onResetFilters: () => void;
}

export default function JobFilterBar({ filters, onApplyFilters, onResetFilters }: Props) {
  const [localFilters, setLocalFilters] = useState<ExploreJobsFilters>(filters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(localFilters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Subject Search */}
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

        {/* Grade Level */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Grade Level
          </label>
          <select
            value={localFilters.grade_level || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                grade_level: (e.target.value as TargetGradeLevel) || undefined,
              })
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none min-h-[40px]"
          >
            <option value="">All Grades</option>
            <option value="ELEMENTARY_LOWER">Elementary (1-3)</option>
            <option value="ELEMENTARY_UPPER">Elementary (4-6)</option>
            <option value="MIDDLE_SCHOOL">Middle School (7-8)</option>
            <option value="HIGH_SCHOOL">High School (9-12)</option>
            <option value="UNDERGRADUATE">University / College</option>
          </select>
        </div>

        {/* Teaching Mode */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Teaching Mode
          </label>
          <select
            value={localFilters.teaching_mode || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                teaching_mode: (e.target.value as TeachingMode) || undefined,
              })
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none min-h-[40px]"
          >
            <option value="">Any Mode</option>
            <option value="ONLINE">Online / Virtual</option>
            <option value="IN_PERSON_STUDENT_HOME">Student's Home</option>
            <option value="IN_PERSON_TUTOR_HOME">Tutor's Home</option>
          </select>
        </div>

        {/* City */}
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

        {/* Min Hourly Rate */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
            Min Budget (ETB)
          </label>
          <input
            type="number"
            placeholder="Min ETB/hr"
            value={localFilters.min_budget || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                min_budget: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none min-h-[40px]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            setLocalFilters({});
            onResetFilters();
          }}
          className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 min-h-[36px]"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm min-h-[36px]"
        >
          <Search className="w-3.5 h-3.5" /> Search Jobs
        </button>
      </div>
    </form>
  );
}