'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tutorProfileSchema, TutorProfileFormInput } from '../../lib/validations/tutor';
import { useTutorProfileStore } from '../../store/useTutorProfileStore';
import YouTubePlayer from './YouTubePlayer';
import CredentialsViewer from './CredentialsViewer';
import SubjectsAndModesSelector from './SubjectsAndModesSelector';
import AvailabilityPicker from './AvailabilityPicker';
import { Loader2, Save, Video, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

function extractClientYoutubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match && match[5] ? match[5] : null;
}

export default function TutorProfileForm() {
  const { profile, fetchProfile, updateProfile, isLoading } = useTutorProfileStore();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<TutorProfileFormInput>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      bio: '',
      hourlyRate: 300,
      gender: 'MALE',
      youtubeVideoUrl: '',
      credentialsDocumentUrl: '',
      subjects: ['Mathematics'],
      deliveryModes: ['ONLINE'],
      cityOrSubcity: 'Addis Ababa',
      availability: {},
    },
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        bio: profile.bio || '',
        hourlyRate: Number(profile.hourlyRate) || 300,
        gender: profile.gender || 'MALE',
        youtubeVideoUrl: profile.youtubeVideoUrl || '',
        credentialsDocumentUrl: profile.credentialsDocumentUrl || '',
        subjects: profile.subjects || ['Mathematics'],
        deliveryModes: profile.deliveryModes || ['ONLINE'],
        cityOrSubcity: profile.cityOrSubcity || 'Addis Ababa',
        availability: profile.availability || {},
      });
    }
  }, [profile, reset]);

  const watchedYoutubeUrl = watch('youtubeVideoUrl');
  const watchedDocumentUrl = watch('credentialsDocumentUrl');
  const liveVideoId = extractClientYoutubeId(watchedYoutubeUrl);

  const onSubmit = async (data: TutorProfileFormInput) => {
    setIsSaving(true);
    try {
      await updateProfile(data);
      toast.success('Profile and portfolio updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto" noValidate>
      
      {/* Section 1: Basic Info & Hourly Rate */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          1. General Information & Rates
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Hourly Rate (ETB/hr)
            </label>
            <input
              {...register('hourlyRate', { valueAsNumber: true })}
              type="number"
              min="50"
              max="5000"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none min-h-11"
            />
            {errors.hourlyRate && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.hourlyRate.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Gender
            </label>
            <select
              {...register('gender')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none min-h-11"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              City / Subcity
            </label>
            <input
              {...register('cityOrSubcity')}
              placeholder="e.g. Addis Ababa, Bole"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none min-h-11"
            />
            {errors.cityOrSubcity && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.cityOrSubcity.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Tutor Bio & Teaching Philosophy
          </label>
          <textarea
            {...register('bio')}
            rows={4}
            placeholder="Describe your academic experience, teaching approach, and success stories..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
          />
          {errors.bio && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.bio.message}</p>}
        </div>
      </div>

      {/* Section 2: Subjects & Delivery Modes */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">
          2. Subjects & Teaching Format
        </h3>
        <Controller
          control={control}
          name="subjects"
          render={({ field: { value, onChange } }) => (
            <Controller
              control={control}
              name="deliveryModes"
              render={({ field: { value: modes, onChange: setModes } }) => (
                <SubjectsAndModesSelector
                  selectedSubjects={value || []}
                  onChangeSubjects={onChange}
                  selectedModes={modes || []}
                  onChangeModes={setModes}
                  errorSubject={errors.subjects?.message}
                  errorMode={errors.deliveryModes?.message}
                />
              )}
            />
          )}
        />
      </div>

      {/* Section 3: YouTube Intro Video & Portfolio */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>3. Video Introduction & Media</span>
          <span className="text-xs font-normal text-slate-500">YouTube Hosted</span>
        </h3>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 items-center gap-1.5">
            <Video className="w-4 h-4 text-rose-600" /> YouTube Video Link (Short or Regular Video):
          </label>
          <input
            {...register('youtubeVideoUrl')}
            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none min-h-11"
          />
          {errors.youtubeVideoUrl && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.youtubeVideoUrl.message}</p>}
        </div>

        {/* Real-time YouTube Player Preview */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Live Video Preview:</p>
          <YouTubePlayer videoId={liveVideoId} />
        </div>
      </div>

      {/* Section 4: Credentials Document (Drive / Canva) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>4. Academic Background & Certification Document</span>
          <span className="text-xs font-normal text-slate-500">Google Drive / Canva</span>
        </h3>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 items-center gap-1.5">
            <LinkIcon className="w-4 h-4 text-blue-700" /> Google Drive or Canva Share Link:
          </label>
          <input
            {...register('credentialsDocumentUrl')}
            placeholder="https://drive.google.com/file/d/.../view or https://www.canva.com/design/..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none min-h-11"
          />
          {errors.credentialsDocumentUrl && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.credentialsDocumentUrl.message}</p>
          )}
        </div>

        <CredentialsViewer
          documentUrl={watchedDocumentUrl}
          status={profile?.verificationStatus || 'PENDING'}
        />
      </div>

      {/* Section 5: Availability Matrix */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">
          5. Availability Calendar
        </h3>
        <Controller
          control={control}
          name="availability"
          render={({ field: { value, onChange } }) => (
            <AvailabilityPicker value={value || {}} onChange={onChange} />
          )}
        />
      </div>

      {/* Submit / Save Button */}
      <div className="pt-4 sticky bottom-4">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-2xl transition shadow-xl flex items-center justify-center gap-2 text-base cursor-pointer min-h-11"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save & Update Profile
            </>
          )}
        </button>
      </div>
    </form>
  );
}