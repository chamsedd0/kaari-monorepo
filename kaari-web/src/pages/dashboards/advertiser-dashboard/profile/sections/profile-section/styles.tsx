import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';

export const ProfileSectionStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 32px;
    width: 100%;

    .section-title {
        font: ${Theme.typography.fonts.h2};
        color: ${Theme.colors.black};
    }

    .profile-image-container {
        display: flex;
        align-items: center;
        
        gap: 16px;

        .profile-image {
            width: 120px;
            height: 120px;
            border-radius: ${Theme.borders.radius.round};
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .text-button {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.secondary};
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                color: ${Theme.colors.primary};
            }
        }
    }

    .profile-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        width: 100%;
    }

    .profile-inbut-group {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .profile-inbut-label {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
        }
    }

    .profile-actions {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
`;
