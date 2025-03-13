import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const PhotoSliderStyle = styled.div`

    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
    z-index: 1;

    .small-picture {
        flex: 1;
        height: 185px;
        cursor: pointer;
        border-radius: ${Theme.borders.radius.sm};
    }

    .big-picture {
        flex: 1;
        max-width: 100%;
        cursor: pointer;
        max-height: 600px;
    }

    .small-pics-container {
        border-radius: ${Theme.borders.radius.sm};
        width: 100%;
        display: flex;
        overflow-x: scroll;
        align-items: start;
        justify-content: space-between;
        gap: 16px;

        scrollbar-width: none; /* For Firefox */
        -ms-overflow-style: none; /* For IE and Edge */

        &::-webkit-scrollbar {
            display: none; /* For Chrome, Safari, and Opera */
        }
    }

`

