import React from 'react';
import { NavigationPannelDashboardStyle } from "../../../styles/constructed/dashboard-navigation-pannel/navigation-pannel-dashboard-style";
import { Link } from 'react-router-dom';

import ProfileIcon from "../../icons/Icon-Profile.svg";
import MessagesIcon from "../../icons/Icon-Messages.svg";
import ReservationsIcon from "../../icons/Icon-Reservation.svg";
import ReviewsIcon from "../../icons/Icon-Review.svg";
import PaymentsIcon from "../../icons/Icon-Payments.svg";
import PerksIcon from "../../icons/Icon-Perks.svg";
import SettingsIcon from "../../icons/Icon-Settings.svg";
import ContactsIcon from "../../icons/Phone-Icon.svg";
import FaqIcon from "../../icons/Icon-Support.svg";

type Section = 'profile' | 'messages' | 'reservations' | 'reviews' | 'payments' | 'perks' | 'settings' | 'contacts' | 'faq';

interface NavigationPannelProps {
    activeSection: Section;
    onSectionChange: (section: Section) => void;
}

export const NavigationPannel: React.FC<NavigationPannelProps> = ({ activeSection, onSectionChange }) => {
    return (
        <NavigationPannelDashboardStyle>
            <button 
                onClick={() => onSectionChange('profile')} 
                className={`nav-link ${activeSection === 'profile' ? 'active' : ''}`}
                aria-current={activeSection === 'profile' ? 'page' : undefined}
            >
                <img src={ProfileIcon} alt="Profile" className="nav-link-icon" />
                <span className="nav-link-text">My Profile</span>
            </button>
            <button 
                onClick={() => onSectionChange('messages')} 
                className={`nav-link ${activeSection === 'messages' ? 'active' : ''}`}
                aria-current={activeSection === 'messages' ? 'page' : undefined}
            >
                <img src={MessagesIcon} alt="Messages" className="nav-link-icon" />
                <span className="nav-link-text">Messages</span>
            </button>
            <button 
                onClick={() => onSectionChange('reservations')} 
                className={`nav-link ${activeSection === 'reservations' ? 'active' : ''}`}
                aria-current={activeSection === 'reservations' ? 'page' : undefined}
            >
                <img src={ReservationsIcon} alt="Reservations" className="nav-link-icon" />
                <span className="nav-link-text">Reservations</span>
            </button>
            <button 
                onClick={() => onSectionChange('reviews')} 
                className={`nav-link ${activeSection === 'reviews' ? 'active' : ''}`}
                aria-current={activeSection === 'reviews' ? 'page' : undefined}
            >
                <img src={ReviewsIcon} alt="Reviews" className="nav-link-icon" />
                <span className="nav-link-text">Reviews</span>
            </button>
            <button 
                onClick={() => onSectionChange('payments')} 
                className={`nav-link ${activeSection === 'payments' ? 'active' : ''}`}
                aria-current={activeSection === 'payments' ? 'page' : undefined}
            >
                <img src={PaymentsIcon} alt="Payments" className="nav-link-icon" />
                <span className="nav-link-text">Payments</span>
            </button>
            <button 
                onClick={() => onSectionChange('settings')} 
                className={`nav-link ${activeSection === 'settings' ? 'active' : ''}`}
                aria-current={activeSection === 'settings' ? 'page' : undefined}
            >
                <img src={SettingsIcon} alt="Settings" className="nav-link-icon" />
                <span className="nav-link-text">Settings</span>
            </button>
            <button 
                onClick={() => onSectionChange('contacts')} 
                className={`nav-link ${activeSection === 'contacts' ? 'active' : ''}`}
                aria-current={activeSection === 'contacts' ? 'page' : undefined}
            >
                <img src={ContactsIcon} alt="Contacts" className="nav-link-icon" />
                <span className="nav-link-text">Contacts</span>
            </button>
            <button 
                onClick={() => onSectionChange('faq')} 
                className={`nav-link ${activeSection === 'faq' ? 'active' : ''}`}
                aria-current={activeSection === 'faq' ? 'page' : undefined}
            >
                <img src={FaqIcon} alt="FAQ" className="nav-link-icon" />
                <span className="nav-link-text">FAQ</span>
            </button>
        </NavigationPannelDashboardStyle>
    );
};
