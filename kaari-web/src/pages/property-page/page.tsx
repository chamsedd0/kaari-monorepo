import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { PropertyPage } from "./styles";
import UnifiedHeader from "../../components/skeletons/constructed/headers/unified-header";
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
import people from '../../components/skeletons/icons/People-Icon.svg'
import { BedroomIcon, BathroomIcon, FurnitureIcon, KitchenIcon } from '../../components/icons/RoomIcons';
import size from '../../components/skeletons/icons/Area-Icon.svg'
import wifi from '../../components/skeletons/icons/Wifi-Icon.svg'
import furnished from '../../components/skeletons/icons/Furniture-Icon.svg'
import check from '../../components/skeletons/icons/Check-Icon.svg'
import cross from '../../components/skeletons/icons/Cross-Icon.svg'
import bedroom from '../../components/skeletons/icons/Bedroom-Icon.svg'
import bathroom from '../../components/skeletons/icons/Bathroom-Icon.svg'
import { Theme } from "../../theme/theme";
import { getPropertyById, getProperties } from '../../backend/server-actions/PropertyServerActions';
import { getUserById } from '../../backend/server-actions/UserServerActions';

const PropertyPageComponent = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [advertiser, setAdvertiser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const boxRef = useRef(null);
  const stopRef = useRef(null);
  const [isFixed, setIsFixed] = useState(true);
  const [isStopped, setIsStopped] = useState(false);
  const [stopPosition, setStopPosition] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);
  const recommendationsRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPropertyById(id);
        setProperty(data);
        if (data && data.ownerId) {
          try {
            const adv = await getUserById(data.ownerId);
            setAdvertiser(adv);
          } catch (err) {
            setAdvertiser(null);
          }
        } else {
          setAdvertiser(null);
        }
        // Fetch recommendations (other properties in the same city, excluding current)
        if (data && data.address && data.address.city) {
          try {
            const all = await getProperties({});
            const recs = all.filter(p => p.id !== data.id && p.address?.city === data.address.city).slice(0, 4);
            setRecommendations(recs);
          } catch (err) {
            setRecommendations([]);
          }
        } else {
          setRecommendations([]);
        }
      } catch (err) {
        setError('Failed to load property.');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  const images = property && property.images && property.images.length > 0 ? property.images : [pictures, LivingRoom];

  useEffect(() => {
    const handleScroll = () => {
      setTotalHeight(document.documentElement.scrollHeight || document.body.scrollHeight);
      if (!boxRef.current || !stopRef.current) return;
      const boxRect = boxRef.current.getBoundingClientRect();
      const stopRect = stopRef.current.getBoundingClientRect();
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

  if (loading) return <div>Loading...</div>;
  if (error || !property) return <div>{error || "Property not found."}</div>;

  // Rental conditions
  const price = property.price ? `${property.price} MAD` : 'N/A';
  const deposit = property.deposit ? `${property.deposit} MAD` : 'N/A';
  const minstay = property.minstay || 'N/A';
  const availableFrom = property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : 'N/A';

  // Address
  const address = property.address ? `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.country || ''}` : 'N/A';

  // Room info
  const bedrooms = property.bedrooms || 0;
  const bathrooms = property.bathrooms || 0;
  const area = property.area || 'N/A';

  return (
    <PropertyPage total_Height={totalHeight} isFixed={isFixed} isStopped={isStopped} stopPosition={stopPosition}>
      <UnifiedHeader variant="white" userType="user" />
      <div className="main-content">
        <div className="photo-slider">
          <PhotoSlider images={images}></PhotoSlider>
        </div>
        <div className="property-icons-container">
          <div className="icon-container">
            <div className="icon-circle">
              <img src={people} alt="icon" />
            </div>
            <div className="icon-text">
              <p>{bedrooms + bathrooms} People</p>
            </div>
          </div>
          <div className="icon-container">
            <div className="icon-circle">
              <img src={bedroom} alt="icon" />
            </div>
            <div className="icon-text">
              <p>{bedrooms} Bedroom{bedrooms > 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="icon-container">
            <div className="icon-circle">
              <img src={bathroom} alt="icon" />
            </div>
            <div className="icon-text">
              <p>{bathrooms} Bathroom{bathrooms > 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="icon-container">
            <div className="icon-circle">
              <img src={size} alt="icon" />
            </div>
            <div className="icon-text">
              <p>{area} m2</p>
            </div>
          </div>
          <div className="icon-container">
            <div className="icon-circle">
              <img src={wifi} alt="icon" />
            </div>
            <div className="icon-text">
              <p>Wi-fi</p>
            </div>
          </div>
          <div className="icon-container">
            <div className="icon-circle">
              <img src={furnished} alt="icon" />
            </div>
            <div className="icon-text">
              <p>Furnished</p>
            </div>
          </div>
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
          <h1 className="title">{property.title}</h1>
          <p className="description">{property.description}</p>
          <div className="equipment">
            <h2>Equipment</h2>
            <div className="equipment-list">
              <div className="equipment-group">
                <h3>Basic furniture</h3>
                <ul>
                  {property.features && property.features.length > 0 ? property.features.map((f, i) => (
                    <li key={i}><img src={check} alt="check" />{f}</li>
                  )) : <li>No features listed</li>}
                </ul>
              </div>
            </div>
          </div>
          <div className="rooms">
            <h2>Rooms and equipment</h2>
            <div className="room-list">
              <div className="room">
                <BedroomIcon color={Theme.colors.secondary} />
                <div className="text-container">
                  <span className="room-name">Bedroom</span>
                  <span className="room-description">{bedrooms > 0 ? `${bedrooms} room(s)` : 'N/A'}</span>
                </div>
              </div>
              <div className="room">
                <BathroomIcon color={Theme.colors.secondary} />
                <div className="text-container">
                  <span className="room-name">Bathroom</span>
                  <span className="room-description">{bathrooms > 0 ? `${bathrooms} room(s)` : 'N/A'}</span>
                </div>
              </div>
              <div className="room">
                <FurnitureIcon color={Theme.colors.secondary} />
                <div className="text-container">
                  <span className="room-name">Living Room</span>
                  <span className="room-description">{area !== 'N/A' ? `${area} m2` : 'N/A'}</span>
                </div>
              </div>
              <div className="room">
                <KitchenIcon color={Theme.colors.secondary} />
                <div className="text-container">
                  <span className="room-name">Kitchen</span>
                  <span className="room-description">N/A</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rental-conditions">
            <h2>Rental conditions</h2>
            <div className="conditions-grid">
              <div className="condition">
                <span className="label">Rent per month</span>
                <span className="value">{price}</span>
              </div>
              <div className="condition">
                <span className="label">Service fee</span>
                <span className="value">N/A</span>
              </div>
              <div className="condition">
                <span className="label">Deposit</span>
                <span className="value">{deposit}</span>
              </div>
              <div className="condition">
                <span className="label">Minimal rent length</span>
                <span className="value">{minstay}</span>
              </div>
              <div className="condition">
                <span className="label">Available from</span>
                <span className="value">{availableFrom}</span>
              </div>
            </div>
          </div>
          <div className="about-advertiser">
            <h2>About the advertiser</h2>
            <div className="advertiser-info">
              <img src={advertiser?.profilePicture || ProfilePic} alt={advertiser?.name || "Advertiser"} className="advertiser-image" />
              <div className="advertiser-details">
                <h3>{advertiser?.name || "Advertiser"}</h3>
                <p>On Kaari since {advertiser?.createdAt ? new Date(advertiser.createdAt).toLocaleDateString() : "2024"}</p>
                <div className="certification-banner">
                  <CertificationBanner text={"Verified"} purple></CertificationBanner>
                </div>
              </div>
            </div>
            <p className="advertiser-description">{advertiser?.aboutMe || "No description."}</p>
          </div>
          <div className="location">
            <h2>Where you will live</h2>
            <div>{address}</div>
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
      <div ref={stopRef} className="stop-reference"></div>
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
            {recommendations.length > 0 ? recommendations.map((rec) => (
              <div className="recommendation" key={rec.id}>
                <PropertyCard
                  image={rec.image || pictures}
                  isRecommended={!!rec.isRecommended}
                  title={rec.title}
                  subtitle={rec.address?.city || ''}
                  price={rec.price ? `${rec.price} MAD` : 'N/A'}
                  priceType={rec.priceType || ''}
                  minstay={rec.minstay || ''}
                  description={rec.description || ''}
                />
              </div>
            )) : (
              <div>No recommendations found.</div>
            )}
          </div>
        </div>
      </div>
      <div ref={boxRef} className={`checkout-box ${isFixed ? "fixed" : ""} ${isStopped ? "stopped" : ""}`}>
        <PropertyRequestCard
          title={property.title || 'N/A'}
          isVerified={true}
          advertiserName={advertiser?.name || 'N/A'}
          advertiserImage={advertiser?.profilePicture || ProfilePic}
          moveInDate={availableFrom}
          priceFor30Days={property.price || 0}
          serviceFee={0}
          totalPrice={property.price || 0}
          propertyId={property.id}
        />
      </div>
    </PropertyPage>
  );
};

export default PropertyPageComponent;