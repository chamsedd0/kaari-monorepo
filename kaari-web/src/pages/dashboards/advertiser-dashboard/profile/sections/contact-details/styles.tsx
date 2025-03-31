import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';

export const ContactDetailsStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;

    .section-info {
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.text16};
    }

    .contact-fields {
        display: flex;
        flex-direction: column;
        gap: 32px;

        .field-row {
            display: flex;
            gap: 16px;

            > div {
                flex: 1;
            }
        }

        .additional-field {
            width: 100%;
        }
    }

    .save-button {
        max-width: 188px;
    }
`;
