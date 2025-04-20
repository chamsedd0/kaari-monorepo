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
  onContinue: () => void;
}

const RentalApplication: React.FC<RentalApplicationProps> = ({ onContinue }) => {
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [occupationType, setOccupationType] = useState<'work' | 'study'>('work');
  const [numPeople, setNumPeople] = useState('2');
  const [idDocument, setIdDocument] = useState<{
    files: FileList | null;
    type: string;
  } | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextFormStep = () => {
    setCurrentFormStep(2);
    scrollToTop();
  };

  const handleBackStep = () => {
    setCurrentFormStep(1);
    scrollToTop();
  };

  const handleContinue = () => {
    onContinue();
    scrollToTop();
  };

  const handleOccupationTypeChange = (value: 'work' | 'study') => {
    setOccupationType(value);
  };

  const handleIdUpload = (files: FileList | null, type: string) => {
    setIdDocument({ files, type });
  };

  const renderFirstStep = () => (
    <FormContainer className="form-container">
      <div className="form-group">
        <InputBaseModel    
          title="First Name" 
          placeholder="Enter your first name" 
        />
        <InputBaseModel 
          title="Email" 
          placeholder="Enter your email" 
        />
      </div>
      
      <div className="form-group">
        <InputBaseModel 
          title="Last Name" 
          placeholder="Enter your last name" 
        />
        <InputBaseModel 
          title="Phone Number" 
          placeholder="Enter your phone number" 
        />
      </div>
      
      <InputBaseModel 
        title="Address" 
        placeholder="Enter your address" 
      />
      
      <div className="date-of-birth-container">
        <SelectFieldDatePicker 
          label="Date of Birth"
        />
      </div>
      
      <UploadIDField onUploadComplete={handleIdUpload} />

      <div className="next-button-container">
        <PurpleButtonMB48 
          text="Next Step" 
          onClick={handleNextFormStep} 
          disabled={!idDocument} 
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
          value={numPeople}
          onChange={(value) => setNumPeople(value)}
        />
      </div>

      <div className="form-group">
        <InputBaseModel
          title="Who will you live with?"
          placeholder="Friends, family or someone else..."
        />
      </div>

      <div className="form-group">
        <SelectFieldBaseModelVariant1
          label="Do you study or work?"
          options={["Work", "Study"]}
          value={occupationType === 'work' ? 'Work' : 'Study'}
          onChange={(value) => handleOccupationTypeChange(value.toLowerCase() as 'work' | 'study')}
        />
      </div>

      {occupationType === 'work' ? (
        <>
          <div className="form-group">
            <InputBaseModel
              title="Where do you work?"
              placeholder="Company name"
            />
          </div>
          <div className="form-group">
            <InputBaseModel
              title="Who do you work as?"
              placeholder="Computer Engineer"
            />
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <InputBaseModel
              title="Where do you study?"
              placeholder="Institution name"
            />
          </div>
          <div className="form-group">
            <InputBaseModel
              title="What do you study?"
              placeholder="Faculty or Department"
            />
          </div>
        </>
      )}

      <div className="form-group">
        <SelectFieldBaseModelVariant1
          label="How will you fund your stay?"
          options={["Myself (from salary)", "Parents", "Scholarship", "Other"]}
        />
      </div>

      <div className="form-group text-area-container">
        <TextAreaBaseModel
          title="About Me"
          placeholder="Tell us more about yourself"
        /><div className="checkbox-container">
        <input type="checkbox" id="promotions" />
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