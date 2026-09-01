'use client';

import { AvailabilityMatrix, DaySchedule } from '../../types/tutor';
import { Calendar, Plus, Trash2 } from 'lucide-react';

const DAYS: { key: keyof AvailabilityMatrix; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

interface Props {
  value: AvailabilityMatrix;
  onChange: (availability: AvailabilityMatrix) => void;
}

export default function AvailabilityPicker({ value = {}, onChange }: Props) {
  const addSlot = (dayKey: keyof AvailabilityMatrix) => {
    const currentSlots = value[dayKey] || [];
    const newSlot: DaySchedule = { start: '09:00', end: '12:00' };
    onChange({
      ...value,
      [dayKey]: [...currentSlots, newSlot],
    });
  };

  const removeSlot = (dayKey: keyof AvailabilityMatrix, index: number) => {
    const currentSlots = value[dayKey] || [];
    const updated = currentSlots.filter((_, idx) => idx !== index);
    const copy = { ...value };
    if (updated.length === 0) {
      delete copy[dayKey];
    } else {
      copy[dayKey] = updated;
    }
    onChange(copy);
  };

  const updateTime = (
    dayKey: keyof AvailabilityMatrix,
    index: number,
    field: 'start' | 'end',
    timeVal: string
  ) => {
    const currentSlots = [...(value[dayKey] || [])];
    currentSlots[index] = { ...currentSlots[index], [field]: timeVal };
    onChange({
      ...value,
      [dayKey]: currentSlots,
    });
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 items-center gap-1.5">
        <Calendar className="w-4 h-4 text-blue-700" /> Weekly Availability Schedule:
      </label>

      <div className="border border-slate-200 rounded-2xl divide-y divide-slate-200 bg-white overflow-hidden shadow-sm">
        {DAYS.map(({ key, label }) => {
          const slots = value[key] || [];
          return (
            <div key={key} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-800 w-28 shrink-0">{label}</span>

              {/* Time Slots List */}
              <div className="flex-1 flex flex-wrap items-center gap-2">
                {slots.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Unavailable / Off day</span>
                ) : (
                  slots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs"
                    >
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateTime(key, idx, 'start', e.target.value)}
                        className="bg-white px-2 py-1 rounded border border-slate-300 text-xs font-semibold text-slate-800 outline-none"
                      />
                      <span className="text-slate-400 text-xs">to</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateTime(key, idx, 'end', e.target.value)}
                        className="bg-white px-2 py-1 rounded border border-slate-300 text-xs font-semibold text-slate-800 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeSlot(key, idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 min-h-7.5 flex items-center"
                        title="Remove Slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Slot Button */}
              <button
                type="button"
                onClick={() => addSlot(key)}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition shrink-0 min-h-9"
              >
                <Plus className="w-3.5 h-3.5" /> Add Slot
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}