import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth, applyActionCode, signInWithEmailLink } from 'firebase/auth';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';
import { FaSpinner } from 'react-icons/fa';

/**
 * Email verification handler component
 * This component handles the verification process when a user clicks on a verification link
 */
const EmailVerificationHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(true);
  
  useEffect(() => {
    const processVerification = async () => {
      // Get the action code from URL parameters
      const actionCode = searchParams.get('oobCode');
      
      if (!actionCode) {
        // No action code found, redirect to error page
        navigate('/email-verification/error');
        return;
      }
      
      try {
        const auth = getAuth();
        
        // Apply the action code to verify the email
        await applyActionCode(auth, actionCode);
        
        // If successful, redirect to success page
        navigate('/email-verification/success');
      } catch (error) {
        console.error('Error verifying email:', error);
        // If verification fails, redirect to error page
        navigate('/email-verification/error');
      } finally {
        setIsProcessing(false);
      }
    };
    
    processVerification();
  }, [searchParams, navigate]);
  
  return (
    <Container>
      <LoadingSpinner>
        <FaSpinner size={48} />
      </LoadingSpinner>
      <LoadingText>{t('common.loading')}</LoadingText>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${Theme.colors.white};
`;

const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  color: ${Theme.colors.secondary};
  margin-bottom: 16px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.gray2};
`;

export default EmailVerificationHandler; 