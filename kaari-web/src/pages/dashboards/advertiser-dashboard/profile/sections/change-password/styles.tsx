import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';

export const ChangePasswordStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
   

    .section-info {
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.mediumM};
    }

    .input-filed {
        width: 48%;
    }

    .password-fields {
        display: flex;
       
        gap: 24px;
        margin-top: 8px;
        width: 100%;
        
       
    }

    .save-button {
       width: 188px;
    }
`;
