import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  isNewUser: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithDiscord: () => Promise<void>;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isNewUser: false,
  signInWithGoogle: async () => {
    // Mock Google sign in
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isAuthenticated: true, isNewUser: Math.random() > 0.5 });
  },
  signInWithDiscord: async () => {
    // Mock Discord sign in
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isAuthenticated: true, isNewUser: Math.random() > 0.5 });
  },
  signOut: () => {
    set({ isAuthenticated: false, isNewUser: false });
  },
}));
