import styled from 'styled-components';

export const UserDashboardStyle = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  
  .dashboard-container {
    display: flex;
    min-height: calc(100vh - 80px);
  }
  
  .sidebar {
    width: 250px;
    background-color: #f5f5f5;
    padding: 20px;
    
    .sidebar-title {
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 600;
    }
    
    .sidebar-nav {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          margin-bottom: 10px;
          
          button {
            width: 100%;
            text-align: left;
            padding: 10px;
            border: none;
            background: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.2s;
            
            &:hover {
              background-color: #e0e0e0;
            }
          }
        }
      }
    }
  }
  
  .content {
    flex-grow: 1;
    padding: 20px;
    
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
  }
  
  @media (max-width: 768px) {
    .dashboard-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
    }
  }
`;

