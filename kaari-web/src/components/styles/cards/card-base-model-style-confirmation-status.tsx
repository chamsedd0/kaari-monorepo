import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const CardBaseModelStyleConfirmationStatus = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: start;
    width: 100%;
    background: linear-gradient(to right , rgba(159, 50, 225, 1), rgba(67, 13, 174, 1));
    border-radius: ${Theme.borders.radius.lg};
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

        .h3-text {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.white};
        }

        .text16-text {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.white};
        }

        .button-container {
            width: 100%
            
        }
    }

    img {
        width: 100%;
        height: 100%;
    }
`;