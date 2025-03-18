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

    .section-title {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
    }

    .post-reviews-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 100%;
        align-items: start;

        .post-reviews-content-title {
            font: ${Theme.typography.fonts.h4B};
            color: ${Theme.colors.black};
        }

        .post-reviews-content-form {
            display: flex;
            flex-direction: column;
            gap: 24px;
            width: 100%;
            max-height: 500px;
            overflow-y: auto;
        }
    }

    .reviews-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 100%;
        align-items: start;

        .reviews-to-write {
            display: flex;
            font: ${Theme.typography.fonts.h4B};
            color: ${Theme.colors.black};
            align-items: center;
            justify-content: start;
            gap: 12px;

            .count-reviews {
                font: ${Theme.typography.fonts.largeB};
                color: ${Theme.colors.white};
                background-color: ${Theme.colors.secondary};
                border-radius: ${Theme.borders.radius.extreme};
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 24px;
                padding: 4px 8px;
                margin-bottom: 2px;

                b {
                    margin-top: 4px;
                    margin-right: 1.5px;
                }
            }
    }
}
`;
