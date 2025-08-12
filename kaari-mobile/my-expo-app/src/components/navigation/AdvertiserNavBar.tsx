import React from 'react';
import BottomNavBar, { BottomNavItem } from './BottomNavBar';
import DashboardIcon from '~/../assets/Icon_Dashboard.svg';
import MessagesIcon from '~/../assets/Icon_Messages.svg';
import PropertiesIcon from '~/../assets/Icon_Property.svg';
import ProfileIcon from '~/../assets/Icon_Profile.svg';

export type AdvertiserNavBarProps = {
  activeKey: string;
  onChange: (key: string) => void;
};

export default function AdvertiserNavBar({ activeKey, onChange }: AdvertiserNavBarProps) {
  const items: BottomNavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon width={20} height={20} /> },
    { key: 'messages', label: 'Messages', icon: <MessagesIcon width={20} height={20} /> },
    { key: 'properties', label: 'Properties', icon: <PropertiesIcon width={20} height={20} /> },
    { key: 'profile', label: 'Profile', icon: <ProfileIcon width={20} height={20} /> },
  ];
  return <BottomNavBar items={items} activeKey={activeKey} onChange={onChange} />;
}


