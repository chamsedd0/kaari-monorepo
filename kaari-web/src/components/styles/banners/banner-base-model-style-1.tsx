import React from 'react';

interface BannerBaseProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

const BannerBaseModel: React.FC<BannerBaseProps> = ({ type = 'info', message }) => {
  return (
    <div className={`banner-base banner-${type}`}>
      {message}
    </div>
  );
};

export default BannerBaseModel; 