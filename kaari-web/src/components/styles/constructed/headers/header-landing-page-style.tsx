import styled, { css } from "styled-components";
import { Theme } from "../../../../theme/theme";
import { HeaderBaseModel } from "./header-base-model";

interface HeaderLandingPageStyleProps {
    scrolled: boolean;
}

export const HeaderLandingPageStyle = styled(HeaderBaseModel)<HeaderLandingPageStyleProps>`
    background: ${({ scrolled }) => scrolled ? Theme.colors.primary : 'transparent'};
    border: none !important;
    padding: ${({ scrolled }) => scrolled ? '15px 6%' : '20px 6%'};
    max-height: 80px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    transition: all 0.3s ease;
    box-shadow: ${({ scrolled }) => scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'};
    z-index: 1000;
    
    ${({ scrolled }) => scrolled && css`
        padding: 15px 40px;
    `}
    
    .wrapper {
        max-width: 1400px;
    }
    
    .logo {
        height: 100%;
        max-width: 120px;
        z-index: 10;
        
        img {
            width: 100%;
            height: 100%;
        }
    }

    .nav-links {
        display: flex;
        align-items: center;
        gap: 30px;
    }
    
    .link {
        color: ${({ scrolled }) => scrolled ? Theme.colors.white : Theme.colors.white};
        font-weight: 600;
        font-size: 15px;
        padding: 8px 16px;
        transition: all 0.3s;
        cursor: pointer;
        
        &:hover {
            color: ${({ scrolled }) => scrolled ? Theme.colors.white : Theme.colors.white};
            opacity: 0.8;
        }
    }
    
    .language-container {
        color: ${({ scrolled }) => scrolled ? Theme.colors.primary : Theme.colors.white};
        font-weight: 600;
        font-size: 14px;
        padding: 4px 16px;
        background-color: ${({ scrolled }) => scrolled ? Theme.colors.white : 'rgba(255, 255, 255, 0.3)'};
        border-radius: 16px;
        transition: all 0.3s;
        cursor: pointer;
        
        &:hover {
            background-color: ${({ scrolled }) => scrolled ? Theme.colors.white : 'rgba(255, 255, 255, 0.5)'};
            transform: scale(1.05);
        }
    }
    
    .heart-icon {
        color: ${({ scrolled }) => scrolled ? Theme.colors.white : Theme.colors.white};
        margin: 0 20px;
        transition: all 0.3s;
        cursor: pointer;
        display: flex;
        align-items: center;
        
        svg {
            width: 24px;
            height: 24px;
            fill: ${Theme.colors.white};
        }
        
        &:hover {
            opacity: 0.8;
            transform: scale(1.1);
        }
    }
    
    .sign-in {
        color: ${({ scrolled }) => scrolled ? Theme.colors.white : Theme.colors.white};
        font-weight: 600;
        font-size: 15px;
        transition: all 0.3s;
        cursor: pointer;
        
        &:hover {
            text-decoration: underline;
            opacity: 0.8;
        }
    }
`; 