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
        max-width: 353px;
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
    
    .recommend-banner{
        margin-top: 16px;
        width: 100%;
        height: 385px;
        object-fit: cover;
        border-radius: 16px;
        overflow: hidden;
        position: relative;

        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            z-index: 1;
        }

        .banner-content{
            position: relative;
            z-index: 2;
            color: white;
            padding: 32px 24px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            height: 100%;
            gap: 1.5rem;

            *{
                color: white;
                line-height: 150%;
            }

            h2 {
                font: ${Theme.typography.fonts.h4DB};
                justify-self: start;
                max-width: 55%;
                flex: 1;
            }

            h3 {
                font: ${Theme.typography.fonts.text14};
                flex: 0.3;
            }

            p {
                font: ${Theme.typography.fonts.text14};
                flex: 0.5;
                line-height: 150%;

            }
        }
    }
`;


