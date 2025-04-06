import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./global.css"
import { useStore } from './backend/store'
import { AuthProvider } from './contexts/auth'

// Initialize auth on app start
const AppWithAuth = () => {
  const initAuth = useStore(state => state.initAuth);
  
  // Only initialize auth once on component mount
  useEffect(() => {
    // We call initAuth but don't depend on it as a dependency
    // to prevent re-renders
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithAuth />
  </StrictMode>,
)
