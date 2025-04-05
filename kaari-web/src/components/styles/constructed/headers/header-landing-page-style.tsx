import styled, { css } from "styled-components";
import { Theme } from "../../../../theme/theme";
import { HeaderBaseModel } from "./header-base-model";

interface HeaderLandingPageStyleProps {
    scrolled: boolean;
}

export const HeaderLandingPageStyle = styled(HeaderBaseModel)<HeaderLandingPageStyleProps>`
    background: ${({ scrolled }) => scrolled ? Theme.colors.primary : 'transparent'};
    border: none !important;
    padding: ${({ scrolled }) => scrolled ? '0 6%' : '0 6%'};
    height: 80px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    transition: all 0.3s ease;
    box-shadow: ${({ scrolled }) => scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'};
    z-index: 1000;
    display: flex;
    align-items: center;
    
    ${({ scrolled }) => scrolled && css`
        padding: 0 40px;
    `}
    
    .wrapper {
        max-width: 1400px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .logo {
        height: 40px;
        max-width: 120px;
        z-index: 10;
        
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
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
        padding: 0px 16px;
        height: 28px;
        background-color: ${({ scrolled }) => scrolled ? Theme.colors.white : 'rgba(255, 255, 255, 0.3)'};
        border-radius: 16px;
        transition: all 0.3s;
        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;

        p {
            margin: 0;
            margin-top: 2px;
        }

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
        padding: 10px 20px;
        border-radius: 10px;
        
        &:hover {
            background-color: ${Theme.colors.white};
            color: ${Theme.colors.primary};
        }
    }
`; 