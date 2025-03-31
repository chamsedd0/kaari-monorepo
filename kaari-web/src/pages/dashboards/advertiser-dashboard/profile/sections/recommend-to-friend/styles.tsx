import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';

export const RecommendToFriendStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
    max-width: 800px;

    .section-subtitle {
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.mediumM};
        margin-bottom: 24px;
    }

    .email-input {
        width: 100%;
    }

    .reward-info {
        background: ${Theme.colors.primary};
        border-radius: ${Theme.borders.radius.lg};
        padding: 32px;
        color: ${Theme.colors.white};
        margin-top: 16px;

        .reward-title {
            font: ${Theme.typography.fonts.h3};
            margin-bottom: 16px;
        }

        .reward-amount {
            font: ${Theme.typography.fonts.h2};
            margin-bottom: 24px;
        }

        .reward-description {
            font: ${Theme.typography.fonts.mediumM};
            margin-bottom: 16px;
        }

        .reward-steps {
            font: ${Theme.typography.fonts.mediumM};
        }

        .reward-question {
            font: ${Theme.typography.fonts.mediumM};
            margin-top: 24px;
        }
    }

    .save-button {
        width: fit-content;
    }
`;
