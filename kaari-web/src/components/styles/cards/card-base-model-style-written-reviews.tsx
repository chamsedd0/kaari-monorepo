import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const WrittenReviewsCard = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.md};
    padding: 40px 32px;
    border: ${Theme.borders.primary};
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

    .ratings-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;

        .ratings-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 17px;
            width: 70%;

            .rating-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                margin-right: 33px;
                .label {
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.black};
                }

                .stars {
                    display: flex;
                    gap: 2px;

                    .star {
                        width: 16px;
                        height: 16px;

                        img {
                            width: 100%;
                            height: 100%;
                            
                            &.filled {
                                filter: invert(73%) sepia(88%) saturate(1129%) hue-rotate(358deg) brightness(101%) contrast(104%);
                            }
                            
                            &.empty {
                                filter: invert(83%) sepia(5%) saturate(11%) hue-rotate(314deg) brightness(86%) contrast(90%);
                            }
                        }
                    }
                }
            }
        }
    }

    .reviewer-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .reviewer-image {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .name {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.secondary};
        }
    }
    
`;


