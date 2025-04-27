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
                
                .location {
                    font: ${Theme.typography.fonts.mediumB};
                    color: ${Theme.colors.black};
                }
                
                .date-time {
                    font: ${Theme.typography.fonts.smallM};
                    color: ${Theme.colors.gray2};
                }

                .status {
                    font-weight: 600;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    
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