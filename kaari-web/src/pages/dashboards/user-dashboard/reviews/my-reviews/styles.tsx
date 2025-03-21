import styled from "styled-components";
import { Theme } from "../../../../../theme/theme";

export const MyReviewsPageStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 40px;

    .right {
        display: flex;
        flex-direction: column;
        flex: 0.45;
        gap: 32px;
    }

    .left {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 40px;
        
        .top-section {
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 100%;

            .page-title {
                font: ${Theme.typography.fonts.h3};
                color: ${Theme.colors.black};
            }

            .section-title {
                font: ${Theme.typography.fonts.h4B};
                color: ${Theme.colors.black};
            }

            .section-info {
                font: ${Theme.typography.fonts.largeM};
                color: ${Theme.colors.black};
            }
        }
    }
`;