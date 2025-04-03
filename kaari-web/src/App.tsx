import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './components/skeletons/constructed/footer/footer';
import CheckoutProcess from './pages/checkout-process/page';

function App() {
  return (
    <Router>
      <div className="app">
        <main>
          <CheckoutProcess />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;