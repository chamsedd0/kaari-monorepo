import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const NeedHelpCard = styled.div`
     background-color: ${Theme.colors.white};
            border-radius: ${Theme.borders.radius.md};
            border: ${Theme.borders.primary};
            padding: 32px 16px;
            display: flex;
            flex-direction: column;
            gap: 25px;
            padding-bottom: 63px;

            h3 {
                font: ${Theme.typography.fonts.extraLargeB};
                color: ${Theme.colors.black};
                margin: 0;
            }

            .faq-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                width: 100%;

                &:last-child {
                    border-bottom: none;
                }

                span {
                    font: ${Theme.typography.fonts.text14};
                    font-weight: 700;
                    color: ${Theme.colors.gray2};
                    text-decoration: underline;
                    max-width: 80%;
                    cursor: pointer;
                }

                .arrow {
                    
                }
            }
`;
