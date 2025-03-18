import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const WrittenReviewsCard = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.md};
    padding: 40px 32px;
    border: 1px solid ${Theme.colors.tertiary};
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;

    .property-info{
        display: flex;
        gap: 12px;
        width: 100%;
        justify-content: start;
        align-items: center;

        .property-image{
            width: 81px;
            height: 60px;

            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: ${Theme.borders.radius.sm};
            }
        }

        .property-text{
            display: flex;
            flex-direction: column;
            gap: 12px;
            justify-content: start;
            align-items: start;
            width: 100%;
            .title{
                font: ${Theme.typography.fonts.extraLargeB};
                color: ${Theme.colors.black};
                text-align: start;
                width: 100%;
            }

            .subtitle{
                display: flex;
                gap: 21px;
                justify-content: start;
                align-items: center;
                width: 100%;

                .posted-date{
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                    text-align: start;

                    b{
                        font: ${Theme.typography.fonts.mediumB};
                        color: ${Theme.colors.gray2};
                        text-align: start;
                    }
                }

                .length-of-stay{
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                    text-align: start;

                    b{
                        font: ${Theme.typography.fonts.mediumB};
                        color: ${Theme.colors.gray2};
                        text-align: start;
                    }
                }

            }
            
        }
        
       
    }

    .property-review-text{
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.black};
        text-align: start;
        width: 80%;
        line-height: 150%;
    }
    
    .title{
        font: ${Theme.typography.fonts.extraLargeB};
        color: ${Theme.colors.black};
        text-align: start;
        width: 100%;
    }

    .advertiser-rating{
        display: flex;
        gap: 32px;
        width: 100%;
        flex-direction: column;
        justify-content: start;
        align-items: start;

        .advertiser-info{
            display: flex;
            gap: 12px;
            justify-content: start;
            align-items: center;

            .advertiser-image{
                width: 48px;
                height: 48px;

                img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: ${Theme.borders.radius.round};
                }
                
            }
            .advertiser-name{
                font: ${Theme.typography.fonts.largeB};
                color: ${Theme.colors.secondary};
                text-align: start;
            }
            
        }

        .advertiser-rating-text{
            display: flex;
            flex-direction: column;
            gap: 8px;
            
            .rating-category {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                
                .category-name {
                    font: ${Theme.typography.fonts.mediumB};
                    color: ${Theme.colors.black};
                    text-align: start;
                    min-width: 150px;
                }
                
                .stars {
                    display: flex;
                    gap: 2px;
                }
            }
        }
    
    }
    
`;


