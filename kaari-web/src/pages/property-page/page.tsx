import { useEffect, useRef, useState } from "react";
import { PropertyPage } from "./styles";
import { WhiteHeaderUsers } from "../../components/skeletons/constructed/headers/header-users-white";
import PhotoSlider from "../../components/skeletons/constructed/slider/photo-slider";

import pictures from '../../assets/images/propertyExamplePic.png'
import PropertyRequestCard from "../../components/skeletons/cards/send-request-card";
import ProfilePic from '../../assets/images/ProfilePicture.png'
import LivingRoom from '../../assets/images/livingRoomExample.png'
import TimeLine from '../../components/skeletons/icons/safeMoneyTimeLine.svg'
import { CertificationBanner } from "../../components/skeletons/banners/static/certification-banner";
import Map from '../../assets/images/map2.png'
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import ArrowLeftIcon from "../../components/skeletons/icons/Icon_Arrow_Left.svg";
import ArrowRightIcon from "../../components/skeletons/icons/Icon_Arrow_Right.svg";

const PropertyPageComponent = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(true);
  const [isStopped, setIsStopped] = useState(false);
  const [stopPosition, setStopPosition] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  const images = [pictures, LivingRoom, pictures, pictures];

  useEffect(() => {
    

    const handleScroll = () => {
      setTotalHeight(document.documentElement.scrollHeight || document.body.scrollHeight);
      

      if (!boxRef.current || !stopRef.current) return;

      const boxRect = boxRef.current.getBoundingClientRect();
      const stopRect = stopRef.current.getBoundingClientRect();

      console.log(window.scrollY + stopRect.top)

      if (stopRect.top <= boxRect.height) {
        setIsStopped(true);
        setIsFixed(false);
        setStopPosition(window.scrollY + stopRect.top);
      } else {
        setIsStopped(false);
        setIsFixed(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PropertyPage total_Height={totalHeight} isFixed={isFixed} isStopped={isStopped} stopPosition={stopPosition}>
      <WhiteHeaderUsers user></WhiteHeaderUsers>
      
      <div className="main-content">
            <div className="photo-slider">
                <PhotoSlider images={images}></PhotoSlider>
            </div>

            <div className="property-info">
              <div className="money-safe-banner">
                    <h3>Your money is safe up to 48 hours after you move in</h3>
                    <p>When you move in, if the property doesn't match its listing description, let us know within 48 hours and you can get a refund</p>
                    <div className="outside-tube">
                        <div className="inside-tube">Your money is safe</div>
                    </div>
                    <div className="timeline">
                        <img src={TimeLine} alt="timeline" />
                    </div>
                </div>
                
                <h1 className="title">Flat for rent in Agadir</h1>
                
                <p className="description">
                    Discover an exceptional building for rent in the vibrant city of Agadir, Morocco. This versatile property offers a prime location in a thriving neighborhood, making it ideal for various business ventures or residential purposes. The building boasts a modern design with spacious interiors, large windows that flood the space with natural light, and high ceilings.
                </p>
                <p className="description">
                    The property spans multiple floors, each offering unique room for offices, retail spaces, or apartments. It is equipped with essential amenities including a well-maintained elevator, secure parking, and advanced security features. The building's strategic location ensures easy access to major roads, public transportation, and essential services, making it an attractive site for businesses looking to establish a presence in Agadir.
                </p>

                

                <div className="equipment">
                    <h2>Equipment</h2>
                    <div className="equipment-list">
                        <div className="equipment-group">
                            <h3>Basic furniture</h3>
                            <ul>
                                <li>Sofa</li>
                                <li>Dining Table</li>
                                <li>Wardrobe</li>
                                <li>Cabinet</li>
                            </ul>
                        </div>
                        <div className="equipment-group">
                            <h3>Kitchen Essentials</h3>
                            <ul>
                                <li>Basic equipment</li>
                                <li>Some equipment</li>
                                <li>Some equipment</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="rooms">
                    <h2>Rooms and equipment</h2>
                    <div className="room-list">
                        <div className="room">
                            <span className="room-icon">🛏️</span>
                            <span>Bedroom</span>
                        </div>
                        <div className="room">
                            <span className="room-icon">🚽</span>
                            <span>Bathroom</span>
                        </div>
                        <div className="room">
                            <span className="room-icon">🛋️</span>
                            <span>Living Room</span>
                        </div>
                        <div className="room">
                            <span className="room-icon">🍳</span>
                            <span>Kitchen</span>
                        </div>
                    </div>
                </div>

                <div className="rental-conditions">
                    <h2>Rental conditions</h2>
                    <div className="conditions-grid">
                        <div className="condition">
                            <span className="label">Rent per month</span>
                            <span className="value">2000$</span>
                        </div>
                        <div className="condition">
                            <span className="label">Service fee</span>
                            <span className="value">400$</span>
                        </div>
                        <div className="condition">
                            <span className="label">Deposit</span>
                            <span className="value">2000$</span>
                        </div>
                        <div className="condition">
                            <span className="label">Minimal rent length</span>
                            <span className="value">30 days</span>
                        </div>
                        <div className="condition">
                            <span className="label">Available from</span>
                            <span className="value">26.04.2024</span>
                        </div>
                    </div>
                </div>

                <div className="about-advertiser">
                    <h2>About the advertiser</h2>
                    <div className="advertiser-info">
                        <img src={ProfilePic} alt="Leonardo V." className="advertiser-image" />
                        <div className="advertiser-details">
                            <h3>Leonardo V.</h3>
                            <p>On Kaari since August 2024</p>
                            <CertificationBanner text="Premium host" purple></CertificationBanner>
                        </div>
                    </div>
                    <p className="advertiser-description">
                        As the landlord, I am pleased to offer this charming house for rent, perfect for those seeking a comfortable and cozy home. I take great pride in maintaining my properties and ensuring they are well-maintained and equipped, offering a warm and welcoming atmosphere that you'll be proud to call home.
                    </p>
                    <p className="property-description">
                        The house is spacious layout with three bedrooms, two bathrooms, and an open-concept living and dining area. The kitchen is fully equipped with modern appliances and ample counter space, making it joy for those who love to cook. The master bedroom includes an en-suite bathroom and a walk-in closet, ensuring both privacy and convenience.
                    </p>
                </div>

                <div className="location">
                    <h2>Where you will live</h2>
                    <div className="nearby-places">
                        <div className="place">
                            <h4>Workplaces</h4>
                            <span>10 minutes</span>
                        </div>
                        <div className="place">
                            <h4>Grocery stores</h4>
                            <span>15 minutes</span>
                        </div>
                        <div className="place">
                            <h4>Schools</h4>
                            <span>10 minutes</span>
                        </div>
                        <div className="place">
                            <h4>Supermarkets</h4>
                            <span>10 minutes</span>
                        </div>
                        <div className="place">
                            <h4>Medical transport</h4>
                            <span>15 minutes</span>
                        </div>
                    </div>
                </div>
            </div>
      </div>

      {/* Add a separate div just for stop calculation */}
      <div ref={stopRef} className="stop-reference">
        
      </div>

      {/* Content that goes after the checkout box */}
      <div className="bottom-content">
        <img src={Map} alt="map" className="map-image" />
        <div className="recommendations">
          <div className="title">
            Other offers you may like
            <div className="navigation-buttons">
              <button onClick={() => recommendationsRef.current?.scrollBy({ left: -435, behavior: 'smooth' })}>
                <img src={ArrowLeftIcon} alt="arrow-left" />
              </button>
              <button onClick={() => recommendationsRef.current?.scrollBy({ left: 435, behavior: 'smooth' })}>
                <img src={ArrowRightIcon} alt="arrow-right" />
              </button>
            </div>
          </div>
          <div className="recommendations-list" ref={recommendationsRef}>
            <div className="recommendation">
              <PropertyCard
                image={pictures}
                isRecommended={true}
                title="Apartment"
                subtitle="Agadir, Morocco"
                price="2000$"
                priceType="per month"
                minstay="Min Stay 30 days"
                description="Deposit 2000$"
              />
            </div>

            <div className="recommendation">
              <PropertyCard
                image={pictures}
                isRecommended={true}
                title="Apartment"
                subtitle="Agadir, Morocco"
                price="2000$"
                priceType="per month"
                minstay="Min Stay 30 days"
                description="Deposit 2000$"
              />
            </div>

            <div className="recommendation">
              <PropertyCard
                image={pictures}
                isRecommended={true}
                title="Apartment"
                subtitle="Agadir, Morocco"
                price="2000$"
                priceType="per month"
                minstay="Min Stay 30 days"
                description="Deposit 2000$"
              />
            </div>
            
            <div className="recommendation">
              <PropertyCard
                image={pictures}
                isRecommended={false}
                title="Cozy studio near beach"
                subtitle="Agadir, Morocco"
                price="1500$"
                priceType="per month"
                minstay="Min Stay 30 days"
                description="Deposit 1500$"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div ref={boxRef} className={`checkout-box ${isFixed ? "fixed" : ""} ${isStopped ? "stopped" : ""}`}>
        <PropertyRequestCard
          title="Apartment - flat in the center of Agadir"
          isVerified={true}
          advertiserName="Leonardo V."
          advertiserImage={ProfilePic}
          moveInDate="21/08/2024"
          priceFor30Days={2000}
          serviceFee={400}
          totalPrice={2400}
        />
      </div>
    </PropertyPage>
  );
};

export default PropertyPageComponent;