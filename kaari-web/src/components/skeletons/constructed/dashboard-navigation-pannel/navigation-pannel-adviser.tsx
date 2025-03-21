import React from 'react';
import { NavigationPannelDashboardStyle } from "../../../styles/constructed/dashboard-navigation-pannel/navigation-pannel-dashboard-style";

import DashboardIcon from "../../icons/Icon-Dashboard.svg";
import ProfileIcon from "../../icons/Icon-Profile.svg";
import MessagesIcon from "../../icons/Icon-Messages.svg";
import PropertiesIcon from "../../icons/Icon-Property.svg";
import ReservationsIcon from "../../icons/Icon-Reservation.svg";
import ReviewsIcon from "../../icons/Icon-Review.svg";
import PaymentsIcon from "../../icons/Icon-Payments.svg";
import TenantsIcon from "../../icons/Icon-Tenants.svg";
import PhotoshootIcon from "../../icons/Icon-Photoshoot.svg";
import SupportIcon from "../../icons/Icon-Support.svg";

type Section = 'Dashboard' | 'MyProfile' | 'Messages' | 'Properties' | 'Reservations' | 'Reviews' | 'Payments' | 'Tenants' | 'Photoshoot' | 'Support';

interface NavigationPannelAdviserProps {
    activeSection: Section;
    onSectionChange: (section: Section) => void;
}

export const NavigationPannelAdviser: React.FC<NavigationPannelAdviserProps> = ({ activeSection, onSectionChange }) => {
    return (
        <NavigationPannelDashboardStyle>
            <button 
                onClick={() => onSectionChange('Dashboard')} 
                className={`nav-link ${activeSection === 'Dashboard' ? 'active' : ''}`}
            >
                <img src={DashboardIcon} alt="Dashboard" className="nav-link-icon" />
                <span className="nav-link-text">Dashboard</span>
            </button>
            <button 
                onClick={() => onSectionChange('MyProfile')} 
                className={`nav-link ${activeSection === 'MyProfile' ? 'active' : ''}`}
            >
                <img src={ProfileIcon} alt="Profile" className="nav-link-icon" />
                <span className="nav-link-text">My Profile</span>
            </button>
            <button 
                onClick={() => onSectionChange('Messages')} 
                className={`nav-link ${activeSection === 'Messages' ? 'active' : ''}`}
            >
                <img src={MessagesIcon} alt="Messages" className="nav-link-icon" />
                <span className="nav-link-text">Messages</span>
            </button>
            <button 
                onClick={() => onSectionChange('Properties')} 
                className={`nav-link ${activeSection === 'Properties' ? 'active' : ''}`}
            >
                <img src={PropertiesIcon} alt="Properties" className="nav-link-icon" />
                <span className="nav-link-text">Properties</span>
            </button>
            <button 
                onClick={() => onSectionChange('Reservations')} 
                className={`nav-link ${activeSection === 'Reservations' ? 'active' : ''}`}
            >
                <img src={ReservationsIcon} alt="Reservations" className="nav-link-icon" />
                <span className="nav-link-text">Reservations</span>
            </button>
            <button 
                onClick={() => onSectionChange('Reviews')} 
                className={`nav-link ${activeSection === 'Reviews' ? 'active' : ''}`}
            >
                <img src={ReviewsIcon} alt="Reviews" className="nav-link-icon" />
                <span className="nav-link-text">Reviews</span>
            </button>
            <button 
                onClick={() => onSectionChange('Payments')} 
                className={`nav-link ${activeSection === 'Payments' ? 'active' : ''}`}
            >
                <img src={PaymentsIcon} alt="Payments" className="nav-link-icon" />
                <span className="nav-link-text">Payments</span>
            </button>
            <button 
                onClick={() => onSectionChange('Tenants')} 
                className={`nav-link ${activeSection === 'Tenants' ? 'active' : ''}`}
            >
                <img src={TenantsIcon} alt="Tenants" className="nav-link-icon" />
                <span className="nav-link-text">Tenants</span>
            </button>
            <button 
                onClick={() => onSectionChange('Photoshoot')} 
                className={`nav-link ${activeSection === 'Photoshoot' ? 'active' : ''}`}
            >
                <img src={PhotoshootIcon} alt="Photoshoot" className="nav-link-icon" />
                <span className="nav-link-text">Photoshoot</span>
            </button>
            <button 
                onClick={() => onSectionChange('Support')} 
                className={`nav-link ${activeSection === 'Support' ? 'active' : ''}`}
            >
                <img src={SupportIcon} alt="Support" className="nav-link-icon" />
                <span className="nav-link-text">Support</span>
            </button>
        </NavigationPannelDashboardStyle>
    );
};
