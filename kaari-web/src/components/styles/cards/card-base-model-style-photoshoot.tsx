import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const CardBaseModelStylePhotoshoot = styled.div`

    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;

    img {
        width: 100%;
        height: 53%;
        object-fit: cover;
        object-position: 50% 0%;
        border-radius: ${Theme.borders.radius.lg} ${Theme.borders.radius.lg} 0 0;
    }

    .text {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        gap: 20px;
        width: 100%;
        height: 47%;
        padding: 29px 36px;

        .title {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.secondary};
            text-align: center;
            width: 100%;
        }

        .description {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.black};
            text-align: center;
        }
    }

    .enums {
        position: absolute;
        top: 0;
        margin-left: 0;
        display: flex;
        align-items: start;
        justify-content: start;
        padding: 20px;
        width: 100%;

        .enum {
            width: 56px;
            height: 56px;
            background-color: ${Theme.colors.white};
            border-radius: ${Theme.borders.radius.round};
            display: flex;
            align-items: center;
            justify-content: center;
            
            span {
                margin-top: 15%;
                font: ${Theme.typography.fonts.h3};
                color: ${Theme.colors.secondary};
            }
        }
    }

`;