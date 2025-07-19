import React, { useState, useEffect } from 'react';
import { ReferralProgramPageStyle } from './styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import arowdown from '../../../../components/skeletons/icons/Icon_arrow_Down.svg'
import arowup from '../../../../components/skeletons/icons/Icon_arrow_Up.svg'
import { useReferralProgram } from '../../../../hooks/useReferralProgram';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../../../contexts/auth/AuthContext';
import YourEarningsCalculatorCard from "../../../../components/skeletons/cards/your-earnings-calculator-card";
import ThinFreePhotoshootCard from "../../../../components/skeletons/cards/thin-free-photoshoot";
import ReferralPassGreenSkeleton from "../../../../components/skeletons/cards/referral-pass-green";
import ReferralPassRedSkeleton from "../../../../components/skeletons/cards/referral-pass-red";
import FacebookLogo from '../../../../components/icons/Logo_Facebook.svg';
import InstagramLogo from '../../../../components/icons/Logo_Instagram.svg';
import WhatsappLogo from '../../../../components/icons/Logo_Whatsapp.svg';
import XLogo from '../../../../components/icons/Logo_X.svg';
import CrossIcon from '../../../../components/icons/Icon_Cross.svg';
import ShareIcon from '../../../../components/icons/Icon_Share.svg';
import { BpurpleButtonMB48 } from '../../../../components/skeletons/buttons/border_purple_MB48';

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9.5" stroke="white" />
    <path d="M10 6V7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 10V14" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);



const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4L10 8L6 12" stroke="#8F27CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Up and Down arrow indicators
const UpArrowIndicator = () => (
  <img src={arowup} alt="Up Arrow"  />
);

const DownArrowIndicator = () => (
  <img src={arowdown} alt="Down Arrow"  />
);

// Lock icons
const LockIcon = ({ locked }: { locked: boolean }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 16h-2v-4c0-5.52-4.48-10-10-10S14 6.48 14 12v4h-2c-2.2 0-4 1.8-4 4v20c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4V20c0-2.2-1.8-4-4-4zm-12 18c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm6.2-18H17.8v-4c0-3.42 2.78-6.2 6.2-6.2 3.42 0 6.2 2.78 6.2 6.2v4z" fill={locked ? "#FFD700" : "#FFD700"}/>
  </svg>
);

const ReferralProgramPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { 
    referralData, 
    loading, 
    error, 
    getReferralLink, 
    requestPayout,
    isReferralPassActive,
    getReferralPassTimeRemaining,
    hasMetReferralPassRequirements
  } = useReferralProgram();
  const { user } = useAuth();

  // Timer state for countdown
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Update the timer every second
  useEffect(() => {
    if (!referralData) return;

    const timer = setInterval(() => {
      const remaining = getReferralPassTimeRemaining();
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [referralData, getReferralPassTimeRemaining]);

  // Function to copy referral code to clipboard
  const copyReferralCode = () => {
    if (!referralData) return;
    
    const referralLink = getReferralLink();
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Function to navigate to the performance details
  const handleViewPerformance = () => {
    navigate('/dashboard/advertiser/referral-program/performance');
  };

  

  // Function to handle payout request
  const handleRequestPayout = async () => {
    const success = await requestPayout();
    if (success) {
      // Show success message
      console.log('Payout requested successfully');
    }
  };

  // Function to book a photoshoot
  const handleBookPhotoshoot = () => {
    navigate('/photoshoot-booking');
  };

  // Function to open share modal
  const handleOpenShareModal = () => {
    setShowShareModal(true);
  };

  // Function to share on social media
  const handleShare = (platform: 'facebook' | 'whatsapp' | 'twitter' | 'instagram') => {
    const referralLink = getReferralLink();
    const message = `Download Kaari and get 200 MAD off your next booking using code ${referralData?.referralCode}!`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + referralLink)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct sharing API, but we can open Instagram
        shareUrl = 'https://www.instagram.com/';
        alert('Copy your referral link and share it on Instagram!');
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Component for the copy button with custom styling
  const CopyButton = () => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
      const referralLink = getReferralLink();
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <button className="copy-button" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy link'} 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" fill="none"/>
            <path d="M8 4V16H20V4H8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 16V20H4V8H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <ReferralProgramPageStyle>
        <div className="page-header">
          <h2>Kaari's Referral Program</h2>
        </div>
        <div className="loading">Loading referral program data...</div>
      </ReferralProgramPageStyle>
    );
  }

  // Render error state
  if (error) {
    return (
      <ReferralProgramPageStyle>
        <div className="page-header">
          <h2>Kaari's Referral Program</h2>
        </div>
        <div className="error">Error: {error}</div>
      </ReferralProgramPageStyle>
    );
  }

  // If no referral data, show a message
  if (!referralData) {
    return (
      <ReferralProgramPageStyle>
        <div className="page-header">
          <h2>Kaari's Referral Program</h2>
        </div>
        <div className="no-data">No referral program data available.</div>
      </ReferralProgramPageStyle>
    );
  }

  // Determine if the user has met requirements to activate the referral pass
  const hasMetRequirements = hasMetReferralPassRequirements();
  const isFoundingPartner = user?.foundingPartner === true;

  return (
    <ReferralProgramPageStyle>
      <div className="page-header">
        <h2>Kaari's Referral Program</h2>
        {isFoundingPartner && (
          <div className="founding-partner-badge">
            Founding Partner
            <span className="tooltip">As a founding partner, you have access to the referral program for 90 days with no conditions and 0% commission on profits.</span>
          </div>
        )}
      </div>

      <div className="cards-layout">
        <div className="main-column">
          {/* Referral Pass Card - Show different UI based on active state */}
              {isReferralPassActive() ? (
            <ReferralPassGreenSkeleton 
              listingsCurrent={referralData.referralPass.listingsSincePass}
              listingsTotal={referralData.referralPass.listingRequirement}
              bookingsCurrent={referralData.referralPass.bookingsSincePass}
              bookingsTotal={referralData.referralPass.bookingRequirement}
              validUntil={referralData.referralPass.expiryDate.toLocaleDateString()}
              passStatus="Your Pass is Active!"
              timeRemaining={timeRemaining}
              isFoundingPartner={isFoundingPartner}
            />
              ) : hasMetRequirements ? (
            <ReferralPassRedSkeleton 
              listingsCurrent={referralData.referralPass.listingsSincePass}
              listingsTotal={referralData.referralPass.listingRequirement}
              bookingsCurrent={referralData.referralPass.bookingsSincePass}
              bookingsTotal={referralData.referralPass.bookingRequirement}
              validUntil={referralData.referralPass.expiryDate.toLocaleDateString()}
              passStatus="Your Pass Expired!"
              timeRemaining={timeRemaining}
              isFoundingPartner={isFoundingPartner}
            />
          ) : (
            <ReferralPassRedSkeleton 
              listingsCurrent={referralData.referralPass.listingsSincePass}
              listingsTotal={referralData.referralPass.listingRequirement}
              bookingsCurrent={referralData.referralPass.bookingsSincePass}
              bookingsTotal={referralData.referralPass.bookingRequirement}
              validUntil=""
              passStatus="Welcome to Kaari's Referral Program!"
              timeRemaining={null}
              isFoundingPartner={isFoundingPartner}
              isOnboarding={true}
            />
          )}

          {/* Your Referral Link Card - Only show if pass is active */}
          {isReferralPassActive() && (
            <div className="card referral-link-card">

              <div className="referral-link-card-content">
                <div className="card-header">
                  <h2>Your Referral Link</h2>
                </div>

                <div className="referral-link-content">
                  <div className="link-input-group">
                    <input 
                      type="text" 
                      value={getReferralLink()} 
                      readOnly 
                      className="referral-link-input" 
                    />
                    <div className="referral-actions">
                    <button className="share-button" onClick={handleOpenShareModal}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08261 9.12833C7.54305 8.43386 6.7914 8 5.94737 8C4.32343 8 3 9.34315 3 11C3 12.6569 4.32343 14 5.94737 14C6.7914 14 7.54305 13.5661 8.08261 12.8717L15.0227 16.6294C15.0077 16.7508 15 16.8745 15 17C15 18.6569 16.3431 20 18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C17.1559 14 16.4043 14.4338 15.8647 15.1282L8.92465 11.3706C8.93965 11.2492 8.94737 11.1255 8.94737 11C8.94737 10.8745 8.93965 10.7508 8.92465 10.6294L15.8647 6.87175C16.4043 7.56618 17.1559 8 18 8Z" fill="white"/>
                      </svg>
                      Share
                    </button>
                  </div>
                  </div>

                  

                  <div className="referral-info">
                    <p>Give tenants your unique promocode. They get 200 MAD off, and you earn a bonus! You can scan the QR code to use the referral link fast.</p>
                  </div>

                  
                </div>
                
              </div>
              <div className="qr-code-container">
                    <QRCodeSVG 
                      value={getReferralLink()}
                      size={120}
                      bgColor={"#ffffff"}
                      fgColor={"#8F27CE"}
                      level={"H"}
                      includeMargin={true}
                    />
                  </div>
            </div>
          )}

          {/* Free Photoshoot Banner */}
          <ThinFreePhotoshootCard/>

          {/* Earnings Calculator Card */}
          <YourEarningsCalculatorCard/>
        </div>

        <div className="sidebar">
          {/* Your Progress Card */}
          <div className="card progress-card">
            <div className="card-header">
              <h2>Your Progress</h2>
            </div>

            <div className="progress-stats-row">
              <div className="stat-col">
                <span className="stat-label">Total Referrals</span>
                <span className="stat-value positive">
                  <span className="trend-indicator up">
                    <UpArrowIndicator />
                  </span>
                  {referralData.referralStats.totalReferrals}
                </span>
              </div>
              <div className="stat-col">
                <span className="stat-label">Successful Bookings</span>
                <span className="stat-value negative">
                  <span className="trend-indicator down">
                    <DownArrowIndicator />
                  </span>
                  {referralData.referralStats.successfulBookings}
                </span>
              </div>
            </div>

            <div className="earnings-row">
              <div className="earning-col">
                <span className="stat-label">Monthly earnings</span>
                <span className="stat-value">{referralData.referralStats.monthlyEarnings} MAD</span>
              </div>
              <div className="earning-col">
                <span className="stat-label">Annual earnings</span>
                <span className="stat-value">{referralData.referralStats.annualEarnings} MAD</span>
              </div>
            </div>

            <div className="progress-card-buttons">
              <button className="request-payout-btn" onClick={handleRequestPayout}>
                Request Payout
              </button>
              <button className="performance-details-btn" onClick={handleViewPerformance}>
                Performance Details
              </button>
            </div>
          </div>
          
          {/* Need Help Card */}
          <div className="card help-card">
            <div className="card-header">
              <h2>Need Help?</h2>
              <div className="help-icon">?</div>
            </div>
            
            <div className="help-links">
              <div className="help-link">
                <span>When will I get my payout?</span>
                <ArrowRightIcon />
              </div>
              <div className="help-link">
                <span>How payouts work?</span>
                <ArrowRightIcon />
              </div>
              <div className="help-link">
                <span>My Transaction history</span>
                <ArrowRightIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay">
          <div className="share-modal">
            <div className="share-modal-header">
              <img src={ShareIcon} alt="Share" />
              <h2>Share Your Code</h2>
              <button className="close-btn" onClick={() => setShowShareModal(false)}>
                <img src={CrossIcon} alt="Close" width="24" height="24" />
              </button>
            </div>
            
            <div className="share-modal-content">
              <div className="share-text">
                <p>Download Kaari and get 200 MAD off your next booking using code {referralData.referralCode}!</p>
                <p className="share-link">{getReferralLink()}</p>
              </div>
              
              <div className="share-options">
                <div className="share-option" onClick={() => handleShare('facebook')}>
                  <div className="share-icon facebook">
                    <img src={FacebookLogo} alt="Facebook" />
                  </div>
                  <span>Facebook</span>
                </div>
                <div className="share-option" onClick={() => handleShare('whatsapp')}>
                  <div className="share-icon whatsapp">
                    <img src={WhatsappLogo} alt="WhatsApp" />
                  </div>
                  <span>WhatsApp</span>
                </div>
                <div className="share-option" onClick={() => handleShare('instagram')}>
                  <div className="share-icon instagram">
                    <img src={InstagramLogo} alt="Instagram" />
                  </div>
                  <span>Instagram</span>
                </div>
                <div className="share-option" onClick={() => handleShare('twitter')}>
                  <div className="share-icon twitter">
                    <img src={XLogo} alt="X" />
                  </div>
                  <span>X</span>
                </div>
              </div>
              
              <div className="promo-code-banner">
                <div className="promo-icon">%</div>
                <p>Promo code <strong>{referralData.referralCode}</strong> will be applied - 200 MAD discount!</p>
              </div>
              
              <div className="share-modal-buttons">
                <BpurpleButtonMB48 
                  text="Close"
                  onClick={() => setShowShareModal(false)}
                />
                <CopyButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </ReferralProgramPageStyle>
  );
};

export default ReferralProgramPage;