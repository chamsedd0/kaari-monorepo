import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ProfilePageStyle = styled.div`
    display: flex;
    width: 100%;
    gap: clamp(16px, 4vw, 40px);

    .right {
        display: flex;
        flex-direction: column;
        flex: 0.35;
        gap: clamp(12px, 3vw, 32px);
    }

    .left {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: clamp(16px, 4vw, 40px);
    
        .section-title {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};
        }

        .profile-image-container {
            display: flex;
            gap: clamp(10px, 3vw, 18px);
            align-items: center;
            flex-wrap: wrap;
        
        .profile-image {
            position: relative;
            width: clamp(96px, 18vw, 150px);
            height: clamp(96px, 18vw, 150px);

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
                width: clamp(28px, 6vw, 36px);
                height: clamp(28px, 6vw, 36px);
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
            grid-template-rows: auto;
            gap: clamp(12px, 4vw, 24px) clamp(10px, 3vw, 19px);
            width: 100%;
            align-items: end;
        }

        .profile-actions {
            display: flex;
            gap: 12px;
            max-width: 100%;
            flex-wrap: wrap;
        }

        .profile-inbut-group {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: clamp(8px, 2.5vw, 12px);
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

    /* Stack columns on tablets/phones */
    @media (max-width: 1024px) {
        flex-direction: column;
        .right { order: -1; flex: 1; }
        .left { background: #fff; border: ${Theme.borders.primary}; border-radius: 12px; padding: 12px; }
    }

    @media (max-width: 700px) {
        .left .profile-grid { grid-template-columns: 1fr; }
        .left .section-title { font: ${Theme.typography.fonts.h4B}; }
    }
`;
