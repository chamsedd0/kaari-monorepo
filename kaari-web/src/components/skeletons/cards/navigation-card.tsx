import React from 'react';
import { NavigationCardBaseModalStyle } from '../../styles/cards/navigation-card-base-modal-style';

type Section = 'profile' | 'Supporting Documents' | 'Contact Details' | 'Payout Method' | 'Recommend to Friends' | 'Help';

interface NavigationCardProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({ activeSection, onSectionChange }) => {
  return (
    <NavigationCardBaseModalStyle>
      <button 
        onClick={() => onSectionChange('profile')} 
        className={`nav-link ${activeSection === 'profile' ? 'active' : ''}`}
      >
        <span className="nav-link-text">My Profile</span>
      </button>
      <button 
        onClick={() => onSectionChange('Supporting Documents')} 
        className={`nav-link ${activeSection === 'Supporting Documents' ? 'active' : ''}`}
      >
        <span className="nav-link-text">Supporting Documents</span>
      </button>
      <button 
        onClick={() => onSectionChange('Contact Details')} 
        className={`nav-link ${activeSection === 'Contact Details' ? 'active' : ''}`}
      >
        <span className="nav-link-text">Contact Details</span>
      </button>
      <button 
        onClick={() => onSectionChange('Payout Method')} 
        className={`nav-link ${activeSection === 'Payout Method' ? 'active' : ''}`}
      >
        <span className="nav-link-text">Payout Method</span>
      </button>
      <button 
        onClick={() => onSectionChange('Recommend to Friends')} 
        className={`nav-link ${activeSection === 'Recommend to Friends' ? 'active' : ''}`}
      >
        <span className="nav-link-text">Recommend to Friends</span>
      </button>
      <button 
        onClick={() => onSectionChange('Help')} 
        className={`nav-link ${activeSection === 'Help' ? 'active' : ''}`}
      >
        <span className="nav-link-text">Help</span>
      </button>
    </NavigationCardBaseModalStyle>
  );
};
