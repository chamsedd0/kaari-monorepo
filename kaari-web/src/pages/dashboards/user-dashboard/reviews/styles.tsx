import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ReviewsPageStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 0 0 40px 0;

    .section-title {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
        margin-bottom: 8px;
    }

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
    }

    .error {
        background-color: rgba(255, 0, 0, 0.1);
        padding: 16px;
        border-radius: ${Theme.borders.radius.md};
        color: ${Theme.colors.error};
        font: ${Theme.typography.fonts.mediumM};
    }

    .reviews-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 24px;
        background-color: ${Theme.colors.white};
        border-radius: ${Theme.borders.radius.md};
        border: ${Theme.borders.primary};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        scroll-margin-top: 100px;

        .reviews-to-write {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.primary};
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 12px;
            border-bottom: 1px solid ${Theme.colors.gray3};

            .count-reviews {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background-color: ${Theme.colors.primary};
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                margin-left: 8px;
                font: ${Theme.typography.fonts.mediumB};
            }
        }
        
        .no-reviews-to-write {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: white;
            padding: 32px;
            border-radius: ${Theme.borders.radius.md};
            
            p {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.gray2};
                text-align: center;
            }
        }
    }

    .post-reviews-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
        margin-top: 8px;

        .post-reviews-content-title {
            font: ${Theme.typography.fonts.h4};
            color: ${Theme.colors.black};
            margin: 0;
        }

        .post-reviews-content-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
    }
`;
