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


`;
