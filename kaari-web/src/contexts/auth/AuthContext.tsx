import React, { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { useStore } from '../../backend/store';
import { User } from '../../backend/entities';
import { resetPassword } from '../../backend/firebase/auth';

// Define the context shape
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGooglePopup: () => Promise<void>;
  signOutUser: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  clearError: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGooglePopup: async () => {},
  signOutUser: async () => {},
  sendPasswordResetEmail: async () => {},
  clearError: () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component that uses the global store
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use individual selectors to avoid unnecessary re-renders
  const user = useStore(state => state.user);
  const loading = useStore(state => state.authLoading);
  const login = useStore(state => state.login);
  const loginWithGoogle = useStore(state => state.loginWithGoogle);
  const logout = useStore(state => state.logout);
  
  // Local state for auth errors (not stored in global store)
  const [error, setError] = useState<string | null>(null);

  // Sign up is not directly in the store, but we can add it later if needed
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      // Use the login function from the store
      // In a real implementation, you would modify the store to include signUp
      await login(email, password);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to sign up');
      throw err;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await login(email, password);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in');
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGooglePopup = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      setError(null);
      await logout();
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message || 'Failed to sign out');
      throw err;
    }
  };

  // Send password reset email
  const sendPasswordResetEmail = async (email: string) => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send password reset email');
      throw err;
    }
  };

  // Clear any authentication errors
  const clearError = () => {
    setError(null);
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGooglePopup,
    signOutUser,
    sendPasswordResetEmail,
    clearError,
  }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 