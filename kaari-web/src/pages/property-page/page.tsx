import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyPage, spin } from "./styles";
import UnifiedHeader from "../../components/skeletons/constructed/headers/unified-header";
import PhotoSlider from "../../components/skeletons/constructed/slider/photo-slider";
import pictures from '../../assets/images/propertyExamplePic.png'
import PropertyRequestCard from "../../components/skeletons/cards/send-request-card";
import ProfilePic from '../../assets/images/ProfilePicture.png'
import TimeLine from '../../components/skeletons/icons/safeMoneyTimeLine.svg'
import { CertificationBanner } from "../../components/skeletons/banners/static/certification-banner";
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
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useStore } from "../../backend/store";
import { IoEyeOutline, IoPersonCircleOutline, IoLogInOutline, IoHomeOutline } from 'react-icons/io5';
import { getGoogleMapsLoaderOptions } from '../../utils/googleMapsConfig';



// Define types for Property and User
interface Room {
  type: 'bedroom' | 'bathroom' | 'kitchen' | 'storage' | 'living';
  area: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  deposit?: number;
  serviceFee?: number;
  minstay?: string;
  availableFrom?: Date;
  area: number;
  address: Address;
  bedrooms?: number;
  bathrooms?: number;
  propertyType: 'apartment' | 'house' | 'condo' | 'land' | 'commercial';
  rooms?: Room[];
  amenities: string[];
  features: string[];
  location?: Location;
  images: string[];
  status: 'available' | 'occupied';
  createdAt: Date;
  updatedAt: Date;
  // UI specific properties
  isRecommended?: boolean;
  priceType?: string;
  image?: string;
  rules?: { name: string; allowed: boolean }[];
  capacity?: number;
  isFurnished?: boolean;
  nearbyPlaces?: { name: string; timeDistance: string }[];
  videos?: string[]; // Added videos property
}

interface User {
  id: string;
  email: string;
  name: string;
  surname?: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: 'admin' | 'advertiser' | 'client';
  createdAt: Date;
  updatedAt: Date;
  aboutMe?: string;
}

// Default map settings for Morocco
const DEFAULT_MAP_CENTER = { lat: 34.020882, lng: -6.841650 }; // Rabat, Morocco
const DEFAULT_MAP_ZOOM = 15;

// Define the map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px'
};

// Declare google namespace to fix type errors
declare global {
  interface Window {
    google: any;
  }
}

const PropertyPageComponent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [advertiser, setAdvertiser] = useState<User | null>(null);
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<HTMLDivElement>(null);
  const [isBoxFixed, setIsBoxFixed] = useState(false);
  const [isBoxStopped, setIsBoxStopped] = useState(false);
  const [boxTopPosition, setBoxTopPosition] = useState(80);
  const [totalHeight, setTotalHeight] = useState(0);
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Get the current user from store to check role
  const currentUser = useStore(state => state.user);
  const isClient = currentUser?.role === 'client';
  
  // Load Google Maps API
  const { isLoaded: mapsLoaded, loadError: mapsError } = useJsApiLoader(getGoogleMapsLoaderOptions());
  
  // Map configuration
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_MAP_ZOOM);
  
  // Track window width for responsive positioning
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        if (!id) throw new Error("Property ID not found");
        const data = await getPropertyById(id);
        
        // Add default images to the property data
        if (data) {
          setProperty(data);
          
          // Set map center if property has address data
          if (data.address) {
            // Use the address to create a Location if one doesn't exist
            // This could be replaced with a geocoding call in a real application
            setMapCenter(DEFAULT_MAP_CENTER);
            setMapZoom(15);
          }
        }
        
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

  // Handle scroll for checkout box positioning
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    const handleScroll = () => {
      if (!boxRef.current || !stopRef.current) return;
      
      const scrollY = window.scrollY;
      const boxHeight = window.innerHeight; // Use viewport height for full-height box
      const stopPosition = stopRef.current.offsetTop;
      const gap = 40; // Gap between stopping point and card (40px)
      const topMargin = 0; // Top margin for the box
      
      // When the box should stop at bottom
      if (scrollY + boxHeight + topMargin >= stopPosition - gap) {
        setIsBoxFixed(false);
        setIsBoxStopped(true);
        setBoxTopPosition(stopPosition - boxHeight - gap);
      } 
      // When scrolling
      else {
        setIsBoxFixed(true);
        setIsBoxStopped(false);
      }
    };
    
    // Run handler on mount and add listeners
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Apply the appropriate className and style to checkout box
  const getCheckoutBoxProps = () => {
    let className = "checkout-box";
    let style: React.CSSProperties = {};
    
    // Calculate right position based on window width and page max width
    const rightPosition = windowWidth > 1500 ? `${(windowWidth - 1500) / 2}px` : '0';
    
    if (isBoxFixed) {
      className += " fixed";
      style = { 
        position: 'fixed', 
        top: 0,
        right: rightPosition,
        height: '100vh',
        marginTop: '80px'
      };
    } else if (isBoxStopped) {
      className += " stopped";
      style = { 
        position: 'absolute', 
        top: `${boxTopPosition}px`,
        right: 0,
        height: '100vh',
        marginTop: '0' // Remove margin when stopped
      };
    } else {
      // Default position
      style = {
        position: 'fixed',
        top: 0,
        right: rightPosition,
        height: '100vh',
        marginTop: '80px'
      };
    }
    
    return { className, style };
  };

  if (loading) return <div>Loading...</div>;
  if (error || !property) return <div>{error || "Property not found."}</div>;

  // Rental conditions
  const price = property.price ? `${property.price} MAD` : 'N/A';
  const deposit = property.deposit ? `${property.deposit} MAD` : 'N/A';
  const serviceFee = property.serviceFee ? `${property.serviceFee} MAD` : 'N/A';
  const minstay = property.minstay || 'N/A';
  const availableFrom = property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : 'N/A';

  // Address
  const address = property.address ? `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.country || ''}` : 'N/A';

  // Room info with fallback to bedrooms/bathrooms for backward compatibility
  const bedrooms = property.rooms?.filter(room => room.type === 'bedroom')?.length || property.bedrooms || 0;
  const bathrooms = property.rooms?.filter(room => room.type === 'bathroom')?.length || property.bathrooms || 0;
  const area = property.area ? `${property.area}` : 'N/A';
  
  // Get room types and areas
  const livingRooms = property.rooms?.filter(room => room.type === 'living') || [];
  const kitchens = property.rooms?.filter(room => room.type === 'kitchen') || [];
  const storageRooms = property.rooms?.filter(room => room.type === 'storage') || [];
  
  // Calculate area per room type
  const bedroomsArea = property.rooms?.filter(room => room.type === 'bedroom')?.reduce((sum: number, room: Room) => sum + room.area, 0) || 0;
  const bathroomsArea = property.rooms?.filter(room => room.type === 'bathroom')?.reduce((sum: number, room: Room) => sum + room.area, 0) || 0;
  const livingRoomsArea = livingRooms.reduce((sum: number, room: Room) => sum + room.area, 0) || 0;
  const kitchensArea = kitchens.reduce((sum: number, room: Room) => sum + room.area, 0) || 0;
  const storageRoomsArea = storageRooms.reduce((sum: number, room: Room) => sum + room.area, 0) || 0;

  return (
    <PropertyPage 
      total_Height={totalHeight} 
      isFixed={isBoxFixed} 
      isStopped={isBoxStopped} 
      stopPosition={boxTopPosition}
    >
      <UnifiedHeader variant="white" userType="user" />
      <div className="main-content">
        <div className="photo-slider">
          {property.images.length > 0 || (property.videos && property.videos.length > 0) ? (
            <PhotoSlider 
              images={property.images} 
              videos={property.videos || []}
            />
          ) : (
            <div className="fallback-image">
              <img src={pictures} alt="Fallback" />
            </div>
          )}
        </div>
        <div className="property-icons-container">
          <div className="icon-container">
            <div className="icon-circle">
              <img src={people} alt="icon" />
            </div>
            <div className="icon-text">
              <p>{property.capacity || (bedrooms + bathrooms)} People</p>
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
              <p>{property.isFurnished ? "Furnished" : "Unfurnished"}</p>
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
              {property.amenities && property.amenities.length > 0 && (
                <div className="equipment-group">
                  <h3>Amenities</h3>
                  <ul>
                    {property.amenities.map((amenity: string, i: number) => (
                      <li key={i}><img src={check} alt="check" />{amenity}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {property.features && property.features.length > 0 && (
                <div className="equipment-group">
                  <h3>Features</h3>
                  <ul>
                    {property.features.map((feature: string, i: number) => (
                      <li key={i}><img src={check} alt="check" />{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(!property.amenities || property.amenities.length === 0) && 
               (!property.features || property.features.length === 0) && (
                <div className="equipment-group">
                  <h3>Basic furniture</h3>
                  <ul>
                    <li>No amenities or features listed</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="rooms">
            <h2>Rooms and equipment</h2>
            <div className="room-list">
              {property.rooms && property.rooms.length > 0 ? (
                property.rooms.map((room, index) => {
                  let RoomIcon;
                  let roomLabel;
                  
                  switch(room.type) {
                    case 'bedroom':
                      RoomIcon = BedroomIcon;
                      roomLabel = 'Bedroom';
                      break;
                    case 'bathroom':
                      RoomIcon = BathroomIcon;
                      roomLabel = 'Bathroom';
                      break;
                    case 'living':
                      RoomIcon = FurnitureIcon;
                      roomLabel = 'Living Room';
                      break;
                    case 'kitchen':
                      RoomIcon = KitchenIcon;
                      roomLabel = 'Kitchen';
                      break;
                    case 'storage':
                      RoomIcon = FurnitureIcon;
                      roomLabel = 'Storage Room';
                      break;
                    default:
                      RoomIcon = FurnitureIcon;
                      roomLabel = 'Room';
                  }
                  
                  return (
                    <div className="room" key={index}>
                      <RoomIcon color={Theme.colors.secondary} />
                      <div className="text-container">
                        <span className="room-name">{roomLabel}</span>
                        <span className="room-description">
                          {`${room.area} sq m`}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  {/* Legacy display method for properties without room detail */}
                  {bedrooms > 0 && (
                    <div className="room">
                      <BedroomIcon color={Theme.colors.secondary} />
                      <div className="text-container">
                        <span className="room-name">Bedroom</span>
                        <span className="room-description">
                          {`${bedrooms} room(s)${bedroomsArea > 0 ? ` - ${bedroomsArea} sq m` : ''}`}
                        </span>
                      </div>
                    </div>
                  )}
                  {bathrooms > 0 && (
                    <div className="room">
                      <BathroomIcon color={Theme.colors.secondary} />
                      <div className="text-container">
                        <span className="room-name">Bathroom</span>
                        <span className="room-description">
                          {`${bathrooms} room(s)${bathroomsArea > 0 ? ` - ${bathroomsArea} sq m` : ''}`}
                        </span>
                      </div>
                    </div>
                  )}
                  {livingRooms.length > 0 && (
                    <div className="room">
                      <FurnitureIcon color={Theme.colors.secondary} />
                      <div className="text-container">
                        <span className="room-name">Living Room</span>
                        <span className="room-description">
                          {`${livingRooms.length} room(s) - ${livingRoomsArea} sq m`}
                        </span>
                      </div>
                    </div>
                  )}
                  {kitchens.length > 0 && (
                    <div className="room">
                      <KitchenIcon color={Theme.colors.secondary} />
                      <div className="text-container">
                        <span className="room-name">Kitchen</span>
                        <span className="room-description">
                          {`${kitchens.length} room(s) - ${kitchensArea} sq m`}
                        </span>
                      </div>
                    </div>
                  )}
                  {storageRooms.length > 0 && (
                    <div className="room">
                      <FurnitureIcon color={Theme.colors.secondary} />
                      <div className="text-container">
                        <span className="room-name">Storage Room</span>
                        <span className="room-description">
                          {`${storageRooms.length} room(s) - ${storageRoomsArea} sq m`}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
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
                <span className="value">{serviceFee}</span>
              </div>
              <div className="condition">
                <span className="label">Deposit</span>
                <span className="value">{deposit}</span>
              </div>
              <div className="condition">
                <span className="label">Minimal rent length</span>
                <span className="value">{minstay}</span>
              </div>

            </div>
            
            {/* Rules section */}
            <h3 className="rules-title">Rules</h3>
            <div className="rules-container">
              {property.rules && property.rules.length > 0 ? (
                property.rules.map((rule, index) => (
                  <div className="rule-item" key={index}>
                    <div className={`rule-icon ${rule.allowed ? 'allowed' : 'forbidden'}`}>
                      <img src={rule.allowed ? check : cross} alt={rule.allowed ? "allowed" : "forbidden"} />
                    </div>
                    <div className="rule-name">{rule.name}</div>
                  </div>
                ))
              ) : (
                <div className="no-rules">No specific rules provided for this property.</div>
              )}
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
            <p className="address">{address}</p>
            
            <div className="location-map">
              {!mapsLoaded ? (
                <div className="map-placeholder">
                  <p>Loading map...</p>
                </div>
              ) : mapsError ? (
                <div className="map-placeholder">
                  <p>Error loading map</p>
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={mapZoom}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  <Marker
                    position={mapCenter}
                    icon={{
                      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                      scaledSize: new window.google.maps.Size(30, 30)
                    }}
                  />
                </GoogleMap>
              )}
            </div>
            
            <div className="nearby-places-container">
              <div className="nearby-places">
                {property.nearbyPlaces && property.nearbyPlaces.length > 0 ? (
                  property.nearbyPlaces.map((place, index) => (
                    <div className="place" key={index}>
                      <h4>{place.name}</h4>
                      <span>{place.timeDistance}</span>
                    </div>
                  ))
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref={stopRef} className="stop-reference"></div>
      <div className="bottom-content">
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
                  id={rec.id}
                  propertyType="apartment"
                  isFavorite={false}
                  onToggleFavorite={() => {}}
                />
              </div>
            )) : (
              <div>No recommendations found.</div>
            )}
          </div>
        </div>
      </div>
      <div 
        ref={boxRef} 
        {...getCheckoutBoxProps()}
      >
        {isClient ? (
          <PropertyRequestCard
            title={property.title || 'N/A'}
            isVerified={true}
            advertiserName={advertiser?.name || 'N/A'}
            advertiserImage={advertiser?.profilePicture || ProfilePic}
            moveInDate={availableFrom}
            priceFor30Days={property.price || 0}
            serviceFee={property.serviceFee || 0}
            totalPrice={(property.price || 0) + (property.serviceFee || 0)}
            propertyId={property.id}
            ownerId={advertiser?.id || ''}
          />
        ) : currentUser ? (
          <div style={{ 
            padding: '30px', 
            textAlign: 'center', 
            marginTop: '120px'
          }}>
            <IoEyeOutline size={40} color={Theme.colors.secondary} style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 15px 0', color: Theme.colors.black }}>
              Admin/Advertiser View
            </h3>
            <p style={{ color: Theme.colors.gray2, margin: '0 0 5px 0' }}>
              Only clients can send property requests.
            </p>
            <p style={{ color: Theme.colors.gray2, fontSize: '14px' }}>
              You are logged in as: <strong>{currentUser.role}</strong>
            </p>
          </div>
        ) : (
          <div style={{ 
            padding: '30px', 
            textAlign: 'center', 
            marginTop: '120px'
          }}>
            <IoLogInOutline size={40} color={Theme.colors.primary} style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 15px 0', color: Theme.colors.black }}>
              Please Log In
            </h3>
            <p style={{ color: Theme.colors.gray2, margin: '0' }}>
              You need to log in as a client to send property requests.
            </p>
          </div>
        )}
      </div>
    </PropertyPage>
  );
};

export default PropertyPageComponent;