import React from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';

// Additional styles for the resources page
const ResourcesPageStyles = styled(StaticPageWrapper)`
  .resources-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    margin: 40px 0;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .resource-item {
    background-color: white;
    border-radius: ${Theme.borders.radius.md};
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .resource-content {
      padding: 25px;
      
      h3 {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
        margin-bottom: 15px;
      }
      
      p {
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.gray2};
        margin-bottom: 20px;
      }
      
      .button {
        display: inline-block;
        background-color: ${Theme.colors.primary};
        color: white;
        font: ${Theme.typography.fonts.largeB};
        padding: 10px 20px;
        border-radius: ${Theme.borders.radius.full};
        text-decoration: none;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: ${Theme.colors.secondary};
          transform: translateY(-2px);
        }
      }
    }
  }
  
  .document-list {
    margin: 30px 0;
    
    .document-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 15px;
      background-color: white;
      border-radius: ${Theme.borders.radius.md};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .document-icon {
        width: 50px;
        height: 50px;
        background-color: ${Theme.colors.tertiary}30;
        border-radius: ${Theme.borders.radius.md};
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        flex-shrink: 0;
        
        svg {
          font-size: 24px;
          color: ${Theme.colors.primary};
        }
      }
      
      .document-details {
        flex-grow: 1;
        
        h4 {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
          margin-bottom: 5px;
        }
        
        p {
          font: ${Theme.typography.fonts.text16};
          color: ${Theme.colors.gray2};
          margin: 0;
        }
      }
      
      .download-button {
        background-color: ${Theme.colors.tertiary}20;
        color: ${Theme.colors.primary};
        font: ${Theme.typography.fonts.largeB};
        padding: 8px 15px;
        border-radius: ${Theme.borders.radius.full};
        text-decoration: none;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: ${Theme.colors.primary};
          color: white;
        }
      }
    }
  }
`;

const TenantResourcesPage: React.FC = () => {
  return (
    <ResourcesPageStyles>
      <div className="page-header">
        <h1>Tenant Resources</h1>
        <p className="subtitle">Helpful guides, tools, and information for Kaari tenants</p>
      </div>

      <div className="content-section">
        <h2>Get Started with Kaari</h2>
        <p>
          We've created a collection of resources to help you navigate your rental journey with Kaari. From finding the perfect property to understanding your rights as a tenant, these resources will make your rental experience smoother and more enjoyable.
        </p>
        
        <div className="resources-grid">
          <div className="resource-item">
            <div className="resource-content">
              <h3>First-Time Renter's Guide</h3>
              <p>
                New to renting? Our comprehensive guide covers everything you need to know about renting for the first time, from understanding rental terms to managing your budget.
              </p>
              <a href="/resources/first-time-renters-guide" className="button">Read Guide</a>
            </div>
          </div>
          
          <div className="resource-item">
            <div className="resource-content">
              <h3>Rental Property Inspection Checklist</h3>
              <p>
                Use our detailed inspection checklist when viewing properties to ensure you don't miss any important details before signing a lease.
              </p>
              <a href="/resources/inspection-checklist" className="button">Download Checklist</a>
            </div>
          </div>
          
          <div className="resource-item">
            <div className="resource-content">
              <h3>Moving-In Guide</h3>
              <p>
                Our step-by-step guide helps you prepare for moving day and settling into your new home with ease.
              </p>
              <a href="/resources/moving-in-guide" className="button">Read Guide</a>
            </div>
          </div>
          
          <div className="resource-item">
            <div className="resource-content">
              <h3>Tenant Rights Overview</h3>
              <p>
                Understand your rights and responsibilities as a tenant in various African countries with our comprehensive overview.
              </p>
              <a href="/resources/tenant-rights" className="button">Learn More</a>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Helpful Documents</h2>
        <p>
          Download these useful documents to assist you throughout your rental journey:
        </p>
        
        <div className="document-list">
          <div className="document-item">
            <div className="document-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="document-details">
              <h4>Sample Lease Agreement</h4>
              <p>Review a sample lease agreement to understand common terms and conditions</p>
            </div>
            <a href="/resources/sample-lease-agreement.pdf" className="download-button">Download</a>
          </div>
          
          <div className="document-item">
            <div className="document-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="document-details">
              <h4>Move-In/Move-Out Condition Report</h4>
              <p>Document the condition of your rental at move-in and move-out to avoid disputes</p>
            </div>
            <a href="/resources/condition-report.pdf" className="download-button">Download</a>
          </div>
          
          <div className="document-item">
            <div className="document-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="document-details">
              <h4>Maintenance Request Form</h4>
              <p>Use this form to request repairs or maintenance for your rental property</p>
            </div>
            <a href="/resources/maintenance-request.pdf" className="download-button">Download</a>
          </div>
          
          <div className="document-item">
            <div className="document-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="document-details">
              <h4>Roommate Agreement Template</h4>
              <p>Establish clear expectations with roommates using this customizable agreement</p>
            </div>
            <a href="/resources/roommate-agreement.pdf" className="download-button">Download</a>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Local Housing Resources</h2>
        <p>
          These organizations provide additional support and information for tenants in different regions:
        </p>
        <ul>
          <li><strong>Kenya Tenants Association</strong> - Advocacy and support for tenants in Kenya</li>
          <li><strong>Nigeria Housing Authority</strong> - Information on housing regulations and tenant rights in Nigeria</li>
          <li><strong>South African Rental Housing Tribunal</strong> - Dispute resolution for tenants and landlords in South Africa</li>
          <li><strong>Ghana Rent Control Department</strong> - Rent regulations and tenant support in Ghana</li>
        </ul>
      </div>

      <div className="cta-section">
        <h3>Need More Help?</h3>
        <p>
          Our support team is available to assist you with any questions or concerns about your rental experience.
        </p>
        <a href="/contact" className="cta-button">
          Contact Support
        </a>
      </div>
    </ResourcesPageStyles>
  );
};

export default TenantResourcesPage; 