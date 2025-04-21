import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const CardBaseModelStylePaymentFailed = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    width: 100%;
    background: linear-gradient(to right, rgba(143, 39, 206, 1), rgba(199, 22, 25, 1));
    border-radius: ${Theme.borders.radius.lg};
    max-height: 320px;
    margin-bottom: 25px;

    .left-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 20px;
        width: 60%;
        padding: 20px;
         
        
        .confirmation-status-text {
            font: ${Theme.typography.fonts.largeM};
            color: ${Theme.colors.white};
        }

        .icon-h3-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 12px;

            img {
                width: 32px;
                height: 32px;
            }

            .h3-text {
                font: ${Theme.typography.fonts.h3};
                color: ${Theme.colors.white};
            }
        }

        .text16-text {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.white};
        }
        
        .separator {
            width: 100%;
            height: 2px;
            background-color: ${Theme.colors.quaternary};
            opacity: 0.3;
        }

        .largeM-text {
            font: ${Theme.typography.fonts.largeM};
            color: ${Theme.colors.white};
        }

        .largeM-text2 {
            font: ${Theme.typography.fonts.largeM};
            color: ${Theme.colors.white};
        }
        
    }
    
    .right-container {
        display: flex;
        align-items: end;
        justify-content: end;
        
        img {
            width: 100%;
            height: 90%;
            align-self: end;
        }
    }
`;