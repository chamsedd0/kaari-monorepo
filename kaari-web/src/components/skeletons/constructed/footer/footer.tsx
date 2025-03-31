import { FooterWrapper } from '../../../styles/constructed/footer/footer-style';
import { Link } from 'react-router-dom';
import { FaTelegram, FaInstagram, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import Logo from '../../icons/LogoWhite.svg';

const Footer = () => {
  return (
    <FooterWrapper>
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">
            <img src={Logo} alt="Kaari Logo" />
          </div>
          <p className="description">
            Kaari is an online platform in Africa dedicated to monthly rentals. It features hand-picked properties, each verified through personal inspections, provides high-quality content, and offers an exceptional tenant protection policy.
          </p>
          <div className="social-wrapper">
          <h1>Follow Us</h1>
          <div className="social-links">
            
            <a href="https://t.me/kaari" target="_blank" rel="noopener noreferrer">
              <FaTelegram />
            </a>
            <a href="https://instagram.com/kaari" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com/company/kaari" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com/kaari" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://facebook.com/kaari" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
          </div>
          </div>
        </div>

        <div className="footer-section">
          <h3>Kaari</h3>
          <ul>
            <li><Link to="/become-a-partner">Become a Partner</Link></li>
            <li><Link to="/contact">Contact and Impressum</Link></li>
            <li><Link to="/terms">Terms and Conditions</Link></li>
            <li><Link to="/privacy">Personal data protection</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Tenants</h3>
          <ul>
            <li><Link to="/stay-protection-tenants">StayProtection for Tenants</Link></li>
            <li><Link to="/help-tenants">Help for Tenants</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Advertisers</h3>
          <ul>
            <li><Link to="/signin">Sign in</Link></li>
            <li><Link to="/overview">Overview</Link></li>
            <li><Link to="/stay-protection-advertisers">StayProtection for Advertisers</Link></li>
            <li><Link to="/help-advertisers">Help for Advertisers</Link></li>
          </ul>
        </div>
      </div>
    </FooterWrapper>
  );
};

export default Footer;
