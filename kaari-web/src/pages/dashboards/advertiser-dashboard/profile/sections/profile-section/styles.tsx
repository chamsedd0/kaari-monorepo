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
        width: 100%;
    }

    

    .profile-inbut-group {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        
        
        
        

        .profile-inbut-label {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};
           margin-bottom: 32px;
            
        }
        .profile-inbut-label2 {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};
            margin-bottom: 27px;
            
        }

        .text-button {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.secondary};
            cursor: pointer;
            transition: all 0.3s ease;
            
        }
    }

    .profile-actions {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
`;
