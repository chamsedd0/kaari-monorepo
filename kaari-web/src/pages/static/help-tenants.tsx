import React, { useState } from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';

// Additional styles for the help center page
const HelpPageStyles = styled(StaticPageWrapper)`
  .search-container {
    margin: 40px 0;
    
    .search-box {
      display: flex;
      align-items: center;
      background-color: white;
      border: 1px solid ${Theme.colors.gray3};
      border-radius: ${Theme.borders.radius.full};
      padding: 5px 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      
      .search-icon {
        color: ${Theme.colors.gray2};
        font-size: 18px;
        margin-right: 10px;
      }
      
      input {
        flex: 1;
        border: none;
        padding: 12px 0;
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.black};
        
        &:focus {
          outline: none;
        }
        
        &::placeholder {
          color: ${Theme.colors.gray3};
        }
      }
    }
  }
  
  .categories {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 40px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .category {
      background-color: white;
      border-radius: ${Theme.borders.radius.md};
      padding: 20px;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }
      
      &.active {
        background-color: ${Theme.colors.primary}10;
        border: 1px solid ${Theme.colors.primary};
      }
      
      h3 {
        font: ${Theme.typography.fonts.h4};
        color: ${Theme.colors.black};
        margin-bottom: 10px;
      }
      
      p {
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.gray2};
        margin-bottom: 0;
      }
    }
  }
  
  .faq-section {
    margin-bottom: 40px;
    
    .faq-item {
      margin-bottom: 15px;
      border: 1px solid ${Theme.colors.gray3};
      border-radius: ${Theme.borders.radius.md};
      overflow: hidden;
      
      .faq-question {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background-color: white;
        cursor: pointer;
        
        h3 {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
          margin: 0;
        }
        
        .icon {
          color: ${Theme.colors.primary};
          font-size: 18px;
          transition: transform 0.3s ease;
        }
      }
      
      .faq-answer {
        padding: 0 20px;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease;
        
        p {
          font: ${Theme.typography.fonts.text16};
          color: ${Theme.colors.gray2};
          margin-bottom: 15px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
        
        ul {
          margin-left: 20px;
          margin-bottom: 15px;
          
          li {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.gray2};
            margin-bottom: 8px;
          }
        }
        
        a {
          color: ${Theme.colors.primary};
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
      
      &.active {
        .faq-question {
          background-color: ${Theme.colors.tertiary}10;
          
          .icon {
            transform: rotate(180deg);
          }
        }
        
        .faq-answer {
          max-height: 1000px;
          padding: 20px;
        }
      }
    }
  }
`;

// FAQ data
const faqData = {
  booking: [
    {
      question: "How do I book a property on Kaari?",
      answer: (
        <>
          <p>Booking a property on Kaari is simple:</p>
          <ol>
            <li>Find a property you're interested in through our search feature</li>
            <li>Review property details, amenities, and house rules</li>
            <li>Check availability for your desired dates</li>
            <li>Click "Book Now" and follow the instructions to complete your booking</li>
            <li>Wait for the owner's confirmation (usually within 24 hours)</li>
            <li>Once confirmed, complete the payment process to secure your booking</li>
          </ol>
          <p>You'll receive a confirmation email with all the details of your booking, including the property address and check-in instructions.</p>
        </>
      )
    },
    {
      question: "What payment methods are accepted?",
      answer: (
        <>
          <p>Kaari accepts various payment methods to make booking as convenient as possible:</p>
          <ul>
            <li>Credit/Debit cards (Visa, Mastercard, American Express)</li>
            <li>Mobile money (M-Pesa, MTN Mobile Money, etc.)</li>
            <li>Bank transfers</li>
            <li>PayPal</li>
          </ul>
          <p>All payments are processed securely through our platform to protect both tenants and property owners.</p>
        </>
      )
    },
    {
      question: "Can I cancel my booking?",
      answer: (
        <>
          <p>Yes, you can cancel your booking, but the refund policy depends on the cancellation policy selected by the property owner. There are three standard cancellation policies on Kaari:</p>
          <ul>
            <li><strong>Flexible:</strong> Full refund if cancelled at least 7 days before check-in</li>
            <li><strong>Moderate:</strong> Full refund if cancelled at least 14 days before check-in</li>
            <li><strong>Strict:</strong> 50% refund if cancelled at least 30 days before check-in</li>
          </ul>
          <p>The specific cancellation policy for each property is clearly displayed on the property listing page before you book. Additionally, with StayProtection™, you may be eligible for more flexible cancellation options in case of emergencies.</p>
        </>
      )
    }
  ],
  stay: [
    {
      question: "How do I communicate with the property owner?",
      answer: (
        <>
          <p>Kaari provides a secure messaging system that allows you to communicate directly with the property owner or manager. You can access this through your dashboard after booking a property.</p>
          <p>We recommend keeping all communication within the Kaari platform for your protection, as these messages are recorded and can be referenced if any issues arise during your stay.</p>
        </>
      )
    },
    {
      question: "What should I do if something is damaged or not working?",
      answer: (
        <>
          <p>If you encounter any issues with the property during your stay:</p>
          <ol>
            <li>Document the issue with photos or videos</li>
            <li>Contact the property owner or manager immediately through the Kaari messaging system</li>
            <li>Allow reasonable time for them to address the issue</li>
            <li>If the issue isn't resolved within 24 hours, contact Kaari support</li>
          </ol>
          <p>Under StayProtection™, if essential amenities (water, electricity, internet) fail and aren't repaired within 24 hours, you may be eligible for compensation for each day the issue persists.</p>
        </>
      )
    },
    {
      question: "Can I extend my stay?",
      answer: (
        <>
          <p>Yes, you can request to extend your stay through the Kaari platform. Here's how:</p>
          <ol>
            <li>Log into your Kaari account</li>
            <li>Go to "My Bookings"</li>
            <li>Select the current booking you wish to extend</li>
            <li>Click the "Extend Stay" button</li>
            <li>Select your new check-out date</li>
            <li>Submit your request</li>
          </ol>
          <p>The property owner will review your extension request and either approve or decline it based on availability. If approved, you'll be prompted to pay for the additional days.</p>
        </>
      )
    }
  ],
  account: [
    {
      question: "How do I create a Kaari account?",
      answer: (
        <>
          <p>Creating a Kaari account is free and easy:</p>
          <ol>
            <li>Click the "Sign Up" button on the top right of any Kaari page</li>
            <li>Enter your email address or sign up with Google, Facebook, or Apple</li>
            <li>Create a secure password</li>
            <li>Fill in your basic profile information</li>
            <li>Verify your email address via the confirmation link we send you</li>
          </ol>
          <p>Once your account is created, you can start browsing, saving favorites, and booking properties right away.</p>
        </>
      )
    },
    {
      question: "How do I verify my identity on Kaari?",
      answer: (
        <>
          <p>To verify your identity on Kaari, which helps build trust with property owners:</p>
          <ol>
            <li>Log into your Kaari account</li>
            <li>Go to "Account Settings" then "Identity Verification"</li>
            <li>Follow the prompts to upload a government-issued ID (passport, national ID, or driver's license)</li>
            <li>Take a selfie for facial recognition verification</li>
          </ol>
          <p>The verification process usually takes 24-48 hours to complete. Once verified, a verification badge will appear on your profile, which can increase your chances of booking approval.</p>
        </>
      )
    },
    {
      question: "How do I reset my password?",
      answer: (
        <>
          <p>If you've forgotten your password, you can reset it by following these steps:</p>
          <ol>
            <li>Click "Log In" on the top right of any Kaari page</li>
            <li>Click "Forgot Password?" below the login form</li>
            <li>Enter the email address associated with your account</li>
            <li>Check your email for a password reset link (check spam folder if not in inbox)</li>
            <li>Click the link and follow the instructions to create a new password</li>
          </ol>
          <p>For security reasons, password reset links expire after 24 hours. If you don't reset your password within that timeframe, you'll need to request a new reset link.</p>
        </>
      )
    }
  ]
};

const HelpTenantsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("booking");
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleQuestion = (index: number) => {
    if (expandedQuestions.includes(index)) {
      setExpandedQuestions(expandedQuestions.filter(i => i !== index));
    } else {
      setExpandedQuestions([...expandedQuestions, index]);
    }
  };
  
  return (
    <HelpPageStyles>
      <div className="page-header">
        <h1>Help Center for Tenants</h1>
        <p className="subtitle">Find answers to your questions about renting with Kaari</p>
      </div>

      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for help topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="content-section">
        <h2>Browse Help Categories</h2>
        <div className="categories">
          <div 
            className={`category ${activeCategory === "booking" ? "active" : ""}`}
            onClick={() => setActiveCategory("booking")}
          >
            <h3>Booking & Payments</h3>
            <p>Help with searching, booking, and payment processes</p>
          </div>
          
          <div 
            className={`category ${activeCategory === "stay" ? "active" : ""}`}
            onClick={() => setActiveCategory("stay")}
          >
            <h3>During Your Stay</h3>
            <p>Information about check-in, communication, and resolving issues</p>
          </div>
          
          <div 
            className={`category ${activeCategory === "account" ? "active" : ""}`}
            onClick={() => setActiveCategory("account")}
          >
            <h3>Account Management</h3>
            <p>Help with your Kaari account, profile, and settings</p>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-section">
          {faqData[activeCategory as keyof typeof faqData].map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${expandedQuestions.includes(index) ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleQuestion(index)}>
                <h3>{faq.question}</h3>
                <div className="icon">
                  {expandedQuestions.includes(index) ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              <div className="faq-answer">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h3>Can't Find What You're Looking For?</h3>
        <p>
          Our support team is here to help. Contact us with any questions or concerns you have about using Kaari.
        </p>
        <a href="/contact" className="cta-button">
          Contact Support
        </a>
      </div>
    </HelpPageStyles>
  );
};

export default HelpTenantsPage; 