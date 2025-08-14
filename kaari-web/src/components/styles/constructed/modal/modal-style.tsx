import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

export const ModalOverlay = styled.div`
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
  padding: 20px;
  animation: overlay-fade-in 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: opacity;

  @keyframes overlay-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContainer = styled.div`
  background-color: ${Theme.colors.white};
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modal-slide-fade-in 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, opacity;
  
  @keyframes modal-slide-fade-in {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  
  @media (max-width: 600px) {
    max-width: 90%;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${Theme.colors.gray}50;
  
  h2 {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin: 0;
  }
`;

export const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  max-height: 70vh;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${Theme.colors.gray2};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${Theme.colors.black};
    background-color: ${Theme.colors.gray}20;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid ${Theme.colors.gray}50;
  gap: 12px;
`; 