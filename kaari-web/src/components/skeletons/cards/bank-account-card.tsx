import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { PayoutMethod } from '../../../backend/entities';
import { useTranslation } from 'react-i18next';

interface BankAccountCardProps {
  payoutMethod: PayoutMethod;
  onEdit?: (payoutMethod: PayoutMethod) => void;
  onDelete?: (payoutMethod: PayoutMethod) => void;
  onSetDefault?: (payoutMethod: PayoutMethod) => void;
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  position: relative;
  border: 1px solid ${Theme.colors.gray5};
  
  &.default {
    border: 1px solid ${Theme.colors.secondary};
  }
`;

const DefaultBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: ${Theme.colors.secondary};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const AccountType = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 12px;
  color: ${Theme.colors.black};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BankIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${Theme.colors.secondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

const AccountDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  
  .label {
    color: ${Theme.colors.gray2};
    font-size: 14px;
  }
  
  .value {
    font-size: 14px;
    font-weight: 500;
    color: ${Theme.colors.black};
  }
`;

const AccountNumber = styled.div`
  font-size: 16px;
  letter-spacing: 1px;
  margin-bottom: 16px;
  color: ${Theme.colors.black};
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${Theme.colors.secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
  
  &:hover {
    text-decoration: underline;
  }
  
  &.delete {
    color: ${Theme.colors.error};
  }
`;

const BankAccountCard: React.FC<BankAccountCardProps> = ({ 
  payoutMethod, 
  onEdit, 
  onDelete, 
  onSetDefault 
}) => {
  const { t } = useTranslation();
  
  // Format account number to show only last 4 digits
  const formatAccountNumber = (number: string) => {
    if (!number) return '';
    const lastFour = number.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };
  
  return (
    <CardContainer className={payoutMethod.isDefault ? 'default' : ''}>
      {payoutMethod.isDefault && (
        <DefaultBadge>
          {t('advertiser_dashboard.profile.payout_method.default')}
        </DefaultBadge>
      )}
      
      <AccountType>
        <BankIcon>
          {payoutMethod.type === 'RIB' ? 'R' : 'I'}
        </BankIcon>
        {payoutMethod.type === 'RIB' 
          ? t('advertiser_dashboard.profile.payout_method.rib') 
          : t('advertiser_dashboard.profile.payout_method.iban')}
      </AccountType>
      
      <AccountNumber>
        {formatAccountNumber(payoutMethod.accountNumber)}
      </AccountNumber>
      
      <AccountDetails>
        <DetailRow>
          <span className="label">{t('advertiser_dashboard.profile.payout_method.bank_name')}</span>
          <span className="value">{payoutMethod.bankName}</span>
        </DetailRow>
        <DetailRow>
          <span className="label">{t('advertiser_dashboard.profile.payout_method.account_holder')}</span>
          <span className="value">{payoutMethod.accountHolderName}</span>
        </DetailRow>
      </AccountDetails>
      
      <Actions>
        {!payoutMethod.isDefault && onSetDefault && (
          <ActionButton onClick={() => onSetDefault(payoutMethod)}>
            {t('advertiser_dashboard.profile.payout_method.set_as_default')}
          </ActionButton>
        )}
        {onEdit && (
          <ActionButton onClick={() => onEdit(payoutMethod)}>
            {t('advertiser_dashboard.profile.payout_method.edit')}
          </ActionButton>
        )}
        {onDelete && (
          <ActionButton className="delete" onClick={() => onDelete(payoutMethod)}>
            {t('advertiser_dashboard.profile.payout_method.delete')}
          </ActionButton>
        )}
      </Actions>
    </CardContainer>
  );
};

export default BankAccountCard; 