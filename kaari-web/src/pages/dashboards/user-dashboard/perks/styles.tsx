import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const PerksPageStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 32px;

    .section-title {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
    }

    .perks-content {
        border-radius: ${Theme.borders.radius.md};
        

        
        .perks-list {
            display: flex;
            flex-direction: column;
            
            
            .perk-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 0;
                width: 100%;
                border-bottom: 1px solid ${Theme.colors.tertiary};
                
                &:last-child {
                    border-bottom: none;
                }
                
                .perk-info {
                    display: flex;
                    align-items: center;
                    flex: 1;
                    justify-content: space-between;
                    
                    
                    .premium-tag {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 14px;
                        flex-direction: row;
                        
                        span {
                            margin-top: 8px;
                            font: ${Theme.typography.fonts.smallDB};
                            color: ${Theme.colors.gray2};
                            
                        }
                    }
                    
                    .perk-text {
                        font: ${Theme.typography.fonts.mediumB};
                        color: ${Theme.colors.black};
                        
                    }
                }
            }
        }
    }
`;
