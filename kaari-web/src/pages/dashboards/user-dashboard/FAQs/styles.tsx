import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const FAQsPageStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 32px;

    .section-title {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
    }

    .faqs-content {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 12px;
        border-radius: ${Theme.borders.radius.md};
    }

    .faq-item {
        width: 100%;
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.md};
        overflow: hidden;
    }

    .faq-question {
        padding: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        background-color: ${Theme.colors.white};
        width: 100%;
        
        .question-text {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};
        }
        
        .question-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
            transition: all 0.3s ease;
        }

        .question-icon-image {
            width: 16px;
            height: 24px;
        }
    }

    .faq-answer {
        padding: 0 32px;
        background-color: ${Theme.colors.white};
        overflow: hidden;
        transition: all 0.3s ease-in;
        
        p {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.gray2};
            line-height: 150%;
            margin: 0;
            padding: 0;
        }
        
        &:not(.hidden) {
            height: 100px;
            padding-bottom: 32px;
        }
    }

    .hidden {
        height: 0;
    }
`;
