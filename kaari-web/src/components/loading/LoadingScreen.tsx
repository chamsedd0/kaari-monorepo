import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Theme } from '../../theme/theme';
import logo from '../../assets/images/purpleLogo.svg';

interface LoadingScreenProps {
    isLoading: boolean;
}

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
`;

const LoadingContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${Theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.7s ease, visibility 0.2s ease;
  
  ${props => !props.isVisible && `
    animation: ${fadeOut} 0.2s ease forwards;
  `}
`;

const LogoContainer = styled.div`
  animation: ${pulse} 2s infinite ease-in-out;
  margin-bottom: 30px;
  
  img {
    width: 120px;
    height: auto;
  }
`;



const ProgressBar = styled.div`
  width: 200px;
  height: 4px;
  background-color: ${Theme.colors.tertiary};
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 30%;
    background-color: ${Theme.colors.primary};
    animation: progress 1.5s infinite ease-in-out;
  }
  
  @keyframes progress {
    0% {
      left: -30%;
    }
    100% {
      left: 100%;
    }
  }
`;

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  // Only render the loading screen if isLoading is true
  if (!isLoading) return null;
  
  return (
    <LoadingContainer isVisible={isLoading}>
      <LogoContainer>
        {/* Replace with your actual logo */}
            <img src={logo} alt="Kaari Logo" />
      </LogoContainer>
      <ProgressBar />
    </LoadingContainer>
  );
};

export default LoadingScreen; 