import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const BookAPhotoshootCard = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    padding: clamp(14px, 3.5vw, 20px) clamp(12px, 3vw, 16px);
    display: flex;
    flex-direction: column;
    gap: 20px;

    .text-picture-container {
        display: flex;
        align-items: center;
        gap: 15px;

        .text-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            
            .host-text {
                font: ${Theme.typography.fonts.mediumB};
                color: ${Theme.colors.black};
            }

            .book-a-photoshoot-text {
                font: ${Theme.typography.fonts.extraLargeB};
                color: ${Theme.colors.black};
            }

            .info-text {
                font: ${Theme.typography.fonts.text12};
                color: ${Theme.colors.gray2};
            }
        }

        .picture-container {
            width: clamp(56px, 10vw, 70px);
            height: clamp(64px, 12vw, 80px);
        }
    }
    
    @media (max-width: 640px) {
        .text-picture-container { align-items: flex-start; gap: 12px; }
        .text-picture-container .text-container .book-a-photoshoot-text { font: ${Theme.typography.fonts.largeB}; }
        .text-picture-container .text-container .info-text { font: ${Theme.typography.fonts.text12}; }
    }
    
`;
