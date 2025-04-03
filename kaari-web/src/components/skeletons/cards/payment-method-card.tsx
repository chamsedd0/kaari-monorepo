import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

interface PaymentMethodCardProps {
  cardNumber: string;
  expiryDate: string;
  cardType: string;
  logoSrc: string;
  isSelected: boolean;
  onClick: () => void;
}

const CardContainer = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  width: 100%;
  border: ${props => props.isSelected ? `2px solid ${Theme.colors.secondary}` : `1px solid ${Theme.colors.gray2}`};
  border-radius: ${Theme.borders.radius.lg};
  background-color: ${props => props.isSelected ? Theme.colors.gray : Theme.colors.white};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    border-color: ${Theme.colors.secondary};
  }

  .card-logo {
    width: 48px;
    height: 48px;
    margin-right: 16px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .card-info {
    flex: 1;
    min-width: 0;

    .card-number {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-expiry {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
    }
  }

  .card-actions {
    flex-shrink: 0;
    
    .more-options {
      background: none;
      border: none;
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.gray2};
      cursor: pointer;
      padding: 8px;
      transition: all 0.3s ease;

      &:hover {
        color: ${Theme.colors.secondary};
      }
    }
  }
`;

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  cardNumber,
  expiryDate,
  cardType,
  logoSrc,
  isSelected,
  onClick
}) => {
  return (
    <CardContainer isSelected={isSelected} onClick={onClick}>
      <div className="card-logo">
        <img src={logoSrc} alt={cardType} />
      </div>
      <div className="card-info">
        <div className="card-number">{cardNumber}</div>
        <div className="card-expiry">Expiration: {expiryDate}</div>
      </div>
      <div className="card-actions">
        <button className="more-options">•••</button>
      </div>
    </CardContainer>
  );
};

export default PaymentMethodCard; 