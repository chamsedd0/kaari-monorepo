import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { User, Property } from '../../backend/entities';
import { useCheckoutContext } from '../../contexts/checkout-process';

const ApplicationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  .section-title {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin-bottom: 1.5rem;
  }
  
  .property-summary {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    border-radius: ${Theme.borders.radius.md};
    background-color: ${Theme.colors.tertiary};
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
    
    .property-image {
      width: 200px;
      height: 150px;
      border-radius: ${Theme.borders.radius.md};
      object-fit: cover;
      
      @media (max-width: 768px) {
        width: 100%;
      }
    }
    
    .property-details {
      flex: 1;
      
      .property-title {
        font: ${Theme.typography.fonts.h5B};
        color: ${Theme.colors.black};
        margin-bottom: 0.5rem;
      }
      
      .property-address {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
        margin-bottom: 1rem;
      }
      
      .property-price {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.secondary};
        margin-bottom: 1rem;
      }
      
      .property-features {
        display: flex;
        gap: 1rem;
        
        .feature {
          font: ${Theme.typography.fonts.smallM};
          color: ${Theme.colors.gray2};
        }
      }
    }
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      label {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.black};
      }
      
      input, textarea, select {
        padding: 12px 16px;
        border: 1px solid ${Theme.colors.tertiary};
        border-radius: ${Theme.borders.radius.md};
        font: ${Theme.typography.fonts.mediumM};
        transition: border-color 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: ${Theme.colors.secondary};
        }
      }
      
      textarea {
        min-height: 120px;
        resize: vertical;
      }
      
      &.form-row {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        
        @media (max-width: 768px) {
          flex-direction: column;
        }
        
        .form-group {
          flex: 1;
        }
      }
    }
  }
  
  .error-message {
    color: ${Theme.colors.error};
    font: ${Theme.typography.fonts.smallM};
    margin-top: 0.5rem;
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    
    .next-button {
      background-color: ${Theme.colors.secondary};
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: ${Theme.borders.radius.md};
      font: ${Theme.typography.fonts.mediumB};
      cursor: pointer;
      transition: background-color 0.3s ease;
      
      &:hover {
        background-color: ${Theme.colors.primary};
      }
      
      &:disabled {
        background-color: ${Theme.colors.tertiary};
        color: ${Theme.colors.gray2};
        cursor: not-allowed;
      }
    }
  }
`;

interface RentalApplicationProps {
  userData: User;
  propertyData: Property;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  movingDate: string;
  visitDate: string;
  message: string;
}

const RentalApplication: React.FC<RentalApplicationProps> = ({ userData, propertyData }) => {
  const { navigateToPaymentMethod } = useCheckoutContext();
  
  // Initialize form with user data
  const [formData, setFormData] = useState<FormData>(() => {
    // Try to get saved data from localStorage
    const savedData = localStorage.getItem('rentalApplicationData');
    const defaultData = {
      fullName: `${userData.name} ${userData.surname || ''}`.trim(),
      email: userData.email,
      phoneNumber: userData.phoneNumber || '',
      movingDate: '',
      visitDate: '',
      message: ''
    };
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        return {
          ...defaultData,
          ...parsedData
        };
      } catch (e) {
        console.error('Error parsing saved rental data:', e);
      }
    }
    
    return defaultData;
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when the user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.visitDate) {
      newErrors.visitDate = 'Visit date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If validation passes, save the form data to the context and proceed
      localStorage.setItem('rentalApplicationData', JSON.stringify(formData));
      navigateToPaymentMethod();
    }
  };
  
  // Format address
  const formatAddress = (address: Property['address']) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  };
  
  return (
    <ApplicationContainer>
      <h2 className="section-title">Rental Application</h2>
      
      <div className="property-summary">
        <img 
          src={propertyData.images[0] || 'https://via.placeholder.com/200x150'} 
          alt={propertyData.title} 
          className="property-image" 
        />
        
        <div className="property-details">
          <h3 className="property-title">{propertyData.title}</h3>
          <p className="property-address">{formatAddress(propertyData.address)}</p>
          <p className="property-price">${propertyData.price.toLocaleString()}</p>
          
          <div className="property-features">
            {propertyData.bedrooms && (
              <span className="feature">{propertyData.bedrooms} Beds</span>
            )}
            {propertyData.bathrooms && (
              <>
                <span className="feature">•</span>
                <span className="feature">{propertyData.bathrooms} Baths</span>
              </>
            )}
            <span className="feature">•</span>
            <span className="feature">{propertyData.area} sq ft</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="error-message">{errors.fullName}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="visitDate">Preferred Visit Date</label>
            <input
              type="date"
              id="visitDate"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.visitDate && <p className="error-message">{errors.visitDate}</p>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="movingDate">Expected Moving Date (optional)</label>
          <input
            type="date"
            id="movingDate"
            name="movingDate"
            value={formData.movingDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Additional Information (optional)</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us anything that might be relevant for your visit or rental application..."
          />
        </div>
        
        <div className="actions">
          <button type="submit" className="next-button">
            Next: Payment Method
          </button>
        </div>
      </form>
    </ApplicationContainer>
  );
};

export default RentalApplication; 