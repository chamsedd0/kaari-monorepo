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
import { useToastService } from '../../../../../services/ToastService';
import { useTranslation } from 'react-i18next';

export interface EditRequestFormData {
  propertyId: string;
  additionalAmenities: string[];
  includedFees: string[];
  additionalComments: string;
}

const PropertyEditRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams<{ propertyId: string }>();
  const toast = useToastService();
  const { t } = useTranslation();
  
  // Amenities options with icons and translations
  const AMENITIES_OPTIONS = [
    { id: 'furnished', label: t('common.furnished'), icon: <FaBed style={{ color: Theme.colors.secondary }} /> },
    { id: 'sofabed', label: t('advertiser_dashboard.properties.amenities.sofabed'), icon: <FaCouch style={{ color: Theme.colors.secondary }} /> },
    { id: 'dining-table', label: t('advertiser_dashboard.properties.amenities.dining_table'), icon: <MdTableRestaurant style={{ color: Theme.colors.secondary }} /> },
    { id: 'wardrobe', label: t('advertiser_dashboard.properties.amenities.wardrobe'), icon: <BiCloset style={{ color: Theme.colors.secondary }} /> },
    { id: 'cabinet', label: t('advertiser_dashboard.properties.amenities.cabinet'), icon: <BiCabinet style={{ color: Theme.colors.secondary }} /> },
    { id: 'chair', label: t('advertiser_dashboard.properties.amenities.chair'), icon: <FaChair style={{ color: Theme.colors.secondary }} /> },
    { id: 'desk', label: t('advertiser_dashboard.properties.amenities.desk'), icon: <FaDesktop style={{ color: Theme.colors.secondary }} /> },
    { id: 'sofa', label: t('advertiser_dashboard.properties.amenities.sofa'), icon: <FaCouch style={{ color: Theme.colors.secondary }} /> },
    { id: 'coffee-table', label: t('advertiser_dashboard.properties.amenities.coffee_table'), icon: <MdOutlineCoffee style={{ color: Theme.colors.secondary }} /> },
    { id: 'dresser', label: t('advertiser_dashboard.properties.amenities.dresser'), icon: <FaTable style={{ color: Theme.colors.secondary }} /> },
    { id: 'mirror', label: t('advertiser_dashboard.properties.amenities.mirror'), icon: <BiCloset style={{ color: Theme.colors.secondary }} /> },
    { id: 'walk-in-closet', label: t('advertiser_dashboard.properties.amenities.walk_in_closet'), icon: <BiCloset style={{ color: Theme.colors.secondary }} /> },
    { id: 'oven', label: t('advertiser_dashboard.properties.amenities.oven'), icon: <MdOutlineKitchen style={{ color: Theme.colors.secondary }} /> },
    { id: 'washing-machine', label: t('advertiser_dashboard.properties.amenities.washing_machine'), icon: <MdOutlineLocalLaundryService style={{ color: Theme.colors.secondary }} /> },
    { id: 'hotplate-cooktop', label: t('advertiser_dashboard.properties.amenities.hotplate'), icon: <MdOutlineMicrowave style={{ color: Theme.colors.secondary }} /> },
    { id: 'water-heater', label: t('advertiser_dashboard.properties.amenities.water_heater'), icon: <MdWaterDrop style={{ color: Theme.colors.secondary }} /> }
  ];

  // Fees options with icons and translations
  const FEES_OPTIONS = [
    { id: 'water', label: t('common.water'), icon: <RiWaterFlashFill style={{ color: Theme.colors.secondary }} /> },
    { id: 'electricity', label: t('common.electricity'), icon: <BsFillLightningFill style={{ color: Theme.colors.secondary }} /> },
    { id: 'wifi', label: t('common.wifi'), icon: <RiWifiFill style={{ color: Theme.colors.secondary }} /> },
    { id: 'women-only', label: t('common.women_only'), icon: <ImWoman style={{ color: Theme.colors.secondary }} /> }
  ];
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [additionalAmenities, setAdditionalAmenities] = useState<string[]>([]);
  const [includedFees, setIncludedFees] = useState<string[]>([]);
  const [additionalComments, setAdditionalComments] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load property details
  useEffect(() => {
    const loadProperty = async () => {
      if (!propertyId) {
        setError(t('advertiser_dashboard.properties.errors.no_property_id'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const property = await getPropertyById(propertyId);
        if (property) {
          setPropertyTitle(property.title || t('advertiser_dashboard.properties.default_apartment_title'));
          setPropertyLocation(`${property.address?.city || t('common.default_city')}, ${property.address?.country || t('common.default_country')}`);
          
          // Set existing amenities from property data
          if (property.amenities && Array.isArray(property.amenities)) {
            setAdditionalAmenities(property.amenities);
          }
          
          // Set existing included fees from property data
          if (property.features && Array.isArray(property.features)) {
            setIncludedFees(property.features);
          }
        } else {
          setError(t('advertiser_dashboard.properties.errors.property_not_found'));
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError(t('advertiser_dashboard.properties.errors.loading_failed'));
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [propertyId, t]);

  const handleAmenityChange = (amenityId: string) => {
    setAdditionalAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(a => a !== amenityId) 
        : [...prev, amenityId]
    );
  };

  const handleFeeChange = (feeId: string) => {
    setIncludedFees(prev => 
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
        includedFees, 
        additionalComments
      };
      
      await submitPropertyEditRequest(formData);
      
      // Show success toast
      toast.property.editRequestSuccess();
      
      // Navigate back to properties page
      navigate('/dashboard/advertiser/properties');
    } catch (error) {
      console.error('Error submitting edit request:', error);
      setError(t('advertiser_dashboard.properties.errors.submit_failed'));
      
      // Show error toast
      toast.property.updateError(t('advertiser_dashboard.properties.errors.submit_failed'));
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
        <h1>{t('advertiser_dashboard.properties.edit_request.title')}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">{t('advertiser_dashboard.properties.loading')}</div>
      ) : (
        <div className="content">
          <div className="form-container">
            <div className="form-section">
              <h3>{t('advertiser_dashboard.properties.edit_request.additional_amenities')}</h3>
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
              <h3>{t('advertiser_dashboard.properties.edit_request.other')}</h3>
              <div className="checkbox-grid">
                {FEES_OPTIONS.map(fee => (
                  <label key={fee.id} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={includedFees.includes(fee.id)}
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
              <h3>{t('advertiser_dashboard.properties.edit_request.additional_comments')}</h3>
              <textarea 
                placeholder={t('advertiser_dashboard.properties.edit_request.comments_placeholder')}
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                rows={5}
              />
            </div>
            
            <div className="button-container">
              <button className="back-button" onClick={handleCancel}>
                <FaArrowLeft /> {t('advertiser_dashboard.properties.edit_request.back')}
              </button>
              <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={isSubmitting || (additionalAmenities.length === 0 && includedFees.length === 0 && !additionalComments.trim())}
              >
                {t('advertiser_dashboard.properties.edit_request.submit_request')}
              </button>
            </div>
          </div>
          
          <div className="property-info">
            <div className="property-image">
              <img src={PropertyExamplePic} alt={propertyTitle} />
            </div>
            <div className="property-title">
              {propertyTitle}
            </div>
            <div className="property-location">
              {propertyLocation}
            </div>
            <div className="property-details">
              <div className="detail">{t('property_list.property_type.apartment')}</div>
              <div className="detail">{t('advertiser_dashboard.properties.people', { count: 2 })}</div>
            </div>
            <NeedHelpCardComponent />
          </div>
        </div>
      )}
    </PropertyEditRequestPageStyle>
  );
};

export default PropertyEditRequestPage; 