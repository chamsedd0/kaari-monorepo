import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const BookAPhotoshootCard = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    padding: 20px 16px;
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
            width: 71px;
            height: 81px;
        }
    }
    
`;
