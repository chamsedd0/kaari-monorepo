import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdvertisersLandingStyle } from './styles';
import HeaderAdvertisersLanding from '../../components/skeletons/constructed/headers/header-advertisers-landing';
import { PhotoshootCardEnum } from '../../components/skeletons/cards/photoshoot-card-enum';

// Import images
import Photoshoot1 from '../../assets/images/photoshoot1.png';
import Photoshoot2 from '../../assets/images/Photoshoot2.png';
import Photoshoot3 from '../../assets/images/Photoshoot3.png';
import Photoshoot4 from '../../assets/images/Photoshoot4.png';

import HouseInMountain from '../../assets/images/HouseInMountain.png';
import CelebrationImage from '../../assets/images/CelebrationImage.png';
import CheckingTime from '../../assets/images/CheckingTime.png';
import CameraMan from '../../assets/images/CameraMan.png';
import BuildingWindows from '../../assets/images/BuildingWindows.png';

import { PurpleButtonLB60 } from '../../components/skeletons/buttons/purple_LB60';

const AdvertisersLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  // How it works data
  const howItWorksSteps = [
    {
      id: 1,
      title: 'Book a photoshoot',
      description: 'You get a FREE professional photoshoot with hundreds of high-quality images of your property for an accurate showcase.'
    },
    {
      id: 2,
      title: 'Your Listing will be Created',
      description: 'We\'ll list your property on our platform with expert descriptions and professional photos that highlight its best features.'
    },
    {
      id: 3,
      title: 'Get Bookings',
      description: 'Interested renters will contact you directly through our platform, making communication smooth and hassle-free.'
    },
    {
      id: 4,
      title: 'Receive Your Payment',
      description: 'After a successful booking, your payment is securely processed. You only need to provide the keys to the tenant.'
    }
  ];

  return (
    <>
      <HeaderAdvertisersLanding />
      <AdvertisersLandingStyle>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Lease fast, stress less</h1>
            <p>Rent Out Easily with Kaari - Morocco's Premier Platform for Mid and Long Term Rentals</p>
            
            <div className="button-container" style={{ maxWidth: '250px' }}>  
                <PurpleButtonLB60
                    text="Book a Photoshoot"
                    onClick={handleGetStarted}
                />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <h2>Everything you need to know to choose Kaari</h2>
          <p className="subtitle">High-end visibility, Qualified Tenants, Stress-free renting</p>
          
          <div className="benefit-item">
            <div className="benefit-content">
              <div className="benefit-title">
                <div className="benefit-number">1</div>
                <h3>Free Professional Photoshoot</h3>
              </div>
              <p>Explore hundreds of high-quality rooms, studios, and apartments. Save your favorites and get alerts. Finding your dream home could not be easier.</p>
            </div>
            <div className="benefit-image">
              <img src={CameraMan} alt="Professional Photoshoot" />
            </div>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-content">
              <div className="benefit-title">
                <div className="benefit-number">2</div>
                <h3>Hassle-free Management</h3>
              </div>
              <p>Pay the first month's rent to confirm your booking. Congratulations, you found your next home. We'll protect your money until you've moved in and checked the place out.</p>
            </div>
            <div className="benefit-image">
              <img src={HouseInMountain} alt="Hassle-free Management" />
            </div>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-content">
              <div className="benefit-title">
                <div className="benefit-number">3</div>
                <h3>Protection from last-minute cancellation</h3>
              </div>
              <p>To counter cancel culture, tenants pay first month in advance if the reservation is confirmed. Kaari guarantees first months rent.</p>
            </div>
            <div className="benefit-image">
              <img src={CheckingTime} alt="Protection from cancellation" />
            </div>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-content">
              <div className="benefit-title">
                <div className="benefit-number">4</div>
                <h3>Wider reach and Higher Visibility</h3>
              </div>
              <p>List in just one location and be found automatically across our platform. Know if it's occupied or not within 24 hours.</p>
            </div>
            <div className="benefit-image">
              <img src={CelebrationImage} alt="Higher Visibility" />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
            <div className="pricing-image">
                <img src={BuildingWindows} alt="Building" />
            </div>

            <div className="pricing-content">
                <h2>One price, all inclusive</h2>
                <div className="fee-container">
                    <div className="fee-highlight">50</div>
                    <div className="fee-text">fee</div>
                </div>
                <p className="pricing-details">of the first month's rent</p>
                <p className="pricing-description">Simple pricing. No hidden costs. Only pay when you see results.</p>
                <div className="button-container" style={{ maxWidth: '188px' }}>
                    <PurpleButtonLB60
                        text="Start Now"
                        onClick={handleGetStarted}
                    />
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step-card">
              <PhotoshootCardEnum
                title="Book a photoshoot"
                description="Schedule a free photoshoot with our professional photographers who will capture quality images of your property for an accurate showcase."
                number={1}
                image={Photoshoot1}
              />
            </div>
            
            <div className="step-card">
              <PhotoshootCardEnum
                title="Your Listing will be Created"
                description="We'll create a detailed listing with your property info and professional photos on our platform to attract qualified tenants."
                number={2}
                image={Photoshoot2}
              />
            </div>
            
            <div className="step-card">
              <PhotoshootCardEnum
                title="Get Bookings"
                description="Interested renters will send booking requests through our platform, making communication smooth and hassle-free."
                number={3}
                image={Photoshoot3}
              />
            </div>
            
            <div className="step-card">
              <PhotoshootCardEnum
                title="Receive Your Payment"
                description="After a successful booking, your payment is securely processed. You only need to provide the keys to the tenant."
                number={4}
                image={Photoshoot4}
              />
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section className="get-started">
          <h2>Get Started for Free</h2>
          <h3>Start Earning with Kaari Today</h3>
          <p>Book a shoot and enjoy safe, hassle-free renting from the comfort of your home</p>
          <div className="button-container">
            <PurpleButtonLB60
              text="Start Now"
              onClick={handleGetStarted}
            />
          </div>
        </section>
      </AdvertisersLandingStyle>
    </>
  );
};

export default AdvertisersLanding;
