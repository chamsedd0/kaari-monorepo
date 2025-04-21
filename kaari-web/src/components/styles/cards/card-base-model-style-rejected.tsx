import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const CardBaseModelStyleRejected = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    background: linear-gradient(to right, rgba(199, 22, 25, 1), rgba(143, 39, 206, 1));
    border-radius: ${Theme.borders.radius.lg};
    margin-bottom: 25px;
    max-height: 320px;

    .left-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 25px;
        width: 55%;
        padding: 20px;
        
        .confirmation-status-text {
            font: ${Theme.typography.fonts.largeM};
            color: ${Theme.colors.white};
        }

        .text-icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;

            .h3-text {
                font: ${Theme.typography.fonts.h3};
                color: ${Theme.colors.white};
                max-width: 285px;
            }

            img {
                width: 56px;
                height: 56px;
            }
        }

        .text16-text {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.white};
        }
        
        .button-container {
                width: 100%;
            
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