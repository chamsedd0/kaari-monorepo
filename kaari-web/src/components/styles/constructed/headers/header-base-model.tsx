import styled from "styled-components";
import { Theme } from "../../../../theme/theme";


export const HeaderBaseModel = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;

    max-height: 80px;
    width: 100%;
    border: ${Theme.borders.primary};
    padding: 20px;

    

    .wrapper {
        
        width: 100%;
        max-width: 1600px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: auto;

    }

    .logo {
        height: 100%;
        max-width: 105px;
        
        img {
            width: 100%;
            height: 100%;
        }
    }

    .profilePic {
        cursor: pointer;
    }

    .nav-links {
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 40px;

    }
`