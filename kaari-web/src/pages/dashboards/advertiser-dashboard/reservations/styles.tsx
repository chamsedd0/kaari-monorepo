import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ReservationsStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    gap: 32px;
    max-width: 100%;
    width: 100%;
  
   
 

    .pending-requests {
        display: flex;
        align-items: center;
        gap: 32px;
        width: 100%;

        .field-container {
            display: flex;
            align-items: center;
            gap: 20px;
            min-width: 370px;
            min-height: 32px;
        } 
    }
    
    .section-title {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
    }

    .border-container {
        width: 100%;
        background-color: ${Theme.colors.white};
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.md};
        overflow: hidden;
    }

    .border-container {
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.md};
        padding: 20px;
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
            
            img {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                object-fit: cover;
            }
            
            .applicant-name {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.black};
            }
        }
        
        .property-info {
            display: flex;
            align-items: center;
            gap: 6px;
            
            img {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                object-fit: cover;
            }
            
            .property-name {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.black};
            }
        }
        
        .applied {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
            
        }
        
        .occupants {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
            text-align: center;
        }
        
        .move-in-date {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
        }
        
        .hours-remaining {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
            text-align: center;
        }
        
        .action-buttons {
            display: flex;
            gap: 8px;
            
            .approve-button, .reject-button {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            
            .approve-button {
                background-color: ${Theme.colors.success};
            }
            
            .reject-button {
                background-color: ${Theme.colors.error};
            }
        }
    }
`
