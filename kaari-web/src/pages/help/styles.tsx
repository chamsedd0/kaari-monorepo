import styled from "styled-components";
import { Theme } from "../../theme/theme";

export const HelpStyle = styled.div`
    display: flex;
    align-items: start;
    justify-content: start;
    background-color: ${Theme.colors.white};
    gap: 40px;
    width: 100%;
    padding: 80px;
    margin-top: 80px;
    padding-top: 40px;
    padding-bottom: 86px;
    max-width: 1500px;
    margin-left: auto;
    margin-right: auto;

    .left-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        width: 35%;
        height: 100%;
        gap: 42px;
        
        img {
            width: 320px;
            height: 320px;
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
            color: ${Theme.colors.gray2};
        }
    }

    .right-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        width: 65%;
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

