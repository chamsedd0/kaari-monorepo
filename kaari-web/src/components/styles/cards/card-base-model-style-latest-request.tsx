import styled from 'styled-components';
import { Theme } from '../../../theme/theme';


export const CardBaseModelStyleLatestRequest = styled.div<{ timer?: boolean }>`

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;

    width: 100%;
    height: 100%;


    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.lg};

    .timer-container {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: space-between;
        gap: 6px;
        background-color: ${Theme.colors.primary};
        position: relative;
        pointer-events: none;
        overflow: hidden;

        img {
            position: absolute;
            pointer-events: all;
            z-index: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            top: 0;
            right: 0;
            filter: brightness(0.5);
            transition: transform 0.3s ease;


            &:hover {
                transform: scale(1.08);
            }
        }

        .upper-banner {

            z-index: 1;
            display: flex;
            flex-direction: row;
            align-items: start;
            justify-content: space-between;
            overflow: hidden;
            width: 100%;
            height: auto;
            pointer-events: none;

            .title-banner {
                display: flex;
                align-items: center;
                justify-content: center;

                padding: 10px 11px;
                font: ${Theme.typography.fonts.largeB};
                color: ${Theme.colors.primary};

                border-radius: 0px 0px 16px 0px;
                background-color: ${Theme.colors.white};
            }

            .status-banner {
                padding: 16px;
                padding-bottom: 0px;
                
            }
            
        }

        .main-content {
            z-index: 1;

            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: center;
            gap: 14px;
            padding: 16px;
            padding-top: 0px;

            width: 100%;

            .timer {
                display: ${props => props.timer ? 'flex' : 'none'};;
                align-items: center;    
                justify-content: center;

            }

            .text-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                width: 100%;
                color: ${Theme.colors.white};

                .title {
                    text-align: start;
                    max-width: 50%;
                    line-height: 150%;

                    b {
                        font: ${Theme.typography.fonts.extraLargeB};
                        margin-right: 5px;
                        font-size: 16px;
                    }
                    span {
                        font-size: 16px;
                        font-weight: 300;
                    }
                }

                .info {
                    text-align: end;

                    .date {
                        font: ${Theme.typography.fonts.mediumM};
                        margin-bottom: 4px;

                    }
                    .price {
                        font: ${Theme.typography.fonts.extraLargeB};
                    }
                }

            }

        }


    }

    .control-container {

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        padding: 16px;
        width: 100%;
        background-color: ${Theme.colors.white};

        button{
            width: 48%;
            height: 48px;
        }
    }

`