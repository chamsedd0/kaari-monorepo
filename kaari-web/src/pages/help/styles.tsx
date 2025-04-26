import styled from "styled-components";
import { Theme } from "../../theme/theme";

export const HelpStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: ${Theme.colors.white};
    gap: 40px;

    .left-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        width: 40%;
        height: 100%;
        gap: 42px;
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .title-container {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
            gap: 12px;
        

            .title {
                font: ${Theme.typography.fonts.h2};
                color: ${Theme.colors.black};
            }

            .subtitle {
                font: ${Theme.typography.fonts.h3};
                color: ${Theme.colors.black};
            }
        }

        .info-text{
            font: ${Theme.typography.fonts.h4B};
            color: ${Theme.colors.gray};
        }
    }

    .right-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        width: 60%;
        height: 100%;
        gap: 32px;

        .title {
            font: ${Theme.typography.fonts.h4B};
            color: ${Theme.colors.black};
        }
        
        .form-row {
            display: flex;
            width: 100%;
            gap: 19px;
            
            @media (max-width: 768px) {
                flex-direction: column;
            }
        }
        
        .button-container {
            max-width: 200px;
        }
    }
`;

