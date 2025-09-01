import styled from "styled-components";
import { Theme } from "../../../../theme/theme";



export const CertifiedBanner = styled.div<{ $variant?: boolean }>`
    padding: 7.5px 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    height: 27px;
    
    
    font: ${Theme.typography.fonts.smallB};
    border-radius: ${Theme.borders.radius.extreme};

    background-color: ${props => props.$variant ? Theme.colors.secondary : Theme.colors.white};
    color: ${props => props.$variant ? Theme.colors.white : Theme.colors.secondary};;

    img {
        width: 12px;
        height: 12px;
    }

    .text {
        
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    * {
        transition: all 0.3s ease;
    }

    @media (max-width: 700px) {
        padding: 5px 8px;
        gap: 4px;
        height: 22px;
        font-size: 11px;

        img { width: 10px; height: 10px; }

        .text { max-width: 120px; }
    }



`