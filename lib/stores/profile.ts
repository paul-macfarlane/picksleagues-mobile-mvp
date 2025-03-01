import { create } from "zustand";

export type Profile = {
  username: string;
  firstName: string;
  lastName: string;
  profilePicUrl?: string;
};

type ProfileState = {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
  checkUsernameAvailable: (username: string) => Promise<boolean>;
};

const mockOAuthProfile = {
  username: "johndoe123",
  firstName: "John",
  lastName: "Doe",
  profilePicUrl: "https://example.com/profile.jpg",
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ profile: mockOAuthProfile });
    } catch (error) {
      set({ error: "Failed to fetch profile" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profile: Profile) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ profile });
    } catch (error) {
      set({ error: "Failed to update profile" });
    } finally {
      set({ isLoading: false });
    }
  },

  checkUsernameAvailable: async (username: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return !["taken", "admin", "test"].includes(username.toLowerCase());
  },
}));
