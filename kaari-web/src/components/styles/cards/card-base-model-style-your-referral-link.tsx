import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const CardBaseModelStyleYourReferralLink = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px;
    border-radius: ${Theme.borders.radius.lg};
    border:${Theme.borders.primary};
    background: ${Theme.colors.white};
    gap: 23;

    .left-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 20px;
        width: 75%;

        .title{
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};
        }

        .text-14{
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.gray2};
        }

        .input-Icon-container{
            display: flex;
            align-items: center;
            justify-content: start;
            gap: 8px;
            .referral-link-box {
            border: ${Theme.borders.primary};
            border-radius: ${Theme.borders.radius.extreme};
            padding: 16px 24px;
            width: 100%;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            user-select: all;

            .link-text{
                font: ${Theme.typography.fonts.link14};
                color: ${Theme.colors.tertiary};
            }
        }
            

            .Icon-container{
                width: 48px;
                height: 48px;
                padding: 14px;
                border-radius: ${Theme.borders.radius.round};
                background: ${Theme.colors.secondary};
                display: flex;
                align-items: center;
                justify-content: center;

                img{
                    width: 24px;
                    height: 24px;
                }
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover{
                    background: ${Theme.colors.primary};
                } 
            }
            

        }  
       
    }
    .right-container{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25%;
        border-radius: ${Theme.borders.radius.lg};
        border:${Theme.borders.primary};

        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
`;