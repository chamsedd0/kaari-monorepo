import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, Property, Listing, Request } from './entities';
import { 
  signInWithEmail, 
  signInWithGoogle, 
  signOut, 
  getCurrentUserProfile,
  signUpWithEmail
} from './firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

// Define the store types
interface StoreState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  
  // Property state
  properties: Property[];
  selectedProperty: Property | null;
  propertiesLoading: boolean;
  
  // Listing state
  listings: Listing[];
  selectedListing: Listing | null;
  listingsLoading: boolean;
  
  // Request state
  requests: Request[];
  selectedRequest: Request | null;
  requestsLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setProperties: (properties: Property[]) => void;
  setSelectedProperty: (property: Property | null) => void;
  setListings: (listings: Listing[]) => void;
  setSelectedListing: (listing: Listing | null) => void;
  setRequests: (requests: Request[]) => void;
  setSelectedRequest: (request: Request | null) => void;
  
  // User actions
  signUp: (email: string, password: string, name: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

// Create the store
export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        authLoading: true,
        properties: [],
        selectedProperty: null,
        propertiesLoading: false,
        listings: [],
        selectedListing: null,
        listingsLoading: false,
        requests: [],
        selectedRequest: null,
        requestsLoading: false,
        
        // Actions
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setProperties: (properties) => set({ properties }),
        setSelectedProperty: (property) => set({ selectedProperty: property }),
        setListings: (listings) => set({ listings }),
        setSelectedListing: (listing) => set({ selectedListing: listing }),
        setRequests: (requests) => set({ requests }),
        setSelectedRequest: (request) => set({ selectedRequest: request }),
        
        // User actions
        signUp: async (email, password, name) => {
          try {
            set({ authLoading: true });
            const user = await signUpWithEmail(email, password, name);
            set({ user, isAuthenticated: true, authLoading: false });
            return user;
          } catch (error) {
            set({ authLoading: false });
            throw error;
          }
        },
        
        login: async (email, password) => {
          try {
            set({ authLoading: true });
            const user = await signInWithEmail(email, password);
            set({ user, isAuthenticated: true, authLoading: false });
            return user;
          } catch (error) {
            set({ authLoading: false });
            throw error;
          }
        },
        
        loginWithGoogle: async () => {
          try {
            set({ authLoading: true });
            const user = await signInWithGoogle();
            set({ user, isAuthenticated: true, authLoading: false });
            return user;
          } catch (error) {
            set({ authLoading: false });
            throw error;
          }
        },
        
        logout: async () => {
          try {
            set({ authLoading: true });
            
            // Immediately update the local state to ensure UI updates right away
            set({ 
              user: null, 
              isAuthenticated: false, 
              // Clear user-specific data
              properties: [],
              selectedProperty: null,
              listings: [],
              selectedListing: null,
              requests: [],
              selectedRequest: null
            });
            
            // Then perform the Firebase signout operation
            await signOut();
            
            // Complete the process
            set({ authLoading: false });
          } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, ensure we've cleared the local state
            set({ 
              user: null, 
              isAuthenticated: false, 
              authLoading: false,
              properties: [],
              selectedProperty: null,
              listings: [],
              selectedListing: null,
              requests: [],
              selectedRequest: null
            });
            throw error;
          }
        },
        
        initAuth: async () => {
          try {
            set({ authLoading: true });
            
            // Set up auth state listener
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
              if (firebaseUser) {
                // User is signed in
                const userProfile = await getCurrentUserProfile();
                set({ 
                  user: userProfile, 
                  isAuthenticated: true, 
                  authLoading: false 
                });
              } else {
                // User is signed out
                set({ 
                  user: null, 
                  isAuthenticated: false, 
                  authLoading: false 
                });
              }
            });
            
            // Return function to unsubscribe - though we typically want this to persist for app lifetime
            return unsubscribe;
          } catch (error) {
            set({ authLoading: false });
            console.error('Error initializing auth:', error);
          }
        }
      }),
      {
        name: 'kaari-store',
        // Don't persist sensitive data or loading states
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          properties: state.properties,
          selectedProperty: state.selectedProperty,
          listings: state.listings,
          selectedListing: state.selectedListing,
          requests: state.requests,
          selectedRequest: state.selectedRequest,
        }),
      }
    )
  )
); 