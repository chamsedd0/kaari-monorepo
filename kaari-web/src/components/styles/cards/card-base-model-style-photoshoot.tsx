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
    box-shadow: 0 8px 20px rgba(81, 27, 114, 0.07);
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), 
                box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    overflow: hidden;
    
    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(81, 27, 114, 0.15);
        
        img {
            transform: scale(1.05);
        }
        
        .enums .enum {
            background-color: ${Theme.colors.primary};
            
            span {
                color: ${Theme.colors.white};
            }
        }
    }

    img {
        width: 100%;
        height: 55%;
        object-fit: cover;
        object-position: 50% 0%;
        border-radius: ${Theme.borders.radius.lg} ${Theme.borders.radius.lg} 0 0;
        transition: transform 0.5s ease;
    }
    

    .text {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        gap: 20px;
        width: 100%;
        height: 45%;
        padding: 32px 30px;

        .title {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.primary};
            text-align: center;
            width: 100%;
            font-weight: 700;
        }

        .description {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.gray2};
            text-align: center;
            line-height: 1.7;
        }
    }

    .enums {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: start;
        justify-content: start;
        padding: 24px;
        width: 100%;

        .enum {
            width: 60px;
            height: 60px;
            background-color: ${Theme.colors.white};
            border-radius: ${Theme.borders.radius.round};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 15px rgba(81, 27, 114, 0.2);
            transition: all 0.3s ease;
            
            span {
                font: ${Theme.typography.fonts.h3};
                color: ${Theme.colors.primary};
                font-weight: 800;
                transition: color 0.3s ease;
            }
        }
    }
`;