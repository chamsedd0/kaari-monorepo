import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const CardBaseModelStyleCompletedPayment = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    cursor: pointer;

    .left-container {
        display: flex;
        align-items: center;
        gap: 16px;
        width: 100%;

        .image-container {
            width: 74px;
            height: 64px;
            border-radius: ${Theme.borders.radius.md};
            overflow: hidden;

            img {
                width: 74px;
                height: 64px;
                object-fit: cover;
            }
        }

        .text-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
            
            .title-container {
                display: flex;
                flex-direction: row;
                gap: 10px;
                
                .title {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.success};
                }

                .date {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.black};
                    &:before {
                        content: "•";
                        margin: 0 8px;
                        color: ${Theme.colors.black};
                    }
                }
            }

            .mastercard-title-number-container {
                display: flex;
                align-items: center;
                gap: 10px;
                
                .mastercard-title {
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                }

                .mastercard-number {
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                    &:before {
                        content: "•";
                        margin: 0 8px;
                        color: ${Theme.colors.gray2};
                    }
                }
            }

            .property-info-container {
                display: flex;
                align-items: center;
                gap: 10px;
                
                .property-name {
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                }

                .property-move-in-date {
                    font: ${Theme.typography.fonts.smallM};
                    color: ${Theme.colors.gray2};
                    &:before {
                        content: "•";
                        margin: 0 8px;
                        color: ${Theme.colors.gray2};
                    }
                }
            }
        }
    }

    .right-container {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .right-container-text {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.secondary};
        }

        .arrow-icon {
            width: 20px;
            height: 20px;
        }
    }

`;