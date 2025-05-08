import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ReviewsPageStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 32px;

    * {
        outline: none;
    }

    .reviews-title {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
    }
    
    .reviews-select-container {
        display: flex;
        max-width: 230px;
    }

    .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        width: 100%;
    }

    .error-message {
        padding: 24px;
        background-color: rgba(255, 0, 0, 0.1);
        border-radius: ${Theme.borders.radius.md};
        color: ${Theme.colors.error};
        font: ${Theme.typography.fonts.mediumM};
        text-align: center;
    }

    .no-reviews-message {
        padding: 40px;
        background-color: ${Theme.colors.white};
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.md};
        text-align: center;
        
        p {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.gray2};
        }
    }

    .reviews-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 100%;
    }
`;
