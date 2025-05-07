import React from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';

const AboutUsPage: React.FC = () => {
  return (
    <StaticPageWrapper>
      <div className="page-header">
        <h1>About Kaari</h1>
        <p className="subtitle">Transforming the rental experience across Africa</p>
      </div>

      <div className="content-section">
        <h2>Our Story</h2>
        <p>
          Kaari was founded in 2023 with a simple mission: to make renting properties in Africa as easy, transparent, and safe as possible. We saw the challenges that both tenants and property owners faced in the traditional rental market and set out to create a platform that addresses these issues head-on.
        </p>
        <p>
          Our team consists of real estate professionals, technology experts, and customer service specialists who are passionate about improving the rental experience for everyone involved.
        </p>
      </div>

      <div className="content-section">
        <h2>Our Mission</h2>
        <p>
          At Kaari, our mission is to revolutionize the rental market in Africa by providing a platform that offers:
        </p>
        <ul>
          <li>Verified, high-quality rental properties</li>
          <li>Transparent pricing and terms</li>
          <li>Enhanced protection for both tenants and property owners</li>
          <li>Streamlined booking and management processes</li>
          <li>Exceptional customer support at every step</li>
        </ul>
      </div>

      <div className="content-section">
        <h2>What Sets Us Apart</h2>
        <h3>Verified Properties</h3>
        <p>
          Every property on our platform is personally inspected by our team to ensure it meets our quality standards. We verify all details and take professional photos to provide an accurate representation of each property.
        </p>

        <h3>StayProtection™</h3>
        <p>
          Our unique protection policy offers peace of mind to both tenants and advertisers, covering various unexpected situations and providing mediation in case of disputes.
        </p>

        <h3>Local Expertise</h3>
        <p>
          We have a deep understanding of the local rental markets across Africa, enabling us to provide valuable insights and support to our users.
        </p>
      </div>

      <div className="content-section">
        <h2>Our Team</h2>
        <p>
          Behind Kaari is a dedicated team of professionals committed to transforming the rental experience. Our diverse team brings together expertise in real estate, technology, customer service, and local market knowledge.
        </p>
      </div>

      <div className="cta-section">
        <h3>Join the Kaari Community</h3>
        <p>
          Whether you're looking for your next home or wanting to list your property, Kaari is here to make your experience better than ever before.
        </p>
        <a href="/signup" className="cta-button">
          Get Started Today
        </a>
      </div>
    </StaticPageWrapper>
  );
};

export default AboutUsPage; 