import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface ReferralDiscountErrorBannerProps {
  error: string;
  onRetry?: () => void;
}

const ReferralDiscountErrorBanner: React.FC<ReferralDiscountErrorBannerProps> = ({ 
  error,
  onRetry
}) => {
  const { t } = useTranslation();

  return (
    <BannerContainer>
      <ErrorIcon>
        <FaExclamationTriangle />
      </ErrorIcon>
      <BannerContent>
        <BannerText>
          {t('referral.discount.error', 'Error loading discount: {{error}}', { error })}
        </BannerText>
        {onRetry && (
          <RetryButton onClick={onRetry}>
            {t('referral.discount.retry', 'Try again')}
          </RetryButton>
        )}
      </BannerContent>
    </BannerContainer>
  );
};

const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${Theme.colors.error}15;
  border-radius: ${Theme.borders.radius.md};
  padding: 12px 16px;
  width: 100%;
  border: 1px solid ${Theme.colors.error}30;
`;

const ErrorIcon = styled.div`
  color: ${Theme.colors.error};
  font-size: 20px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const BannerText = styled.div`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.error};
  margin-bottom: 4px;
`;

const RetryButton = styled.button`
  background: none;
  border: none;
  color: ${Theme.colors.primary};
  font: ${Theme.typography.fonts.smallB};
  cursor: pointer;
  padding: 0;
  text-align: left;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default ReferralDiscountErrorBanner; 