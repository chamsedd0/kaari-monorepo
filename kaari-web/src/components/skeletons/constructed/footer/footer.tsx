import { FooterWrapper } from '../../../styles/constructed/footer/footer-style';
import { Link } from 'react-router-dom';
import { FaTelegram, FaInstagram, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import Logo from '../../icons/LogoWhite.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterWrapper>
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">
            <img src={Logo} alt="Kaari Logo" />
          </div>
          <p className="description">
            Kaari is an online platform in Africa dedicated to monthly rentals. We feature hand-picked properties, each verified through personal inspections, providing high-quality content and an exceptional tenant protection policy.
          </p>
          <div className="social-wrapper">
            <h1>Connect With Us</h1>
            <div className="social-links">
              <a href="https://t.me/kaari" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <FaTelegram />
              </a>
              <a href="https://instagram.com/kaari" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com/company/kaari" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com/kaari" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://facebook.com/kaari" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop/Tablet sections */}
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/become-a-partner">Become a Partner</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>For Tenants</h3>
          <ul>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/stay-protection-tenants">StayProtection™</Link></li>
            <li><Link to="/help-tenants">Help Center</Link></li>
            <li><Link to="/tenant-resources">Resources</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>For Advertisers</h3>
          <ul>
            <li><Link to="/signin">Sign In</Link></li>
            <li><Link to="/advertiser-guide">Advertiser Guide</Link></li>
            <li><Link to="/stay-protection-advertisers">StayProtection™</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Mobile-only collapsible sections */}
        <div className="footer-sections-mobile">
          <details>
            <summary>Company</summary>
            <ul>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/become-a-partner">Become a Partner</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </details>
          <details>
            <summary>For Tenants</summary>
            <ul>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/stay-protection-tenants">StayProtection™</Link></li>
              <li><Link to="/help-tenants">Help Center</Link></li>
              <li><Link to="/tenant-resources">Resources</Link></li>
              <li><Link to="/testimonials">Testimonials</Link></li>
            </ul>
          </details>
          <details>
            <summary>For Advertisers</summary>
            <ul>
              <li><Link to="/signin">Sign In</Link></li>
              <li><Link to="/advertiser-guide">Advertiser Guide</Link></li>
              <li><Link to="/stay-protection-advertisers">StayProtection™</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </details>
        </div>
      </div>
      
      <div className="copyright">
        © {currentYear} Kaari. All Rights Reserved. <Link to="/terms">Terms</Link> • <Link to="/privacy">Privacy</Link>
      </div>
    </FooterWrapper>
  );
};

export default Footer;
