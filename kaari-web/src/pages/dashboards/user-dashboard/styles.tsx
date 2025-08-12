import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const UserDashboardStyle = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: ${Theme.colors.white};
  
  .dashboard-container {
    display: flex;
    gap: 24px;
    min-height: calc(100vh - 80px);
    padding: 24px;
  }
  
  .sidebar {
    width: 280px;
    background: rgba(81, 27, 114, 0.04);
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.lg};
    padding: 20px;
    height: fit-content;
    position: sticky;
    top: 96px;

    .sidebar-title {
      font: ${Theme.typography.fonts.h5B};
      color: ${Theme.colors.black};
      margin: 0 0 16px 0;
    }
    
    .sidebar-nav {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 8px;
        
        li {
          margin: 0;
          
          button {
            width: 100%;
            text-align: left;
            padding: 12px 14px;
            border: none;
            background: ${Theme.colors.white};
            border-radius: ${Theme.borders.radius.md};
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};
            cursor: pointer;
            border: ${Theme.borders.primary};
            transition: background-color 0.2s, box-shadow 0.2s, transform 0.02s;
            
            &:hover {
              background-color: ${Theme.colors.tertiary};
            }
            
            &:active { transform: scale(0.998); }
          }
        }
      }
    }
  }
  
  .content {
    flex: 1;
    padding: 0;
    
    .payment-method-alert {
      background: #fff8eb;
      border: 1px solid #ffe0a6;
      border-radius: ${Theme.borders.radius.md};
      padding: 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .alert-content {
        h3 {
          font: ${Theme.typography.fonts.largeB};
          margin: 0 0 6px 0;
          color: #8a5800;
        }
        
        p { margin: 0; color: #8a5800; font: ${Theme.typography.fonts.mediumM}; }
      }
      
      .add-payment-method-btn {
        background-color: ${Theme.colors.secondary};
        color: white;
        border: none;
        border-radius: ${Theme.borders.radius.sm};
        padding: 10px 16px;
        cursor: pointer;
        font: ${Theme.typography.fonts.mediumB};
        transition: background-color 0.2s;
        
        &:hover { background-color: ${Theme.colors.primary}; }
      }
    }
  }
  
  @media (max-width: 1024px) {
    .dashboard-container {
      flex-direction: column;
      padding: 16px;
      gap: 16px;
      min-height: calc(100vh - 64px);
    }
    
    .sidebar {
      width: 100%;
      position: static;
      top: auto;
    }
  }
`;

