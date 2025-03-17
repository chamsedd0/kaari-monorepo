import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ProfilePageStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 32px;

    .section-title {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
    }

    .profile-content {
        display: flex;
        flex-direction: column;
        gap: 32px;
        width: 100%;
    }

    .profile-info {
        display: flex;
        gap: 32px;
        padding: 24px;
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.md};
    }

    .profile-image {
        position: relative;
        width: 150px;
        height: 150px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        .edit-button {
            position: absolute;
            bottom: 0;
            right: 0;
            background: ${Theme.colors.primary};
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            cursor: pointer;
        }
    }

    .profile-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .detail-group {
        display: flex;
        flex-direction: column;
        gap: 8px;

        label {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.gray2};
        }

        input {
            padding: 12px;
            border: 1px solid ${Theme.colors.tertiary};
            border-radius: ${Theme.borders.radius.sm};
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.black};
            background: ${Theme.colors.white};
            width: 100%;
        }
    }

    .profile-actions {
        display: flex;
        gap: 16px;

        button {
            padding: 12px 24px;
            border-radius: ${Theme.borders.radius.sm};
            font: ${Theme.typography.fonts.text16};
            cursor: pointer;
        }

        .primary-button {
            background: ${Theme.colors.primary};
            color: white;
            border: none;
        }

        .secondary-button {
            background: white;
            color: ${Theme.colors.primary};
            border: 1px solid ${Theme.colors.primary};
        }
    }
`;
