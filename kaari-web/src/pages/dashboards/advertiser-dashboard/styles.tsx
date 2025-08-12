import styled from "styled-components";
import { Theme } from "../../../theme/theme";


export const AdvertiserDashboardStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    gap: 24px;
    flex: 1;
    margin-top: 80px;
    padding: 32px 40px;
    position: relative;

    .section-title {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
    }

    .section-container {
        width: 100%;
        min-height: 500px;
        opacity: 1;
        transition: opacity 300ms;

        &.animating {
            opacity: 0;
        }
    }

    /* Cross-dashboard banner: missing payment method */
    .payment-method-alert {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 16px;
        width: 100%;
        border-radius: ${Theme.borders.radius.lg};
        border: ${Theme.borders.primary};
        background: #ffffff;
        box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        padding: 16px 18px;
        margin-bottom: 8px;

        .alert-icon {
            width: 36px;
            height: 36px;
            border-radius: ${Theme.borders.radius.full};
            background: ${Theme.colors.secondary};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
        }

        .alert-content {
            display: grid;
            gap: 4px;

            h3 {
                margin: 0;
                font: ${Theme.typography.fonts.largeB};
                color: ${Theme.colors.black};
            }

            p {
                margin: 0;
                color: ${Theme.colors.gray2};
                font: ${Theme.typography.fonts.mediumM};
            }
        }

        .add-payment-method-btn {
            background-color: ${Theme.colors.secondary};
            color: ${Theme.colors.white};
            border: none;
            border-radius: 100px;
            padding: 10px 16px;
            font: ${Theme.typography.fonts.mediumB};
            cursor: pointer;
            transition: background-color .2s ease, transform .02s ease;

            &:hover {
                background-color: ${Theme.colors.primary};
            }
            &:active { transform: scale(0.996); }
        }
    }

    @media (max-width: 768px) {
        .payment-method-alert {
            grid-template-columns: 1fr auto;
            grid-auto-flow: row;
            gap: 12px;

            .alert-icon { display: none; }
        }
    }
`

