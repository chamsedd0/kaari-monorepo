import React, { useState } from 'react';
import InputBaseModel from '../../inputs/input-fields/input-variant';
import SelectFieldDatePicker from '../../inputs/select-fields/select-field-date-picker';
import SelectFieldBaseModelVariant1 from '../../inputs/select-fields/select-field-base-model';
import TextAreaBaseModel from '../../inputs/input-fields/textarea-variant';
import { PurpleButtonMB48 } from '../../buttons/purple_MB48';
import { BackButton } from '../../buttons/back_button';
import { FormContainer } from '../../../styles/checkoutprocess/checkout-process-sections-style';
import UploadIDField from '../../inputs/upload-fields/upload-id-field';

interface RentalApplicationProps {
  onContinue: (formData: RentalApplicationFormData) => void;
}

export interface RentalApplicationFormData {
  firstName: string;
  lastName: string;
  fullName: string; // Concatenated first and last name
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: Date | null;
  idDocument: {
    files: FileList | null;
    type: string;
  } | null;
  numPeople: string;
  roommates: string;
  occupationType: 'work' | 'study';
  workPlace: string;
  occupationRole: string;
  studyPlace: string;
  studyField: string;
  funding: string;
  aboutMe: string;
  languages?: string[];
  receivePromotions: boolean;
}

const RentalApplication: React.FC<RentalApplicationProps> = ({ onContinue }) => {
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [formData, setFormData] = useState<RentalApplicationFormData>({
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: null,
    idDocument: null,
    numPeople: '2',
    roommates: '',
    occupationType: 'work',
    workPlace: '',
    occupationRole: '',
    studyPlace: '',
    studyField: '',
    funding: 'Myself (from salary)',
    aboutMe: '',
    receivePromotions: false
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (field: keyof RentalApplicationFormData, value: any) => {
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value };
      
      // Update fullName whenever firstName or lastName changes
      if (field === 'firstName' || field === 'lastName') {
        updatedData.fullName = `${field === 'firstName' ? value : prev.firstName} ${field === 'lastName' ? value : prev.lastName}`.trim();
      }
      
      return updatedData;
    });
  };

  const handleNextFormStep = () => {
    // Validate first step data
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.idDocument) {
      alert('Please fill in all required fields');
      return;
    }
    
    setCurrentFormStep(2);
    scrollToTop();
  };

  const handleBackStep = () => {
    setCurrentFormStep(1);
    scrollToTop();
  };

  const handleContinue = () => {
    // Validate second step data
    if (!formData.numPeople || !formData.occupationType) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      // Heads-up: If other pending/accepted requests exist for this property, inform the tenant.
      const pendingKey = 'kaari_checkout_heads_up_shown';
      if (!localStorage.getItem(pendingKey)) {
        // Non-blocking notice; we allow concurrency
        alert('Heads-up: another booking request may already be in progress for this property. Your request will still be sent.');
        localStorage.setItem(pendingKey, 'true');
      }
    } catch {}

    // Call parent component's onContinue with the complete form data
    onContinue(formData);
    scrollToTop();
  };

  const handleOccupationTypeChange = (value: string) => {
    handleInputChange('occupationType', value.toLowerCase() as 'work' | 'study');
  };

  const handleIdUpload = (files: FileList | null, type: string) => {
    handleInputChange('idDocument', { files, type });
  };

  const handleDateChange = (date: { day: string; month: string; year: string }) => {
    const parsed = date && date.year && date.month && date.day 
      ? new Date(parseInt(date.year, 10), parseInt(date.month, 10) - 1, parseInt(date.day, 10))
      : null;
    handleInputChange('dateOfBirth', parsed);
  };

  const renderFirstStep = () => (
    <FormContainer className="form-container">
      <div className="form-group">
         <InputBaseModel    
          title="First Name" 
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
        />
         <InputBaseModel 
          title="Email" 
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
      </div>
      
      <div className="form-group">
         <InputBaseModel 
          title="Last Name" 
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
        />
        <InputBaseModel 
          title="Phone Number" 
          placeholder="Enter your phone number"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        />
      </div>
      
      <InputBaseModel 
        title="Address" 
        placeholder="Enter your address"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
      />
      
      <div className="date-of-birth-container">
        <SelectFieldDatePicker 
          label="Date of Birth"
          onChange={handleDateChange}
        />
      </div>
      
      <UploadIDField onUploadComplete={handleIdUpload} />

      <div className="next-button-container">
        <PurpleButtonMB48 
          text="Next Step" 
          onClick={handleNextFormStep} 
          disabled={!formData.idDocument} 
        />
      </div>
    </FormContainer>
  );

  const renderSecondStep = () => (
    <FormContainer className="form-container">
      <div className="form-group">
        <SelectFieldBaseModelVariant1
          label="How many people will stay at the property?"
          options={["1", "2", "3", "4", "5+"]}
          value={formData.numPeople}
          onChange={(value) => handleInputChange('numPeople', value)}
        />
      </div>

      <div className="form-group">
        <InputBaseModel
          title="Who will you live with?"
          placeholder="Friends, family or someone else..."
          value={formData.roommates}
          onChange={(e) => handleInputChange('roommates', e.target.value)}
        />
      </div>

      <div className="form-group">
        <SelectFieldBaseModelVariant1
          label="Do you study or work?"
          options={["Work", "Study"]}
          value={formData.occupationType === 'work' ? 'Work' : 'Study'}
          onChange={handleOccupationTypeChange}
        />
      </div>

      {formData.occupationType === 'work' ? (
        <>
          <div className="form-group">
            <InputBaseModel
              title="Where do you work?"
              placeholder="Company name"
              value={formData.workPlace}
              onChange={(e) => handleInputChange('workPlace', e.target.value)}
            />
          </div>
          <div className="form-group">
            <InputBaseModel
              title="Who do you work as?"
              placeholder="Computer Engineer"
              value={formData.occupationRole}
              onChange={(e) => handleInputChange('occupationRole', e.target.value)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <InputBaseModel
              title="Where do you study?"
              placeholder="Institution name"
              value={formData.studyPlace}
              onChange={(e) => handleInputChange('studyPlace', e.target.value)}
            />
          </div>
          <div className="form-group">
            <InputBaseModel
              title="What do you study?"
              placeholder="Faculty or Department"
              value={formData.studyField}
              onChange={(e) => handleInputChange('studyField', e.target.value)}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <SelectFieldBaseModelVariant1
          label="How will you fund your stay?"
          options={["Myself (from salary)", "Parents", "Scholarship", "Other"]}
          value={formData.funding}
          onChange={(value) => handleInputChange('funding', value)}
        />
      </div>

      <div className="form-group text-area-container">
        <TextAreaBaseModel
          title="About Me"
          placeholder="Tell us more about yourself"
          value={formData.aboutMe}
          onChange={(e) => handleInputChange('aboutMe', e.target.value)}
        />
        <SelectFieldBaseModelVariant1
          label="What languages do you speak?"
          options={["Arabic", "French", "English", "Spanish", "Other"]}
          value={(formData.languages && formData.languages[0]) || ''}
          onChange={(value) => handleInputChange('languages', [value])}
        />
        <div className="checkbox-container">
          <input 
            type="checkbox" 
            id="promotions" 
            checked={formData.receivePromotions}
            onChange={(e) => handleInputChange('receivePromotions', e.target.checked)}
          />
          <label htmlFor="promotions">
            I want to receive emails with promotions and useful information from Kaari
          </label>
        </div>
      </div>
    </FormContainer>
  );

  return (
    <div className="checkout-process-form">
      <div className="checkout-process-form-title">
        Your Information
      </div>
      
      {currentFormStep === 1 ? renderFirstStep() : renderSecondStep()}
      
      {currentFormStep === 2 && (
        <div className="button-container">
          <BackButton onClick={handleBackStep} />
          <PurpleButtonMB48 text="Continue to Payment" onClick={handleContinue} />
        </div>
      )}
    </div>
  );
};

export default RentalApplication; 