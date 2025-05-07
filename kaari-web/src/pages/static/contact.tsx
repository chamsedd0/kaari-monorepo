import React, { useState } from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

// Additional styles for the contact page
const ContactPageStyles = styled(StaticPageWrapper)`
  .contact-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    margin-top: 40px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .contact-info {
    .info-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 30px;
      
      .icon {
        font-size: 24px;
        color: ${Theme.colors.primary};
        margin-right: 15px;
        margin-top: 5px;
      }
      
      .details {
        h3 {
          font: ${Theme.typography.fonts.h4};
          color: ${Theme.colors.black};
          margin-bottom: 8px;
        }
        
        p, a {
          font: ${Theme.typography.fonts.text16};
          color: ${Theme.colors.gray2};
          margin: 0;
          text-decoration: none;
          
          &:hover {
            color: ${Theme.colors.primary};
          }
        }
      }
    }
  }
  
  .contact-form {
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.black};
        margin-bottom: 8px;
      }
      
      input, textarea, select {
        width: 100%;
        padding: 12px 15px;
        font: ${Theme.typography.fonts.text16};
        border: 1px solid ${Theme.colors.gray3};
        border-radius: ${Theme.borders.radius.md};
        background-color: white;
        transition: all 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: ${Theme.colors.primary};
          box-shadow: 0 0 0 2px ${Theme.colors.primary}20;
        }
      }
      
      textarea {
        height: 150px;
        resize: vertical;
      }
    }
    
    .submit-button {
      background-color: ${Theme.colors.primary};
      color: white;
      font: ${Theme.typography.fonts.largeB};
      padding: 12px 24px;
      border-radius: ${Theme.borders.radius.full};
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
      
      &:hover {
        background-color: ${Theme.colors.secondary};
      }
      
      &:disabled {
        background-color: ${Theme.colors.gray3};
        cursor: not-allowed;
      }
    }
    
    .success-message {
      background-color: #e6f7e6;
      color: #2e7d32;
      padding: 15px;
      border-radius: ${Theme.borders.radius.md};
      margin-top: 20px;
      font: ${Theme.typography.fonts.largeM};
      text-align: center;
    }
  }
`;

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  return (
    <ContactPageStyles>
      <div className="page-header">
        <h1>Contact Us</h1>
        <p className="subtitle">Get in touch with our team for any questions or support</p>
      </div>

      <div className="content-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>
              We're here to help and answer any questions you might have. We look forward to hearing from you.
            </p>
            
            <div className="info-item">
              <div className="icon">
                <FaPhoneAlt />
              </div>
              <div className="details">
                <h3>Phone</h3>
                <p><a href="tel:+254123456789">+254 123 456 789</a></p>
                <p>Monday to Friday, 8am to 6pm EAT</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon">
                <FaEnvelope />
              </div>
              <div className="details">
                <h3>Email</h3>
                <p><a href="mailto:support@kaari.com">support@kaari.com</a></p>
                <p>We'll respond as soon as possible</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon">
                <FaMapMarkerAlt />
              </div>
              <div className="details">
                <h3>Office</h3>
                <p>Kilimani Business Center</p>
                <p>Nairobi, Kenya</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            <h2>Send Us a Message</h2>
            {submitted ? (
              <div className="success-message">
                Thank you for your message! We'll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="booking">Booking Assistance</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={!formData.name || !formData.email || !formData.subject || !formData.message}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </ContactPageStyles>
  );
};

export default ContactPage; 