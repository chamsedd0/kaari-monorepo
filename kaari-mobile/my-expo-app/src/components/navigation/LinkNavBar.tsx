import React from 'react';
import BottomNavBar, { BottomNavItem } from './BottomNavBar';
import InfoIcon from '~/../assets/Icon_Info.svg';
import PaymentsIcon from '~/../assets/Icon_Payments.svg';
import ReviewsIcon from '~/../assets/Icon_Review.svg';

export type LinkNavBarProps = {
  activeKey: string;
  onChange: (key: string) => void;
};

export default function LinkNavBar({ activeKey, onChange }: LinkNavBarProps) {
  const items: BottomNavItem[] = [
    { key: 'info', label: 'Info', icon: <InfoIcon width={20} height={20} /> },
    { key: 'payments', label: 'Payments', icon: <PaymentsIcon width={20} height={20} /> },
    { key: 'reviews', label: 'Reviews', icon: <ReviewsIcon width={20} height={20} /> },
  ];
  return <BottomNavBar items={items} activeKey={activeKey} onChange={onChange} />;
}


