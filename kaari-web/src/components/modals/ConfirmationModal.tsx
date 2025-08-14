import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { PurpleButtonMB48 } from '../skeletons/buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../skeletons/buttons/border_purple_MB48';
import { IoClose } from 'react-icons/io5';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: opacity;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: ${Theme.borders.radius.lg};
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  animation: slideIn 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, opacity;

  @keyframes slideIn {
    from { transform: translateY(18px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${Theme.colors.gray2};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${Theme.colors.black};
  }
`;

const Title = styled.h3`
  font: ${Theme.typography.fonts.h4B};
  color: ${Theme.colors.black};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.gray2};
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  if (!isOpen) return null;
  
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <IoClose />
        </CloseButton>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonContainer>
          <BpurpleButtonMB48 
            text={cancelText} 
            onClick={onClose}
            disabled={isLoading}
          />
          <PurpleButtonMB48 
            text={confirmText} 
            onClick={onConfirm}
            disabled={isLoading}
            // @ts-expect-error Button type lacks loading prop in skeleton
            loading={isLoading}
          />
        </ButtonContainer>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default ConfirmationModal; 