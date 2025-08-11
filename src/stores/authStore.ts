import { IAuthService } from '@/src/services/firebase';
import { create } from 'zustand';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Auth operations
  signIn: (authService: IAuthService, email: string, password: string) => Promise<void>;
  signUp: (authService: IAuthService, email: string, password: string) => Promise<void>;
  signOut: (authService: IAuthService) => Promise<void>;
  resetPassword: (authService: IAuthService, email: string) => Promise<void>;
  updateProfile: (authService: IAuthService, displayName: string, photoURL?: string) => Promise<void>;
  
  // Reset state
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true, // Start with loading true until auth state is determined
  error: null,

  setUser: (user) => {
    console.log('AuthStore: setUser called', { user: !!user, uid: user?.uid || 'no-uid' });
    set({ user, error: null });
  },
  setLoading: (loading) => {
    console.log('AuthStore: setLoading called', { loading });
    set({ loading });
  },
  setError: (error) => {
    console.log('AuthStore: setError called', { error });
    set({ error, loading: false });
  },

  signIn: async (authService, email, password) => {
    try {
      set({ loading: true, error: null });
      await authService.signInWithEmail(email, password);
      // User will be set via onAuthStateChanged listener
    } catch (error: any) {
      const message = getAuthErrorMessage(error.code);
      set({ error: message, loading: false });
      throw error;
    }
  },

  signUp: async (authService, email, password) => {
    try {
      set({ loading: true, error: null });
      await authService.signUpWithEmail(email, password);
      // User will be set via onAuthStateChanged listener
    } catch (error: any) {
      const message = getAuthErrorMessage(error.code);
      set({ error: message, loading: false });
      throw error;
    }
  },

  signOut: async (authService) => {
    try {
      set({ loading: true, error: null });
      await authService.signOut();
      set({ user: null, loading: false });
    } catch (error: any) {
      set({ error: 'Failed to sign out', loading: false });
      throw error;
    }
  },

  resetPassword: async (authService, email) => {
    try {
      set({ loading: true, error: null });
      await authService.resetPassword(email);
      set({ loading: false });
    } catch (error: any) {
      const message = getAuthErrorMessage(error.code);
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateProfile: async (authService, displayName, photoURL) => {
    try {
      set({ loading: true, error: null });
      await authService.updateProfile(displayName, photoURL);
      // Update local user state
      const currentUser = get().user;
      if (currentUser) {
        set({ 
          user: { ...currentUser, displayName, photoURL: photoURL || null },
          loading: false 
        });
      }
    } catch (error: any) {
      set({ error: 'Failed to update profile', loading: false });
      throw error;
    }
  },

  reset: () => set({ user: null, loading: false, error: null }),
}));

// Helper function to get user-friendly error messages
function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-email':
      return 'Invalid email format.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
}
