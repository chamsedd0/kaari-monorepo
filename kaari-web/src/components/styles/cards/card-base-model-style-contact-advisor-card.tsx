import styled from "styled-components";
import { Theme } from "../../../theme/theme";



export const ContactAdvisorCardStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    padding: 16px 20px;
    gap: 23px;
    border-radius: 16px;
    border: ${Theme.borders.primary};
    background-color: ${Theme.colors.white};
    width: 100%;

    .title-container {
        display: flex;
        align-items: start;
        justify-content: start;
        gap: 7px;

        .title {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};
        }

        img {
            width: 20px;
            height: 20px;
        }
    }

    .description-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 8px;

        .important-text {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
        }

        .description {
            font: ${Theme.typography.fonts.text12};
            color: ${Theme.colors.gray2};
        }
        
    }

    .bottom-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        
        .left-container {
            display: flex;
            align-items: center;
            justify-content: start;
            gap: 12px;

            img {
                width: 48px;
                height: 48px;
                border-radius: ${Theme.borders.radius.extreme};

            }

            .text-container {
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: start;
                gap: 4px;

                .name {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.black};
                }

                .experience-container {
                    max-width: 134px; 
                }

        }      
    }

    .button-container {
        min-width: 140px;
    }
}
    
`