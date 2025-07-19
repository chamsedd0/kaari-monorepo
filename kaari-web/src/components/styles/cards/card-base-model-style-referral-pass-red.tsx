import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const CardBaseModelStyleReferralPassred = styled.div`
   display: flex;
    align-items: stretch;
    justify-content: space-between;
    width: 100%;
    background: linear-gradient(to right, rgba(143, 39, 206, 1), rgba(199, 22, 25, 1));
    border-radius: ${Theme.borders.radius.lg};
    max-height: 320px;
    padding: 24px 20px;
    gap: 20px;


    .left-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 20px;
        width: 48%;


        .title-text {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.white};
        }

        .time-container {
            display: flex;
            flex-direction: column;
            align-items: start; 
            gap: 10px;

            .countdown-timer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: white;
                border-radius: ${Theme.borders.radius.md};
                width: 100%;
                
                .timer-block {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: ${Theme.borders.radius.md};
                    min-width: 84px;
                    height: 94px;
                    flex: 1;
                    
                    .time {
                        font: ${Theme.typography.fonts.h2};

                    }
                    
                    .label {
                        font: ${Theme.typography.fonts.mediumM};

                    }
                }
                
                .separator {
                    font: ${Theme.typography.fonts.h2};
                    margin-bottom: 10px;
                }
            }

            .time-text {
                font: ${Theme.typography.fonts.text14};
                color: ${Theme.colors.white};
            }
        }
    }

    .right-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 10px;
        margin-top: 20px;
        width: 52%;

        .welcome-message {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 20px;
            border-radius: ${Theme.borders.radius.md};
            margin-bottom: 20px;

            h3 {
                font: ${Theme.typography.fonts.largeB};
                margin: 0 0 10px 0;
            }

            p {
                font: ${Theme.typography.fonts.mediumM};
                margin: 0;
            }
        }

        .icon-text12-container {
            display: flex;
            align-items: start;
            justify-content: start;
            gap: 4px;

            img {
                width: 20px;
                height: 20px;
            }

            .text-12 {
                font: ${Theme.typography.fonts.text12};
                color: ${Theme.colors.white};
            }
        }
    }

`;