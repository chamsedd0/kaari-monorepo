import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const CardBaseModelStyleUpcomingPhotoshoot = styled.div`
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
                width: 100px;
                height: 100px;
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

                .description2 {
                    font: ${Theme.typography.fonts.text16};
                    color: ${Theme.colors.black};
                    max-width: 352px;
                    line-height: 1.7;
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
        width: 100%;    
        justify-content: space-between;
        align-items: center;

        .button-container{
            width: 60%;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .upload-Icon{
            width: 32px;
            height: 32px;
            align-self: end;
            
        }

    }
`;