import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookingSearchForm from "../../components/skeletons/constructed/forms/booking-search-form";
import { UsersLandingStyle } from "../../landing-page-style";
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import HeaderLandingPage from "../../components/skeletons/constructed/headers/header-landing-page";

// Import icons and images
import ArrowRight from '../../components/skeletons/icons/ArrowRightThick.svg';
import VerifiedIcon from '../../components/skeletons/icons/Security.svg'
import IdentityIcon from '../../components/skeletons/icons/Identity.svg';
import QualityIcon from '../../components/skeletons/icons/Quality.svg';
import PriceIcon from '../../components/skeletons/icons/Price.svg';
import PropertyImage from '../../assets/images/propertyExamplePic.png';
import RenterProtectionBg from '../../assets/images/renterProtection.svg';

// Import city images
import TangierImage from '../../assets/images/BigCityPic0.png';
import CasablancaImage from '../../assets/images/BigCityPic1.png';
import FesImage from '../../assets/images/BigCityPic2.png';
import MarrakeshImage from '../../assets/images/BigCityPic1.png';
import RabatImage from '../../assets/images/BigCityPic1.png';
import OujdaImage from '../../assets/images/BigCityPic2.png';
import AgadirImage from '../../assets/images/BigCityPic1.png';

const UsersLanding: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for property listings
  const topProperties = [
    { 
      id: '1', 
      title: 'Apartment - flat in the center of Agadir',
      subtitle: 'Beautiful apartment in downtown',
      price: '100$',
      priceType: '/month', 
      minstay: 'Min stay: 3 months',
      description: 'Fully furnished, 2 bedrooms, close to amenities and beach.',
      image: PropertyImage,
      isRecommended: true
    },
    { 
      id: '2', 
      title: 'Modern studio in Marrakesh',
      subtitle: 'Cozy studio with all amenities',
      price: '80$',
      priceType: '/month',
      minstay: 'Min stay: 1 month',
      description: 'Perfect for remote workers, high-speed wifi included.',
      image: PropertyImage,
      isRecommended: false
    },
    { 
      id: '3', 
      title: 'Luxury villa in Casablanca',
      subtitle: 'Exclusive neighborhood, sea view',
      price: '250$',
      priceType: '/month',
      minstay: 'Min stay: 6 months',
      description: 'Spacious 3-bedroom villa with private garden and pool.',
      image: PropertyImage,
      isRecommended: true
    },
    { 
      id: '4', 
      title: 'Cozy apartment in Rabat',
      subtitle: 'Heart of the capital',
      price: '120$',
      priceType: '/month',
      minstay: 'Min stay: 2 months',
      description: 'Close to government buildings and historic sites.',
      image: PropertyImage,
      isRecommended: false
    }
  ];

  // City data
  const cities = [
    { name: 'Tangier', image: TangierImage },
    { name: 'Casablanca', image: CasablancaImage },
    { name: 'Fes', image: FesImage },
    { name: 'Marrakesh', image: MarrakeshImage },
    { name: 'Rabat', image: RabatImage },
    { name: 'Oujda', image: OujdaImage },
    { name: 'Agadir', image: AgadirImage }
  ];

  return (
    <>
      <HeaderLandingPage />
      <UsersLandingStyle>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Trustworthy, verified rentals</h1>
            <div className="search-container">
          <BookingSearchForm />
        </div>
            <div className="explore-link" onClick={() => navigate('/properties')}>
              <span>Explore Places</span>
              <span className="arrow-icon">
                <img src={ArrowRight} alt="Arrow" />
              </span>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Verified Listings</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Customer Support</span>
              </div>
            </div>
          </div>
          <div className="hosting-button" onClick={() => navigate('/for-advertisers')}>
            <span>Own a place? Try Hosting</span>
            <span className="arrow-icon">
              <img src={ArrowRight} alt="Arrow" />
            </span>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="feature-item">
            <img src={VerifiedIcon} alt="Security" />
            <p>Experience enhanced tenant security with our comprehensive Renter Protection policy.</p>
          </div>
          <div className="feature-item">
            <img src={IdentityIcon} alt="Identity" />
            <p>Each property listed on our site undergoes thorough in-person inspections to ensure accuracy.</p>
          </div>
          <div className="feature-item">
            <img src={QualityIcon} alt="Quality" />
            <p>We offer top-notch photos, videos, floor plans, and more to help you make informed decisions.</p>
          </div>
          <div className="feature-item">
            <img src={PriceIcon} alt="Price" />
            <p>The prices you see are final - no hidden charges. Everything is clearly communicated upfront.</p>
          </div>
        </section>

        {/* What is Kaari Section */}
        <section className="what-is-kaari">
          <div className="section-content">
            <h2>What is Kaari?</h2>
            <p>Choose your type, based on your needs</p>
            <div className="button-group">
              <button className="primary-button" onClick={() => window.location.href = '/properties'}>For Guests</button>
              <button className="secondary-button" onClick={() => window.location.href = '/for-advertisers'}>For Hosts</button>
        </div>
      </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Pick a few places</h3>
              <p>Explore hundreds of high-quality rooms, studios, and apartments. Save your favorites and get alerts. Finding your dream home could not be easier.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Send a booking request</h3>
              <p>Like a place and want to call it home? Send a booking request. You'll know if it's accepted or not within 24 hours.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Pay, and it's yours</h3>
              <p>Pay the first month's rent to confirm your booking. Congratulations, you found your next home. We'll protect your money until you've moved in and checked the place out.</p>
            </div>
          </div>
        </section>

        {/* Top Picks Section */}
        <section className="top-picks">
          <h2>Top Picks on Kaari</h2>
          <div className="property-grid">
            {topProperties.map((property) => (
              <div key={property.id} className="property-card" onClick={() => navigate(`/property/${property.id}`)}>
                <PropertyCard
                  image={property.image}
                  title={property.title}
                  subtitle={property.subtitle}
                  price={property.price}
                  priceType={property.priceType}
                  minstay={property.minstay}
                  description={property.description}
                  isRecommended={property.isRecommended}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Renter Protection Section */}
        <section className="renter-protection">
          <div className="protection-content">
            <h2>Renter Protection</h2>
            <div className="protection-feature">
              <h3>
                <span className="icon-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" fill="currentColor"/>
                  </svg>
                </span>
                Stress-Free Move-In
              </h3>
              <p>For 48 hours after you've moved into your new place, we will work to resolve any issues. If they cannot be resolved, we will issue you a full refund.</p>
            </div>
            <div className="protection-feature">
              <h3>
                <span className="icon-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
                  </svg>
                </span>
                Prompt Support
              </h3>
              <p>Our dedicated support team is available anytime during office hours to promptly resolve issues.</p>
            </div>
            <div className="protection-feature">
              <h3>
                <span className="icon-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 18.09L11.27 15.95C10.5 15.18 10 14.14 10 13.06V8H14V13.06C14 13.57 14.2 14.08 14.59 14.47L16.73 16.61L13.41 18.09Z" fill="currentColor"/>
                  </svg>
                </span>
                Hassle-free Refund
              </h3>
              <p>If you have a bad experience and the property doesn't match, we'll give you a refund to make the process worry-free.</p>
            </div>
          </div>
          <div className="protection-image">
            <img src={PropertyImage} alt="Tenant Protection" />
          </div>
        </section>

        {/* Recommended Properties Section */}
        <section className="recommended-properties">
          <h2>Recommended furnished apartments for your stay</h2>
          <div className="property-grid">
            {topProperties.map((property) => (
              <div key={property.id} className="property-card" onClick={() => navigate(`/property/${property.id}`)}>
                <PropertyCard
                  image={property.image}
                  title={property.title}
                  subtitle={property.subtitle}
                  price={property.price}
                  priceType={property.priceType}
                  minstay={property.minstay}
                  description={property.description}
                  isRecommended={property.isRecommended}
                />
              </div>
            ))}
          </div>
        </section>

        {/* City Selection Section */}
        <section className="city-selection">
          <h2>Where will your next stay be?</h2>
          <div className="view-all">Show all destinations</div>
          <div className="city-grid">
            {cities.map((city, index) => (
              <div key={index} className="city-card" onClick={() => navigate(`/properties?city=${city.name}`)}>
                <img src={city.image} alt={city.name} />
                <h3>{city.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* App Download Section */}
        <section className="app-download">
          <div className="app-content">
            <h2>Download the App</h2>
            <ul className="app-features">
              <li>
                <span className="check-icon">✓</span>
                Real-time notifications
              </li>
              <li>
                <span className="check-icon">✓</span>
                Live chat with landlords
              </li>
              <li>
                <span className="check-icon">✓</span>
                Faster booking process
              </li>
            </ul>
            <div className="app-buttons">
              <a href="#" className="app-store">
                <img src={PropertyImage} alt="Download on App Store" />
              </a>
              <a href="#" className="google-play">
                <img src={PropertyImage} alt="Get it on Google Play" />
              </a>
      </div>
          </div>
          <div className="app-image">
            <img src={PropertyImage} alt="Kaari Mobile App" />
        </div>
        </section>

        {/* Property Listing Section */}
        <section className="list-property">
          <div className="list-property-content">
            <h2>List your property at no cost by arranging a free photoshoot!</h2>
            <p>That's right, list a quality property and showcase your property to millions of users for free. We'll help you create quality photographs and verification.</p>
            <button className="photoshoot-button">Book A Free Photoshoot</button>
          </div>
          <div className="list-property-image">
            <img src={PropertyImage} alt="Property Listing" />
          </div>
        </section>

        {/* Features Footer */}
        <section className="features-footer">
          <div className="feature-item">
            <img src={VerifiedIcon} alt="Security" />
            <p>Experience enhanced tenant security with our Renter Protection policy.</p>
          </div>
          <div className="feature-item">
            <img src={IdentityIcon} alt="Identity" />
            <p>Each property undergoes thorough in-person inspections to ensure accuracy.</p>
          </div>
          <div className="feature-item">
            <img src={QualityIcon} alt="Quality" />
            <p>We offer top-notch photos, videos, and floor plans to help you decide.</p>
          </div>
          <div className="feature-item">
            <img src={PriceIcon} alt="Price" />
            <p>The prices you see are final - no hidden charges or fees.</p>
          </div>
        </section>
      </UsersLandingStyle>
    </>
  );
};

export default UsersLanding;