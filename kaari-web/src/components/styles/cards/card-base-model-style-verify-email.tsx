import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const VerifyEmailCard = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.md};
    padding: 20px 16px;
    border: 1px solid ${Theme.colors.tertiary};
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    
    .title{
        font: ${Theme.typography.fonts.extraLargeB};
        color: ${Theme.colors.black};
    }

    .info-text{
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.gray2};
        text-align: start;
        line-height: 150%;

    }

    .verify-email-container{
        display: flex;
        gap: 8px;
        width: 100%;
        align-items: end;
        justify-content: end;

        .verify-email-icon{
            width: 14px;
            height: 14px;
        }

        .verify-email-text{
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.success};
            text-align: start;
        }
        

    }
`;