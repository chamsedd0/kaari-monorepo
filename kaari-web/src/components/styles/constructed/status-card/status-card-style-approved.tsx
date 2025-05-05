import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const StatusCardStyleApproved = styled.div`
   display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: linear-gradient(to right, rgba(3, 148, 201, 1), rgba(100, 194, 6, 1));
    border-radius: ${Theme.borders.radius.lg};
    padding: 35px 40px;
    max-height: 320px;

    .left-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 20px;
        width: 70%;
        

        .text-container {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
            gap: 8px;
        
            .confirmation-status-text {
                font: ${Theme.typography.fonts.largeM};
                color: ${Theme.colors.white};
            }

            .h3-text {
                font: ${Theme.typography.fonts.h3};
                color: ${Theme.colors.white};
            }
        }

        .text16-text {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.white};
        }
        
        .button-container {
            display: flex;
            gap: 15px;
            align-items: center;
            min-width: 100%;
        }
    }

    .right-container {
        display: flex;
        align-items: start;
        justify-content: center;
        width: 30%;
       
      
        
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