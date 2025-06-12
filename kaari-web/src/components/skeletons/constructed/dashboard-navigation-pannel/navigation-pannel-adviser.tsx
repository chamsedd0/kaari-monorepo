import React from 'react';
import { NavigationPannelDashboardStyle } from "../../../styles/constructed/dashboard-navigation-pannel/navigation-pannel-dashboard-style";
import { Link } from 'react-router-dom';

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
import ReferralProgramIcon from "../../icons/Icon-ReferralProgram.svg";

type Section = 'Dashboard' | 'MyProfile' | 'Messages' | 'Properties' | 'Reservations' | 'Reviews' | 'Payments' | 'Tenants' | 'Photoshoot' | 'Support' | 'ReferralProgram';

interface NavigationPannelAdviserProps {
    activeSection: Section;
    onSectionChange: (section: Section) => void;
    getTranslatedSectionName?: (section: Section) => string;
}

export const NavigationPannelAdviser: React.FC<NavigationPannelAdviserProps> = ({ 
    activeSection, 
    onSectionChange,
    getTranslatedSectionName = (section) => section === 'MyProfile' ? 'My Profile' : section === 'ReferralProgram' ? 'Referral Program' : section
}) => {
    return (
        <NavigationPannelDashboardStyle>
            <button 
                onClick={() => onSectionChange('Dashboard')} 
                className={`nav-link ${activeSection === 'Dashboard' ? 'active' : ''}`}
                aria-current={activeSection === 'Dashboard' ? 'page' : undefined}
            >
                <img src={DashboardIcon} alt="Dashboard" className="nav-link-icon" />
                <span className="nav-link-text">{getTranslatedSectionName('Dashboard')}</span>
            </button>
            <button 
                onClick={() => onSectionChange('MyProfile')} 
                className={`nav-link ${activeSection === 'MyProfile' ? 'active' : ''}`}
                aria-current={activeSection === 'MyProfile' ? 'page' : undefined}
            >
                <img src={ProfileIcon} alt="Profile" className="nav-link-icon" />
                <span className="nav-link-text">{getTranslatedSectionName('MyProfile')}</span>
            </button>
            <button 
                onClick={() => onSectionChange('Messages')} 
                className={`nav-link ${activeSection === 'Messages' ? 'active' : ''}`}
                aria-current={activeSection === 'Messages' ? 'page' : undefined}
            >
                <img src={MessagesIcon} alt="Messages" className="nav-link-icon" />
                <span className="nav-link-text">{getTranslatedSectionName('Messages')}</span>
            </button>
            <button 
                onClick={() => onSectionChange('Properties')} 
                className={`nav-link ${activeSection === 'Properties' ? 'active' : ''}`}
                aria-current={activeSection === 'Properties' ? 'page' : undefined}
            >
                <img src={PropertiesIcon} alt="Properties" className="nav-link-icon" />
                <span className="nav-link-text">{getTranslatedSectionName('Properties')}</span>
            </button>
            <button 
                onClick={() => onSectionChange('Reservations')} 
                className={`nav-link ${activeSection === 'Reservations' ? 'active' : ''}`}
                aria-current={activeSection === 'Reservations' ? 'page' : undefined}
            >
                <img src={ReservationsIcon} alt="Reservations" className="nav-link-icon" />
                <span className="nav-link-text">{getTranslatedSectionName('Reservations')}</span>
            </button>
            <button 
                onClick={() => onSectionChange('Reviews')} 
                className={`nav-link ${activeSection === 'Reviews' ? 'active' : ''}`}
                aria-current={activeSection === 'Reviews' ? 'page' : undefined}
            >
                <img src={ReviewsIcon} alt="Reviews" className="nav-link-icon" />
                <span className="nav-link-text">{getTranslatedSectionName('Reviews')}</span>
            </button>
            <button 
                onClick={() => onSectionChange('Payments')} 
                className={`nav-link ${activeSection === 'Payments' ? 'active' : ''}`}
                aria-current={activeSection === 'Payments' ? 'page' : undefined}
            >
                <img src={PaymentsIcon} alt="Payments" className="nav-link-icon" />
                <span className="nav-link-text">{getTranslatedSectionName('Payments')}</span>
            </button>
            <button 
                onClick={() => onSectionChange('Tenants')} 
                className={`nav-link ${activeSection === 'Tenants' ? 'active' : ''}`}
                aria-current={activeSection === 'Tenants' ? 'page' : undefined}
            >
                <img src={TenantsIcon} alt="Tenants" className="nav-link-icon" />
                <span className="nav-link-text">{getTranslatedSectionName('Tenants')}</span>
            </button>
            <button 
                onClick={() => onSectionChange('ReferralProgram')} 
                className={`nav-link ${activeSection === 'ReferralProgram' ? 'active' : ''}`}
                aria-current={activeSection === 'ReferralProgram' ? 'page' : undefined}
            >
                <img src={ReferralProgramIcon} alt="Referral Program" className="nav-link-icon" />
                <span className="nav-link-text">{getTranslatedSectionName('ReferralProgram')}</span>
            </button>
            <button 
                onClick={() => onSectionChange('Photoshoot')} 
                className={`nav-link ${activeSection === 'Photoshoot' ? 'active' : ''}`}
                aria-current={activeSection === 'Photoshoot' ? 'page' : undefined}
            >
                <img src={PhotoshootIcon} alt="Photoshoot" className="nav-link-icon" />
                <span className="nav-link-text">{getTranslatedSectionName('Photoshoot')}</span>
            </button>
            <button 
                onClick={() => onSectionChange('Support')} 
                className={`nav-link ${activeSection === 'Support' ? 'active' : ''}`}
                aria-current={activeSection === 'Support' ? 'page' : undefined}
            >
                <img src={SupportIcon} alt="Support" className="nav-link-icon" />
                <span className="nav-link-text">{getTranslatedSectionName('Support')}</span>
            </button>
        </NavigationPannelDashboardStyle>
    );
};
