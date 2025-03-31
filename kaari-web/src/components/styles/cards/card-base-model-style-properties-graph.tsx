import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const PropertiesGraphCard = styled.div`
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 26px;

    .title-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .title {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};
        }

        .total-views {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .arrow-up-icon {
                color: ${Theme.colors.success};
            }
            
            .views-count {
                font: ${Theme.typography.fonts.h4B};
                color: ${Theme.colors.primary};
            }
        }
    }

    .properties-table {
        width: 100%;
        border-collapse: collapse;
        background-color: ${Theme.colors.white};
        border-radius: ${Theme.borders.radius.md};
        overflow: hidden;
        
        th, td {
            padding: 16px 12px;
            text-align: left;
        }
        
        th {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
            border-bottom: ${Theme.borders.primary};
        }
        
        td {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.gray2};
            border-bottom: ${Theme.borders.primary};
        }
        
        tr:last-child td {
            border-bottom: none;
        }
        
        .property-info {
            display: flex;
            align-items: center;
            gap: 6px;
            
            img {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                object-fit: cover;
            }
            
            .property-name {
                font: ${Theme.typography.fonts.smallM};
                color: ${Theme.colors.black};
            }
        }
        
        .trend-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            
            .arrow-up {
                color: ${Theme.colors.success};
            }
            
            .arrow-down {
                color: ${Theme.colors.error};
            }
            
            .value {
                font: ${Theme.typography.fonts.smallM};
                color: ${Theme.colors.black};
            }
        }
        
        .metric-value {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.black};
        }
        
        .date-value {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.black};
        }
        
        .total-value {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.black};
        }
    }

    .reservations-table {
        width: 100%;
        border-collapse: collapse;
        background-color: ${Theme.colors.white};
        border-radius: ${Theme.borders.radius.md};
        overflow: hidden;      
        th, td {
            padding: 24px 20px;
            text-align: left;
        }
        
        th {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};
            border-bottom: ${Theme.borders.primary};
        }
        
        td {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.black};
            border-bottom: ${Theme.borders.primary};
        }
        
        tr:last-child td {
            border-bottom: none;
        }
        
        .applicant-info {
            display: flex;
            align-items: center;
            gap: 6px;
            
            .applicant-name {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.black};
            }
        }
    }
`;