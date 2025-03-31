import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

const NavigationCardStyle = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: ${Theme.borders.radius.md};
        cursor: pointer;
        transition: all 0.3s ease;
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.largeM};

        &:hover {
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

const sections = [
    { id: 'profile', label: 'Profile' },
    { id: 'documents', label: 'Supporting Documents' },
    { id: 'contact', label: 'Contact Details' },
    { id: 'payout', label: 'Payout Methods' },
    { id: 'recommend', label: 'Recommend to Friend' },
    { id: 'password', label: 'Change Password' }
];

export const NavigationCard: React.FC<NavigationCardProps> = ({
    activeSection,
    onSectionChange
}) => {
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
