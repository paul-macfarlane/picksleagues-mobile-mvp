import { create } from "zustand";

export type Profile = {
  username: string;
  firstName: string;
  lastName: string;
  profilePicUrl?: string;
};

export type FetchProfileResponse = {
  profile: Profile | null;
  error: string | null;
};

export type FetchProfileFunction = () => Promise<FetchProfileResponse>;

export type UpdateProfileResponse = {
  error: string | null;
};

export type UpdateProfileFunction = (
  profile: Profile
) => Promise<UpdateProfileResponse>;

export type CheckUsernameAvailabilityResponse = {
  available: boolean;
  error: string | null;
};

export type CheckUsernameAvailabilityFunction = (
  username: string
) => Promise<CheckUsernameAvailabilityResponse>;

type ProfileState = {
  profile: Profile | null;

  isFetching: boolean;
  fetchError: string | null;
  fetchProfile: FetchProfileFunction;

  isUpdating: boolean;
  updateError: string | null;
  updateProfile: UpdateProfileFunction;

  isCheckingUsername: boolean;
  checkUsernameError: string | null;
  checkUsernameAvailable: CheckUsernameAvailabilityFunction;
};

const mockOAuthProfile = {
  username: "johndoe123",
  firstName: "John",
  lastName: "Doe",
  profilePicUrl: "https://example.com/profile.jpg",
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isFetching: false,
  fetchError: null,
  fetchProfile: async () => {
    let profile = null;
    let error = null;
    set({ isFetching: true, fetchError: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ profile: mockOAuthProfile });
      profile = mockOAuthProfile;
    } catch (e) {
      error = "Failed to fetch profile";
      set({ fetchError: error });
    } finally {
      set({ isFetching: false });
      return { profile, error };
    }
  },

  isUpdating: false,
  updateError: null,
  updateProfile: async (profile: Profile) => {
    let error: string | null = null;
    set({ isUpdating: true, updateError: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ profile });
    } catch (e) {
      error = "Failed to update profile";
      set({ updateError: error });
    } finally {
      set({ isUpdating: false });
      return { error };
    }
  },

  isCheckingUsername: false,
  checkUsernameError: null,
  checkUsernameAvailable: async (username: string) => {
    let available = false;
    let error: string | null = null;
    set({ isCheckingUsername: true, checkUsernameError: null });

    try {
      available = !["taken", "admin", "test"].includes(username.toLowerCase());
      set({ checkUsernameError: null });
    } catch (e) {
      error = "Failed to check username";
      set({ checkUsernameError: error });
    } finally {
      set({ isCheckingUsername: false });
      return { available, error };
    }
  },
}));
