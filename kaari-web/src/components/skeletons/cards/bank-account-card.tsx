import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { useToastService } from '../../../services/ToastService';
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
  padding: 20px 22px;
  background-color: #fff;
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  position: relative;
  border: 1px solid ${Theme.colors.tertiary};
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.09);
    transform: translateY(-1px);
  }
  
  &.default {
    border: 1px solid ${Theme.colors.secondary};
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const DefaultBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: ${Theme.colors.secondary};
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(147, 51, 234, 0.25);
`;

const AccountType = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
  color: ${Theme.colors.black};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BankIcon = styled.div<{ $bg?: string }>`
  width: 24px;
  height: 24px;
  background-color: ${({ $bg }) => $bg || Theme.colors.secondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
`;
const TypeChip = styled.span`
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 999px;
  border: 1px solid ${Theme.colors.tertiary};
  color: ${Theme.colors.black};
  background: #fff;
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
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
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
const CopyButton = styled.button`
  background: none;
  border: 1px solid ${Theme.colors.tertiary};
  color: ${Theme.colors.black};
  font-size: 12px;
  border-radius: 8px;
  padding: 4px 6px;
  cursor: pointer;
  &:hover { background: ${Theme.colors.tertiary}; }
`;

const NudgeLink = styled.button`
  background: transparent;
  border: none;
  color: ${Theme.colors.secondary};
  font-size: 12px;
  cursor: pointer;
  padding: 2px 4px;
  text-decoration: underline;
  &:hover { opacity: 0.85; }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${Theme.colors.tertiary};
  margin: 10px 0 14px;
`;

const ButtonRow = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Btn = styled.button<{ $variant?: 'ghost' | 'outline' | 'destructive' }>`
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid ${Theme.colors.tertiary};
  background: #fff;
  color: ${Theme.colors.black};
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  ${({ $variant }) => $variant === 'ghost' && `background: transparent;`}
  ${({ $variant }) => $variant === 'outline' && `background: #fff;`}
  ${({ $variant }) => $variant === 'destructive' && `border-color: ${Theme.colors.error}; color: ${Theme.colors.error};`}
  &:hover { background: ${Theme.colors.tertiary}; }
`;

const BankAccountCard: React.FC<BankAccountCardProps> = ({ 
  payoutMethod, 
  onEdit, 
  onDelete, 
  onSetDefault 
}) => {
  const { t } = useTranslation();
  const toast = useToastService();
  
  // Format account number to show only last 4 digits
  const formatAccountNumber = (number: string) => {
    if (!number) return '';
    const lastFour = number.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };
  // Simple brand mapping by bank name
  const getBankBrand = (name?: string): { label: string; color: string } => {
    const n = (name || '').toLowerCase();
    if (n.includes('attijari')) return { label: 'AWB', color: '#f59e0b' };
    if (n.includes('populaire') || n.includes('bcp')) return { label: 'BCP', color: '#0ea5e9' };
    if (n.includes('cih')) return { label: 'CIH', color: '#06b6d4' };
    if (n.includes('bmce') || n.includes('boa')) return { label: 'BOA', color: '#10b981' };
    if (n.includes('sgmb') || n.includes('société') || n.includes('societe') || n.includes('generale')) return { label: 'SG', color: '#ef4444' };
    if (n.includes('cam') || n.includes('agricole')) return { label: 'CAM', color: '#16a34a' };
    if (n.includes('barid')) return { label: 'ABA', color: '#8b5cf6' };
    if (n.includes('bmci')) return { label: 'BMCI', color: '#14b8a6' };
    if (n.includes('cfg')) return { label: 'CFG', color: '#a855f7' };
    return { label: (name && name[0]?.toUpperCase()) || (payoutMethod.type === 'RIB' ? 'R' : 'I'), color: Theme.colors.secondary } as any;
  };
  const copyAccount = async () => {
    try {
      if (payoutMethod.accountNumber) {
        await navigator.clipboard.writeText(payoutMethod.accountNumber);
        try {
          toast.showToast('success', t('common.copied', 'Copied'), t('advertiser_dashboard.profile.payout_method.account_copied', 'Account number copied to clipboard'));
        } catch {}
      }
    } catch {}
  };
  
  return (
    <CardContainer className={payoutMethod.isDefault ? 'default' : ''}>
      {payoutMethod.isDefault && (
        <DefaultBadge>
          {t('advertiser_dashboard.profile.payout_method.default')}
        </DefaultBadge>
      )}
      
      <HeaderRow>
        <AccountType>
          {(() => { const b = getBankBrand(payoutMethod.bankName); return (
            <BankIcon $bg={b.color} title={payoutMethod.bankName || b.label}>{b.label}</BankIcon>
          ); })()}
          {payoutMethod.bankName || (payoutMethod.type === 'RIB' 
            ? t('advertiser_dashboard.profile.payout_method.rib') 
            : t('advertiser_dashboard.profile.payout_method.iban'))}
          <TypeChip>{payoutMethod.type}</TypeChip>
        </AccountType>
        {payoutMethod.isDefault && (
          <DefaultBadge>
            {t('advertiser_dashboard.profile.payout_method.default')}
          </DefaultBadge>
        )}
      </HeaderRow>
      
      <AccountNumber>
        {formatAccountNumber(payoutMethod.accountNumber)}
        <CopyButton onClick={copyAccount} title={t('common.copy', 'Copy')}>
          {t('common.copy', 'Copy')}
        </CopyButton>
        {!payoutMethod.isDefault && onSetDefault && (
          <NudgeLink onClick={() => onSetDefault(payoutMethod)}>
            {t('advertiser_dashboard.profile.payout_method.set_as_default')}
          </NudgeLink>
        )}
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
      <Divider />
      <ButtonRow>
        {!payoutMethod.isDefault && onSetDefault && (
          <Btn $variant="ghost" onClick={() => onSetDefault(payoutMethod)}>
            {t('advertiser_dashboard.profile.payout_method.set_as_default')}
          </Btn>
        )}
        {onEdit && (
          <Btn $variant="outline" onClick={() => onEdit(payoutMethod)}>
            {t('advertiser_dashboard.profile.payout_method.edit')}
          </Btn>
        )}
        {onDelete && (
          <Btn $variant="destructive" onClick={() => onDelete(payoutMethod)}>
            {t('advertiser_dashboard.profile.payout_method.delete')}
          </Btn>
        )}
      </ButtonRow>
    </CardContainer>
  );
};

export default BankAccountCard; 