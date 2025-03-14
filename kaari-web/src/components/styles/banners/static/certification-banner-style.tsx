import styled from "styled-components";
import { Theme } from "../../../../theme/theme";



export const CertifiedBanner = styled.div<{ variant?: boolean }>`
    padding: 7.5px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    
    max-width: 45%;
    font: ${Theme.typography.fonts.smallB};
    border-radius: ${Theme.borders.radius.extreme};

    background-color: ${props => props.variant ? Theme.colors.secondary : Theme.colors.white};
    color: ${props => props.variant ? Theme.colors.white : Theme.colors.secondary};;

    img {
        width: 12px;
        height: 12px;
    }

    .text {
        max-width: 60%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    * {
        transition: all 0.3s ease;
    }



`