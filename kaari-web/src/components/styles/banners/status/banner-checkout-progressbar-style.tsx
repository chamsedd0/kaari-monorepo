import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

interface ProgressStepProps {
    isActive: boolean;
    isPassed: boolean;
}

export const CheckoutProgressBarStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 404px;
    margin: 0 auto;
    position: relative;
    padding: 0 10px;
    margin-bottom: 48px;

    .step-labels {
        display: flex;
        justify-content: space-between;
        width: 112%;
        position: absolute;
        top: 100%;
        margin-top: 8px;

        .step-label {
            text-align: center;
            max-width: 120px;
            color: ${Theme.colors.secondary};
            opacity: 0.5;
            transition: all 0.3s ease;
            font: ${Theme.typography.fonts.smallB};
            
            &.active {
                opacity: 1;
            }
        }
    }
`;

export const ProgressStep = styled.div<ProgressStepProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 100%;

    .step-icon {
        transition: all 0.3s ease;
        
        svg {
            display: block;
        }
    }
`;
