import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';

export const RecommendToFriendStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;

    .title{
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
    }

    .secondary-title{
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.secondary};
    }

    .info-text{
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.gray2};
    }

    .input-container{
        display: flex;
        flex-direction: column;
        gap: 12px;

        .input-label{
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};
        }

        .input-field{
            width: 100%;
    }
}

    .button-container{
        max-width: 188px;
    }
    
    .recommend-to-friend-image{
        max-width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;


