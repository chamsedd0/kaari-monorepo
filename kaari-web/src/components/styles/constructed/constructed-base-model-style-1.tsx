import React from 'react';

interface ConstructedBaseProps {
  children?: React.ReactNode;
  className?: string;
}

const ConstructedBaseModel: React.FC<ConstructedBaseProps> = ({ children, className }) => {
  return (
    <div className={`constructed-base ${className || ''}`}>
      {children}
    </div>
  );
};

export default ConstructedBaseModel; 