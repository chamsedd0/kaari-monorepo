import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BookingSearchForm from "../../components/skeletons/constructed/forms/booking-search-form";
import { UsersLandingStyle } from "../../landing-page-style";
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";

// Import icons and images
import ArrowRight from '../../components/skeletons/icons/ArrowRightThick.svg';
import VerifiedIcon from '../../components/skeletons/icons/Security.svg'
import IdentityIcon from '../../components/skeletons/icons/Identity.svg';
import QualityIcon from '../../components/skeletons/icons/Quality.svg';
import PriceIcon from '../../components/skeletons/icons/Price.svg';
import PropertyImage from '../../assets/images/propertyExamplePic.png';
import Mockup from './mockup.png';
import CameraGirl from '../../assets/icons/camera-girl.svg';
import KaariLogo from '../../assets/images/purpleLogo.svg';

// Import city images
import TangierImage from '../../assets/images/BigCityPic0.png';
import CasablancaImage from '../../assets/images/BigCityPic1.png';
import FesImage from '../../assets/images/BigCityPic2.png';
import MarrakeshImage from '../../assets/images/BigCityPic1.png';
import RabatImage from '../../assets/images/BigCityPic1.png';
import OujdaImage from '../../assets/images/BigCityPic2.png';
import AgadirImage from '../../assets/images/BigCityPic1.png';

// Import slider SVGs
import DoorSvg from '../../assets/images/doorsvg.svg';
import GirlGlobeSvg from '../../assets/images/girlGlobesvg.svg';
import GuyLettersSvg from '../../assets/images/guyLetterssvg.svg';
import GirlHouseSvg from '../../assets/images/girlHousesvg.svg';
import MoneyShieldSvg from '../../assets/images/moneyShieldsvg.svg';

const UsersLanding: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  
  // Total number of slides
  const totalSlides = 5;
  
  // Function to move to a specific slide
  const goToSlide = (slideIndex: number) => {
    if (slideIndex < 0) {
      slideIndex = totalSlides - 1;
    } else if (slideIndex >= totalSlides) {
      slideIndex = 0;
    }
    
    setCurrentSlide(slideIndex);
    
    // Move the slider track
    if (sliderTrackRef.current) {
      sliderTrackRef.current.style.transform = `translateX(-${slideIndex * 100}%) translateX(-${slideIndex * 20}px)`;
      
      // Add classes for fade effect
      const slides = sliderTrackRef.current.children;
      Array.from(slides).forEach((slide, index) => {
        const slideElement = slide as HTMLElement;
        slideElement.classList.remove('active', 'next', 'prev');
        
        if (index === slideIndex) {
          slideElement.classList.add('active');
        } else if (index === (slideIndex + 1) % totalSlides) {
          slideElement.classList.add('next');
        } else if (index === (slideIndex - 1 + totalSlides) % totalSlides) {
          slideElement.classList.add('prev');
        }
      });
    }
  };
  
  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);

  // Initialize slide classes on first render
  useEffect(() => {
    if (sliderTrackRef.current) {
      const slides = sliderTrackRef.current.children;
      Array.from(slides).forEach((slide, index) => {
        const slideElement = slide as HTMLElement;
        if (index === 0) {
          slideElement.classList.add('active');
        } else if (index === 1) {
          slideElement.classList.add('next');
        } else if (index === totalSlides - 1) {
          slideElement.classList.add('prev');
        }
      });
    }
  }, []);

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
      isRecommended: true,
      propertyType: 'Apartment',
      isFavorite: false
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
      isRecommended: false,
      propertyType: 'Studio',
      isFavorite: false
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
      isRecommended: true,
      propertyType: 'Villa',
      isFavorite: false
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
      isRecommended: false,
      propertyType: 'Apartment',
      isFavorite: false
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
      <UsersLandingStyle>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>{t('home.hero_title')}</h1>
            <div className="search-container">
              <BookingSearchForm />
            </div>
            <div className="explore-link" onClick={() => navigate('/properties')}>
              <span>{t('home.explore_places')}</span>
              <span className="arrow-icon">
                <img src={ArrowRight} alt="Arrow" />
              </span>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">{t('home.verified_listings')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">{t('home.satisfaction_rate')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">{t('home.customer_support')}</span>
              </div>
            </div>
          </div>
          <div className="hosting-button" onClick={() => navigate('/for-advertisers')}>
            <span>{t('home.try_hosting')}</span>
            <span className="arrow-icon">
              <img src={ArrowRight} alt="Arrow" />
            </span>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="feature-item">
            <img src={VerifiedIcon} alt="Security" />
            <p>{t('home.features.security')}</p>
          </div>
          <div className="feature-item">
            <img src={IdentityIcon} alt="Identity" />
            <p>{t('home.features.identity')}</p>
          </div>
          <div className="feature-item">
            <img src={QualityIcon} alt="Quality" />
            <p>{t('home.features.quality')}</p>
          </div>
          <div className="feature-item">
            <img src={PriceIcon} alt="Price" />
            <p>{t('home.features.price')}</p>
          </div>
        </section>

        {/* What is Kaari Section - Slider */}
        <div className="what-is-kaari-container">
          <section className="what-is-kaari">
            <div className="kaari-logo">
                    <img src={KaariLogo} alt="Kaari" />
                  </div>
            <div className="slider-container">
              
              <div className="slider-track" ref={sliderTrackRef}>
                  
                {/* Slide 1 - Welcome */}
                <div className="slide welcome-slide">

                  <div className="slide-content">
                    <div className="text-content">
                      <h2>{t('home.slider.welcome_title')}</h2>
                      <p>{t('home.slider.welcome_description')}</p>
                      <div className="buttons-container">
                        <button className="primary-button" onClick={() => navigate('/tenant-signup')}>
                          {t('home.slider.tenant_button')}
                        </button>
                        <button className="secondary-button" onClick={() => navigate('/advertiser-signup')}>
                          {t('home.slider.advertiser_button')}
                        </button>
                      </div>
                    </div>
                    <div className="image-content">
                      <img src={DoorSvg} alt="Welcome to Kaari" />
                    </div>
                  </div>
                </div>
                
                {/* Slide 2 - Search */}
                <div className="slide search-slide">

                  <div className="slide-content">
                    <div className="text-content">
                      <h2>{t('home.slider.search_title')}</h2>
                      <p>{t('home.slider.search_description')}</p>
                      <div className="buttons-container">
                        <button className="primary-button" onClick={() => navigate('/properties')}>
                          {t('home.slider.browse_button')}
                        </button>
                        <button className="secondary-button" onClick={() => navigate('/how-it-works')}>
                          {t('home.slider.how_works_button')}
                        </button>
                      </div>
                    </div>
                    <div className="image-content">
                      <img src={GirlGlobeSvg} alt="Search for a place" />
                    </div>
                  </div>
                </div>
                
                {/* Slide 3 - Request */}
                <div className="slide request-slide">

                  <div className="slide-content">
                    <div className="text-content">
                      <h2>{t('home.slider.request_title')}</h2>
                      <p>{t('home.slider.request_description')}</p>
                      <div className="buttons-container">
                        <button className="primary-button" onClick={() => navigate('/properties')}>
                          {t('home.slider.find_properties_button')}
                        </button>
                        <button className="secondary-button" onClick={() => navigate('/contact')}>
                          {t('home.slider.contact_button')}
                        </button>
                      </div>
                    </div>
                    <div className="image-content">
                      <img src={GuyLettersSvg} alt="Send your request" />
                    </div>
                  </div>
                </div>
                
                {/* Slide 4 - Enjoy */}
                <div className="slide enjoy-slide">

                  <div className="slide-content">
                    <div className="text-content">
                      <h2>{t('home.slider.enjoy_title')}</h2>
                      <p>{t('home.slider.enjoy_description')}</p>
                      <div className="buttons-container">
                        <button className="primary-button" onClick={() => navigate('/properties')}>
                          {t('home.slider.search_button')}
                        </button>
                        <button className="secondary-button" onClick={() => navigate('/testimonials')}>
                          {t('home.slider.testimonials_button')}
                        </button>
                      </div>
                    </div>
                    <div className="image-content">
                      <img src={GirlHouseSvg} alt="Enjoy your place" />
                    </div>
                  </div>
                </div>
                
                {/* Slide 5 - Payment Protection */}
                <div className="slide payment-slide">

                  <div className="slide-content">
                    <div className="text-content">
                      <h2>{t('home.slider.payment_title')}</h2>
                      <p>{t('home.slider.payment_description')}</p>
                      <div className="buttons-container">
                        <button className="primary-button" onClick={() => navigate('/protection')}>
                          {t('home.slider.learn_more_button')}
                        </button>
                        <button className="secondary-button" onClick={() => navigate('/faqs')}>
                          {t('home.slider.faq_button')}
                        </button>
                      </div>
                    </div>
                    <div className="image-content">
                      <img src={MoneyShieldSvg} alt="Payment Protection" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Slider Controls */}
            <div className="slider-controls">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <div
                  key={index}
                  className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
            
            {/* Slider Arrows */}
            <div className="slider-arrows">
              <div className="slider-arrow prev" onClick={() => goToSlide(currentSlide - 1)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </div>
              <div className="slider-arrow next" onClick={() => goToSlide(currentSlide + 1)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </section>
        </div>

        {/* Top Picks Section */}
        <section className="top-picks">
          <h2>{t('home.top_picks')}</h2>
          <div className="property-grid">
            {topProperties.map((property) => (
              <div key={property.id} className="property-card" onClick={() => navigate(`/property/${property.id}`)}>
                <PropertyCard
                  id={property.id}
                  image={property.image}
                  title={property.title}
                  subtitle={property.subtitle}
                  price={property.price}
                  priceType={property.priceType}
                  minstay={property.minstay}
                  description={property.description}
                  isRecommended={property.isRecommended}
                  propertyType={property.propertyType}
                  isFavorite={property.isFavorite}
                  onToggleFavorite={() => {}}
                />
              </div>
            ))}
          </div>
        </section>

        {/* City Selection Section */}
        <section className="city-selection">
          <h2>{t('home.city_selection.title')}</h2>
          <div className="view-all">{t('home.city_selection.show_all')}</div>
          <div className="city-grid">
            {cities.map((city, index) => (
              <div key={index} className="city-card" onClick={() => navigate(`/properties?city=${city.name}`)}>
                <img src={city.image} alt={city.name} />
                <div className="city-label">{city.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Renter Protection Section */}
        <section className="renter-protection">
          <div className="protection-content">
            <h2>{t('home.renter_protection.title')}</h2>
            <div className="protection-feature">
              <h3>
                <span className="icon-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" fill="currentColor"/>
                  </svg>
                </span>
                {t('home.renter_protection.stress_free_title')}
              </h3>
              <p>{t('home.renter_protection.stress_free_description')}</p>
            </div>
            <div className="protection-feature">
              <h3>
                <span className="icon-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
                  </svg>
                </span>
                {t('home.renter_protection.support_title')}
              </h3>
              <p>{t('home.renter_protection.support_description')}</p>
            </div>
            <div className="protection-feature">
              <h3>
                <span className="icon-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 18.09L11.27 15.95C10.5 15.18 10 14.14 10 13.06V8H14V13.06C14 13.57 14.2 14.08 14.59 14.47L16.73 16.61L13.41 18.09Z" fill="currentColor"/>
                  </svg>
                </span>
                {t('home.renter_protection.refund_title')}
              </h3>
              <p>{t('home.renter_protection.refund_description')}</p>
            </div>
          </div>
          <div className="protection-image">
            <img src={PropertyImage} alt="Tenant Protection" />
          </div>
        </section>

        {/* Recommended Properties Section */}
        <section className="recommended-properties">
          <h2>{t('home.recommended')}</h2>
          <div className="property-grid">
            {topProperties.map((property) => (
              <div key={property.id} className="property-card" onClick={() => navigate(`/property/${property.id}`)}>
                <PropertyCard
                  id={property.id}
                  image={property.image}
                  title={property.title}
                  subtitle={property.subtitle}
                  price={property.price}
                  priceType={property.priceType}
                  minstay={property.minstay}
                  description={property.description}
                  isRecommended={property.isRecommended}
                  propertyType={property.propertyType}
                  isFavorite={property.isFavorite}
                  onToggleFavorite={() => {}}
                />
              </div>
            ))}
          </div>
        </section>

        

        {/* App Download Section */}
        <section className="app-download">
          <div className="app-wrapper">
            <div className="app-content">
              
              <h2>{t('home.app.title')}</h2>
              <div className="app-badge">{t('home.app.badge')}</div>
              
              <p className="app-description">
                {t('home.app.description')}
              </p>
              <ul className="app-features">
                <li>
                  <span className="check-icon">✓</span>
                  {t('home.app.feature1')}
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  {t('home.app.feature2')}
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  {t('home.app.feature3')}
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  {t('home.app.feature4')}
                </li>
              </ul>
              <div className="app-buttons">
                <a href="#" className="app-store">
                  <div className="store-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.05 20.28C16.07 21.23 15 21.08 13.97 20.63C12.88 20.17 11.88 20.15 10.73 20.63C9.29 21.25 8.53 21.07 7.67 20.28C2.79 15.25 3.51 7.59 9.09 7.31C10.5 7.38 11.43 8.05 12.24 8.11C13.43 7.89 14.57 7.2 15.9 7.3C17.47 7.42 18.68 8.1 19.49 9.33C15.76 11.44 16.52 16.13 19.95 17.34C19.31 18.41 18.54 19.47 17.05 20.29V20.28ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3C16.06 5.58 13.43 7.5 12.03 7.25Z" fill="white"/>
                    </svg>
                  </div>
                  <div className="store-text">
                    <span className="small-text">{t('home.app.app_store')}</span>
                    <span className="big-text">{t('home.app.app_store_name')}</span>
                  </div>
                </a>
                <a href="#" className="google-play">
                  <div className="store-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.42 20.1C4.15 19.89 4 19.56 4 19.2V4.8C4 4.44 4.16 4.11 4.42 3.9L12.13 12L4.42 20.1ZM13.93 13.87L6.99 17.71L14.93 13.12L16.58 12L14.93 10.88L6.99 6.29L13.93 10.13L17.17 12L13.93 13.87ZM14.42 20.6L21.18 16.4C21.7 16.08 22 15.54 22 14.95C22 14.36 21.7 13.82 21.18 13.5L14.42 9.4L12.71 11.07L16.38 12.93C16.51 13 16.51 13.2 16.38 13.27L12.71 15.13L14.42 16.8V20.6ZM4.42 3.9L6.99 6.29L16.43 12L6.99 17.71L4.42 20.1C4.74 20.33 5.16 20.35 5.5 20.12L13.93 15.13L16.19 13.17C16.27 13.11 16.33 13.01 16.33 12.91V12.09C16.33 11.99 16.27 11.89 16.19 11.83L13.93 9.87L5.5 4.88C5.16 4.65 4.73 4.67 4.42 4.9V3.9Z" fill="#673AB7"/>
                    </svg>
                  </div>
                  <div className="store-text">
                    <span className="small-text">{t('home.app.google_play')}</span>
                    <span className="big-text">{t('home.app.google_play_name')}</span>
                  </div>
                </a>
              </div>
            </div>
            <div className="app-image">
              <div className="phone-mockup">
                <img src={Mockup} alt="Property" />
              </div>
            </div>
          </div>
        </section>

        {/* Property Listing Section */}
        <section className="list-property">
          <div className="list-property-image">
            <img src={CameraGirl} alt="Property Photoshoot" />
          </div>
          <div className="list-property-content">
            <h3>{t('home.list_property.title')}</h3>
            <h2>{t('home.list_property.subtitle')}</h2>
            <p>{t('home.list_property.description')}</p>
            <div className="buttons-container">
            <button 
              className="photoshoot-button"
              onClick={() => navigate('/photoshoot-booking')}
            >
                {t('home.list_property.book_button')}
              </button>
              <button 
                className="read-more-button"
                onClick={() => navigate('/about-photoshoots')}
              >
                {t('home.list_property.read_more')}
            </button>
          </div>
          </div>
        </section>

        {/* Features Footer */}
        <section className="features-footer">
          <div className="feature-item">
            <img src={VerifiedIcon} alt="Security" />
            <p>{t('home.features.security')}</p>
          </div>
          <div className="feature-item">
            <img src={IdentityIcon} alt="Identity" />
            <p>{t('home.features.identity')}</p>
          </div>
          <div className="feature-item">
            <img src={QualityIcon} alt="Quality" />
            <p>{t('home.features.quality')}</p>
          </div>
          <div className="feature-item">
            <img src={PriceIcon} alt="Price" />
            <p>{t('home.features.price')}</p>
          </div>
        </section>
      </UsersLandingStyle>
    </>
  );
};

export default UsersLanding;