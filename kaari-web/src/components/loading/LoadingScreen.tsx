import React from 'react';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';
import { Theme } from '../../theme/theme';

// Create a styled component for the loading overlay
const LoadingOverlay = styled.div<{ isLoading: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: ${props => (props.isLoading ? 1 : 0)};
  visibility: ${props => (props.isLoading ? 'visible' : 'hidden')};
  transition: opacity 0.3s, visibility 0.3s;
`;

// Create a styled component for the loading content
const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

// Create a styled component for the loading text
const LoadingText = styled.div`
  color: ${Theme.colors.primary};
  font: ${Theme.typography.fonts.largeB};
  text-align: center;
`;

interface LoadingScreenProps {
  isLoading: boolean;
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  message = 'Loading...'
}) => {
  return (
    <LoadingOverlay isLoading={isLoading}>
      <LoadingContent>
        <LoadingSpinner size={80} />
        <LoadingText>{message}</LoadingText>
      </LoadingContent>
    </LoadingOverlay>
  );
};

export default LoadingScreen; 