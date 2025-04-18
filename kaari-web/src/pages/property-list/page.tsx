import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { IoFilter, IoMap, IoHome, IoSearch, IoClose, IoHeartOutline, IoHeart } from 'react-icons/io5';
import { FaBed, FaBath, FaRulerCombined, FaStar } from 'react-icons/fa';
import { AppliedFilterBannerComponent } from "../../components/skeletons/banners/static/applied-filter-banner";
import { PurpleButtonMB48 } from "../../components/skeletons/buttons/purple_MB48"
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import SearchBarModel from "../../components/skeletons/inputs/search-bars/search-bar-variant"
import SelectFieldBaseModelVariant2 from "../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2"
import { PropertyList } from "./styles"
import { FilterModal } from "../../components/skeletons/constructed/modals/filter-modal";

import ExamplePic from '../../assets/images/propertyExamplePic.png'
import UnifiedHeader from "../../components/skeletons/constructed/headers/unified-header";

// Define property type
interface PropertyType {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  minstay: string;
  priceType: string;
  description: string;
  isRecommended: boolean;
  image: string;
  location: { lat: number; lng: number };
  bedrooms: number;
  bathrooms: number;
  type: string;
  area: string;
  isFavorite?: boolean;
}

// Define sort option type 
type SortOptionType = string;

// Filter type definition
interface FilterType {
  id: string;
  label: string;
  category: 'bedrooms' | 'price' | 'amenities' | 'other';
}

// Sample property data
const allProperties: PropertyType[] = [
  {
    id: 1,
          title: "Luxury Villa",
    subtitle: "Oceanfront view",
          price: "$2,500",
          minstay: 'Min.stay (30 days)',
          priceType: "per night",
          description: "Deposit 3000$",
          isRecommended: true,
    image: ExamplePic,
    location: { lat: 33.589886, lng: -7.603869 },
    bedrooms: 3,
    bathrooms: 2,
    type: "Villa",
    area: "200 m²",
    isFavorite: false
  },
  {
    id: 2,
          title: "Cozy Cabin",
    subtitle: "Mountain retreat",
          price: "$300",
          priceType: "per night",
          minstay: 'Min.stay (30 days)',
          description: "Deposit 3000$",
          isRecommended: false,
    image: ExamplePic,
    location: { lat: 33.597496, lng: -7.613656 },
    bedrooms: 1,
    bathrooms: 1,
    type: "Cabin",
    area: "80 m²",
    isFavorite: false
  },
  {
    id: 3,
          title: "Downtown Apartment",
    subtitle: "Heart of the city",
          price: "$1,800",
          minstay: 'Min.stay (30 days)',
          priceType: "per month",
          description: "Deposit 3000$",
          isRecommended: true,
    image: ExamplePic,
    location: { lat: 33.582735, lng: -7.632924 },
    bedrooms: 2,
    bathrooms: 1,
    type: "Apartment",
    area: "120 m²",
    isFavorite: true
  },
  {
    id: 4,
          title: "Beach House",
    subtitle: "Steps from the sand",
          price: "$3,000",
          priceType: "per week",
          minstay: 'Min.stay (30 days)',
          description: "Deposit 3000$",
          isRecommended: true,
    image: ExamplePic,
    location: { lat: 33.604086, lng: -7.632283 },
    bedrooms: 4,
    bathrooms: 3,
    type: "House",
    area: "250 m²",
    isFavorite: false
  },
  {
    id: 5,
          title: "Suburban Home",
    subtitle: "Quiet neighborhood",
          price: "$2,200",
          priceType: "per month",
          minstay: 'Min.stay (30 days)',
          description: "Deposit 3000$",
          isRecommended: false,
    image: ExamplePic,
    location: { lat: 33.575168, lng: -7.649405 },
    bedrooms: 3,
    bathrooms: 2,
    type: "House",
    area: "180 m²",
    isFavorite: false
  },
  {
    id: 6,
          title: "Penthouse Suite",
    subtitle: "Skyline views",
          price: "$5,500",
          priceType: "per month",
          minstay: 'Min.stay (30 days)',
          description: "Deposit 3000$",
          isRecommended: true,
    image: ExamplePic,
    location: { lat: 33.592256, lng: -7.618787 },
    bedrooms: 3,
    bathrooms: 2,
    type: "Apartment",
    area: "220 m²",
    isFavorite: true
  },
  {
    id: 7,
    title: "Compact Studio",
    subtitle: "Perfect for students",
    price: "$900",
    priceType: "per month",
    minstay: 'Min.stay (30 days)',
    description: "Deposit 1500$",
    isRecommended: false,
    image: ExamplePic,
    location: { lat: 33.585632, lng: -7.638341 },
    bedrooms: 1,
    bathrooms: 1,
    type: "Studio",
    area: "40 m²",
    isFavorite: false
  },
  {
    id: 8,
    title: "Modern Loft",
    subtitle: "Industrial style",
    price: "$2,800",
    priceType: "per month",
    minstay: 'Min.stay (30 days)',
    description: "Deposit 4000$",
    isRecommended: true,
    image: ExamplePic,
    location: { lat: 33.599326, lng: -7.625691 },
    bedrooms: 2,
    bathrooms: 2,
    type: "Loft",
    area: "150 m²",
    isFavorite: false
  }
];

// Available filters
const availableFilters: FilterType[] = [
  { id: 'bed-1', label: '1 Bedroom', category: 'bedrooms' },
  { id: 'bed-2', label: '2 Bedrooms', category: 'bedrooms' },
  { id: 'bed-3', label: '3+ Bedrooms', category: 'bedrooms' },
  { id: 'price-low', label: '$0-$1000', category: 'price' },
  { id: 'price-mid', label: '$1000-$3000', category: 'price' },
  { id: 'price-high', label: '$3000+', category: 'price' },
  { id: 'furnished', label: 'Furnished', category: 'amenities' },
  { id: 'pets', label: 'Pets Allowed', category: 'amenities' },
  { id: 'parking', label: 'Parking', category: 'amenities' },
  { id: 'people-2', label: '2 People', category: 'other' },
  { id: 'price-range', label: '1500 to 4000', category: 'price' }
];

// Sort options
const sortOptions: SortOptionType[] = [
  'Recommended',
  'Price: Low to High',
  'Price: High to Low',
  'Newest First'
];

export default function PropertyListPage() {
  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const filterModalRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [properties, setProperties] = useState<PropertyType[]>(allProperties);
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>(allProperties);
  const [activeFilters, setActiveFilters] = useState<string[]>(['2 Bedrooms', '2 People', '1500 to 4000', 'Furnished']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('Recommended');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showMap, setShowMap] = useState<boolean>(window.innerWidth > 992);
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const propertiesPerPage = 6;

  // Filter properties based on search query and filters
  useEffect(() => {
    // Simulate loading state
    setIsLoading(true);
    
    // Delay for a realistic filtering experience
    const filterTimer = setTimeout(() => {
      let filtered = [...properties];
      
      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(
          property => 
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply sorting
      switch(sortOption) {
        case 'Price: Low to High':
          filtered.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
          break;
        case 'Price: High to Low':
          filtered.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
          break;
        case 'Newest First':
          filtered.sort((a, b) => b.id - a.id);
          break;
        case 'Recommended':
        default:
          filtered.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));
          break;
      }
      
      setFilteredProperties(filtered);
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(filterTimer);
  }, [searchQuery, properties, sortOption]);

  // Handle clicks outside filter modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterModalRef.current && !filterModalRef.current.contains(event.target as Node)) {
        setIsFilterModalOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle sort option change
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  // Handle filter toggle
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Handle advanced filtering button click
  const handleAdvancedFiltering = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  // Handle property selection on the map
  const handlePropertySelect = (property: PropertyType) => {
    setSelectedProperty(property);
  };

  // Toggle map visibility on mobile
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setProperties(properties.map(property => 
      property.id === id 
        ? { ...property, isFavorite: !property.isFavorite } 
        : property
    ));
  };

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
    return (
      <div className="filter-badge" onClick={onRemove}>
        <AppliedFilterBannerComponent label={label} />
        <span className="remove-icon">×</span>
      </div>
    );
  };

  // Enhanced property card with additional features
  const EnhancedPropertyCard = (property: PropertyType) => {
    return (
      <div className="property-card-wrapper">
        {property.isRecommended && (
          <div className="recommended-badge">
            <FaStar /> Recommended by Kaari
          </div>
        )}
        <PropertyCard 
          image={property.image}
          title={property.title}
          subtitle={property.subtitle}
          minstay={property.minstay}
          price={property.price}
          priceType={property.priceType}
          description={property.description}
          isRecommended={false}
          isFavorite={property.isFavorite}
          onToggleFavorite={toggleFavorite}
          id={property.id}
        />
        <div className="property-details">
          <div className="detail">
            <FaBed /> {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
          </div>
          <div className="detail">
            <FaBath /> {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
          </div>
          <div className="detail">
            <FaRulerCombined /> {property.area}
          </div>
        </div>
      </div>
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  return (
    <PropertyList>
      <UnifiedHeader variant="white" userType="user" />
      <div className="main-content" ref={scrollRef}>
            <div className="search-form">
          <div className="search-input-wrapper">
            <IoSearch className="search-icon" />
            <SearchBarModel 
              placeholder="Search by location, property type, or features" 
              onChange={handleSearch}
              value={searchQuery}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <IoClose />
              </button>
            )}
          </div>
          <PurpleButtonMB48 
            text="Advanced filtering"
            onClick={handleAdvancedFiltering}
          />
          <button className="filter-icon-button" onClick={handleAdvancedFiltering}>
            <IoFilter />
          </button>
            </div>

        <FilterModal 
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          clearFilters={clearAllFilters}
          availableFilters={availableFilters}
        />

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
                {currentProperties.map((property) => (
                  <div 
                    className="result" 
                    key={property.id}
                    onMouseEnter={() => handlePropertySelect(property)}
                    onMouseLeave={() => setSelectedProperty(null)}
                  >
                    <EnhancedPropertyCard {...property} />
                    </div>
                ))}
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
              <button onClick={() => { setSearchQuery(''); setActiveFilters([]); }}>
                Clear all filters
              </button>
            </div>
          )}
                </div>
            </div>

      <div className={`map ${showMap ? 'active' : ''}`}>
        {/* Map placeholder - would be replaced with an actual map component */}
        <div className="map-placeholder">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
          </svg>
          <span>Interactive map would be displayed here</span>
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

        {selectedProperty && (
          <div className="property-popup" style={{ 
            left: `50%`, 
            top: `50%` 
          }}>
            <img 
              src={selectedProperty.image} 
              alt={selectedProperty.title} 
              className="popup-image" 
            />
            <div className="popup-content">
              <div className="popup-title">{selectedProperty.title}</div>
              <div className="popup-price">
                {selectedProperty.price}<span style={{ fontSize: '12px', fontWeight: 'normal' }}>{selectedProperty.priceType}</span>
              </div>
              <div className="popup-details">
                <div className="detail-item">
                  <FaBed />
                  {selectedProperty.bedrooms} bd
                </div>
                <div className="detail-item">
                  <FaBath />
                  {selectedProperty.bathrooms} ba
                </div>
                <div className="detail-item">
                  <FaRulerCombined />
                  {selectedProperty.area}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <button className="toggle-map-button" onClick={toggleMap}>
        <IoMap />
        {showMap ? 'Hide Map' : 'Show Map'}
      </button>
    </PropertyList>
  )
}