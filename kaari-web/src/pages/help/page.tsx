import React, { useState, ChangeEvent } from 'react';
import { HelpStyle } from './styles';
import UnifiedHeader from '../../components/skeletons/constructed/headers/unified-header';
import InputBaseModel from '../../components/skeletons/inputs/input-fields/input-variant';
import TextAreaBaseModel from '../../components/skeletons/inputs/input-fields/textarea-variant';
import SelectFieldBaseModelVariant1 from '../../components/skeletons/inputs/select-fields/select-field-base-model-variant-1';
import { PurpleButtonLB60 } from '../../components/skeletons/buttons/purple_LB60';
import supportImage from '../../assets/images/support.svg';


const HelpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    topic: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const finalValue = typeof value === 'string' ? value : value.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: finalValue
    }));
  };

  const topicOptions = [
    'Choose',
    'Technical Issue',
    'Booking Problem',
    'Payment Issue',
    'Account Management',
    'Feature Request',
    'Other'
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Here you would add the actual API call to submit the form
      console.log('Form submitted:', formData);
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        topic: '',
        description: ''
      });
      
      alert('Your message has been sent. We will get back to you soon!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <UnifiedHeader />
      <HelpStyle>
        <div className="left-container">
            <img src={supportImage} alt="Customer support representative" />
          <div className="title-container">
            <h1 className="title">Kaari Customer Support</h1>
            <h2 className="subtitle">Available 24/7</h2>
          </div>
          <p className="info-text">
            kaariofficial@gmail.com<br />
            +123XXXXXXXX
          </p>
        </div>
        
        <div className="right-container">
          <h3 className="title">Contact us via form</h3>
          
          <div className="form-row">
            <InputBaseModel
              title="Your name"
              value={formData.firstName}
              onChange={handleInputChange.bind(null, 'firstName')}
              placeholder="John"
            />
            
            <InputBaseModel
              title="Your Surname"
              value={formData.lastName}
              onChange={handleInputChange.bind(null, 'lastName')}
              placeholder="Doe"
            />
          </div>
          
          <div className="form-row">
            <InputBaseModel
              title="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange.bind(null, 'phoneNumber')}
              placeholder="+123 456 7890"
            />
            
            <InputBaseModel
              title="Email"
              value={formData.email}
              onChange={handleInputChange.bind(null, 'email')}
              placeholder="your@email.com"
            />
          </div>
          
          <div className="form-row full-width">
            <SelectFieldBaseModelVariant1
              label="What is the topic of your question?"
              options={topicOptions}
              value={formData.topic}
              onChange={(value) => handleInputChange('topic', value)}
              placeholder="Select a topic"
            />
          </div>
          
          <div className="form-row full-width">
            <TextAreaBaseModel
              title="Give us the description of the assist you want"
              value={formData.description}
              onChange={handleInputChange.bind(null, 'description')}
              placeholder="Please provide details about your issue..."
            />
          </div>
          
          <div className="button-container">
            <PurpleButtonLB60
              text={isSubmitting ? "Sending..." : "Save Data"}
              onClick={handleSubmit}
            />
          </div>

        </div>


        
      </HelpStyle>
    </>
  );
};

export default HelpPage;

