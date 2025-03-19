import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ProfilePageStyle = styled.div`
    display: flex;
    width: 100%;
    gap: 40px;

    .right {
        display: flex;
        flex-direction: column;
        flex: 0.45;
        gap: 32px;
    }

    .left{
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 40px;
    }

    .profile-content{
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
        flex-direction: column;
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

    .your-info-text{
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
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
        max-width: 200px;
    }
    }
`;
