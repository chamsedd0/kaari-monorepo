import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const SuccessCard = styled.div`
   display: flex;
    width: 100%;
    background: linear-gradient(to right, rgba(3, 148, 201, 1), rgba(100, 194, 6, 1));
    border-radius: ${Theme.borders.radius.lg};
    max-height: 320px;

    .left-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 16px;
        width: 40%;
        padding: 20px;

        .confirmation-status-text {
            font: ${Theme.typography.fonts.largeM};
            color: ${Theme.colors.white};
        }

        .h3-text {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.white};
        }

        .text16-text {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.white};
        }

        .button-container {
            display: flex;
            align-items: start;
            justify-content: start;
            gap: 16px;
            width: 100%;

            .button {
                min-width: 200px;
            }
        }
    }

    .right-container {
        display: flex;
        align-items: start;
        justify-content: center;
        width: 60%;
       
      
        
        .time {
            font: normal 900 58px Visby CF;
            color: ${Theme.colors.white};
            margin-top: 40px;
            position: relative;
            left: 20px;
        }

        img {
            width: 100%;
            height: 100%;
            
           
        }
    }
`;