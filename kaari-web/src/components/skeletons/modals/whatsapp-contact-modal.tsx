import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { useTranslation } from 'react-i18next';

interface WhatsAppContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  phoneNumber: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: ${Theme.borders.radius.lg};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 28px;
  width: 90%;
  max-width: 420px;
  transform: translateY(0);
  opacity: 1;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
`;

const ModalTitle = styled.h3`
  font: ${Theme.typography.fonts.h4B};
  color: ${Theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${Theme.colors.gray2};
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${Theme.colors.primary};
    background-color: rgba(81, 27, 114, 0.05);
  }
`;

const ModalContent = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  p {
    margin: 0;
    line-height: 1.5;
  }
  
  strong {
    color: ${Theme.colors.primary};
  }
`;

const PhoneInfo = styled.button`
  font: ${Theme.typography.fonts.mediumM};
  margin: 0;
  padding: 12px 16px;
  background-color: #f8f8f8;
  border-radius: ${Theme.borders.radius.md};
  border: none;
  text-align: left;
  border-left: 4px solid ${Theme.colors.primary};
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background-color: #f0f0f0;
    &::after {
      content: attr(data-copy-text);
      position: absolute;
      right: 16px;
      font-size: 12px;
      color: #29822D;
    }
  }
  
  &.copied {
    background-color: #e8f5e9;
    border-left: 4px solid #29822D;
    
    &::after {
      content: attr(data-copied-text);
      position: absolute;
      right: 16px;
      font-size: 12px;
      color: #29822D;
      font-weight: bold;
    }
  }
`;

const WhatsAppButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #29822D;  /* Updated green color */
  color: white;
  padding: 14px;
  border-radius: ${Theme.borders.radius.md};
  text-decoration: none;
  font: ${Theme.typography.fonts.mediumB};
  margin-top: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(41, 130, 45, 0.3);
  
  &:hover {
    background-color: #1f6122;
    box-shadow: 0 4px 12px rgba(41, 130, 45, 0.4);
    transform: translateY(-2px);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const WhatsAppContactModal: React.FC<WhatsAppContactModalProps> = ({
  isOpen,
  onClose,
  teamName,
  phoneNumber,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;
  
  // Format phone number to ensure it has the correct format for WhatsApp
  const formattedPhoneNumber = phoneNumber.startsWith('+') 
    ? phoneNumber.replace(/\D/g, '') 
    : phoneNumber.replace(/\D/g, '');
  
  const whatsappLink = `https://wa.me/${formattedPhoneNumber}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{t('advertiser_dashboard.photoshoot.whatsapp_modal_title', 'Contact via WhatsApp')}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <ModalContent>
          <TeamInfo>
            <p>{t('advertiser_dashboard.photoshoot.whatsapp_modal_info', 'You can contact')} <strong>{teamName}</strong> {t('advertiser_dashboard.photoshoot.whatsapp_modal_via', 'via WhatsApp:')}</p>
          </TeamInfo>
          
          <PhoneInfo 
            onClick={copyToClipboard} 
            className={copied ? 'copied' : ''}
            data-copy-text={t('advertiser_dashboard.photoshoot.whatsapp_modal_click_to_copy', 'Click to copy')}
            data-copied-text={t('advertiser_dashboard.photoshoot.whatsapp_modal_copied', 'Copied!')}
          >
            {phoneNumber}
          </PhoneInfo>
          
          <TeamInfo>
            <p>{t('advertiser_dashboard.photoshoot.whatsapp_modal_instruction', 'Click the button below to start a WhatsApp conversation with your assigned photographer.')}</p>
          </TeamInfo>
          
          <WhatsAppButton 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.601 2.326C12.0969 0.822 10.0719 0 7.92488 0C3.60488 0 0.0848763 3.52 0.0848763 7.84C0.0848763 9.22 0.424876 10.56 1.06488 11.74L0 16L4.36488 14.96C5.50488 15.54 6.70488 15.84 7.92488 15.84C12.2449 15.84 15.7649 12.32 15.7649 8C15.7649 5.86 14.9449 3.82 13.601 2.326ZM7.92488 14.5C6.82488 14.5 5.74488 14.22 4.80488 13.7L4.56488 13.56L2.00488 14.16L2.60488 11.68L2.42488 11.42C1.85148 10.44 1.54153 9.32893 1.54488 8.2C1.54488 4.28 4.42488 1.14 7.92488 1.14C9.72488 1.14 11.4049 1.82 12.6649 3.08C13.9249 4.34 14.4449 6.02 14.4449 7.84C14.4449 11.76 11.4049 14.5 7.92488 14.5ZM11.3849 9.46C11.1849 9.36 10.2649 8.91 10.0849 8.84C9.90488 8.77 9.76488 8.74 9.62488 8.94C9.48488 9.14 9.12488 9.55 9.00488 9.69C8.88488 9.83 8.76488 9.85 8.56488 9.75C7.55028 9.25559 6.68851 8.48283 6.06488 7.51C5.86488 7.17 6.22488 7.19 6.56488 6.51C6.63488 6.37 6.60488 6.25 6.55488 6.15C6.50488 6.05 6.14488 5.13 5.97488 4.73C5.80488 4.34 5.63488 4.39 5.50488 4.38C5.38488 4.37 5.24488 4.37 5.10488 4.37C4.96488 4.37 4.74488 4.42 4.56488 4.62C4.38488 4.82 3.90488 5.27 3.90488 6.19C3.90488 7.11 4.56488 8 4.66488 8.14C4.76488 8.28 6.13488 10.39 8.22488 11.19C9.42488 11.64 9.90488 11.69 10.5049 11.6C10.8649 11.54 11.6049 11.14 11.7749 10.67C11.9449 10.2 11.9449 9.8 11.8949 9.72C11.8449 9.64 11.7049 9.6 11.5049 9.5L11.3849 9.46Z" fill="white"/>
            </svg>
            {t('advertiser_dashboard.photoshoot.whatsapp_modal_open_button', 'Open WhatsApp')}
          </WhatsAppButton>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default WhatsAppContactModal; 