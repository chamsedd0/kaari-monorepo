import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './components/skeletons/constructed/footer/footer';
import AdvertiserDashboard from "./pages/dashboards/advertiser-dashboard/page";

function App() {
  return (
    <Router>
      <div className="app">
        <main>
          <AdvertiserDashboard/>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;