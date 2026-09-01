'use client';

import { DeliveryMode } from '../../types/tutor';
import { BookOpen, MapPin, Laptop, Home } from 'lucide-react';

const AVAILABLE_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Language',
  'EUEE Aptitude',
  'Economics',
  'Civics',
  'Geography',
];

const DELIVERY_OPTIONS: { id: DeliveryMode; label: string; icon: typeof Laptop }[] = [
  { id: 'ONLINE', label: 'Online / Virtual', icon: Laptop },
  { id: 'IN_PERSON_STUDENT_HOME', label: "Student's Home", icon: Home },
  { id: 'IN_PERSON_TUTOR_HOME', label: "Tutor's Location", icon: MapPin },
];

interface Props {
  selectedSubjects: string[];
  onChangeSubjects: (subjects: string[]) => void;
  selectedModes: DeliveryMode[];
  onChangeModes: (modes: DeliveryMode[]) => void;
  errorSubject?: string;
  errorMode?: string;
}

export default function SubjectsAndModesSelector({
  selectedSubjects,
  onChangeSubjects,
  selectedModes,
  onChangeModes,
  errorSubject,
  errorMode,
}: Props) {
  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      onChangeSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      onChangeSubjects([...selectedSubjects, subject]);
    }
  };

  const toggleMode = (mode: DeliveryMode) => {
    if (selectedModes.includes(mode)) {
      if (selectedModes.length > 1) {
        onChangeModes(selectedModes.filter((m) => m !== mode));
      }
    } else {
      onChangeModes([...selectedModes, mode]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subject Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-blue-700" /> Subjects You Teach:
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SUBJECTS.map((sub) => {
            const isSelected = selectedSubjects.includes(sub);
            return (
              <button
                type="button"
                key={sub}
                onClick={() => toggleSubject(sub)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition min-h-11 flex items-center cursor-pointer ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-700/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {sub}
              </button>
            );
          })}
        </div>
        {errorSubject && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errorSubject}</p>}
      </div>

      {/* Delivery Modes Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Teaching Delivery Modes:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DELIVERY_OPTIONS.map((opt) => {
            const isSelected = selectedModes.includes(opt.id);
            const Icon = opt.icon;
            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => toggleMode(opt.id)}
                className={`p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition min-h-11 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span className="text-xs">{opt.label}</span>
              </button>
            );
          })}
        </div>
        {errorMode && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errorMode}</p>}
      </div>
    </div>
  );
}