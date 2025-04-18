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
    margin: 0 auto;

    margin-bottom: 30px;

`;

export const ProgressStep = styled.div<ProgressStepProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    width: 100%;

    .step-number {

        opacity: ${props => props.isActive || props.isPassed ? 1 : 0.5};

        transition: all 0.3s ease;

    }

    .second, .third {
        margin-left: -1px;
    }





`;
