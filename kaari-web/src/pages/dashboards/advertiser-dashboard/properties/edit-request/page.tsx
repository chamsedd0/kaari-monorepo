import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaChevronRight, FaBed, FaCouch, FaTable, FaChair, FaDesktop, FaPaw, FaSmoking, FaParking, FaSwimmingPool, FaWheelchair } from 'react-icons/fa';
import { BiCloset, BiCabinet, BiWind } from 'react-icons/bi';
import { MdTableRestaurant, MdOutlineCoffee, MdWaterDrop, MdOutlineLocalLaundryService, MdOutlineKitchen, MdOutlineMicrowave, MdOutlineBalcony, MdOutlineFireplace, MdOutlineBathtub, MdOutlineHeatPump } from 'react-icons/md';
import { RiWaterFlashFill, RiWifiFill, RiParkingBoxLine } from 'react-icons/ri';
import { BsFillLightningFill } from 'react-icons/bs';
import { ImWoman } from 'react-icons/im';
import { TbAirConditioning, TbWood } from 'react-icons/tb';
import { GiHeatHaze } from 'react-icons/gi';
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
  
  // Amenities options with icons and translations - updated to match the new structure
  const AMENITIES_OPTIONS = [
    { id: 'desk', label: t('advertiser_dashboard.properties.amenities.desk'), icon: <FaDesktop style={{ color: Theme.colors.secondary }} /> },
    { id: 'cabinet', label: t('advertiser_dashboard.properties.amenities.cabinet'), icon: <BiCabinet style={{ color: Theme.colors.secondary }} /> },
    { id: 'dining-table', label: t('advertiser_dashboard.properties.amenities.dining_table'), icon: <MdTableRestaurant style={{ color: Theme.colors.secondary }} /> },
    { id: 'wardrobe', label: t('advertiser_dashboard.properties.amenities.wardrobe'), icon: <BiCloset style={{ color: Theme.colors.secondary }} /> },
    { id: 'chair', label: t('advertiser_dashboard.properties.amenities.chair'), icon: <FaChair style={{ color: Theme.colors.secondary }} /> },
    { id: 'sofa', label: t('advertiser_dashboard.properties.amenities.sofa'), icon: <FaCouch style={{ color: Theme.colors.secondary }} /> },
    { id: 'dresser', label: t('advertiser_dashboard.properties.amenities.dresser'), icon: <BiCabinet style={{ color: Theme.colors.secondary }} /> },
    { id: 'walk-in-closet', label: t('advertiser_dashboard.properties.amenities.walk_in_closet'), icon: <BiCloset style={{ color: Theme.colors.secondary }} /> },
    { id: 'oven', label: t('advertiser_dashboard.properties.amenities.oven'), icon: <MdOutlineKitchen style={{ color: Theme.colors.secondary }} /> },
    { id: 'hotplate-cooktop', label: t('advertiser_dashboard.properties.amenities.hotplate_cooktop'), icon: <MdOutlineKitchen style={{ color: Theme.colors.secondary }} /> },
    { id: 'mirror', label: t('advertiser_dashboard.properties.amenities.mirror'), icon: <BiCloset style={{ color: Theme.colors.secondary }} /> },
    { id: 'washing-machine', label: t('advertiser_dashboard.properties.amenities.washing_machine'), icon: <MdOutlineLocalLaundryService style={{ color: Theme.colors.secondary }} /> },
    { id: 'gym', label: t('advertiser_dashboard.properties.amenities.gym'), icon: <FaDesktop style={{ color: Theme.colors.secondary }} /> },
  ];

  // Features options with icons and translations - updated to match the new structure
  const FEATURES_OPTIONS = [
    { id: 'water', label: t('common.water'), icon: <RiWaterFlashFill style={{ color: Theme.colors.secondary }} /> },
    { id: 'electricity', label: t('common.electricity'), icon: <BsFillLightningFill style={{ color: Theme.colors.secondary }} /> },
    { id: 'wifi', label: t('common.wifi'), icon: <RiWifiFill style={{ color: Theme.colors.secondary }} /> },
    { id: 'gas', label: t('common.gas'), icon: <BsFillLightningFill style={{ color: Theme.colors.secondary }} /> },
    { id: 'balcony', label: t('property_features.balcony'), icon: <MdOutlineBalcony style={{ color: Theme.colors.secondary }} /> },
    { id: 'central-heating', label: t('property_features.central_heating'), icon: <GiHeatHaze style={{ color: Theme.colors.secondary }} /> },
    { id: 'parking-space', label: t('property_features.parking_space'), icon: <RiParkingBoxLine style={{ color: Theme.colors.secondary }} /> },
    { id: 'air-conditioning', label: t('property_features.air_conditioning'), icon: <TbAirConditioning style={{ color: Theme.colors.secondary }} /> },
    { id: 'wooden-floors', label: t('property_features.wooden_floors'), icon: <TbWood style={{ color: Theme.colors.secondary }} /> },
    { id: 'elevator', label: t('property_features.elevator'), icon: <FaWheelchair style={{ color: Theme.colors.secondary }} /> },
    { id: 'swimming-pool', label: t('property_features.swimming_pool'), icon: <FaSwimmingPool style={{ color: Theme.colors.secondary }} /> },
    { id: 'fireplace', label: t('property_features.fireplace'), icon: <MdOutlineFireplace style={{ color: Theme.colors.secondary }} /> },
    { id: 'accessible', label: t('property_features.accessible'), icon: <FaWheelchair style={{ color: Theme.colors.secondary }} /> },
  ];
  
  // Housing preference options
  const HOUSING_PREFERENCES = [
    { id: 'womenOnly', label: t('common.women_only'), icon: <ImWoman style={{ color: Theme.colors.secondary }} /> },
    { id: 'familiesOnly', label: t('common.families_only'), icon: <FaDesktop style={{ color: Theme.colors.secondary }} /> }
  ];
  
  // Rules options
  const RULES_OPTIONS = [
    { id: 'petsAllowed', label: t('common.pets_allowed'), icon: <FaPaw style={{ color: Theme.colors.secondary }} /> },
    { id: 'smokingAllowed', label: t('common.smoking_allowed'), icon: <FaSmoking style={{ color: Theme.colors.secondary }} /> }
  ];
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [additionalAmenities, setAdditionalAmenities] = useState<string[]>([]);
  const [includedFeatures, setIncludedFeatures] = useState<string[]>([]);
  const [housingPreference, setHousingPreference] = useState<string>('');
  const [propertyRules, setPropertyRules] = useState<string[]>([]);
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
          
          // Format location from address components
          const address = property.address || {};
          const locationParts = [
            address.city,
            address.state,
            address.country
          ].filter(Boolean);
          setPropertyLocation(locationParts.join(', '));
          
          // Set existing amenities from property data
          if (property.amenities && Array.isArray(property.amenities)) {
            setAdditionalAmenities(property.amenities);
          }
          
          // Set existing features from property data
          if (property.features && Array.isArray(property.features)) {
            setIncludedFeatures(property.features);
          }
          
          // Set housing preference if available
          if (property.housingPreference) {
            setHousingPreference(property.housingPreference);
          }
          
          // Set rules based on boolean properties
          const rules: string[] = [];
          if (property.petsAllowed) rules.push('petsAllowed');
          if (property.smokingAllowed) rules.push('smokingAllowed');
          setPropertyRules(rules);
          
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

  const handleFeatureChange = (featureId: string) => {
    setIncludedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(f => f !== featureId) 
        : [...prev, featureId]
    );
  };
  
  const handleHousingPreferenceChange = (preferenceId: string) => {
    // Only allow one housing preference at a time
    setHousingPreference(prev => prev === preferenceId ? '' : preferenceId);
  };
  
  const handleRuleChange = (ruleId: string) => {
    setPropertyRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(r => r !== ruleId) 
        : [...prev, ruleId]
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
        includedFees: includedFeatures, // Map to the expected field in the API
        additionalComments
      };
      
      // Add housing preference and rules to additional comments if selected
      if (housingPreference || propertyRules.length > 0) {
        const preferences = [];
        if (housingPreference) {
          preferences.push(`Housing Preference: ${housingPreference}`);
        }
        if (propertyRules.length > 0) {
          preferences.push(`Rules: ${propertyRules.join(', ')}`);
        }
        
        if (preferences.length > 0) {
          formData.additionalComments = [
            formData.additionalComments,
            ...preferences
          ].filter(Boolean).join('\n\n');
        }
      }
      
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
              <h3>{t('property_features.title')}</h3>
              <div className="checkbox-grid">
                {FEATURES_OPTIONS.map(feature => (
                  <label key={feature.id} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={includedFeatures.includes(feature.id)}
                      onChange={() => handleFeatureChange(feature.id)}
                    />
                    <div className="amenity-icon">{feature.icon}</div>
                    <span className="amenity-text">{feature.label}</span>
                    <span className="checkbox-square"></span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-section">
              <h3>{t('common.housing_preferences')}</h3>
              <div className="checkbox-grid">
                {HOUSING_PREFERENCES.map(preference => (
                  <label key={preference.id} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={housingPreference === preference.id}
                      onChange={() => handleHousingPreferenceChange(preference.id)}
                    />
                    <div className="amenity-icon">{preference.icon}</div>
                    <span className="amenity-text">{preference.label}</span>
                    <span className="checkbox-square"></span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-section">
              <h3>{t('common.allowed')}</h3>
              <div className="checkbox-grid">
                {RULES_OPTIONS.map(rule => (
                  <label key={rule.id} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={propertyRules.includes(rule.id)}
                      onChange={() => handleRuleChange(rule.id)}
                    />
                    <div className="amenity-icon">{rule.icon}</div>
                    <span className="amenity-text">{rule.label}</span>
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
                disabled={isSubmitting || (
                  additionalAmenities.length === 0 && 
                  includedFeatures.length === 0 && 
                  !housingPreference &&
                  propertyRules.length === 0 &&
                  !additionalComments.trim()
                )}
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