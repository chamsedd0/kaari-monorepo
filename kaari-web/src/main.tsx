import { StrictMode, useEffect, Component, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./global.css"
import { useStore } from './backend/store'
import { AuthProvider } from './contexts/auth'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Error Boundary component to handle uncaught errors
class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("App error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px auto', 
          maxWidth: '600px', 
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h2>Something went wrong</h2>
          <p>We're sorry, but there was an error loading the application.</p>
          <p style={{ color: '#666', fontSize: '14px' }}>{String(this.state.error)}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#673AB7',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <App />
          <ToastContainer />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithAuth />
  </StrictMode>,
)
