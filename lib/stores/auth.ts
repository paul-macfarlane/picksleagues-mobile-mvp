import { create } from "zustand";

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

  isSigningIn: boolean;
  signInError: string | null;
  signInWithGoogle: SignInFunction;
  signInWithDiscord: SignInFunction;

  isSigningOut: boolean;
  signOutError: string | null;
  signOut: SignOutFunction;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isNewUser: false,

  isSigningIn: false,
  signInError: null,
  signInWithGoogle: async () => {
    let error: string | null = null;
    let isNewUser = false;
    set({ isSigningIn: true, signInError: null, isNewUser });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      isNewUser = true;
      // todo temporarily setting this to always be a new user when signed in with google
      set({ isAuthenticated: true, isNewUser, isSigningIn: false });
    } catch (e) {
      error = "Failed to sign in";
      set({ signInError: error });
    } finally {
      set({ isSigningIn: false, isNewUser });
      return { error, isNewUser };
    }
  },
  signInWithDiscord: async () => {
    let error: string | null = null;
    let isNewUser = false;
    set({ isSigningIn: true, signInError: null, isNewUser });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // todo temporarily setting this to always be an existing user when signed in with discord
      set({ isAuthenticated: true, isNewUser, isSigningIn: false });
    } catch (e) {
      error = "Failed to sign in";
      set({ signInError: error });
    } finally {
      set({ isSigningIn: false, isNewUser });
      return { error, isNewUser };
    }
  },

  isSigningOut: false,
  signOutError: null,
  signOut: async () => {
    let error: string | null = null;
    set({ isSigningOut: true, signOutError: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ isAuthenticated: false });
    } catch (e) {
      error = "Failed to sign out";
      set({ signOutError: error });
    } finally {
      set({ isSigningOut: false });
      return { error };
    }
  },
}));
