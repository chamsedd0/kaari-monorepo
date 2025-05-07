import React from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';

const CareersPage: React.FC = () => {
  return (
    <StaticPageWrapper>
      <div className="page-header">
        <h1>Careers at Kaari</h1>
        <p className="subtitle">Join our team and help transform the rental experience in Africa</p>
      </div>

      <div className="content-section">
        <h2>Why Work With Us</h2>
        <p>
          At Kaari, we're passionate about revolutionizing the property rental market. We're a dynamic, fast-growing team with a mission to make renting accessible, transparent, and safe for everyone in Africa.
        </p>
        <p>
          Joining our team means becoming part of a company that values innovation, inclusivity, and impact. We're looking for talented individuals who share our vision and want to make a difference.
        </p>
      </div>

      <div className="content-section">
        <h2>Our Culture</h2>
        <p>
          We believe in creating a work environment that fosters creativity, collaboration, and personal growth. Our core values include:
        </p>
        <ul>
          <li><strong>Innovation:</strong> We encourage new ideas and approaches to solving challenges</li>
          <li><strong>Integrity:</strong> We operate with honesty and transparency in all we do</li>
          <li><strong>Impact:</strong> We measure success by the positive change we create</li>
          <li><strong>Inclusion:</strong> We celebrate diversity and ensure everyone feels welcome</li>
          <li><strong>Excellence:</strong> We strive for the highest standards in our work</li>
        </ul>
      </div>

      <div className="content-section">
        <h2>Benefits & Perks</h2>
        <ul>
          <li>Competitive compensation packages</li>
          <li>Flexible working arrangements</li>
          <li>Professional development opportunities</li>
          <li>Health and wellness benefits</li>
          <li>Team building events and activities</li>
          <li>Opportunity to make a real impact in the African rental market</li>
        </ul>
      </div>

      <div className="content-section">
        <h2>Open Positions</h2>
        <p>
          We're always looking for talented people to join our team. Check out our current openings below:
        </p>
        
        <h3>Technology</h3>
        <ul>
          <li>Senior Frontend Developer (React)</li>
          <li>Backend Developer (Node.js)</li>
          <li>Mobile App Developer (React Native)</li>
          <li>UI/UX Designer</li>
        </ul>
        
        <h3>Operations</h3>
        <ul>
          <li>Property Verification Specialist</li>
          <li>Customer Success Manager</li>
          <li>Operations Coordinator</li>
        </ul>
        
        <h3>Marketing & Sales</h3>
        <ul>
          <li>Digital Marketing Specialist</li>
          <li>Content Creator</li>
          <li>Partnership Manager</li>
        </ul>
      </div>

      <div className="cta-section">
        <h3>Join Our Team</h3>
        <p>
          Don't see a position that matches your skills? We'd still love to hear from you! Send your resume and a cover letter explaining why you'd be a great fit for Kaari.
        </p>
        <a href="/apply" className="cta-button">
          Apply Now
        </a>
      </div>
    </StaticPageWrapper>
  );
};

export default CareersPage; 