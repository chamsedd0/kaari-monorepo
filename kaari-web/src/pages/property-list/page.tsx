import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMap} from 'react-icons/io5';
import { AppliedFilterBannerComponent } from "../../components/skeletons/banners/static/applied-filter-banner";
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import SelectFieldBaseModelVariant2 from "../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2"
import { PropertyList } from "./styles"
import { getProperties } from "../../backend/server-actions/PropertyServerActions";
import SearchFilterBar from "../../components/skeletons/inputs/search-bars/search-filter-bar";
import FilteringSection from "../../components/skeletons/constructed/filtering/filtering-section";
import defaultImage from "../../assets/images/propertyExamplePic.png";
import { useAuth } from "../../contexts/auth";
import { toast } from 'react-toastify';

// Updated PropertyType interface to match Firestore data model
interface PropertyType {
  id: string | number;
  ownerId: string;
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyType: 'apartment' | 'house' | 'condo' | 'land' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  price: number;
  images: string[];
  amenities: string[];
  features: string[];
  status: 'available' | 'sold' | 'pending' | 'rented';
  createdAt: Date;
  updatedAt: Date;
  listingId?: string;
  // UI specific properties
  isFavorite?: boolean;
  isRecommended?: boolean;
  subtitle?: string;
  priceType?: string;
  minstay?: string;
  location?: { lat: number; lng: number };
  image?: string;
}

// Define sort option type 
type SortOptionType = string;

// Filter type definition
interface FilterType {
  id: string;
  label: string;
  category: 'bedrooms' | 'price' | 'amenities' | 'other';
}


// Sort options
const sortOptions: SortOptionType[] = [
  'Recommended',
  'Price: Low to High',
  'Price: High to Low',
  'Newest First'
];

// Create a separate component for the map with property popup
const PropertyMap = memo(({ selectedProperty, showMap, properties }: { 
  selectedProperty: PropertyType | null, 
  showMap: boolean,
  properties: PropertyType[] 
}) => {
  return (
    <div className={`map ${showMap ? 'active' : ''}`}>
      {/* Map placeholder - would be replaced with an actual map component */}
      <div className="map-placeholder">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
        </svg>
        <span>Interactive map would be displayed here - with {properties.length} properties</span>
      </div>
      
      <div className="map-controls">
        <button className="map-button" title="Zoom In">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
          </svg>
        </button>
        <button className="map-button" title="Zoom Out">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13H5V11H19V13Z" fill="currentColor"/>
          </svg>
        </button>
        <button className="map-button" title="My Location">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
});

// Enhanced property card component (outside of main component to avoid re-creation)
interface EnhancedPropertyCardProps {
  property: PropertyType;
  onToggleFavorite: (id: string | number) => void;
}

const EnhancedPropertyCardComponent = ({ property, onToggleFavorite }: EnhancedPropertyCardProps) => {
  // Format property data for the card component
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);
  
  // Don't try to convert the ID, just pass it as is
  const propertyId = property.id;
  
  return (
    <div className="property-card-wrapper">
      <PropertyCard 
        image={property.image || defaultImage}
        title={property.title}
        subtitle={property.subtitle || ''}
        minstay={property.minstay || ''}
        price={formattedPrice}
        priceType={property.priceType || ''}
        description={property.description}
        propertyType={property.propertyType}
        isRecommended={!!property.isRecommended}
        isFavorite={!!property.isFavorite}
        onToggleFavorite={onToggleFavorite}
        id={propertyId}
      />
    </div>
  );
};

// Memoize the EnhancedPropertyCard to prevent unnecessary renders
const EnhancedPropertyCard = memo(EnhancedPropertyCardComponent, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.property.isFavorite === nextProps.property.isFavorite
  );
});

export default function PropertyListPage() {
  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [genderInput, setGenderInput] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('Recommended');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [isFilteringSectionVisible, setIsFilteringSectionVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const propertiesPerPage = 6;

  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle advanced filtering button click - defined early to avoid reference errors
  const handleAdvancedFiltering = () => {
    // Reset to first page whenever filters change
    setCurrentPage(1);
    
    // Apply the filters to properties
    let filtered = [...properties];
    console.log("Applying filters:", activeFilters);
    console.log("Location input:", locationInput);
    console.log("Date input:", dateInput);
    console.log("Gender input:", genderInput);
    
    // Filter by location input
    if (locationInput) {
      filtered = filtered.filter(
        property => 
          property.title.toLowerCase().includes(locationInput.toLowerCase()) ||
          (property.subtitle?.toLowerCase().includes(locationInput.toLowerCase()) ?? false) ||
          property.address.city.toLowerCase().includes(locationInput.toLowerCase()) ||
          property.address.state.toLowerCase().includes(locationInput.toLowerCase()) ||
          property.propertyType.toLowerCase().includes(locationInput.toLowerCase())
      );
    }
    
    // Filter by date input (availability date)
    if (dateInput) {
      // In a real app, you would check against property availability dates
      const dateObj = new Date(dateInput);
      
      filtered = filtered.filter(property => {
        // Mock implementation - in a real app, check actual availability dates
        if (property.createdAt) {
          // For demo, filter based on a simple comparison (created before selected date is available)
          const propertyDate = property.createdAt instanceof Date 
            ? property.createdAt 
            : new Date(property.createdAt);
          
          return propertyDate <= dateObj;
        }
        return true;  
      });
    }
    
    // Filter by gender preference
    if (genderInput) {
      // In a real app, you would check against property gender preference settings
      if (genderInput === 'women_only') {
        // Mock implementation - filter only properties meant for women
        filtered = filtered.filter((property, index) => {
          // Use the index to create a deterministic filter
          return index % 3 === 0;
        });
      } else if (genderInput === 'men_only') {
        // Mock implementation - filter only properties meant for men
        filtered = filtered.filter((property, index) => {
          // Use the index to create a deterministic filter
          return index % 3 === 1;
        });
      }
    }
    
    // Apply other active filters 
    if (activeFilters.length > 0) {
      filtered = filtered.filter(property => {
        // Check each filter
        return activeFilters.every(filter => {
          // Bedroom filters
          if (filter.includes('Bedroom')) {
            const bedroomCount = property.bedrooms || 0;
            const filterValue = parseInt(filter.split(' ')[0]);
            
            if (filter.includes('+')) {
              return bedroomCount >= filterValue;
            } else {
              return bedroomCount === filterValue;
            }
          }
          
          // Property type filters
          if (filter === 'Apartment' || filter === 'House' || filter === 'Condo' || filter === 'Commercial') {
            return property.propertyType.toLowerCase() === filter.toLowerCase();
          }
          
          // Price range filters
          if (filter.includes('$0-$1000')) {
            return property.price <= 1000;
          }
          
          if (filter.includes('$1000-$3000')) {
            return property.price > 1000 && property.price <= 3000;
          }
          
          if (filter.includes('$3000+')) {
            return property.price > 3000;
          }
          
          // Custom price range filter (e.g., "1500 to 4000")
          if (filter.includes('to')) {
            try {
              const [min, max] = filter.split('to').map(s => parseInt(s.trim()));
              if (!isNaN(min) && !isNaN(max)) {
                return property.price >= min && property.price <= max;
              }
            } catch (e) {
              console.error("Error parsing price range:", e);
            }
            return true;
          }
          
          // Amenities filters
          if (filter === 'WiFi' || filter === 'Parking' || filter === 'Pets Allowed' || filter === 'Furnished') {
            return property.amenities?.some(
              amenity => amenity.toLowerCase() === filter.toLowerCase()
            ) ?? false;
          }
          
          // Status filters
          if (filter === 'Available') {
            return property.status === 'available';
          }
          
          if (filter === 'Pending') {
            return property.status === 'pending';
          }
          
          return true; // Default to including if filter is not recognized
        });
      });
    }
    
    // Apply sorting after filtering
    switch(sortOption) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Newest First':
        filtered.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'Recommended':
      default:
        // Sort recommended properties first
        filtered.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));
        break;
    }
    
    console.log("Filtered properties count:", filtered.length);
    setFilteredProperties(filtered);
    setIsLoading(false);
  };

  // Handle applying filters from the filtering section
  const handleApplyFilters = () => {
    // First close the filtering section
    setIsFilteringSectionVisible(false);
    
    // Set loading state immediately
    setIsLoading(true);
    
    // Update URL with the current search parameters
    const params = new URLSearchParams(location.search);
    
    if (locationInput) {
      params.set('location', locationInput);
    } else {
      params.delete('location');
    }
    
    if (dateInput) {
      params.set('date', dateInput);
    } else {
      params.delete('date');
    }
    
    if (genderInput) {
      params.set('gender', genderInput);
    } else {
      params.delete('gender');
    }
    
    // Use the current path with the updated query parameters
    const currentPath = location.pathname;
    const newUrl = `${currentPath}?${params.toString()}`;
    
    // Update the URL without causing a full page reload
    navigate(newUrl, { replace: true });
    
    // Apply filters immediately using the current filters
    console.log("Applying filters immediately after FilteringSection close");
    applyCurrentFilters(activeFilters);
  };
  
  // Fetch properties from Firestore on component mount
  useEffect(() => {
    const getPropertiesData = async () => {
      setIsLoading(true);
      try {
        // Always use the getProperties function from backend
        const propertiesData = await getProperties({ limit: 50 });
        
        // Transform properties to include UI-specific fields
        const transformedProperties = propertiesData.map(property => {
          return {
            ...property,
            subtitle: property.address.city + ', ' + property.address.state,
            priceType: property.propertyType === 'apartment' ? '/month' : '', 
            minstay: 'Min stay: 1 month', // Default minimum stay
            isRecommended: Math.random() > 0.7, // Random recommendation for now
            isFavorite: false, // Default not favorite
            // Use the default image if no images available
            image: defaultImage,
            // Mock location for now - in real app, get from geocoding
            location: { 
              lat: parseFloat((Math.random() * (36.2 - 33.7) + 33.7).toFixed(6)), 
              lng: parseFloat((Math.random() * (-75.17 - (-80.00)) + (-80.00)).toFixed(6)) 
            }
          };
        });
        
        setProperties(transformedProperties);
        setFilteredProperties(transformedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Set empty arrays in case of error
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    getPropertiesData();
  }, []);

  // Parse URL search parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locationParam = params.get('location');
    const dateParam = params.get('date');
    const genderParam = params.get('gender');
    
    // Initialize with a flag to avoid unnecessary re-filtering
    let filtersChanged = false;
    
    // Set search query if location parameter exists
    if (locationParam && locationParam !== locationInput) {
      setLocationInput(locationParam);
      filtersChanged = true;
    }
    
    // Apply date filter if date parameter exists
    if (dateParam && dateParam !== dateInput) {
      setDateInput(dateParam);
      filtersChanged = true;
    }
    
    // Apply gender filter if it exists
    if (genderParam && genderParam !== genderInput) {
      setGenderInput(genderParam);
      filtersChanged = true;
    }
    
    // Apply filters if they changed
    if (filtersChanged) {
      // We need to use setTimeout to ensure state updates have happened
      setTimeout(() => {
        handleAdvancedFiltering();
      }, 0);
    }
  }, [location.search]);

  // Filter properties based on search inputs and filters
  useEffect(() => {
    // Only apply filtering when properties data changes or sort option changes
    // This avoids unwanted filtering during user input
    // Active filters are handled by the buttons that change them
    if (properties.length > 0) {
      handleAdvancedFiltering();
    }
  }, [properties, sortOption]);

  // Handle search input
  const handleSearch = (e?: React.FormEvent) => {
    // Prevent default form submission if called from a form event
    if (e) {
      e.preventDefault();
    }
    
    // Set loading state
    setIsLoading(true);
    
    // Update URL with the search parameters
    const params = new URLSearchParams(location.search);
    
    if (locationInput) {
      params.set('location', locationInput);
    } else {
      params.delete('location');
    }
    
    if (dateInput) {
      params.set('date', dateInput);
    } else {
      params.delete('date');
    }
    
    if (genderInput) {
      params.set('gender', genderInput);
    } else {
      params.delete('gender');
    }
    
    // Use the current path with the updated query parameters
    const currentPath = location.pathname;
    const newUrl = `${currentPath}?${params.toString()}`;
    
    // Replace the URL without causing a full page reload
    navigate(newUrl, { replace: true });
    
    // Apply filtering immediately
    console.log("Searching and filtering immediately");
    applyCurrentFilters(activeFilters);
  };

  // Handlers for input changes
  const handleLocationChange = (value: string) => {
    setLocationInput(value);
  };

  const handleDateChange = (value: string) => {
    setDateInput(value);
  };

  const handleGenderChange = (value: string) => {
    setGenderInput(value);
  };

  // Handle sort option change
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  // Handle filter toggle
  const toggleFilter = (filter: string) => {
    // Set loading immediately
    setIsLoading(true);
    
    // Update filters state
    if (activeFilters.includes(filter)) {
      // Remove the filter
      const newFilters = activeFilters.filter(f => f !== filter);
      setActiveFilters(newFilters);
      
      // Use callback form to ensure we have the updated state
      setActiveFilters(prev => {
        const newFilters = prev.filter(f => f !== filter);
        console.log("Updated active filters (removed):", newFilters);
        
        // Apply filtering immediately
        applyCurrentFilters(newFilters);
        return newFilters;
      });
    } else {
      // Add the filter
      setActiveFilters(prev => {
        const newFilters = [...prev, filter];
        console.log("Updated active filters (added):", newFilters);
        
        // Apply filtering immediately
        applyCurrentFilters(newFilters);
        return newFilters;
      });
    }
  };
  
  // Function to apply current filters without relying on state updates
  const applyCurrentFilters = (currentFilters: string[]) => {
    // Apply the filters to properties
    let filtered = [...properties];
    
    // Filter by location input
    if (locationInput) {
      filtered = filtered.filter(
        property => 
          property.title.toLowerCase().includes(locationInput.toLowerCase()) ||
          (property.subtitle?.toLowerCase().includes(locationInput.toLowerCase()) ?? false) ||
          property.address.city.toLowerCase().includes(locationInput.toLowerCase()) ||
          property.address.state.toLowerCase().includes(locationInput.toLowerCase()) ||
          property.propertyType.toLowerCase().includes(locationInput.toLowerCase())
      );
    }
    
    // Filter by date input (availability date)
    if (dateInput) {
      // In a real app, you would check against property availability dates
      const dateObj = new Date(dateInput);
      
      filtered = filtered.filter(property => {
        // Mock implementation - in a real app, check actual availability dates
        if (property.createdAt) {
          // For demo, filter based on a simple comparison (created before selected date is available)
          const propertyDate = property.createdAt instanceof Date 
            ? property.createdAt 
            : new Date(property.createdAt);
          
          return propertyDate <= dateObj;
        }
        return true;  
      });
    }
    
    // Filter by gender preference
    if (genderInput) {
      // In a real app, you would check against property gender preference settings
      if (genderInput === 'women_only') {
        // Mock implementation - filter only properties meant for women
        filtered = filtered.filter((property, index) => {
          // Use the index to create a deterministic filter
          return index % 3 === 0;
        });
      } else if (genderInput === 'men_only') {
        // Mock implementation - filter only properties meant for men
        filtered = filtered.filter((property, index) => {
          // Use the index to create a deterministic filter
          return index % 3 === 1;
        });
      }
    }
    
    // Apply active filters 
    if (currentFilters.length > 0) {
      filtered = filtered.filter(property => {
        // Check each filter
        return currentFilters.every(filter => {
          // Same filter logic as in handleAdvancedFiltering
          
          // Bedroom filters
          if (filter.includes('Bedroom')) {
            const bedroomCount = property.bedrooms || 0;
            const filterValue = parseInt(filter.split(' ')[0]);
            
            if (filter.includes('+')) {
              return bedroomCount >= filterValue;
            } else {
              return bedroomCount === filterValue;
            }
          }
          
          // Property type filters
          if (filter === 'Apartment' || filter === 'House' || filter === 'Condo' || filter === 'Commercial') {
            return property.propertyType.toLowerCase() === filter.toLowerCase();
          }
          
          // Price range filters
          if (filter.includes('$0-$1000')) {
            return property.price <= 1000;
          }
          
          if (filter.includes('$1000-$3000')) {
            return property.price > 1000 && property.price <= 3000;
          }
          
          if (filter.includes('$3000+')) {
            return property.price > 3000;
          }
          
          // Custom price range filter (e.g., "1500 to 4000")
          if (filter.includes('to')) {
            try {
              const [min, max] = filter.split('to').map(s => parseInt(s.trim()));
              if (!isNaN(min) && !isNaN(max)) {
                return property.price >= min && property.price <= max;
              }
            } catch (e) {
              console.error("Error parsing price range:", e);
            }
            return true;
          }
          
          // Amenities filters
          if (filter === 'WiFi' || filter === 'Parking' || filter === 'Pets Allowed' || filter === 'Furnished') {
            return property.amenities?.some(
              amenity => amenity.toLowerCase() === filter.toLowerCase()
            ) ?? false;
          }
          
          // Status filters
          if (filter === 'Available') {
            return property.status === 'available';
          }
          
          if (filter === 'Pending') {
            return property.status === 'pending';
          }
          
          return true; // Default to including if filter is not recognized
        });
      });
    }
    
    // Apply sorting
    switch(sortOption) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'Newest First':
        filtered.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'Recommended':
      default:
        // Sort recommended properties first
        filtered.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));
        break;
    }
    
    console.log("Filtered properties count:", filtered.length);
    
    // Update state
    setFilteredProperties(filtered);
    setIsLoading(false);
  };

  // Toggle filtering section visibility
  const toggleFilteringSection = () => {
    setIsFilteringSectionVisible(!isFilteringSectionVisible);
  };

  // Toggle map visibility on mobile
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Toggle favorite status
  const toggleFavorite = useCallback((id: string | number) => {
    console.log("PropertyListPage toggleFavorite called with ID:", id);
    
    if (!isAuthenticated) {
      // Show toast notification if user is not logged in
      toast.info("Please login to save properties to your favorites", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Optionally, navigate to login page
      // navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    // Use functional updates to ensure we're working with the latest state
    setProperties(prevProperties => {
      return prevProperties.map(property => {
        if (property.id === id) {
          console.log("Found matching property to toggle favorite:", property.id);
          return { ...property, isFavorite: !property.isFavorite };
        }
        return property;
      });
    });
    
    setFilteredProperties(prevFilteredProperties => {
      return prevFilteredProperties.map(property => {
        if (property.id === id) {
          console.log("Found matching filtered property to toggle favorite:", property.id);
          return { ...property, isFavorite: !property.isFavorite };
        }
        return property;
      });
    });
    
    // Here you would also update the favorite status in your backend
    // If authenticated, call your API to save the favorite status
    if (isAuthenticated) {
      // Example API call (replace with your actual implementation)
      // saveFavoriteStatus(id, isFavorite);
      console.log("Saving favorite status to backend for property ID:", id);
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Scroll to top when changing page
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Pagination controls
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Custom AppliedFilterBanner component that includes remove functionality
  const FilterBadge = ({ label, onRemove }: { label: string; onRemove: () => void }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onRemove();
    };

    return (
      <div className="filter-badge">
        <AppliedFilterBannerComponent label={label} />
        <button 
          className="remove-icon" 
          onClick={handleClick}
          aria-label={`Remove ${label} filter`}
        >
          ×
        </button>
      </div>
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setIsLoading(true);
    setActiveFilters([]);
    setLocationInput('');
    setDateInput('');
    setGenderInput('');
    
    // Apply filtering after state update with short delay
    setTimeout(() => handleAdvancedFiltering(), 10);
  };

  return (
    <PropertyList>
      <div className="main-content" ref={scrollRef}>
        {!isFilteringSectionVisible ? (
          <div className="content-container">
            <div className="search-form">
              <SearchFilterBar 
                onLocationChange={handleLocationChange}
                onDateChange={handleDateChange}
                onGenderChange={handleGenderChange}
                onSearch={handleSearch}
                onAdvancedFilteringClick={toggleFilteringSection}
                location={locationInput}
                date={dateInput}
                gender={genderInput}
              />
            </div>

            <div className="search-results-container">
              <div className="filters-container">
                <div className="text-select">
                  <div className="text">
                    <div className="title">
                      Renting flats, houses and rooms 
                    </div>
                    <div className="sub-title">
                      {filteredProperties.length} amazing {filteredProperties.length === 1 ? 'listing' : 'listings'} {filteredProperties.length === 1 ? 'is' : 'are'} waiting for new tenants
                    </div>
                  </div>

                  <div className="select-container">
                    <SelectFieldBaseModelVariant2 
                      options={sortOptions}
                      placeholder="Sort by" 
                      onChange={handleSortChange}
                    />
                  </div>
                </div>

                {activeFilters.length > 0 && (
                  <div className="applied-filters">
                    {activeFilters.map((filter, index) => (
                      <FilterBadge
                        key={index} 
                        label={filter}
                        onRemove={() => toggleFilter(filter)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Finding the perfect properties for you...</p>
                </div>
              ) : filteredProperties.length > 0 ? (
                <>
                  <div className="results-container">
                    {currentProperties.map((property) => {
                      // Ensure property ID is properly handled
                      const propertyKey = property.id.toString();
                      
                      return (
                        <div 
                          className="result" 
                          key={propertyKey}
                        >
                          <EnhancedPropertyCard 
                            property={property} 
                            onToggleFavorite={toggleFavorite} 
                          />
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      <button 
                        className="page-button arrow" 
                        onClick={prevPage}
                        disabled={currentPage === 1}
                      >
                        ←
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button 
                        className="page-button arrow" 
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                      >
                        →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🏠</div>
                  <h3>No properties found</h3>
                  <p>Try adjusting your search filters or explore our featured properties</p>
                  <button onClick={clearAllFilters}>
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <FilteringSection 
            onApplyFilters={handleApplyFilters}
            activeFilters={activeFilters}
            onToggleFilter={toggleFilter}
            location={locationInput}
            date={dateInput}
            gender={genderInput}
            onLocationChange={handleLocationChange}
            onDateChange={handleDateChange}
            onGenderChange={handleGenderChange}
          />
        )}
      </div>

      <PropertyMap 
        selectedProperty={null} 
        showMap={showMap}
        properties={filteredProperties} 
      />

      <button className="toggle-map-button" onClick={toggleMap}>
        <IoMap />
        {showMap ? 'Hide Map' : 'Show Map'}
      </button>
    </PropertyList>
  )
}