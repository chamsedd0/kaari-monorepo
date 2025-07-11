import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const CardBaseModelStyleReferralPassred = styled.div`
   display: flex;
    align-items: stretch;
    justify-content: space-between;
    width: 100%;
    background: linear-gradient(to right, rgba(143, 39, 206, 1), rgba(199, 22, 25, 1));
    border-radius: ${Theme.borders.radius.lg};
    max-height: 320px;
    padding: 24px 20px;
    gap: 20px;


    .left-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 20px;
        width: 48%;


        .title-text {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.white};
        }

        .time-container {
            display: flex;
            flex-direction: column;
            align-items: start; 
            gap: 10px;

            .time-text {
                font: ${Theme.typography.fonts.text14};
                color: ${Theme.colors.white};
            }
        }
    }

    .right-container {
        display: flex;
        align-items: start;
        justify-content: start;
        gap: 10px;
        margin-top: 20px;
        width: 52%;

        .icon-text12-container {
            display: flex;
            align-items: start;
            justify-content: start;
            gap: 4px;

            img {
                width: 20px;
                height: 20px;
            }

            .text-12 {
                font: ${Theme.typography.fonts.text12};
                color: ${Theme.colors.white};
            }
        }
    }

`;