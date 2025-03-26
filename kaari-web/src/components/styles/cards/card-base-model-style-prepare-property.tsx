import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const PreparePropertyCard = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 300px;

    .title.container {
        display: flex;
        align-items: center;
        gap: 8px;

        .title {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};
        }

        img {
            width: 24px;
            height: 24px;
        }

    }

    .content-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        
        .prepare-item {
            display: flex;
            gap: 10px;
            
            .text {
                display: flex;
                flex-direction: column;
                gap: 4px;

                .number-text-container {
                    display: flex;
                    gap: 10px;
                }

                .number {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: ${Theme.colors.secondary};
                    color: ${Theme.colors.white};
                    font: ${Theme.typography.fonts.extraSmallB};
                    padding: 8px;
                }
                
                
                    
                    .item-title {
                        font: ${Theme.typography.fonts.mediumM};
                        color: ${Theme.colors.black};
                    }
                    
                    .item-description {
                        font: ${Theme.typography.fonts.text12};
                        color: ${Theme.colors.gray2};
            }
            }
        }
    }
`;