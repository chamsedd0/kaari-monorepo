import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./global.css"
import { useStore } from './backend/store'

// Initialize auth on app start
const AppWithAuth = () => {
  const initAuth = useStore(state => state.initAuth);
  
  useEffect(() => {
    initAuth();
  }, [initAuth]);
  
  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithAuth />
  </StrictMode>,
)
