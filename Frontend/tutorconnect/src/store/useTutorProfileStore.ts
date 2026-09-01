import { create } from 'zustand';
import { TutorProfile } from '../types/tutor';
import { tutorApi } from '../lib/api/tutor';
import { TutorProfileFormInput } from '../lib/validations/tutor';

interface TutorProfileState {
  profile: TutorProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: TutorProfileFormInput) => Promise<TutorProfile>;
}

export const useTutorProfileStore = create<TutorProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await tutorApi.getMyProfile();
      set({ profile, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tutor profile', isLoading: false });
    }
  },

  updateProfile: async (data: TutorProfileFormInput) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await tutorApi.updateProfile(data);
      set({ profile: updated, isLoading: false });
      return updated;
    } catch (err: any) {
      set({ error: err.message || 'Failed to update profile', isLoading: false });
      throw err;
    }
  },
}));