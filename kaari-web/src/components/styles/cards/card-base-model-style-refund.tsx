import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const CardBaseModelStyleRefund = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: start;
    width: 100%;
    background: linear-gradient(to right, rgba(158, 49, 225, 1), rgba(68, 13, 175, 1));
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
            max-width: 435px;
        }

        .button-container {
            max-width: 200px;
        }
    }  

    .right-container {
        display: flex;
        align-items: end;
        justify-content: end;
        
        img {
            width: 100%;
            height: 100%;
            align-self: end;
        }
    }
`;