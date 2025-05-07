import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { User, Property } from '../../backend/entities';
import { useCheckoutContext } from '../../contexts/checkout-process';
import { FiInfo } from 'react-icons/fi';
import CheckoutInput from './input-fields/CheckoutInput';
import CheckoutTextArea from './input-fields/CheckoutTextArea';
import { CheckoutButton } from '../styles/inputs/checkout/checkout-input-style';
import CustomSelect from './input-fields/CustomSelect';
import CustomCheckbox from './input-fields/CustomCheckbox';
import EnhancedCustomSelect from './input-fields/EnhancedCustomSelect';
import EnhancedDatePicker from './input-fields/EnhancedDatePicker';
import BirthDatePicker from './input-fields/BirthDatePicker';
import IDDocumentUpload from './input-fields/IDDocumentUpload';

const ApplicationContainer = styled.div<{step: number}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  .section-title {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin-bottom: 1.5rem;
  }
  
  .checkout-page-layout {
    display: flex;
    gap: 2rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .form-side {
      flex: 1;
  }
  
  .property-side {
    width: 300px;
    
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    
    .form-row {
      display: flex;
      gap: 1.5rem;
      width: 100%;
        
        @media (max-width: 768px) {
          flex-direction: column;
        }
        
      .form-field {
          flex: 1;
        }
      }
    
    .button-container {
      display: flex;
      justify-content: ${props => props.step === 1 ? 'flex-end' : 'space-between'};
      margin-top: 1.5rem;
    }
  }
  
  .error-message {
    color: ${Theme.colors.error};
    font: ${Theme.typography.fonts.smallM};
    margin-top: 0.5rem;
  }
  
  .form-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    
    .back-button {
      background-color: white;
      color: ${Theme.colors.gray2};
      border: 1px solid ${Theme.colors.tertiary};
      padding: 16px 32px;
      border-radius: 100px;
      font: ${Theme.typography.fonts.mediumB};
      cursor: pointer;
      transition: all 0.3s ease;
      width: 140px;
      
      &:hover {
        border-color: ${Theme.colors.gray2};
      }
    }
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
  }
    
    .next-button {
      background-color: ${Theme.colors.secondary};
      color: white;
      border: none;
    padding: 16px 32px;
    border-radius: 100px;
      font: ${Theme.typography.fonts.mediumB};
      cursor: pointer;
      transition: background-color 0.3s ease;
    width: 140px;
      
      &:hover {
        background-color: ${Theme.colors.primary};
      }
      
      &:disabled {
        background-color: ${Theme.colors.tertiary};
        color: ${Theme.colors.gray2};
        cursor: not-allowed;
    }
  }
  
  .optional-label {
    color: ${Theme.colors.gray2};
    font-size: 12px;
    margin-left: 8px;
  }
  
  // Property card styling
  .property-card {
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.md};
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 100px;
    
    .property-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }
    
    .property-content {
      padding: 1.5rem;
      
      .property-title {
        font: ${Theme.typography.fonts.h5B};
        color: ${Theme.colors.black};
        margin-bottom: 0.75rem;
      }
      
      .property-meta {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        
        .meta-item {
          font: ${Theme.typography.fonts.smallM};
          color: ${Theme.colors.gray2};
        }
      }
      
      .host-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid ${Theme.colors.tertiary};
        
        .host-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .host-name {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
        }
        
        .view-profile {
          margin-left: auto;
          color: ${Theme.colors.secondary};
          font: ${Theme.typography.fonts.smallM};
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
      
      .price-breakdown {
        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          
          .price-label {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
          }
          
          .price-value {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.black};
            
            &.total {
              font: ${Theme.typography.fonts.largeB};
              color: ${Theme.colors.secondary};
            }
          }
        }
        
        .total-row {
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid ${Theme.colors.tertiary};
        }
      }
      
      .info-tooltip {
        position: relative;
        display: inline-flex;
        align-items: center;
        margin-left: 0.5rem;
        color: ${Theme.colors.gray2};
        cursor: help;
      }
      
      .cancellation-policy {
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid ${Theme.colors.tertiary};
        
        .policy-title {
          font: ${Theme.typography.fonts.smallB};
          margin-bottom: 0.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .read-more {
          color: ${Theme.colors.secondary};
          font: ${Theme.typography.fonts.smallM};
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
`;

interface RentalApplicationProps {
  userData: User;
  propertyData: Property;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  identificationDocument: FileList | null;
}

interface StayInfo {
  numPeople: string;
  roommates: string;
  occupationType: 'study' | 'work';
  studyPlace: string;
  workPlace: string;
  occupationRole: string;
  funding: string;
  hasPets: boolean;
  hasSmoking: boolean;
  aboutMe: string;
  leavingDate: string;
}

interface FormErrors {
  [key: string]: string;
}

const RentalApplication: React.FC<RentalApplicationProps> = ({ userData, propertyData }) => {
  const { navigateToPaymentMethod } = useCheckoutContext();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Personal info for step 1
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: userData?.name || '',
    lastName: userData?.surname || '',
    email: userData?.email || '',
    phoneNumber: userData?.phoneNumber || '',
    gender: userData?.gender || '',
    dateOfBirth: userData?.dateOfBirth || '',
    identificationDocument: null
  });
  
  // Stay info for step 2
  const [stayInfo, setStayInfo] = useState<StayInfo>({
    numPeople: '1',
    roommates: '',
    occupationType: 'study',
    studyPlace: '',
    workPlace: '',
    occupationRole: '',
    funding: 'Myself (from salary)',
    hasPets: false,
    hasSmoking: false,
    aboutMe: userData?.aboutMe || '',
    leavingDate: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load saved form data from localStorage if it exists
  useEffect(() => {
    const savedData = localStorage.getItem('rentalApplicationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Split data between personal and stay info
        const personal: PersonalInfo = {
          firstName: parsedData.firstName || personalInfo.firstName,
          lastName: parsedData.lastName || personalInfo.lastName,
          email: parsedData.email || personalInfo.email,
          phoneNumber: parsedData.phoneNumber || personalInfo.phoneNumber,
          gender: parsedData.gender || personalInfo.gender,
          dateOfBirth: parsedData.dateOfBirth || personalInfo.dateOfBirth,
          identificationDocument: null // Cannot restore file input from localStorage
        };
        
        const stay: StayInfo = {
          numPeople: parsedData.numPeople || stayInfo.numPeople,
          roommates: parsedData.roommates || stayInfo.roommates,
          occupationType: parsedData.occupationType || stayInfo.occupationType,
          studyPlace: parsedData.studyPlace || stayInfo.studyPlace,
          workPlace: parsedData.workPlace || stayInfo.workPlace,
          occupationRole: parsedData.occupationRole || stayInfo.occupationRole,
          funding: parsedData.funding || stayInfo.funding,
          hasPets: Boolean(parsedData.hasPets),
          hasSmoking: Boolean(parsedData.hasSmoking),
          aboutMe: parsedData.aboutMe || stayInfo.aboutMe,
          leavingDate: parsedData.leavingDate || stayInfo.leavingDate
        };
        
        setPersonalInfo(personal);
        setStayInfo(stay);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handlePersonalInfoSelectChange = (name: string, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleDocumentUpload = (files: FileList | null) => {
    setPersonalInfo(prev => ({
      ...prev,
      identificationDocument: files
    }));
    
    // Clear error when field is being edited
    if (formErrors['identificationDocument']) {
      setFormErrors(prev => ({
        ...prev,
        identificationDocument: ''
      }));
    }
  };
  
  const handleStayInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setStayInfo(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setStayInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateStep1 = (): boolean => {
    const errors: FormErrors = {};
    
    if (!personalInfo.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!personalInfo.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!personalInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!personalInfo.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    
    if (!personalInfo.gender) {
      errors.gender = 'Gender is required';
    }
    
    if (!personalInfo.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!personalInfo.identificationDocument || personalInfo.identificationDocument.length === 0) {
      errors.identificationDocument = 'ID document is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateStep2 = (): boolean => {
    const errors: FormErrors = {};
    
    if (stayInfo.numPeople !== '1' && !stayInfo.roommates.trim()) {
      errors.roommates = 'Please specify who will live with you';
    }
    
    if (stayInfo.occupationType === 'study' && !stayInfo.studyPlace.trim()) {
      errors.studyPlace = 'Please specify where you study';
    }
    
    if (stayInfo.occupationType === 'work' && !stayInfo.workPlace.trim()) {
      errors.workPlace = 'Please specify where you work';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep1()) {
      setCurrentStep(2);
      // Emit event for scroll to top component
      import('../../utils/event-bus').then(({ default: eventBus, EventType }) => {
        eventBus.emit(EventType.CHECKOUT_STEP_CHANGED);
      });
    }
  };
  
  const handleBack = () => {
    setCurrentStep(1);
    // Emit event for scroll to top component
    import('../../utils/event-bus').then(({ default: eventBus, EventType }) => {
      eventBus.emit(EventType.CHECKOUT_STEP_CHANGED);
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Try to get the existing rental data to preserve scheduledDate if set
    let existingData = {};
    try {
      const savedData = localStorage.getItem('rentalApplicationData');
      if (savedData) {
        existingData = JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error parsing saved rental data:', error);
    }
    
    // Combine personal and stay info into a single object (excluding files which can't be serialized)
    const rentalData = {
      ...existingData, // Keep existing data, especially scheduledDate
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      fullName: `${personalInfo.firstName} ${personalInfo.lastName}`.trim(),
      email: personalInfo.email,
      phoneNumber: personalInfo.phoneNumber,
      gender: personalInfo.gender,
      dateOfBirth: personalInfo.dateOfBirth,
      numPeople: stayInfo.numPeople,
      roommates: stayInfo.roommates,
      occupationType: stayInfo.occupationType,
      studyPlace: stayInfo.studyPlace,
      workPlace: stayInfo.workPlace,
      occupationRole: stayInfo.occupationRole,
      funding: stayInfo.funding,
      hasPets: stayInfo.hasPets,
      hasSmoking: stayInfo.hasSmoking,
      aboutMe: stayInfo.aboutMe,
      leavingDate: stayInfo.leavingDate,
      // Only set scheduledDate if it's not already set in existingData
      scheduledDate: existingData.scheduledDate || new Date().toISOString().split('T')[0]
    };
    
    // Save combined data to localStorage
    localStorage.setItem('rentalApplicationData', JSON.stringify(rentalData));
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Navigate to the next step
      navigateToPaymentMethod();
      
      // Explicitly trigger scroll to top event
      import('../../utils/event-bus').then(({ default: eventBus, EventType }) => {
        eventBus.emit(EventType.CHECKOUT_STEP_CHANGED);
      });
    }, 500);
  };
  
  // Options for the select dropdowns
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ];
  
  const peopleOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5+', label: '5+' }
  ];
  
  const occupationOptions = [
    { value: 'study', label: 'Study' },
    { value: 'work', label: 'Work' }
  ];
  
  const fundingOptions = [
    { value: 'Myself (from salary)', label: 'Myself (from salary)' },
    { value: 'Parents', label: 'Parents' },
    { value: 'Scholarship', label: 'Scholarship' },
    { value: 'Other', label: 'Other' }
  ];
  
  return (
    <ApplicationContainer step={currentStep}>
      <h2 className="section-title">Your Information</h2>
      
      {currentStep === 1 ? (
        // Step 1: Personal Information with enhanced fields
        <form className="form-container" onSubmit={handleNextStep}>
          <div className="form-row">
            <div className="form-field">
              <CheckoutInput
                label="First Name"
                name="firstName"
                value={personalInfo.firstName}
                onChange={handlePersonalInfoChange}
                placeholder="Enter your first name"
                required
                error={formErrors.firstName}
              />
            </div>
            
            <div className="form-field">
              <CheckoutInput
                label="Last Name"
                name="lastName"
                value={personalInfo.lastName}
                onChange={handlePersonalInfoChange}
                placeholder="Enter your last name"
                required
                error={formErrors.lastName}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <CheckoutInput
                label="Email"
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                placeholder="Enter your email"
                required
                error={formErrors.email}
              />
            </div>
            
            <div className="form-field">
              <CheckoutInput
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                value={personalInfo.phoneNumber}
                onChange={handlePersonalInfoChange}
                placeholder="Enter your phone number"
                required
                error={formErrors.phoneNumber}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <EnhancedCustomSelect
                label="Gender"
                name="gender"
                options={genderOptions}
                value={personalInfo.gender}
                onChange={(e) => {
                  if (typeof e === 'string') {
                    handlePersonalInfoSelectChange('gender', e);
                  } else {
                    handlePersonalInfoSelectChange('gender', e.target.value);
                  }
                }}
                required
                error={formErrors.gender}
                placeholder="Select your gender"
              />
            </div>
            
            <div className="form-field">
              <BirthDatePicker
                label="Date of Birth"
                name="dateOfBirth"
                value={personalInfo.dateOfBirth}
                onChange={(e) => {
                  if (typeof e === 'string') {
                    handlePersonalInfoSelectChange('dateOfBirth', e);
                  } else {
                    handlePersonalInfoChange(e);
                  }
                }}
                required
                error={formErrors.dateOfBirth}
                placeholder="Select your date of birth"
              />
        </div>
      </div>
      
        <div className="form-row">
            <div className="form-field">
              <IDDocumentUpload
                label="Identification Document"
                name="identificationDocument"
                value={personalInfo.identificationDocument}
                onChange={handleDocumentUpload}
                required
                error={formErrors.identificationDocument}
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </div>
          </div>
          
          <div className="button-container">
            <CheckoutButton type="submit">
              Next Step
            </CheckoutButton>
          </div>
        </form>
      ) : (
        // Step 2: Stay Information
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <EnhancedCustomSelect
                label="How many people will stay at the property?"
                name="numPeople"
                options={peopleOptions}
                value={stayInfo.numPeople}
                onChange={(e) => {
                  if (typeof e === 'string') {
                    handleStayInfoChange({
                      target: { name: 'numPeople', value: e }
                    } as React.ChangeEvent<HTMLSelectElement>);
                  } else {
                    handleStayInfoChange(e);
                  }
                }}
                required
              />
            </div>
            
            <div className="form-field">
              <CheckoutInput
                label="Who will you live with?"
                name="roommates"
                value={stayInfo.roommates}
                onChange={handleStayInfoChange}
                placeholder="Friends, family or someone else..."
                error={formErrors.roommates}
              />
          </div>
        </div>
        
        <div className="form-row">
            <div className="form-field">
              <EnhancedCustomSelect
                label="Do you study or work?"
                name="occupationType"
                options={occupationOptions}
                value={stayInfo.occupationType}
                onChange={(e) => {
                  if (typeof e === 'string') {
                    handleStayInfoChange({
                      target: { name: 'occupationType', value: e }
                    } as React.ChangeEvent<HTMLSelectElement>);
                  } else {
                    handleStayInfoChange(e);
                  }
                }}
                required
              />
            </div>
            
            <div className="form-field">
              {stayInfo.occupationType === 'study' ? (
                <CheckoutInput
                  label="Where do you study?"
                  name="studyPlace"
                  value={stayInfo.studyPlace}
                  onChange={handleStayInfoChange}
                  placeholder="Institution name"
                  error={formErrors.studyPlace}
                  required
                />
              ) : (
                <CheckoutInput
                  label="Where do you work?"
                  name="workPlace"
                  value={stayInfo.workPlace}
                  onChange={handleStayInfoChange}
                  placeholder="Company name"
                  error={formErrors.workPlace}
                  required
                />
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <CheckoutInput
                label={stayInfo.occupationType === 'study' ? "What do you study?" : "Who do you work as?"}
                name="occupationRole"
                value={stayInfo.occupationRole}
                onChange={handleStayInfoChange}
                placeholder={stayInfo.occupationType === 'study' ? "Faculty or Department" : "Computer Engineer"}
              />
            </div>
            
            <div className="form-field">
              <EnhancedCustomSelect
                label="How will you fund your stay?"
                name="funding"
                options={fundingOptions}
                value={stayInfo.funding}
                onChange={(e) => {
                  if (typeof e === 'string') {
                    handleStayInfoChange({
                      target: { name: 'funding', value: e }
                    } as React.ChangeEvent<HTMLSelectElement>);
                  } else {
                    handleStayInfoChange(e);
                  }
                }}
                required
              />
          </div>
        </div>
        
          <div className="form-row">
            <div className="form-field">
              <CustomCheckbox
                name="hasPets"
                label="I have pets with me"
                checked={stayInfo.hasPets}
                onChange={handleStayInfoChange}
          />
        </div>
        
            <div className="form-field">
              <CustomCheckbox
                name="hasSmoking"
                label="I have smoking habits"
                checked={stayInfo.hasSmoking}
                onChange={handleStayInfoChange}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <EnhancedDatePicker
                label="Approximate Leaving Date (Optional)"
                name="leavingDate"
                value={stayInfo.leavingDate}
                onChange={(e) => {
                  if (typeof e === 'string') {
                    handleStayInfoChange({
                      target: { name: 'leavingDate', value: e }
                    } as React.ChangeEvent<HTMLInputElement>);
                  } else {
                    handleStayInfoChange(e);
                  }
                }}
                min={new Date().toISOString().split('T')[0]} // Today's date as minimum
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <CheckoutTextArea
                label="About Me (Optional)"
                name="aboutMe"
                value={stayInfo.aboutMe}
                onChange={handleStayInfoChange}
                placeholder="Briefly describe yourself (your interests, lifestyle, reason for moving). Do NOT include phone numbers, emails, social media profiles, or other personal contact details."
                rows={4}
          />
        </div>
          </div>
          
          <div className="button-container">
            <CheckoutButton 
              type="button" 
              onClick={handleBack}
              style={{ 
                backgroundColor: 'white', 
                color: Theme.colors.gray2,
                border: `1px solid ${Theme.colors.tertiary}`
              }}
            >
              Back
            </CheckoutButton>
            
            <CheckoutButton 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Next Step'}
            </CheckoutButton>
        </div>
      </form>
      )}
    </ApplicationContainer>
  );
};

export default RentalApplication; 