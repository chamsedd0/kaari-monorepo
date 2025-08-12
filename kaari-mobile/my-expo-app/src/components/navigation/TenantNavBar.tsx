import React from 'react';
import BottomNavBar, { BottomNavItem } from './BottomNavBar';
import HomeIcon from '~/../assets/Icon_Dashboard.svg';
import MessagesIcon from '~/../assets/Icon_Messages.svg';
import FavoritesIcon from '~/../assets/Icon_Favorites.svg';
import ProfileIcon from '~/../assets/Icon_Profile.svg';

export type TenantNavBarProps = {
  activeKey: string;
  onChange: (key: string) => void;
};

export default function TenantNavBar({ activeKey, onChange }: TenantNavBarProps) {
  const items: BottomNavItem[] = [
    { key: 'home', label: 'Home', icon: <HomeIcon width={20} height={20} /> },
    { key: 'messages', label: 'Messages', icon: <MessagesIcon width={20} height={20} /> },
    { key: 'favorites', label: 'Saved', icon: <FavoritesIcon width={20} height={20} /> },
    { key: 'profile', label: 'Profile', icon: <ProfileIcon width={20} height={20} /> },
  ];
  return <BottomNavBar items={items} activeKey={activeKey} onChange={onChange} />;
}


