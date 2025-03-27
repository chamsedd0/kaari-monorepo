import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const PaymentCard = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
    align-items: center;

    .title-viewmore-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .title{
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};
        }

        .viewmore-text{
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.secondary};
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                color: ${Theme.colors.primary};
            }
        }
    }

    .income-container{
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        
        .income-amount{
            font: ${Theme.typography.fonts.h1};
            color: ${Theme.colors.primary};
        }

        .income-text{
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};
        }
    }

    .info-container{
        display: flex;
        gap: 20px;
        align-items: center;
        padding: 0 18px;
        
        .title-number-container{
            display: flex;
            flex-direction: column;
            gap: 12px;

            .title{
                font: ${Theme.typography.fonts.mediumB};
                color: ${Theme.colors.gray2};
            }

            .number{
                font: ${Theme.typography.fonts.h3};
                color: ${Theme.colors.black};
            }
        }
       
    }
`;