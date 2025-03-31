import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ProfilePageStyle = styled.div`
    display: flex;
    width: 100%;
    gap: 40px;

    .right {
        display: flex;
        flex-direction: column;
        flex: 0.4;
        gap: 32px;
    }

    .left {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 40px;
    
        .section-title {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};
        }

        .profile-image-container {
            display: flex;
            gap: 18px;
        
        .profile-image {
            position: relative;
            width: 150px;
            height: 150px;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            }

            .edit-button {
                position: absolute;
                bottom: 0;
                right: 0;
                background: ${Theme.colors.primary};
                color: white;
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                cursor: pointer;
            }
        }

        }

        .your-info-text {
            font: ${Theme.typography.fonts.h4B};
            color: ${Theme.colors.black};
        }

        .profile-grid {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 40px 19px;
            width: 100%;
            align-items: end;
        }

        .profile-actions {
            display: flex;
            gap: 16px;
            max-width: 200px;
        }

        .profile-inbut-group {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
        }

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
`;
