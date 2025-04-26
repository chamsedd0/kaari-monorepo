import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';

export const ProfileSectionStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 40px;
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
            font: ${Theme.typography.fonts.link16};
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
        width: 100%;
   
    .profile-inbut-label {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.black}; 
    }
    .text-button {
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${Theme.colors.secondary};
            font: ${Theme.typography.fonts.link16};
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 8px 0;
            text-decoration: underline;
            width: fit-content;
            
            &:hover {
                opacity: 0.8;
            }
            
            &:active {
                opacity: 0.6;
            }
        }
}
    

    .profile-actions {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
`;
