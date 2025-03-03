import { create } from "zustand";
import {
  clearAuthData,
  getUserData,
  initiateOAuthFlow,
  isAuthenticated,
  UserData,
} from "~/lib/services/auth-service";

export type SignInResponse = {
  error: string | null;
  isNewUser: boolean;
};

export type SignInFunction = () => Promise<SignInResponse>;

export type SignOutResponse = {
  error: string | null;
};

export type SignOutFunction = () => Promise<SignOutResponse>;

type AuthState = {
  isAuthenticated: boolean;
  isNewUser: boolean;
  userData: UserData | null;

  isSigningIn: boolean;
  signInError: string | null;
  signInWithGoogle: SignInFunction;
  signInWithDiscord: SignInFunction;

  isSigningOut: boolean;
  signOutError: string | null;
  signOut: SignOutFunction;

  initializeAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isNewUser: false,
  userData: null,

  isSigningIn: false,
  signInError: null,
  signInWithGoogle: async () => {
    let error: string | null = null;
    let isNewUser = false;
    set({ isSigningIn: true, signInError: null, isNewUser });

    try {
      const authResponse = await initiateOAuthFlow("google");
      isNewUser = authResponse.isNewUser;

      set({
        isAuthenticated: true,
        isNewUser,
        userData: authResponse.userData,
      });
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to sign in with Google";
      set({ signInError: error });
    } finally {
      set({ isSigningIn: false });
      return { error, isNewUser };
    }
  },

  signInWithDiscord: async () => {
    let error: string | null = null;
    let isNewUser = false;
    set({ isSigningIn: true, signInError: null, isNewUser });

    try {
      const authResponse = await initiateOAuthFlow("discord");
      isNewUser = authResponse.isNewUser;

      set({
        isAuthenticated: true,
        isNewUser,
        userData: authResponse.userData,
      });
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to sign in with Discord";
      set({ signInError: error });
    } finally {
      set({ isSigningIn: false });
      return { error, isNewUser };
    }
  },

  isSigningOut: false,
  signOutError: null,
  signOut: async () => {
    let error: string | null = null;
    set({ isSigningOut: true, signOutError: null });

    try {
      await clearAuthData();
      set({
        isAuthenticated: false,
        userData: null,
        isNewUser: false,
      });
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to sign out";
      set({ signOutError: error });
    } finally {
      set({ isSigningOut: false });
      return { error };
    }
  },

  initializeAuth: async () => {
    try {
      const isAuth = await isAuthenticated();
      const userData = await getUserData();

      set({
        isAuthenticated: isAuth,
        userData: userData,
        isNewUser: false, // We assume existing user on app restart
      });
    } catch (error) {
      console.error("Failed to initialize auth state:", error);
      // If initialization fails, we assume user is not authenticated
      set({
        isAuthenticated: false,
        userData: null,
        isNewUser: false,
      });
    }
  },
}));
