import styled from 'styled-components';

export const PaymentsPageStyle = styled.div`
  padding: 20px;
  
  .title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  
  .payment-method-alert {
    background-color: #fff3cd;
    border: 1px solid #ffeeba;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .alert-content {
      h3 {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #856404;
      }
      
      p {
        margin: 0;
        color: #856404;
      }
    }
    
    .add-payment-method-btn {
      background-color: #856404;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px 16px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: #6d5204;
      }
    }
  }
  
  .payments-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
    
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
        color: #333;
      }
      
      .payment-number {
        font-size: 24px;
        font-weight: 600;
        color: #5e35b1;
      }
      
      .payment-pending {
        font-size: 24px;
        font-weight: 600;
        color: #ff9800;
      }
    }
  }
  
  .border-container {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fff;
  }
  
  .payments-content {
    .tabs-container {
      display: flex;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 20px;
      
      .tab-button {
        padding: 10px 20px;
        border: none;
        background: none;
        font-size: 16px;
        cursor: pointer;
        position: relative;
        color: #666;
        
        &.active {
          color: #5e35b1;
          font-weight: 600;
          
          &:after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #5e35b1;
          }
        }
        
        &:hover:not(.active) {
          color: #333;
        }
      }
    }
    
    .slider-container {
      margin-bottom: 20px;
    }
    
    .tenants-table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 15px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
      }
      
      th {
        font-weight: 600;
        color: #333;
      }
      
      td {
        color: #666;
      }
      
      tr:last-child td {
        border-bottom: none;
      }
      
      .status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        
        &.pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        &.approved {
          background-color: #d4edda;
          color: #155724;
        }
        
        &.rejected {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        &.paid {
          background-color: #d1ecf1;
          color: #0c5460;
        }
      }
      
      .action-button {
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        
        &.request-btn {
          background-color: #5e35b1;
          color: white;
          border: none;
          
          &:hover {
            background-color: #4527a0;
          }
          
          &:disabled {
            background-color: #b39ddb;
            cursor: not-allowed;
          }
        }
      }
    }
    
    .loading-indicator {
      padding: 20px;
      text-align: center;
      color: #666;
    }
    
    .error-message {
      padding: 20px;
      text-align: center;
      color: #721c24;
      background-color: #f8d7da;
      border-radius: 4px;
    }
    
    .no-data-message {
      padding: 20px;
      text-align: center;
      color: #666;
    }
  }
  
  @media (max-width: 768px) {
    .payments-stats {
      grid-template-columns: 1fr;
    }
    
    .tenants-table {
      th, td {
        padding: 10px;
      }
    }
  }
`;