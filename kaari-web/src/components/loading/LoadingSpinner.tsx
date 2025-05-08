import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Theme } from '../../theme/theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 60px;
  height: 60px;
`;

const SpinnerCircle = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 48px;
  height: 48px;
  margin: 6px;
  border: 4px solid ${Theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: ${Theme.colors.primary} transparent transparent transparent;
`;

interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 60 }) => {
  return (
    <SpinnerContainer style={{ width: size, height: size }}>
      <SpinnerCircle style={{ width: size * 0.8, height: size * 0.8, margin: size * 0.1 }} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 