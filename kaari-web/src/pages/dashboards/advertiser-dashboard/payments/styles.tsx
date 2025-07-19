import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

export const PaymentsPageStyle = styled.div`
  padding: 20px;
  
  .title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  
  .payments-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .payment-stat {
    padding: 20px;
    border-radius: 8px;
    
    .payment-stat-title {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .payment-stat-value {
      font-size: 24px;
      font-weight: 600;
      color: ${Theme.colors.secondary};
    }
    
    .payment-number {
      font-size: 24px;
      font-weight: 600;
      color: ${Theme.colors.secondary};
    }
    
    .payment-pending {
      font-size: 24px;
      font-weight: 600;
      color: ${Theme.colors.warning};
    }
    
    .payment-requestable {
      font-size: 24px;
      font-weight: 600;
      color: ${Theme.colors.success};
      margin-bottom: 15px;
    }
    
    button {
      margin-top: 10px;
      width: 100%;
    }
  }
  
  .border-container {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    background-color: white;
  }
  
  .payments-content {
    .tabs-container {
      display: flex;
      margin-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
      
      .tab-button {
        padding: 10px 20px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        color: #666;
        position: relative;
        
        &.active {
          color: ${Theme.colors.secondary};
          font-weight: 600;
          
          &:after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background-color: ${Theme.colors.secondary};
          }
        }
        
        &:hover {
          color: ${Theme.colors.secondary};
        }
      }
    }
    
    .slider-container {
      margin-bottom: 20px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .success-message {
      padding: 10px 15px;
      background-color: #d4edda;
      color: #155724;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    
    .error-message {
      padding: 10px 15px;
      background-color: #f8d7da;
      color: #721c24;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    
    .loading-indicator {
      text-align: center;
      padding: 20px;
      color: #666;
    }
    
    .no-data-message {
      text-align: center;
      padding: 20px;
      color: #666;
    }
    
    .tenants-table {
      width: 100%;
      border-collapse: collapse;
      
      th {
        text-align: left;
        padding: 12px 10px;
        border-bottom: 1px solid #e0e0e0;
        color: #666;
        font-weight: 600;
      }
      
      td {
        padding: 12px 10px;
        border-bottom: 1px solid #e0e0e0;
        vertical-align: middle;
      }
      
      .tenant-info, .property-info {
        display: flex;
        align-items: center;
        
        .tenant-name, .property-name {
          font-weight: 500;
        }
      }
      
      .move-in-date {
        white-space: nowrap;
      }
      
      .status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        
        &.completed, &.paid {
          background-color: #d4edda;
          color: #155724;
        }
        
        &.pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        &.rejected {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        &.approved {
          background-color: #cce5ff;
          color: #004085;
        }
      }
      
      .reason-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        
        &.rent {
          background-color: #d1ecf1;
          color: #0c5460;
        }
        
        &.referral {
          background-color: #d4edda;
          color: #155724;
        }
        
        &.refund, &.cancellation {
          background-color: #f8d7da;
          color: #721c24;
        }
      }
      
      .request-payout-button {
        padding: 6px 12px;
        background-color: ${Theme.colors.secondary};
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        
        &:hover {
          background-color: ${Theme.colors.secondaryDark};
        }
        
        &:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      }
      
      .payout-status {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        
        &.pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        &.approved {
          background-color: #cce5ff;
          color: #004085;
        }
        
        &.rejected {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        &.paid {
          background-color: #d4edda;
          color: #155724;
        }
        
        &.none {
          background-color: #e2e3e5;
          color: #383d41;
        }
      }
    }
  }
  
  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 8px;
    padding: 24px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    h3 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      color: ${Theme.colors.secondary};
    }
    
    p {
      margin-bottom: 16px;
      line-height: 1.5;
    }
    
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      
      button {
        min-width: 120px;
      }
    }
  }
`;