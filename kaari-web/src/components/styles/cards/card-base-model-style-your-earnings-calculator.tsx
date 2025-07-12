import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const CardBaseModelStyleYourEarningsCalculator = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    width: 100%;
    padding: 20px;
    border-radius: ${Theme.borders.radius.lg};
    border:${Theme.borders.primary};
    background: ${Theme.colors.white};
    
    .title{
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
    }
    
    .right-left-container{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 35px;

        .left-container{
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
            margin-top: 50px;
            gap: 20px;
            width: 60%;

            .label-slider-container{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: start;
                width: 100%;
                gap: 16px;

                .label-text{
                    font: ${Theme.typography.fonts.text14};
                    color: ${Theme.colors.black};
                }

                .slider {
                    width: 100%;
                    height: 8px;
                    background: ${Theme.colors.secondary};
                    border-radius: 4px;
                    outline: none;
                    appearance: none;
                    margin: 0;

                    &::-webkit-slider-thumb {
                        appearance: none;
                        width: 24px;
                        height: 24px;
                        background: ${Theme.colors.white};
                        border-radius: 50%;
                        box-shadow: 0 0 4px rgba(0,0,0,0.1);
                        cursor: pointer;
                        transition: background 0.3s;
                    }

                    &::-webkit-slider-runnable-track {
                        height: 8px;
                        background: linear-gradient(
                            to right,
                            ${Theme.colors.primary} 0%,
                            ${Theme.colors.primary} var(--progress, 50%),
                            ${Theme.colors.secondary} var(--progress, 50%),
                            ${Theme.colors.secondary} 100%
                        );
                        border-radius: 4px;
                    }

                    &::-moz-range-thumb {
                        width: 32px;
                        height: 32px;
                        background: ${Theme.colors.secondary};
                        border: 4px solid ${Theme.colors.primary};
                        border-radius: 50%;
                        cursor: pointer;
                    }

                    &::-moz-range-track {
                        height: 8px;
                        background: ${Theme.colors.secondary};
                        border-radius: 4px;
                    }

                    &::-ms-thumb {
                        width: 32px;
                        height: 32px;
                        background: ${Theme.colors.secondary};
                        border: 4px solid ${Theme.colors.primary};
                        border-radius: 50%;
                        cursor: pointer;
                    }

                    &::-ms-fill-lower {
                        background: ${Theme.colors.primary};
                        border-radius: 4px;
                    }

                    &::-ms-fill-upper {
                        background: ${Theme.colors.secondary};
                        border-radius: 4px;
                    }
                }
            }
            .button-container{
                width: 100%;
            }
        }

        .right-container{
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
            gap: 48px;
            border-radius: ${Theme.borders.radius.lg};
            border:${Theme.borders.primary};
            padding: 38px 12px;

            .text-container{
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: start;
                gap: 12px;
            
            .gray-text{
                font: ${Theme.typography.fonts.text14};
                color: ${Theme.colors.gray2};
            }

            .h2{
                font: ${Theme.typography.fonts.h2};
                color: ${Theme.colors.black};
            }
        }

        /* --- Stats Grid Styling --- */
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px 4px;
            width: 100%;
        }
        .stat-block {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
            gap: 8px;
        }
        .stat-label {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.gray2};
            margin-bottom: 0;
        }
        .stat-value {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};

        }

        .stat-value.mad {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};

        }
    }
}

`;