import React from 'react';
import styled, { keyframes } from 'styled-components';
import loadingSvg from './Loading2.svg';

// Create a rotation animation
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Create a styled component that wraps the SVG image with rotation animation
const SpinningContainer = styled.img`
  animation: ${rotate} 2s infinite linear;
`;

interface SpinningLoadingProps {
  width?: string;
  height?: string;
  className?: string;
}

const SpinningLoading: React.FC<SpinningLoadingProps> = ({ 
  width = '56px', 
  height = '56px',
  className 
}) => {
  return (
    <SpinningContainer 
      src={loadingSvg} 
      alt="Loading" 
      style={{ width, height }}
      className={className}
    />
  );
};

export default SpinningLoading; 