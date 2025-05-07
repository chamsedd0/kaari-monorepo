import React from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';

const PrivacyPage: React.FC = () => {
  return (
    <StaticPageWrapper>
      <div className="page-header">
        <h1>Privacy Policy</h1>
        <p className="subtitle">Last updated: June 1, 2023</p>
      </div>

      <div className="content-section">
        <h2>1. Introduction</h2>
        <p>
          At Kaari, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform and services.
        </p>
        <p>
          By using Kaari, you consent to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree with our policies and practices, please do not use our platform.
        </p>
      </div>

      <div className="content-section">
        <h2>2. Information We Collect</h2>
        <h3>Personal Information</h3>
        <p>We may collect the following types of personal information:</p>
        <ul>
          <li><strong>Identity Information:</strong> Name, date of birth, gender, profile picture</li>
          <li><strong>Contact Information:</strong> Email address, phone number, mailing address</li>
          <li><strong>Account Information:</strong> Username, password, account preferences</li>
          <li><strong>Financial Information:</strong> Payment method details, billing address, transaction history</li>
          <li><strong>Verification Information:</strong> Government ID, proof of address, employment information</li>
          <li><strong>Communication Information:</strong> Messages sent through our platform, customer support communications</li>
        </ul>
        
        <h3>Non-Personal Information</h3>
        <p>We also collect non-personal information, including:</p>
        <ul>
          <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
          <li><strong>Usage Information:</strong> Pages visited, features used, search queries, clickstream data</li>
          <li><strong>Location Information:</strong> General location based on IP address or more precise location if you enable location services</li>
          <li><strong>Cookies and Similar Technologies:</strong> Data collected through cookies, web beacons, and similar technologies</li>
        </ul>
      </div>

      <div className="content-section">
        <h2>3. How We Collect Information</h2>
        <p>We collect information through the following methods:</p>
        <ul>
          <li><strong>Direct Interactions:</strong> Information you provide when creating an account, listing or booking a property, completing forms, or communicating with us</li>
          <li><strong>Automated Technologies:</strong> Information collected automatically through cookies, web beacons, and other tracking technologies</li>
          <li><strong>Third-Party Sources:</strong> Information from business partners, identity verification services, payment processors, and publicly available sources</li>
        </ul>
      </div>

      <div className="content-section">
        <h2>4. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul>
          <li>To create and manage your account</li>
          <li>To provide and improve our services</li>
          <li>To process bookings, payments, and refunds</li>
          <li>To verify your identity and prevent fraud</li>
          <li>To facilitate communication between users</li>
          <li>To provide customer support</li>
          <li>To send administrative notices, updates, and promotional messages</li>
          <li>To personalize your experience and show relevant content</li>
          <li>To analyze usage patterns and improve our platform</li>
          <li>To comply with legal obligations</li>
        </ul>
      </div>

      <div className="content-section">
        <h2>5. Sharing Your Information</h2>
        <p>We may share your information with the following parties:</p>
        <ul>
          <li><strong>Other Users:</strong> When you book a property, we share necessary information with the property owner. When you list a property, we share appropriate information with potential tenants.</li>
          <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.</li>
          <li><strong>Business Partners:</strong> Companies we partner with to offer joint promotions or integrated services.</li>
          <li><strong>Legal Authorities:</strong> When required by law, legal process, or government request, or to protect our rights, privacy, safety, or property, or that of our users or others.</li>
          <li><strong>Business Transfers:</strong> In connection with a corporate transaction, such as a merger, acquisition, or sale of assets.</li>
        </ul>
        <p>
          We do not sell your personal information to third parties for their marketing purposes without your explicit consent.
        </p>
      </div>

      <div className="content-section">
        <h2>6. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, and regular security assessments.
        </p>
        <p>
          While we strive to protect your personal information, no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee absolute security.
        </p>
      </div>

      <div className="content-section">
        <h2>7. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements.
        </p>
        <p>
          To determine the appropriate retention period, we consider the amount, nature, and sensitivity of the data, the potential risk of harm from unauthorized use or disclosure, the purposes for which we process the data, and whether we can achieve those purposes through other means.
        </p>
      </div>

      <div className="content-section">
        <h2>8. Your Privacy Rights</h2>
        <p>Depending on your location, you may have the following rights regarding your personal information:</p>
        <ul>
          <li><strong>Access:</strong> Request access to your personal information.</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information under certain circumstances.</li>
          <li><strong>Restriction:</strong> Request restriction of processing of your personal information.</li>
          <li><strong>Data Portability:</strong> Request the transfer of your personal information to you or a third party.</li>
          <li><strong>Objection:</strong> Object to processing of your personal information for certain purposes.</li>
          <li><strong>Withdraw Consent:</strong> Withdraw consent where we rely on consent to process your personal information.</li>
        </ul>
        <p>
          To exercise these rights, please contact us using the information in the "Contact Us" section below. We may need to verify your identity before responding to your request.
        </p>
      </div>

      <div className="content-section">
        <h2>9. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to collect information about your browsing activities and to remember your preferences. Cookies help us understand how users navigate through our platform, improve our services, and provide personalized experiences.
        </p>
        <p>
          You can set your browser to refuse all or some cookies or to alert you when websites set or access cookies. However, if you disable or refuse cookies, some parts of our platform may not function properly.
        </p>
      </div>

      <div className="content-section">
        <h2>10. Children's Privacy</h2>
        <p>
          Our platform is not intended for children under 18 years of age, and we do not knowingly collect personal information from children. If you are a parent or guardian and believe we have collected information from your child, please contact us immediately.
        </p>
      </div>

      <div className="content-section">
        <h2>11. International Data Transfers</h2>
        <p>
          Your personal information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that differ from the laws of your country.
        </p>
        <p>
          When we transfer your personal information to other countries, we implement appropriate safeguards to ensure that your information receives an adequate level of protection.
        </p>
      </div>

      <div className="content-section">
        <h2>12. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>
        <p>
          We encourage you to review this Privacy Policy periodically to stay informed about how we protect your personal information.
        </p>
      </div>

      <div className="content-section">
        <h2>13. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
        </p>
        <p>
          Kaari<br />
          Kilimani Business Center<br />
          Nairobi, Kenya<br />
          Email: privacy@kaari.com
        </p>
      </div>
    </StaticPageWrapper>
  );
};

export default PrivacyPage; 