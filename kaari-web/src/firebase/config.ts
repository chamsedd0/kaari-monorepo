// Centralize Firebase initialization: re-export from the canonical backend config
export { app, db, auth, storage, initializeAnalytics } from '../backend/firebase/config';