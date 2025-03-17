import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const AdminDashboardStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    gap: 32px;
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

    .pending-requests {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 32px;
        margin-bottom: 32px;

        .request-card {
            flex: 1;
            height: 290px;
        }
    }

    .profile-content,
    .messages-content,
    .reviews-content,
    .payments-content,
    .perks-content,
    .settings-content,
    .contacts-content,
    .faq-content,
    .reservations-content {
        padding: 24px;
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.md};
        width: 100%;
    }
`; 