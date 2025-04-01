import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const CardBaseModelStyleMastercard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.lg};
    padding: 21px 20px;

    .left-container {
        display: flex;
        align-items: center;
        gap: 16px;
        width: 100%;
        
        .mastercard-logo {
            width: 55px;
            height: 48px;
        }

        .mastercard-info {
            display: flex;
            flex-direction: column;
            gap: 7px;

            .mastercard-title-number-container {
                display: flex;
                align-items: center;
                gap: 10px;
                
                .mastercard-title {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.black};
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

            .mastercard-expiration-date {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.gray2};
            }
        }
    }

    
        img {
            width: 20px;
            height: 20px;
            object-fit: cover;
        }
        
    
`;