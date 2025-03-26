import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const CardBaseModelStyleUnassignedPhotoshoot = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.lg};


    .first-container {
        display: flex;
        justify-content: space-between;
        align-items: start;

        .title-container {
            display: flex;
            gap: 12px;
            justify-content: center;
            align-items: center;

            .circle-number {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 24px;
                height: 24px;
                border-radius: ${Theme.borders.radius.round};
                background-color: ${Theme.colors.secondary};
                color: ${Theme.colors.white};
                font: ${Theme.typography.fonts.mediumB};
            }

            .title {
                font: ${Theme.typography.fonts.h4B};
                color: ${Theme.colors.black};
            }
        }

        .info-text{
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
        }
    }

    .middle-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .left-container {
            display: flex;
            gap: 8px;
            align-items: center;
            
            img {
                width: 56px;
                height: 56px;
                object-fit: cover;
                border-radius: ${Theme.borders.radius.extreme};
                filter: brightness(0.9)
            }

            .personal-info-container {
                display: flex;
                flex-direction: column;
                gap: 8px;

                .name {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.black};
                }

                .info {
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                }

                

            }
        }

        .right-container {
            display: flex;
            align-items: center;
            flex-direction: column;
            
            .date{
                font: ${Theme.typography.fonts.extraLargeM};
                color: ${Theme.colors.black};
            }

            .time{
                font: ${Theme.typography.fonts.h25};
                color: ${Theme.colors.black};
            }
            
        }
    }

    .bottom-container {
        display: flex;
        align-items: center;
        gap: 12px;

    }
`;