import styled, { keyframes } from "styled-components";
import { Theme } from "../../../../theme/theme";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const FilterModalOverlayStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const FilterModalStyle = styled.div`
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  .filter-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    
    h3 {
      font-size: 20px;
      font-weight: 600;
      color: ${Theme.colors.black};
      margin: 0;
    }
    
    .close-button {
      background: transparent;
      border: none;
      color: ${Theme.colors.gray};
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      
      &:hover {
        color: ${Theme.colors.primary};
        transform: rotate(90deg);
      }
    }
  }
  
  .filter-modal-body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    
    .filter-section {
      h4 {
        font-size: 16px;
        font-weight: 600;
        color: ${Theme.colors.gray};
        margin: 0 0 12px 0;
      }
      
      .filter-options {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        
        .filter-option {
          padding: 10px 16px;
          background: #f7f9fc;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 30px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            background: #f0f3fa;
            transform: translateY(-2px);
          }
          
          &.active {
            background: ${Theme.colors.primary}10;
            border-color: ${Theme.colors.primary}30;
            color: ${Theme.colors.primary};
            font-weight: 500;
            
            &:hover {
              background: ${Theme.colors.primary}20;
            }
          }
        }
      }
    }
  }
  
  .filter-modal-footer {
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    
    button {
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.clear-filters {
        background: transparent;
        border: 1px solid rgba(0, 0, 0, 0.1);
        color: ${Theme.colors.gray};
        
        &:hover {
          background: #f7f9fc;
        }
      }
      
      &.apply-filters {
        background: ${Theme.colors.primary};
        border: none;
        color: white;
        
        &:hover {
          background: ${Theme.colors.primary}e6;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(103, 58, 183, 0.2);
        }
      }
    }
  }
`; 