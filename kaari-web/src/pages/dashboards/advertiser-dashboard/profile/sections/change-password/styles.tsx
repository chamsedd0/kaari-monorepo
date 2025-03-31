import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';

export const ChangePasswordStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
    max-width: 800px;

    .section-info {
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.mediumM};
    }

    .password-fields {
        display: flex;
        flex-direction: column;
        gap: 24px;
        margin-top: 8px;

        .field-row {
            display: flex;
            gap: 16px;

            &.double {
                > div {
                    width: 50%;
                }
            }
        }
    }

    .save-button {
        width: fit-content;
    }
`;
