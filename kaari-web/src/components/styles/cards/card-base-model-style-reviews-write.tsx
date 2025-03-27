import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const WriteReviewCard = styled.div`
    border: ${Theme.borders.primary};
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.md};
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;

    .info-text{
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
        text-align: start;
        width: 100%;
    }

    .container{
        display: flex;
        align-items: end;
        justify-content: space-between;
        width: 100%;
        
        .advertiser-profile-button {
            background: none;
            border: none;
            cursor: pointer;
            
            
            font: ${Theme.typography.fonts.link14};
            color: ${Theme.colors.secondary};
            text-align: start;
            text-decoration: underline;
            
            transition: all 0.3s ease;

            &:hover {
                color: ${Theme.colors.primary};
            }
        }
    
        .container-left{
            display: flex;
            align-items: center;
            justify-content: start;
            gap: 16px;
            width: 100%;

                img {
                    height: 100%;
                    width: 100%;
                    max-width: 94px;
                    max-height: 82px;
                    border-radius: ${Theme.borders.radius.sm};
                    filter: brightness(0.9);
                }

                .container-left-content{
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    gap: 12px;

                        .title{
                            font: ${Theme.typography.fonts.extraLargeB};
                            color: ${Theme.colors.black};
                            text-align: start;
                            width: 100%;
                        }
                        .subtitle{
                            font: ${Theme.typography.fonts.largeM};
                            color: ${Theme.colors.gray2};
                            text-align: start;
                            width: 100%;
                        }
                        .advertiser-profile{
                            display: flex;
                            gap: 16px;
                            width: 100%;
                            align-items: center;
                            justify-content: start;
                            
                                .advertiser-name{
                                    font: ${Theme.typography.fonts.largeM};
                                    color: ${Theme.colors.gray2};
                                    text-align: start;

                                    b {
                                        font: ${Theme.typography.fonts.largeM};
                                        margin-left: 6px;
                                    }
                                }
                                
                                
                    }
            }
        
        }

        .container-right{
            display: flex;
            gap: 40px;
            width: 100%;
            align-items: end;
            justify-content: end;


            .write-review-button{
                max-width: 188px;
            }

            .feedback-button{
                margin-bottom: 10px;
            }
    }
}
`;
