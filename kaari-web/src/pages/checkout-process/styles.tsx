import styled from "styled-components";
import { Theme } from "../../theme/theme";

export const CheckoutProcessStyle = styled.div`
    width: 100%;
    max-width: 1500px;
    margin: 50px auto;
    padding: 32px 24px;
    min-height: calc(100vh - 112px);

    .form-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
        width: 100%;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .full-width {
            grid-column: 1 / -1;
        }
    }


    .government-id-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        max-height: 48px;
        margin: auto 0;
    }


    .checkout-process-form-title {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
        display: flex;
        align-items: center;
        gap: 32px;
        
    }

    .checkout-process-header {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        padding: 32px 0;

        img {
            display: none;
            
            @media (min-width: 1750px) {
                display: block;
            }
        }
    }

    .checkout-process-progress-bar{

        img {
            height: 40px;
            width: 40px;
        }
    }

    .checkout-process-content{
        display: flex;
        align-items: start;
        flex-direction: row;
        justify-content: space-between;
        gap: 40px;

        .checkout-process-form{
            display: flex;
            flex-direction: column;
            gap: 24px;
            flex: 1;


            .checkout-process-form-title{
                font: ${Theme.typography.fonts.h4B};
                color: ${Theme.colors.black};
                gap: 32px;

                
                
                
            }

            
        }

        .checkout-process-property-card{
            flex: 0.5;
            
            
        }
    }

`;




