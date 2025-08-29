import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { useTranslation } from 'react-i18next';

const NavigationCardStyle = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    padding: clamp(8px, 2.2vw, 12px);
    display: flex;
    flex-direction: column;

    .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: clamp(12px, 2.6vw, 16px) clamp(16px, 3.2vw, 24px);
        border-radius: ${Theme.borders.radius.md};
        cursor: pointer;
        transition: all 0.3s ease;
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.largeB};


        &:hover {
            color: ${Theme.colors.white};
            background-color: ${Theme.colors.quaternary};
        }

        &.active {
            background-color: ${Theme.colors.secondary};
            color: ${Theme.colors.white};
        }

        
    }

    @media (max-width: 700px) {
        position: sticky;
        top: 0;
        z-index: 5;
        padding: 0;
        border-radius: 12px;
        overflow-x: auto;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        background: #fafafa;
        border: ${Theme.borders.primary};
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
        &::-webkit-scrollbar { display: none; }

        .nav-item {
            padding: 14px 12px;
            text-align: center;
            border-radius: 0;
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.gray2};
            background: transparent;
            position: relative;
        }
        .nav-item.active { 
            background: #fff; 
            color: ${Theme.colors.secondary}; 
        }
        .nav-item.active::after {
            content: '';
            position: absolute;
            left: 20%;
            right: 20%;
            bottom: 0;
            height: 3px;
            border-radius: 3px 3px 0 0;
            background: ${Theme.colors.secondary};
        }
        .nav-item:hover { background: transparent; color: ${Theme.colors.secondary}; }
    }
`;

interface NavigationCardProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
    activeSection,
    onSectionChange
}) => {
    const { t } = useTranslation();
    
    const sections = [
        { id: t('advertiser_dashboard.profile.profile_section'), label: t('advertiser_dashboard.profile.navigation.profile') },
        { id: t('advertiser_dashboard.profile.documents_section'), label: t('advertiser_dashboard.profile.navigation.documents') },
        { id: t('advertiser_dashboard.profile.payout_section'), label: t('advertiser_dashboard.profile.navigation.payout') },
        { id: t('advertiser_dashboard.profile.password_section'), label: t('advertiser_dashboard.profile.navigation.password') }
    ];
    
    return (
        <NavigationCardStyle>
            {sections.map((section) => (
                <div
                    key={section.id}
                    className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => onSectionChange(section.id)}
                >
                    {section.label}
                </div>
            ))}
        </NavigationCardStyle>
    );
};
