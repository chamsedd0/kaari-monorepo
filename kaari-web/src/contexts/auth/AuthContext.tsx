import React, { createContext, useContext, ReactNode, useMemo, useState, useCallback, useEffect } from 'react';
import { useStore } from '../../backend/store';
import { User } from '../../backend/entities';
import { resetPassword } from '../../backend/firebase/auth';
import { auth } from '../../backend/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import eventBus, { EventType } from '../../utils/event-bus';

// Error types for better error handling
export type AuthErrorType = 
  | 'auth/invalid-email' 
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/operation-not-allowed'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed'
  | 'auth/requires-recent-login'
  | 'auth/popup-closed-by-user'
  | 'unknown';

export interface AuthError {
  code: AuthErrorType;
  message: string;
}

// Auth status type
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

// Define the context shape
interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  error: AuthError | null;
  signUp: (email: string, password: string, name: string, role?: 'client' | 'advertiser') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGooglePopup: (role?: 'client' | 'advertiser', isNewAdvertiser?: boolean) => Promise<User | void>;
  signOutUser: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  clearError: () => void;
  formatErrorMessage: (error: AuthError | string) => string;
  isAuthenticated: boolean;
  forceUpdate: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  status: 'idle',
  error: null,
  isAuthenticated: false,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGooglePopup: async () => {},
  signOutUser: async () => {},
  sendPasswordResetEmail: async () => {},
  clearError: () => {},
  formatErrorMessage: () => '',
  forceUpdate: () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Format error messages to be more user-friendly
const formatErrorMessage = (error: AuthError | string): string => {
  if (typeof error === 'string') return error;
  
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email. Please check your email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or reset your password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later or reset your password.';
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled. Please try again.';
    case 'auth/requires-recent-login':
      return 'This operation requires recent authentication. Please log in again.';
    default:
      return error.message || 'An unknown error occurred';
  }
};

// Auth Provider component that uses the global store
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use individual selectors to avoid unnecessary re-renders
  const user = useStore(state => state.user);
  const storeIsAuthenticated = useStore(state => state.isAuthenticated);
  const login = useStore(state => state.login);
  const loginWithGoogle = useStore(state => state.loginWithGoogle);
  const logout = useStore(state => state.logout);
  const signup = useStore(state => state.signUp);
  const setUser = useStore(state => state.setUser);
  const setIsAuthenticated = useStore(state => state.setIsAuthenticated);
  
  // Local state for auth
  const [status, setStatus] = useState<AuthStatus>(user ? 'authenticated' : 'idle');
  const [error, setError] = useState<AuthError | null>(null);
  const [isAuthenticated, setIsAuthenticatedLocal] = useState(storeIsAuthenticated);
  const [updater, setUpdater] = useState(0);
  
  // Sync local state with store
  useEffect(() => {
    setIsAuthenticatedLocal(storeIsAuthenticated);
  }, [storeIsAuthenticated]);
  
  // Set up Firebase auth state listener directly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // This will trigger our store listener to update local state
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);
  
  // Update status when user changes
  useEffect(() => {
    if (user) {
      setStatus('authenticated');
      
      // Emit auth state changed event through our event bus instead of DOM event
      eventBus.emit(EventType.AUTH_STATE_CHANGED, {
        isAuthenticated: true,
        user
      });
    }
  }, [user]);

  // Parse and set error
  const handleError = useCallback((err: any): AuthError => {
    console.error('Auth error:', err);
    
    const authError: AuthError = {
      code: (err.code as AuthErrorType) || 'unknown',
      message: err.message || 'An unknown error occurred'
    };
    
    setError(authError);
    setStatus('error');
    
    // Emit auth error event
    eventBus.emit(EventType.AUTH_ERROR, {
      code: authError.code,
      message: authError.message
    });
    
    return authError;
  }, []);

  // Sign up with email, password and name
  const signUp = async (email: string, password: string, name: string, role?: 'client' | 'advertiser') => {
    try {
      setStatus('loading');
      setError(null);
      await signup(email, password, name, role);
      setStatus('authenticated');
      
      // Emit auth state changed
      eventBus.emit(EventType.AUTH_SIGNED_IN, {
        userId: user?.id || '',
        email,
        name
      });
    } catch (err: any) {
      throw handleError(err);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setStatus('loading');
      setError(null);
      await login(email, password);
      setStatus('authenticated');
      
      // Emit auth state changed
      eventBus.emit(EventType.AUTH_SIGNED_IN, {
        userId: user?.id || '',
        email
      });
    } catch (err: any) {
      throw handleError(err);
    }
  };

  // Sign in with Google
  const signInWithGooglePopup = async (role?: 'client' | 'advertiser', isNewAdvertiser?: boolean) => {
    try {
      setStatus('loading');
      setError(null);
      
      // Call the store method but don't do additional redirects
      const user = await loginWithGoogle(role, isNewAdvertiser);
      
      // Update the local state
      setStatus('authenticated');
      setIsAuthenticatedLocal(true);
      
      // Emit auth state changed
      eventBus.emit(EventType.AUTH_SIGNED_IN, {
        userId: user?.id || '',
        email: user?.email,
        name: user?.name
      });
      
      return user;
    } catch (err: any) {
      console.error("Google sign-in error in context:", err);
      throw handleError(err);
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      setStatus('loading');
      setError(null);
      
      // Update UI state first
      setIsAuthenticated(false);
      setUser(null);
      setIsAuthenticatedLocal(false);
      setStatus('unauthenticated');
      
      // Emit sign out event
      eventBus.emit(EventType.AUTH_SIGNED_OUT, {
        reason: 'user-initiated'
      });
      
      // Then perform the actual logout
      await logout();
    } catch (err: any) {
      // Even on error, we still want to log out the user locally
      setIsAuthenticated(false);
      setUser(null);
      setIsAuthenticatedLocal(false);
      setStatus('unauthenticated');
      
      // Emit sign out event even on error
      eventBus.emit(EventType.AUTH_SIGNED_OUT, {
        reason: 'error-during-signout'
      });
      
      throw handleError(err);
    }
  };

  // Send password reset email
  const sendPasswordResetEmail = async (email: string) => {
    try {
      setStatus('loading');
      setError(null);
      await resetPassword(email);
      setStatus(user ? 'authenticated' : 'unauthenticated');
      
      // Emit password reset event
      eventBus.emit(EventType.AUTH_PASSWORD_RESET, {
        email,
        success: true
      });
    } catch (err: any) {
      // Emit failed password reset event
      eventBus.emit(EventType.AUTH_PASSWORD_RESET, {
        email,
        success: false
      });
      
      throw handleError(err);
    }
  };

  // Clear any authentication errors
  const clearError = () => {
    setError(null);
    setStatus(user ? 'authenticated' : 'unauthenticated');
  };
  
  // Function to force re-render when auth state changes
  const forceUpdate = useCallback(() => {
    setUpdater(prev => prev + 1);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    status,
    error,
    isAuthenticated,
    signUp,
    signIn,
    signInWithGooglePopup,
    signOutUser,
    sendPasswordResetEmail,
    clearError,
    formatErrorMessage,
    forceUpdate,
  }), [user, status, error, isAuthenticated, handleError, forceUpdate]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 