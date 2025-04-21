import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const ApplicationTrackingCard = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    padding: 50px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    
    
    

    img {
        width: 68px;
        height: 68px;
        object-fit: cover;
    }

    .title-text {
        font: ${Theme.typography.fonts.extraLargeB};
        color: ${Theme.colors.black};
        text-align: center;
    }

    .description-text {
        font: ${Theme.typography.fonts.text14};
        color: ${Theme.colors.gray2};
        text-align: center;
    }
        
`;