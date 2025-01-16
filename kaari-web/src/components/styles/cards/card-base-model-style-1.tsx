import React from 'react';

interface CardBaseProps {
  title?: string;
  children?: React.ReactNode;
}

const CardBaseModel: React.FC<CardBaseProps> = ({ title, children }) => {
  return (
    <div className="card-base">
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
};

export default CardBaseModel; 