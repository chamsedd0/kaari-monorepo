import { WhiteHeaderUsers } from "../../components/skeletons/constructed/headers/header-users-white";
import { ProfileShowcaseStyle } from "./styles";
import ProfilePic from "../../assets/images/advertiser.png";
import { CertificationBanner } from "../../components/skeletons/banners/static/certification-banner";
import { useState } from "react";

export const ProfileShowcasePage = () => {
    const [activeTab, setActiveTab] = useState<'ratings' | 'offers'>('ratings');

    return(
        <ProfileShowcaseStyle>
            <WhiteHeaderUsers user></WhiteHeaderUsers>
            <div className="info-section">
                <img className="image" src={ProfilePic} alt="Profile" />
                
                <div className="about-me-section">
                    <span className="about-me-title">About me</span>
                    <p className="about-me-text">
                        We are a couple looking to rent in Agadir. We are both professionals working in the city and looking for a nice place to make a home. We would like to ask for serious business and care of the rental place.
                    </p>
                    <button className="about-me-button">Show more</button>
                </div>

                <div className="additional-info">
                    <div className="last-online">
                        <span className="title">Last online</span>
                        <span className="subtitle">2 hours ago</span>
                    </div>
                    <div className="on-kaari-since">
                        <span className="title">On Kaari since</span>
                        <span className="subtitle">March 2024</span>
                    </div>
                </div>
            </div>

            <div className="main-section">
                <div className="profile-section">
                    <div className="profile-details">
                        <div className="rating-stars">
                            
                        </div>
                        
                        <div className="profile-information">
                            <h2 className="name">Leonardo V.</h2>
                            <div className="certifications">
                                <CertificationBanner purple text="Kaari Verified"></CertificationBanner>
                                <CertificationBanner purple text="Owner since 2022"></CertificationBanner>
                            </div>
                            <span className="location">Agadir, Morocco</span>
                        </div>

                        <div className="control-buttons">
                            <button 
                                className={`control-button ${activeTab === 'ratings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('ratings')}
                            >
                                Rating and references
                                <span className="icon-counter">2</span>
                            </button>
                            <button 
                                className={`control-button ${activeTab === 'offers' ? 'active' : ''}`}
                                onClick={() => setActiveTab('offers')}
                            >
                                Offers
                                <span className="icon-counter">3</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="display-section">
                    {activeTab === 'ratings' && (
                        <div className="ratings-content">
                            <h3>Ratings and References</h3>
                            {/* Add your ratings content here */}
                        </div>
                    )}
                    {activeTab === 'offers' && (
                        <div className="offers-content">
                            <h3>Offers</h3>
                            {/* Add your offers content here */}
                        </div>
                    )}
                </div>
            </div>
        </ProfileShowcaseStyle>
    )
}