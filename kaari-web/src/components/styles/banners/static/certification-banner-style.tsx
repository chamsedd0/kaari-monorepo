import styled from "styled-components";
import { Theme } from "../../../../theme/theme";



export const CertifiedBanner = styled.div<{ variant?: boolean }>`
    padding: 7.5px 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    font: ${Theme.typography.fonts.smallB};
    border-radius: ${Theme.borders.radius.extreme};

    background-color: ${props => props.variant ? Theme.colors.secondary : Theme.colors.white};
    color: ${props => props.variant ? Theme.colors.white : Theme.colors.secondary};;

    img {
        width: 12px;
        height: 12px;
    }

    * {
        transition: all 0.3s ease;
    }


    @media (max-width: 1400px) {
        .text {
            display: none;
        }
        padding: 6px;
        
    }
`