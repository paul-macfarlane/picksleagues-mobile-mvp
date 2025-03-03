import { create } from "zustand";
import { fetchWithAuth } from "~/lib/utils/api";
import { getUserData, saveUserData } from "~/lib/services/auth-service";

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

type ProfileState = {
  profile: Profile | null;

  isFetching: boolean;
  fetchError: string | null;
  fetchProfile: FetchProfileFunction;

  isUpdating: boolean;
  updateError: string | null;
  updateProfile: UpdateProfileFunction;
};

const PROFILE_ENDPOINT = "/me";

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isFetching: false,
  fetchError: null,
  fetchProfile: async () => {
    let profile = null;
    let error = null;
    set({ isFetching: true, fetchError: null });

    try {
      const userData = await getUserData();

      if (
        userData &&
        userData.username &&
        userData.firstName &&
        userData.lastName
      ) {
        profile = {
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profilePicUrl: userData.image ?? undefined,
        };
        set({ profile });
      } else {
        const response = await fetchWithAuth(PROFILE_ENDPOINT);
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        profile = data.profile;
        set({ profile });
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to fetch profile";
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
      const response = await fetchWithAuth(PROFILE_ENDPOINT, {
        method: "PUT",
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      set({ profile });

      const userData = await getUserData();
      if (userData) {
        await saveUserData({
          ...userData,
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          image: profile.profilePicUrl ?? null,
        });
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to update profile";
      set({ updateError: error });
    } finally {
      set({ isUpdating: false });
      return { error };
    }
  },
}));
