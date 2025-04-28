import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const PhotoshootsPageStyle = styled.div`
    display: flex;
    width: 100%;
    gap: 40px;

    .right {
        display: flex;
        flex-direction: column;
        flex: 0.35;
        gap: 24px;
    }

    .left {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 24px;

        .section-title-container {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .section-title {
                font: ${Theme.typography.fonts.h3};
                color: ${Theme.colors.black};
            }

            .button-container {
                display: flex;
            }
        }

        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            width: 100%;
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.gray2};
            border: ${Theme.borders.primary};
            border-radius: ${Theme.borders.radius.lg};
        }

        .no-bookings {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            width: 100%;
            padding: 24px;
            text-align: center;
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.gray2};
            border: ${Theme.borders.primary};
            border-radius: ${Theme.borders.radius.lg};

            p {
                max-width: 400px;
                line-height: 1.5;
            }
        }

        .history-container {
            display: flex;
            flex-direction: column;
            gap: 24px;
            border: ${Theme.borders.primary};
            border-radius: ${Theme.borders.radius.lg};
            padding: 20px;
            
            .history-title {
                font: ${Theme.typography.fonts.largeB};
                color: ${Theme.colors.black};
            }
            
            .history-item-container {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .history-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 23px 16px;
                border: ${Theme.borders.primary};
                border-radius: ${Theme.borders.radius.lg};
                gap: 16px;
                
                .location {
                    font: ${Theme.typography.fonts.mediumB};
                    color: ${Theme.colors.black};
                    max-width: 140px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    cursor: pointer;
                    position: relative;

                    &:hover::after {
                        content: attr(data-full);
                        position: absolute;
                        left: 50%;
                        top: 100%;
                        transform: translateX(-50%);
                        background: #fff;
                        color: #222;
                        border: 1px solid ${Theme.colors.primary};
                        border-radius: 8px;
                        padding: 6px 12px;
                        font-size: 13px;
                        font-weight: 500;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                        white-space: pre-line;
                        z-index: 10;
                        min-width: 180px;
                        max-width: 400px;
                        word-break: break-word;
                        pointer-events: none;
                    }
                }
                
                .date-time {
                    font: ${Theme.typography.fonts.smallM};
                    color: ${Theme.colors.gray2};
                }

                .status {
                    font-weight: 600;
                    padding: 4px 18px;
                    border-radius: 999px;
                    font-size: 13px;
                    min-width: 100px;
                    text-align: center;
                    display: inline-block;
                    
                    &.completed {
                        background-color: ${Theme.colors.success};
                        color: white;
                    }
                    
                    &.cancelled {
                        background-color: ${Theme.colors.warning};
                        color: white;
                    }
                    
                    &.pending, &.assigned {
                        background-color: ${Theme.colors.primary};
                        color: white;
                    }
                }
            }
        }



    }
`;