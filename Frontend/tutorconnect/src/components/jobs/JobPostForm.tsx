'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createJobPostSchema, CreateJobPostInput } from '../../lib/validations/job';
import { jobsApi } from '../../lib/api/jobs';
import { 
  Briefcase, 
  MapPin, 
  Laptop, 
  Home, 
  Coins, 
  Loader2, 
  ArrowRight, 
} from 'lucide-react';
import { toast } from 'sonner';

export default function JobPostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateJobPostInput>({
    resolver: zodResolver(createJobPostSchema),
    defaultValues: {
      title: '',
      subject: '',
      grade_level: 'HIGH_SCHOOL',
      learning_objectives: '',
      max_hourly_budget: 350,
      weekly_hours_commitment: 4,
      teaching_mode: 'ONLINE',
      preferred_tutor_gender: 'ANY',
      status: 'PUBLISHED',
      city: '',
      physical_address: '',
      virtual_meeting_link: '',
    },
  });

  const selectedMode = watch('teaching_mode');
  const isOnline = selectedMode === 'ONLINE';

  const onSubmit = async (data: CreateJobPostInput, submitStatus: 'DRAFT' | 'PUBLISHED') => {
    setIsSubmitting(true);
    try {
      await jobsApi.createJob({ ...data, status: submitStatus });
      toast.success(
        submitStatus === 'PUBLISHED'
          ? 'Job post published successfully! Tutors can now discover and apply.'
          : 'Job draft saved successfully.'
      );
      router.push('/guardian/jobs');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit job post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8 max-w-4xl mx-auto" noValidate>
      
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-600" />
          1. Job Overview & Subject
        </h3>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Job Posting Title
          </label>
          <input
            {...register('title')}
            placeholder="e.g. Grade 12 Physics & Calculus Tutor for EUEE Prep"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none min-h-[44px]"
          />
          {errors.title && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Subject Area
            </label>
            <input
              {...register('subject')}
              placeholder="e.g. Mathematics, Physics, Chemistry"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none min-h-[44px]"
            />
            {errors.subject && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Target Grade Level
            </label>
            <select
              {...register('grade_level')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none min-h-[44px]"
            >
              <option value="KINDERGARTEN">Kindergarten</option>
              <option value="ELEMENTARY_LOWER">Elementary (Grades 1–3)</option>
              <option value="ELEMENTARY_UPPER">Elementary (Grades 4–6)</option>
              <option value="MIDDLE_SCHOOL">Middle School (Grades 7–8)</option>
              <option value="HIGH_SCHOOL">High School (Grades 9–12)</option>
              <option value="UNDERGRADUATE">University / College</option>
              <option value="ADULT">Adult Learner</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Learning Objectives & Student Needs
          </label>
          <textarea
            {...register('learning_objectives')}
            rows={4}
            placeholder="Specify current student weaknesses, upcoming exams, or particular textbook chapters to cover..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none"
          />
          {errors.learning_objectives && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.learning_objectives.message}</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Coins className="w-5 h-5 text-emerald-600" />
          2. Budget, Schedule & Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Max Budget (ETB/hr)
            </label>
            <input
              {...register('max_hourly_budget', { valueAsNumber: true })}
              type="number"
              step="10"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none min-h-[44px]"
            />
            {errors.max_hourly_budget && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.max_hourly_budget.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Weekly Hours Needed
            </label>
            <input
              {...register('weekly_hours_commitment', { valueAsNumber: true })}
              type="number"
              min="1"
              max="80"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none min-h-[44px]"
            />
            {errors.weekly_hours_commitment && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.weekly_hours_commitment.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Preferred Tutor Gender
            </label>
            <select
              {...register('preferred_tutor_gender')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none min-h-[44px]"
            >
              <option value="ANY">No Preference (Any)</option>
              <option value="FEMALE">Female Only</option>
              <option value="MALE">Male Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          3. Delivery Mode & Location
        </h3>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Tutoring Delivery Mode:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'ONLINE', label: 'Online / Virtual', icon: Laptop },
              { id: 'IN_PERSON_STUDENT_HOME', label: "Student's Home", icon: Home },
              { id: 'IN_PERSON_TUTOR_HOME', label: "Tutor's Location", icon: MapPin },
            ].map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                onClick={() => setValue('teaching_mode', id as any, { shouldValidate: true })}
                className={`p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition min-h-[44px] cursor-pointer ${
                  selectedMode === id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${selectedMode === id ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {isOnline ? (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Virtual Meeting Link (Optional)
            </label>
            <input
              {...register('virtual_meeting_link')}
              placeholder="e.g. https://meet.google.com/xyz-abcd-efg"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none min-h-[44px]"
            />
            {errors.virtual_meeting_link && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.virtual_meeting_link.message}</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                City / Subcity <span className="text-rose-500">*</span>
              </label>
              <input
                {...register('city')}
                placeholder="e.g. Addis Ababa, Bole"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none min-h-[44px]"
              />
              {errors.city && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Physical Address / Landmark <span className="text-rose-500">*</span>
              </label>
              <input
                {...register('physical_address')}
                placeholder="e.g. Near Medhanialem Mall, House #240"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none min-h-[44px]"
              />
              {errors.physical_address && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.physical_address.message}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit((data) => onSubmit(data, 'DRAFT'))}
          className="w-full sm:w-auto px-6 py-3.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs transition cursor-pointer min-h-[44px]"
        >
          Save as Draft
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit((data) => onSubmit(data, 'PUBLISHED'))}
          className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
            </>
          ) : (
            <>
              Publish Job Post <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}