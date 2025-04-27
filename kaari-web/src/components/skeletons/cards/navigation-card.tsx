import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { useTranslation } from 'react-i18next';

const NavigationCardStyle = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    padding: 12px;
    display: flex;
    flex-direction: column;

    .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
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
        { id: t('advertiser_dashboard.profile.contact_section'), label: t('advertiser_dashboard.profile.navigation.contact') },
        { id: t('advertiser_dashboard.profile.payout_section'), label: t('advertiser_dashboard.profile.navigation.payout') },
        { id: t('advertiser_dashboard.profile.recommend_section'), label: t('advertiser_dashboard.profile.navigation.recommend') },
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
