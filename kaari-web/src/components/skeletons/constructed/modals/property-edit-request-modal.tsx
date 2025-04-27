import React, { useState, useRef, useEffect } from 'react';
import { ModalOverlayStyle, ConfirmationModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { FaTimes } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../buttons/white_LB60';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

interface PropertyEditRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: EditRequestFormData) => void;
  propertyTitle: string;
  propertyId: string;
}

export interface EditRequestFormData {
  propertyId: string;
  additionalAmenities: string[];
  features: string[];
  additionalComments: string;
}

// Amenities options
const AMENITIES_OPTIONS = [
  'Furnished', 'Sofabed', 'Dining Table', 'Wardrobe', 
  'Cabinet', 'Chair', 'Desk', 'Sofa', 
  'Coffee Table', 'Dresser', 'Mirror', 'Walk-in Closet', 
  'Oven', 'Washing Machine', 'Hotplate/Cooktop', 'Water Heater'
];

// Features options (previously Fees)
const FEATURES_OPTIONS = [
  'Water', 'Electricity', 'Wi-Fi', 'Women Only'
];

export const PropertyEditRequestModal: React.FC<PropertyEditRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  propertyTitle,
  propertyId
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [additionalAmenities, setAdditionalAmenities] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [additionalComments, setAdditionalComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleAmenityChange = (amenity: string) => {
    setAdditionalAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };

  const handleFeatureChange = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature) 
        : [...prev, feature]
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const formData: EditRequestFormData = {
        propertyId,
        additionalAmenities,
        features, 
        additionalComments
      };
      
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting edit request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlayStyle>
      <EditRequestModalStyle ref={modalRef}>
        <div className="modal-header">
          <h2>Ask for Edit</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="property-title">
            {propertyTitle}
          </div>
          
          <div className="form-section">
            <h3>Additional Amenities</h3>
            <div className="checkbox-grid">
              {AMENITIES_OPTIONS.map(amenity => (
                <label key={amenity} className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={additionalAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span className="amenity-icon"></span>
                  <span className="amenity-text">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-section">
            <h3>Included Features</h3>
            <div className="checkbox-grid">
              {FEATURES_OPTIONS.map(feature => (
                <label key={feature} className="checkbox-item">
                  <input 
                    type="checkbox" 
                    checked={features.includes(feature)}
                    onChange={() => handleFeatureChange(feature)}
                  />
                  <span className="amenity-icon"></span>
                  <span className="amenity-text">{feature}</span>
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
            <WhiteButtonLB60 
              text="Cancel" 
              onClick={onClose} 
              disabled={isSubmitting}
            />
            <PurpleButtonLB60 
              text={isSubmitting ? "Submitting..." : "Submit Request"} 
              onClick={handleSubmit}
              disabled={isSubmitting || (additionalAmenities.length === 0 && features.length === 0 && !additionalComments.trim())}
            />
          </div>
        </div>
      </EditRequestModalStyle>
    </ModalOverlayStyle>
  );
};

const EditRequestModalStyle = styled(ConfirmationModalStyle)`
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid ${Theme.colors.fifth};
    
    h2 {
      font: ${Theme.typography.fonts.h4};
      color: ${Theme.colors.secondary};
      margin: 0;
    }
  }
  
  .property-title {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.black};
    margin: 16px 0;
    padding: 8px 12px;
    background-color: ${Theme.colors.fifth};
    border-radius: 8px;
  }
  
  .form-section {
    margin-bottom: 24px;
    
    h3 {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      margin-bottom: 16px;
    }
    
    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
      
      .checkbox-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        
        input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        
        .amenity-icon {
          height: 20px;
          width: 20px;
          border: 2px solid ${Theme.colors.tertiary};
          border-radius: 4px;
          display: inline-block;
          position: relative;
          margin-right: 10px;
          
          &:after {
            content: "";
            position: absolute;
            display: none;
            left: 6px;
            top: 2px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        }
        
        input:checked ~ .amenity-icon {
          background-color: ${Theme.colors.secondary};
          border-color: ${Theme.colors.secondary};
          
          &:after {
            display: block;
          }
        }
        
        .amenity-text {
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.black};
        }
      }
    }
    
    textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid ${Theme.colors.tertiary};
      border-radius: 8px;
      resize: vertical;
      font: ${Theme.typography.fonts.mediumM};
      
      &:focus {
        outline: none;
        border-color: ${Theme.colors.secondary};
      }
    }
  }
  
  .button-container {
    display: flex;
    gap: 16px;
    margin-top: 24px;
    
    button {
      flex: 1;
    }
  }
`;

export default PropertyEditRequestModal; 