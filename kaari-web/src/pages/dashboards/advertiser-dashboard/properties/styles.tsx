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

            .section-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;

                .title {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.black};
                }

                .navigation-buttons {
                    display: flex;
                    gap: 12px;

                    button {
                        width: 40px;
                        height: 40px;
                        border-radius: ${Theme.borders.radius.md};
                        border: 1px solid ${Theme.colors.tertiary};
                        background: ${Theme.colors.white};
                        color: ${Theme.colors.black};
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;

                        &:hover {
                            background: ${Theme.colors.tertiary};
                        }
                    }
                }
            }

            .properties-group {
                display: flex;
                align-items: start;
                justify-content: start;
                width: 100%;
                height: calc(100% - 48px);
                gap: 20px;
                overflow-x: auto;
                overflow-y: hidden;
                
                > * {
                    flex: 0 0 calc((100% - 40px) / 3);
                    min-width: calc((100% - 40px) / 3);
                    height: 100%;
                }

                &::-webkit-scrollbar {
                    display: none;
                }
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        }
    }
`;

