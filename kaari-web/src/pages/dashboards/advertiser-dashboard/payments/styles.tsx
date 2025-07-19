import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const PaymentsPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;

  .title {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
  }

  .payments-stats {
    display: flex;
    gap: 21px;

    .payment-stat {
        display: flex;
        justify-content: space-between;
        width: 100%;
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.md};
        padding: 40px 24px;

        .payment-stat-title {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};
        }

        .payment-stat-value {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.success};
        }

        .payment-number {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.primary};
        }

        .payment-pending {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.warning};
        }
    }
  }

  .payments-content {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .payments-title, .section-title {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
    }

    .tabs-container {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      
      .tab-button {
        padding: 12px 24px;
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.black};
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &.active {
          color: ${Theme.colors.primary};
          border-bottom: 3px solid ${Theme.colors.primary};
        }
        
        &:hover:not(.active) {
          color: ${Theme.colors.primary};
          border-bottom: 3px solid ${Theme.colors.gray};
        }
      }
    }

    .tenants-table {
      width: 100%;
      border-collapse: collapse;
      background-color: ${Theme.colors.white};
      border-radius: ${Theme.borders.radius.md};
      overflow: hidden;
      
      th, td {
        padding: 15px;
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
      
      .request-row {
        &.approved {
          background-color: rgba(0, 180, 0, 0.05);
        }
        
        &.rejected {
          background-color: rgba(255, 0, 0, 0.05);
        }
      }
      
      .status {
        font-weight: 600;
        
        &.pending {
          color: ${Theme.colors.warning};
        }
        
        &.approved {
          color: ${Theme.colors.success};
        }
        
        &.rejected {
          color: ${Theme.colors.error};
        }
        
        &.paid {
          color: ${Theme.colors.success};
        }
      }
    }
    
    .request-payout-button {
      padding: 8px 16px;
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.white};
      background-color: ${Theme.colors.primary};
      border: none;
      border-radius: ${Theme.borders.radius.sm};
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: ${Theme.colors.secondary};
      }
      
      &:disabled {
        background-color: ${Theme.colors.gray};
        cursor: not-allowed;
      }
    }
    
    .payout-status {
      display: inline-block;
      padding: 6px 12px;
      font: ${Theme.typography.fonts.smallB};
      border-radius: ${Theme.borders.radius.sm};
      
      &.pending {
        color: ${Theme.colors.warning};
        background-color: rgba(255, 152, 0, 0.1);
      }
      
      &.approved {
        color: ${Theme.colors.success};
        background-color: rgba(0, 180, 0, 0.1);
      }
      
      &.rejected {
        color: ${Theme.colors.error};
        background-color: rgba(255, 0, 0, 0.1);
      }
      
      &.paid {
        color: ${Theme.colors.success};
        background-color: rgba(0, 180, 0, 0.1);
      }
      
      &.none {
        color: ${Theme.colors.gray};
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
    
    .success-message {
      padding: 16px;
      margin-bottom: 16px;
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.success};
      background-color: rgba(0, 180, 0, 0.1);
      border-radius: ${Theme.borders.radius.sm};
    }
    
    .error-message {
      padding: 16px;
      margin-bottom: 16px;
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.error};
      background-color: rgba(255, 0, 0, 0.1);
      border-radius: ${Theme.borders.radius.sm};
    }
    
    .loading-indicator {
      padding: 24px;
      text-align: center;
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray};
    }
    
    .no-data-message {
      padding: 24px;
      text-align: center;
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray};
    }
    
    .reason-badge {
      display: inline-block;
      padding: 6px 12px;
      font: ${Theme.typography.fonts.smallB};
      border-radius: ${Theme.borders.radius.sm};
      
      &.rent-–-move-in {
        color: ${Theme.colors.secondary};
        background-color: rgba(126, 87, 194, 0.1);
      }
      
      &.cushion-–-pre-move-cancel {
        color: ${Theme.colors.warning};
        background-color: rgba(255, 152, 0, 0.1);
      }
      
      &.cushion-–-haani-max-cancel {
        color: #c2185b;
        background-color: rgba(194, 24, 91, 0.1);
      }
      
      &.referral-commission {
        color: ${Theme.colors.success};
        background-color: rgba(0, 180, 0, 0.1);
      }
      
      &.tenant-refund {
        color: ${Theme.colors.error};
        background-color: rgba(255, 0, 0, 0.1);
      }
    }
    
    .payout-row {
      &.approved {
        background-color: rgba(0, 180, 0, 0.05);
      }
      
      &.rejected {
        background-color: rgba(255, 0, 0, 0.05);
      }
      
      &.paid {
        background-color: rgba(126, 87, 194, 0.05);
      }
    }
  }
`;