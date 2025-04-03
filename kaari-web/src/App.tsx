import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './components/skeletons/constructed/footer/footer';
import PropertyPageComponent from './pages/property-page/page';

function App() {
  return (
    <Router>
      <div className="app">
        <main>
          <PropertyPageComponent />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;