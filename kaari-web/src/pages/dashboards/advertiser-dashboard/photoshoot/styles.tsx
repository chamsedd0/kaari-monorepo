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
            }
        }



    }
`;