import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaChevronRight, FaBed, FaCouch, FaTable, FaChair, FaDesktop } from 'react-icons/fa';
import { BiCloset, BiCabinet } from 'react-icons/bi';
import { MdTableRestaurant, MdOutlineCoffee, MdWaterDrop, MdOutlineLocalLaundryService, MdOutlineKitchen, MdOutlineMicrowave } from 'react-icons/md';
import { RiWaterFlashFill, RiWifiFill } from 'react-icons/ri';
import { BsFillLightningFill } from 'react-icons/bs';
import { ImWoman } from 'react-icons/im';
import { Theme } from '../../../../../theme/theme';
import { submitPropertyEditRequest } from '../../../../../backend/server-actions/PropertyEditRequestServerActions';
import { getPropertyById } from '../../../../../backend/server-actions/PropertyServerActions';
import { PropertyEditRequestPageStyle } from './styles';
import PropertyExamplePic from '../../../../../assets/images/propertyExamplePic.png';
import NeedHelpCardComponent from '../../../../../components/skeletons/cards/need-help-card';
// Amenities options with icons
const AMENITIES_OPTIONS = [
  { id: 'furnished', label: 'Furnished', icon: <FaBed style={{ color: Theme.colors.secondary }} /> },
  { id: 'sofabed', label: 'Sofabed', icon: <FaCouch style={{ color: Theme.colors.secondary }} /> },
  { id: 'dining-table', label: 'Dining Table', icon: <MdTableRestaurant style={{ color: Theme.colors.secondary }} /> },
  { id: 'wardrobe', label: 'Wardrobe', icon: <BiCloset style={{ color: Theme.colors.secondary }} /> },
  { id: 'cabinet', label: 'Cabinet', icon: <BiCabinet style={{ color: Theme.colors.secondary }} /> },
  { id: 'chair', label: 'Chair', icon: <FaChair style={{ color: Theme.colors.secondary }} /> },
  { id: 'desk', label: 'Desk', icon: <FaDesktop style={{ color: Theme.colors.secondary }} /> },
  { id: 'sofa', label: 'Sofa', icon: <FaCouch style={{ color: Theme.colors.secondary }} /> },
  { id: 'coffee-table', label: 'Coffee Table', icon: <MdOutlineCoffee style={{ color: Theme.colors.secondary }} /> },
  { id: 'dresser', label: 'Dresser', icon: <FaTable style={{ color: Theme.colors.secondary }} /> },
  { id: 'mirror', label: 'Mirror', icon: <BiCloset style={{ color: Theme.colors.secondary }} /> },
  { id: 'walk-in-closet', label: 'Walk-in Closet', icon: <BiCloset style={{ color: Theme.colors.secondary }} /> },
  { id: 'oven', label: 'Oven', icon: <MdOutlineKitchen style={{ color: Theme.colors.secondary }} /> },
  { id: 'washing-machine', label: 'Washing Machine', icon: <MdOutlineLocalLaundryService style={{ color: Theme.colors.secondary }} /> },
  { id: 'hotplate-cooktop', label: 'Hotplate/Cooktop', icon: <MdOutlineMicrowave style={{ color: Theme.colors.secondary }} /> },
  { id: 'water-heater', label: 'Water Heater', icon: <MdWaterDrop style={{ color: Theme.colors.secondary }} /> }
];

// Fees options with icons
const FEES_OPTIONS = [
  { id: 'water', label: 'Water', icon: <RiWaterFlashFill style={{ color: Theme.colors.secondary }} /> },
  { id: 'electricity', label: 'Electricity', icon: <BsFillLightningFill style={{ color: Theme.colors.secondary }} /> },
  { id: 'wifi', label: 'Wi-Fi', icon: <RiWifiFill style={{ color: Theme.colors.secondary }} /> },
  { id: 'women-only', label: 'Women Only', icon: <ImWoman style={{ color: Theme.colors.secondary }} /> }
];

export interface EditRequestFormData {
  propertyId: string;
  additionalAmenities: string[];
  features: string[];
  additionalComments: string;
}

const PropertyEditRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams<{ propertyId: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [additionalAmenities, setAdditionalAmenities] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [additionalComments, setAdditionalComments] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load property details
  useEffect(() => {
    const loadProperty = async () => {
      if (!propertyId) {
        setError('No property ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const property = await getPropertyById(propertyId);
        if (property) {
          setPropertyTitle(property.title || 'Apartment - flat in the center of Agadir');
          setPropertyLocation(`${property.address?.city || 'Agadir'}, ${property.address?.country || 'Morocco'}`);
          
          // Set existing amenities from property data
          if (property.amenities && Array.isArray(property.amenities)) {
            setAdditionalAmenities(property.amenities);
          }
          
          // Set existing included fees from property data
          if (property.features && Array.isArray(property.features)) {
            setFeatures(property.features);
          }
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError('Failed to load property details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  const handleAmenityChange = (amenityId: string) => {
    setAdditionalAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(a => a !== amenityId) 
        : [...prev, amenityId]
    );
  };

  const handleFeeChange = (feeId: string) => {
    setFeatures(prev => 
      prev.includes(feeId) 
        ? prev.filter(f => f !== feeId) 
        : [...prev, feeId]
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting || !propertyId) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const formData: EditRequestFormData & { propertyTitle: string } = {
        propertyId,
        propertyTitle,
        additionalAmenities,
        features, 
        additionalComments
      };
      
      await submitPropertyEditRequest(formData);
      
      // Show success message and navigate back to properties page
      alert('Edit request submitted successfully!');
      navigate('/dashboard/advertiser/properties');
    } catch (error) {
      console.error('Error submitting edit request:', error);
      setError('Failed to submit edit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/advertiser/properties');
  };

  return (
    <PropertyEditRequestPageStyle>
      <div className="header">
        
        <h1>Ask for Edit</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">Loading property details...</div>
      ) : (
        <div className="content">
          <div className="form-container">
            <div className="form-section">
              <h3>Additional Amenities</h3>
              <div className="checkbox-grid">
                {AMENITIES_OPTIONS.map(amenity => (
                  <label key={amenity.id} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={additionalAmenities.includes(amenity.id)}
                      onChange={() => handleAmenityChange(amenity.id)}
                    />
                    <div className="amenity-icon">{amenity.icon}</div>
                    <span className="amenity-text">{amenity.label}</span>
                    <span className="checkbox-square"></span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-section">
              <h3>Other</h3>
              <div className="checkbox-grid">
                {FEES_OPTIONS.map(fee => (
                  <label key={fee.id} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={features.includes(fee.id)}
                      onChange={() => handleFeeChange(fee.id)}
                    />
                    <div className="amenity-icon">{fee.icon}</div>
                    <span className="amenity-text">{fee.label}</span>
                    <span className="checkbox-square"></span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-section">
              <h3>Any additional comments</h3>
              <textarea 
                placeholder="Tell us more details that you would like to change."
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                rows={5}
              />
            </div>
            
            <div className="button-container">
            <button className="back-button" onClick={handleCancel}>
                <FaArrowLeft /> Back
              </button>
              <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={isSubmitting || (additionalAmenities.length === 0 && features.length === 0 && !additionalComments.trim())}
              >
                Submit Request
              </button>
            </div>
          </div>
          
          <div className="property-info">
            <div className="property-image">
              <img src={PropertyExamplePic} alt={propertyTitle} />
            </div>
            <div className="property-title">
              Apartment - flat in the center of Agadir
            </div>
            <div className="property-location">
              John Kennedy St, 23, Apt 2, G23A5, Agadir, Morocco
            </div>
            <div className="property-details">
              <div className="detail">Apartment</div>
              <div className="detail">2 People</div>
            </div>
            <NeedHelpCardComponent />
          </div>
        </div>
      )}
    </PropertyEditRequestPageStyle>
  );
};

export default PropertyEditRequestPage; 