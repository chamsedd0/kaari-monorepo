import styled from "styled-components";
import { Theme } from "../../../theme/theme";

interface EarningsCalculatorProps {
  referralsThumbPos?: number;
  showReferralsValue?: boolean;
  referralsValue?: number;
  rentThumbPos?: number;
  showRentValue?: boolean;
  rentValue?: number;
}

export const CardBaseModelStyleYourEarningsCalculator = styled.div<EarningsCalculatorProps>`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    width: 100%;
    padding: 18px;
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


        .left-container{
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
            margin-top: 50px;
            gap: 20px;
            width: 50%;

            .label-slider-container{
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: start;
                width: 100%;
                gap: 18px;

                .label-text{
                    font: ${Theme.typography.fonts.mediumB};
                    color: ${Theme.colors.black};
                }

                .slider {
                    width: 100%;
                    height: 24px; /* Make the slider height equal to the thumb for easier centering */
                    background: transparent;
                    border-radius: 4px;
                    outline: none;
                    appearance: none;
                    margin: 0;
                    position: relative;
                    z-index: 1;

                    &::-webkit-slider-thumb {
                        appearance: none;
                        width: 24px;
                        height: 24px;
                        background: ${Theme.colors.white};
                        border-radius: 50%;
                        box-shadow: 0 0 4px rgba(0,0,0,0.1);
                        cursor: pointer;
                        transition: background 0.3s;
                        margin-top: -8px; /* Center the thumb on an 8px track */
                        &:active {
                            background: rgba(207, 171, 229, 1);
                        }
                    }

                    &::-webkit-slider-runnable-track {
                        height: 8px;
                        background: linear-gradient(
                            to right,
                            ${Theme.colors.secondary} 0%,
                            ${Theme.colors.secondary} var(--progress, 50%),
                            rgba(245, 228, 255, 1) var(--progress, 50%),
                            rgba(245, 228, 255, 1) 100%
                        );
                        border-radius: 4px;
                    }

                    &::-moz-range-thumb {
                        width: 24px;
                        height: 24px;
                        background: ${Theme.colors.white};
                        border-radius: 50%;
                        box-shadow: 0 0 4px rgba(0,0,0,0.1);
                        cursor: pointer;
                        border: none;
                        /* Firefox centers by default, but ensure no border offset */
                        &:active {
                            background: rgba(207, 171, 229, 1);
                        }
                    }

                    &::-moz-range-track {
                        height: 8px;
                        background: linear-gradient(
                            to right,
                            ${Theme.colors.secondary} 0%,
                            ${Theme.colors.secondary} var(--progress, 50%),
                            rgba(245, 228, 255, 1) var(--progress, 50%),
                            rgba(245, 228, 255, 1) 100%
                        );
                        border-radius: 4px;
                    }

                    &::-ms-thumb {
                        width: 24px;
                        height: 24px;
                        background: ${Theme.colors.white};
                        border-radius: 50%;
                        box-shadow: 0 0 4px rgba(0,0,0,0.1);
                        cursor: pointer;
                        border: none;
                        margin-top: 0; /* For IE/Edge, may need adjustment */
                        &:active {
                            background: rgba(207, 171, 229, 1);
                        }
                    }

                    &::-ms-fill-lower {
                        background: ${Theme.colors.secondary};
                        border-radius: 4px;
                        height: 8px;
                    }

                    &::-ms-fill-upper {
                        background: rgba(245, 228, 255, 1);
                        border-radius: 4px;
                        height: 8px;
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
    .slider-wrapper {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
    }
    .slider-thumb-value {
        position: absolute;
        top: -36px;
        left: 0;
        background: #fff;
        border:${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.lg};
        padding: 2px 18px;
        font: ${Theme.typography.fonts.text14};
        color: ${Theme.colors.black};
        pointer-events: none;
        transition: ease-in;
        z-index: 2;
        opacity: 1;
        display: block;
        text-align: center;
    }
    .slider-thumb-value.referrals-value {
        left: ${props => props.referralsThumbPos || 0}%;
        transform: translateX(-50%);
        opacity: ${props => (props.showReferralsValue ? 1 : 0)};
        display: ${props => (props.showReferralsValue ? 'block' : 'none')};
    }
    .slider-thumb-value.rent-value {
        left: ${props => props.rentThumbPos || 0}%;
        transform: translateX(-50%);
        opacity: ${props => (props.showRentValue ? 1 : 0)};
        display: ${props => (props.showRentValue ? 'block' : 'none')};
    }
}

`;