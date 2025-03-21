import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const PropertiesPageStyle = styled.div`
  display: flex;
    align-items: start;
    gap: 32px;
    width: 100%;

    .properties-section {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 32px;

        .properties-section-title {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};
        }

        .my-properties {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .title {
                font: ${Theme.typography.fonts.largeB};
                color: ${Theme.colors.black};
            }

            .properties-group {
                display: flex;
                gap: 20px;
                width: 100%;
            }
        }
    }
`;

