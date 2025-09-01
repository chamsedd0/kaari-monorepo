import React, { useState, useRef, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BookingSearchForm from "../../components/skeletons/constructed/forms/booking-search-form";
import MobileHeroSearchBar from "../../components/skeletons/inputs/mobile-hero-search-bar";
import { UsersLandingStyle, MobileCarouselFix } from "../../landing-page-style";
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import { PropertyCardSkeleton } from "../../components/skeletons/cards/property-card-skeleton";

// Import icons and images
import ArrowRight from '../../components/skeletons/icons/ArrowRightThick.svg';
import VerifiedIcon from '../../components/skeletons/icons/Security.svg'
import IdentityIcon from '../../components/skeletons/icons/Identity.svg';
import QualityIcon from '../../components/skeletons/icons/Quality.svg';
import PriceIcon from '../../components/skeletons/icons/Price.svg';
import PropertyImage from '../../assets/images/propertyExamplePic.png';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../backend/firebase/config';
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

// Minimal Firestore property shape to satisfy TS when spreading d.data()
type FirestoreProperty = {
  title?: string;
  address?: { city?: string };
  city?: string;
  price?: number;
  minStay?: number;
  description?: string;
  images?: string[];
  isRecommended?: boolean;
  type?: string;
  housingPreference?: string;
};

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

  // Real data for Top Picks / Recommended
  const [topProperties, setTopProperties] = useState<any[]>([]);
  const [recommendedProperties, setRecommendedProperties] = useState<any[]>([]);
  const [topSlides, setTopSlides] = useState<number>(1);
  const [recSlides, setRecSlides] = useState<number>(1);
  const [topActive, setTopActive] = useState<number>(0);
  const [recActive, setRecActive] = useState<number>(0);
  
  useEffect(() => {
    const loadLandingProperties = async () => {
      try {
        // Top picks: latest available properties
        const propsRef = collection(db, 'properties');
        const topQ = query(propsRef, orderBy('updatedAt', 'desc'), limit(8));
        const topSnap = await getDocs(topQ);
        const top = topSnap.docs.map(d => ({ id: d.id, ...(d.data() as FirestoreProperty) }));
        const topMapped = top.map(p => ({
          id: p.id,
          title: p.title || 'Property', // Property type
          subtitle: p.address?.city || p.city || '',
          price: (p.price ? `${p.price}` : '—'),
      priceType: '/month', 
          minstay: p.minStay ? `Min stay: ${p.minStay} months` : undefined,
          description: p.description || '',
          image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : PropertyImage,
          images: Array.isArray(p.images) ? p.images : undefined,
          isRecommended: !!p.isRecommended,
          propertyType: p.type || 'Apartment',
      isFavorite: false,
          housingPreference: p.housingPreference
        }));
        setTopProperties(topMapped);
        
        // Recommended: featured or highest price as a simple heuristic
        const recQ = query(propsRef, orderBy('price', 'desc'), limit(8));
        const recSnap = await getDocs(recQ);
        const rec = recSnap.docs.map(d => ({ id: d.id, ...(d.data() as FirestoreProperty) }));
        const recMapped = rec.map(p => ({
          id: p.id,
          title: p.title || 'Property',
          subtitle: p.address?.city || p.city || '',
          price: (p.price ? `${p.price}` : '—'),
      priceType: '/month',
          minstay: p.minStay ? `Min stay: ${p.minStay} months` : undefined,
          description: p.description || '',
          image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : PropertyImage,
          images: Array.isArray(p.images) ? p.images : undefined,
      isRecommended: true,
          propertyType: p.type || 'Apartment',
      isFavorite: false,
          housingPreference: p.housingPreference
        }));
        setRecommendedProperties(recMapped);
        
        // Compute slides for dots (how many scroll clicks)
        // Assume card width ~300 + gap 24 => ~324px; container ~max 1400px => visibleCount = floor(container/cardWidth)
        // We compute based on counts as an approximation: slides = max(1, ceil((N - visible) / 1) + 1)
        const approximateVisible = 4; // conservative default for large screens
        setTopSlides(Math.max(1, Math.ceil(Math.max(0, topMapped.length - approximateVisible) / 1) + 0));
        setRecSlides(Math.max(1, Math.ceil(Math.max(0, recMapped.length - approximateVisible) / 1) + 0));
      } catch (e) {
        console.error('Failed loading landing properties:', e);
        // keep placeholders on failure
      }
    };
    loadLandingProperties();
  }, []);


  // Carousel helpers
  const getCardStep = (grid: HTMLElement | null): number => {
    if (!grid) return 300;
    const first = grid.querySelector('.property-card') as HTMLElement | null;
    if (!first) return 300;
    const gridStyle = getComputedStyle(grid as Element);
    const gap = parseFloat(gridStyle.gap || gridStyle.columnGap || '0') || 0;
    return first.getBoundingClientRect().width + gap;
  };
  const scrollById = (id: string, dir: number) => {
    const el = document.getElementById(id);
    if (!el) return;
    const step = getCardStep(el) * dir;
    el.scrollBy({ left: step, behavior: 'smooth' });
  };
  const updateFades = (gridId: string, viewportClass: string) => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const viewport = grid.parentElement as HTMLElement | null;
    if (!viewport) return;
    const atStart = grid.scrollLeft <= 1;
    const atEnd = Math.ceil(grid.scrollLeft + grid.clientWidth) >= grid.scrollWidth - 1;
    viewport.classList.toggle('show-left-fade', !atStart);
    viewport.classList.toggle('show-right-fade', !atEnd);
  };
  const handleTopNav = (dir: 'left' | 'right') => {
    const delta = dir === 'right' ? 1 : -1;
    setTopActive(prev => {
      const next = Math.max(0, Math.min(topSlides - 1, prev + delta));
      // Scroll
      scrollById('lp-top-grid', delta);
      setTimeout(() => updateFades('lp-top-grid', 'top'), 0);
      return next;
    });
  };
  const handleRecNav = (dir: 'left' | 'right') => {
    const delta = dir === 'right' ? 1 : -1;
    setRecActive(prev => {
      const next = Math.max(0, Math.min(recSlides - 1, prev + delta));
      scrollById('lp-rec-grid', delta);
      setTimeout(() => updateFades('lp-rec-grid', 'rec'), 0);
      return next;
    });
  };
  const jumpTopTo = (index: number) => {
    const clamped = Math.max(0, Math.min(topSlides - 1, index));
    setTopActive(clamped);
    const el = document.getElementById('lp-top-grid');
    if (el) {
      el.scrollTo({ left: clamped * getCardStep(el), behavior: 'smooth' });
      setTimeout(() => updateFades('lp-top-grid', 'top'), 0);
    }
  };
  const jumpRecTo = (index: number) => {
    const clamped = Math.max(0, Math.min(recSlides - 1, index));
    setRecActive(clamped);
    const el = document.getElementById('lp-rec-grid');
    if (el) {
      el.scrollTo({ left: clamped * getCardStep(el), behavior: 'smooth' });
      setTimeout(() => updateFades('lp-rec-grid', 'rec'), 0);
    }
  };

  useEffect(() => {
    const recalc = () => {
      const topGrid = document.getElementById('lp-top-grid');
      const recGrid = document.getElementById('lp-rec-grid');
      const getSlides = (grid: HTMLElement | null, total: number): number => {
        if (!grid) return Math.max(1, total - 1);
        const step = getCardStep(grid);
        if (step <= 0) return Math.max(1, total - 1);
        const visible = Math.max(1, Math.floor(grid.clientWidth / step));
        return Math.max(1, total > visible ? total - visible : 1);
      };
      const topTotal = topProperties.length || 6;
      const recTotal = recommendedProperties.length || 6;
      setTopSlides(getSlides(topGrid, topTotal));
      setRecSlides(getSlides(recGrid, recTotal));
      updateFades('lp-top-grid', 'top');
      updateFades('lp-rec-grid', 'rec');
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [topProperties.length, recommendedProperties.length]);

  // Initialize fades and attach scroll listeners once mounted
  useEffect(() => {
    const topEl = document.getElementById('lp-top-grid');
    const recEl = document.getElementById('lp-rec-grid');
    const onTopScroll = () => updateFades('lp-top-grid', 'top');
    const onRecScroll = () => updateFades('lp-rec-grid', 'rec');
    if (topEl) {
      onTopScroll();
      topEl.addEventListener('scroll', onTopScroll, { passive: true });
    }
    if (recEl) {
      onRecScroll();
      recEl.addEventListener('scroll', onRecScroll, { passive: true });
    }
    return () => {
      if (topEl) topEl.removeEventListener('scroll', onTopScroll);
      if (recEl) recEl.removeEventListener('scroll', onRecScroll);
    };
  }, []);

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

  // Features slider (Security, Identity, Quality, Price)
  const features = [
    { icon: VerifiedIcon, textKey: 'home.features.security' },
    { icon: IdentityIcon, textKey: 'home.features.identity' },
    { icon: QualityIcon, textKey: 'home.features.quality' },
    { icon: PriceIcon, textKey: 'home.features.price' }
  ];
  const [featureIndex, setFeatureIndex] = useState(0);
  const [isFeaturesMobile, setIsFeaturesMobile] = useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth <= 1050 : true);
  const [dragging, setDragging] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const featureContainerRef = useRef<HTMLDivElement>(null);

  // Footer features slider (mobile) state
  const [footerFeatureIndex, setFooterFeatureIndex] = useState(0);
  const [footerDragging, setFooterDragging] = useState(false);
  const [footerTouchStartX, setFooterTouchStartX] = useState<number | null>(null);
  const [footerTouchDeltaX, setFooterTouchDeltaX] = useState(0);
  const footerFeatureContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onResize = () => setIsFeaturesMobile(window.innerWidth <= 1050);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  useEffect(() => {
    if (!isFeaturesMobile) return;
    const id = setInterval(() => setFeatureIndex(i => (i + 1) % features.length), 10000);
    return () => clearInterval(id);
  }, [isFeaturesMobile]);
  const onFeatureTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };
  const onFeatureTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const dx = e.touches[0].clientX - touchStartX;
    setTouchDeltaX(dx);
  };
  const onFeatureTouchEnd = () => {
    if (touchStartX === null) { setDragging(false); return; }
    const containerWidth = featureContainerRef.current?.clientWidth || 1;
    const threshold = Math.min(60, containerWidth * 0.15);
    if (touchDeltaX <= -threshold) {
      setFeatureIndex(i => Math.min(i + 1, features.length - 1));
    } else if (touchDeltaX >= threshold) {
      setFeatureIndex(i => Math.max(i - 1, 0));
    }
    setDragging(false);
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  // Footer features touch handlers and auto-advance
  useEffect(() => {
    if (!isFeaturesMobile) return;
    const id = setInterval(() => setFooterFeatureIndex(i => (i + 1) % features.length), 10000);
    return () => clearInterval(id);
  }, [isFeaturesMobile]);

  const onFooterFeatureTouchStart = (e: React.TouchEvent) => {
    setFooterDragging(true);
    setFooterTouchStartX(e.touches[0].clientX);
    setFooterTouchDeltaX(0);
  };
  const onFooterFeatureTouchMove = (e: React.TouchEvent) => {
    if (footerTouchStartX === null) return;
    const dx = e.touches[0].clientX - footerTouchStartX;
    setFooterTouchDeltaX(dx);
  };
  const onFooterFeatureTouchEnd = () => {
    if (footerTouchStartX === null) { setFooterDragging(false); return; }
    const containerWidth = footerFeatureContainerRef.current?.clientWidth || 1;
    const threshold = Math.min(60, containerWidth * 0.15);
    if (footerTouchDeltaX <= -threshold) {
      setFooterFeatureIndex(i => Math.min(i + 1, features.length - 1));
    } else if (footerTouchDeltaX >= threshold) {
      setFooterFeatureIndex(i => Math.max(i - 1, 0));
    }
    setFooterDragging(false);
    setFooterTouchStartX(null);
    setFooterTouchDeltaX(0);
  };

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
            <MobileHeroSearchBar />
            {/* Mobile stats */}
            <div className="mobile-hero-stats">
              <div className="stat">
                <div className="num">10K+</div>
                <div className="lab">{t('home.verified_listings')}</div>
              </div>
              <div className="stat">
                <div className="num">98%</div>
                <div className="lab">{t('home.satisfaction_rate')}</div>
              </div>
              <div className="stat">
                <div className="num">24/7</div>
                <div className="lab">{t('home.customer_support')}</div>
              </div>
        </div>
            <div className="explore-link" onClick={() => navigate('/properties')}>
              <span>{t('home.explore_places')}</span>
              <span className="arrow-icon">
                <img src={ArrowRight} alt="Arrow" />
              </span>
            </div>
            <div className="hero-stats" aria-hidden="true">
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

        

        {/* Features Section (auto slider) */}
        <section className="features-section">
          {/* Desktop grid (>=1051px) */}
          <div className="features-grid">
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
          </div>

          {/* Mobile slider (<=1050px) */}
          <div 
            className="features-slider"
            ref={featureContainerRef}
            onTouchStart={onFeatureTouchStart}
            onTouchMove={onFeatureTouchMove}
            onTouchEnd={onFeatureTouchEnd}
          >
            <div 
              className="feature-track"
              style={{ transform: `translateX(calc(-${featureIndex * 100}% + ${dragging ? touchDeltaX : 0}px))` }}
            >
              {features.map((f, i) => (
                <div key={i} className="feature-card">
                  <img src={f.icon} alt="feature" className="feature-icon" />
                  <p className="feature-text">{t(f.textKey)}</p>
                </div>
              ))}
            </div>
            <div className="feature-dots">
              {features.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === featureIndex ? 'active' : ''}`}
                  onClick={() => setFeatureIndex(i)}
                />
              ))}
            </div>
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
        <section className="top-picks" style={{maxWidth: `100%`}}>
          <div className="section-header">
            <h2 className="top-picks-title">{t('home.top_picks')}</h2>
            {topProperties.length > 0 && (
              <div className="navigation-buttons">
                <button onClick={() => handleTopNav('left')} aria-label="Previous">
                  <IoChevronBackOutline />
                </button>
                <button onClick={() => handleTopNav('right')} aria-label="Next">
                  <IoChevronForwardOutline />
                </button>
              </div>
            )}
          </div>
          <div className="carousel-viewport">
            <div className="property-grid" id="lp-top-grid">
            {(topProperties.length === 0 ? Array.from({length: 6}) : topProperties).map((property: any, idx: number) => (
              <div key={topProperties.length === 0 ? `skeleton-${idx}` : property.id} className="property-card" onClick={() => topProperties.length === 0 ? null : navigate(`/property/${property.id}`)}>
                {topProperties.length === 0 ? (
                  <PropertyCardSkeleton />
                ) : (
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
                  housingPreference={property.housingPreference}
                  onToggleFavorite={() => {}}
                />
                )}
              </div>
            ))}
          </div>
          </div>
          {topProperties.length > 0 && (
            <div className="pagination-dots">
              {Array.from({ length: topSlides }).map((_, idx) => (
                <span key={idx} className={`dot ${idx === topActive ? 'active' : ''}`} onClick={() => jumpTopTo(idx)} />
              ))}
            </div>
          )}
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

        {/* Renter Protection - Mobile Version (<=700px) */}
        <section className="renter-protection-mobile" style={{maxWidth: `100%`}}>
          <div className="rp-header">
            <div className="rp-title">{t('home.renter_protection.title')}</div>
          </div>
          <div className="rp-points">
            <div className="rp-point">
              <span className="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" fill="white"/></svg>
              </span>
              <div>
                <h4>{t('home.renter_protection.stress_free_title')}</h4>
                <p>{t('home.renter_protection.stress_free_description')}</p>
              </div>
            </div>
            <div className="rp-point">
              <span className="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="white"/></svg>
              </span>
              <div>
                <h4>{t('home.renter_protection.support_title')}</h4>
                <p>{t('home.renter_protection.support_description')}</p>
              </div>
            </div>
            <div className="rp-point">
              <span className="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 18.09L11.27 15.95C10.5 15.18 10 14.14 10 13.06V8H14V13.06C14 13.57 14.2 14.08 14.59 14.47L16.73 16.61L13.41 18.09Z" fill="white"/></svg>
              </span>
              <div>
                <h4>{t('home.renter_protection.refund_title')}</h4>
                <p>{t('home.renter_protection.refund_description')}</p>
              </div>
            </div>
          </div>
          
        </section>

        {/* Recommended Properties Section */}
        <section className="top-picks" style={{maxWidth: `100%`}}>
          <div className="section-header">
            <h2 className="top-picks-title" style={{maxWidth: `60%`}}>{t('home.recommended_short', 'Top Picks')}</h2>
            {recommendedProperties.length > 0 && (
              <div className="navigation-buttons">
                <button onClick={() => handleRecNav('left')} aria-label="Previous">
                  <IoChevronBackOutline />
                </button>
                <button onClick={() => handleRecNav('right')} aria-label="Next">
                  <IoChevronForwardOutline />
                </button>
              </div>
            )}
          </div>
          <div className="carousel-viewport">
            <div className="property-grid" id="lp-rec-grid">
              {(recommendedProperties.length === 0 ? Array.from({length: 6}) : recommendedProperties).map((property: any, idx: number) => (
                <div key={recommendedProperties.length === 0 ? `skeleton-rec-${idx}` : property.id} className="property-card" onClick={() => recommendedProperties.length === 0 ? null : navigate(`/property/${property.id}`)}>
                  {recommendedProperties.length === 0 ? (
                    <PropertyCardSkeleton />
                  ) : (
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
                  housingPreference={property.housingPreference}
                  onToggleFavorite={() => {}}
                />
                  )}
              </div>
            ))}
          </div>
          </div>
          {recommendedProperties.length > 0 && (
            <div className="pagination-dots">
              {Array.from({ length: recSlides }).map((_, idx) => (
                <span key={idx} className={`dot ${idx === recActive ? 'active' : ''}`} onClick={() => jumpRecTo(idx)} />
              ))}
            </div>
          )}
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

        {/* Features Footer (desktop grid + mobile slider) */}
        <section className="features-footer">
          {/* Desktop grid */}
          <div className="features-footer-grid">
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
          </div>

          {/* Mobile slider */}
          <div 
            className="footer-features-slider"
            ref={footerFeatureContainerRef}
            onTouchStart={onFooterFeatureTouchStart}
            onTouchMove={onFooterFeatureTouchMove}
            onTouchEnd={onFooterFeatureTouchEnd}
          >
            <div 
              className="feature-track"
              style={{ transform: `translateX(calc(-${footerFeatureIndex * 100}% + ${footerDragging ? footerTouchDeltaX : 0}px))` }}
            >
              {features.map((f, i) => (
                <div key={`footer-${i}`} className="feature-card">
                  <img src={f.icon} alt="feature" className="feature-icon" />
                  <p className="feature-text">{t(f.textKey)}</p>
                </div>
              ))}
            </div>
            <div className="feature-dots">
              {features.map((_, i) => (
                <span
                  key={`footer-dot-${i}`}
                  className={`dot ${i === footerFeatureIndex ? 'active' : ''}`}
                  onClick={() => setFooterFeatureIndex(i)}
                />
              ))}
            </div>
          </div>
        </section>
      </UsersLandingStyle>
      <MobileCarouselFix />
    </>
  );
};

export default UsersLanding;