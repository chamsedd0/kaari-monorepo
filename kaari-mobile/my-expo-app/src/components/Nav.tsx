import React from 'react';
import { Pressable, View, Text, ViewStyle } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';

// Icons
import AlertsIcon from '../../assets/Icon_Notifications.svg';
import ReservationIcon from '../../assets/Icon_Reservation.svg';
import SearchIcon from '../../assets/Icon_Search.svg';
import MessagesIcon from '../../assets/Icon_Messages.svg';
import FavoritesIcon from '../../assets/Icon_Favorites.svg';
import DashboardIcon from '../../assets/Icon_Dashboard.svg';
import PropertyIcon from '../../assets/Icon_Property.svg';
import AccountIcon from '../../assets/Icon_Profile.svg';

type IconName = 'alerts' | 'reservation' | 'search' | 'messages' | 'favorites' | 'dashboard' | 'listings' | 'account';

function IconFor({ name, color }: { name: IconName; color: string }) {
  const props = { width: 22, height: 22, color, fill: color, stroke: color } as any;
  switch (name) {
    case 'alerts':
      return <AlertsIcon {...props} />;
    case 'reservation':
      return <ReservationIcon {...props} />;
    case 'search':
      return <SearchIcon {...props} />;
    case 'messages':
      return <MessagesIcon {...props} />;
    case 'favorites':
      return <FavoritesIcon {...props} />;
    case 'dashboard':
      return <DashboardIcon {...props} />;
    case 'listings':
      return <PropertyIcon {...props} />;
    case 'account':
    default:
      return <AccountIcon {...props} />;
  }
}

type NavItemProps = {
  icon: IconName;
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function BottomNavItem({ icon, label, active, onPress }: NavItemProps) {
  const p = useSharedValue(active ? 1 : 0);
  React.useEffect(() => {
    p.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active]);
  const colorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(p.value, [0, 1], [colors.gray500, colors.primary]),
  }));
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className="items-center justify-center">
      <Animated.View style={colorStyle}>
        {/* Dual-layer to ensure color application regardless of SVG fill */}
        <View className="relative">
          <View className="absolute inset-0 opacity-100">
            <IconFor name={icon} color={colors.gray500} />
          </View>
          <Animated.View className="absolute inset-0" style={{ opacity: p as unknown as number }}>
            <IconFor name={icon} color={colors.primary} />
          </Animated.View>
          <View>
            <IconFor name={icon} color="transparent" />
          </View>
        </View>
      </Animated.View>
      <Animated.Text className="text-[12px] leading-[12px] mt-1" style={[{ fontFamily: 'VisbyCF', fontWeight: '500' }, colorStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

type BottomNavBarProps = {
  items: { key: string; icon: IconName; label: string }[];
  activeKey: string;
  onChange: (key: string) => void;
  style?: ViewStyle | ViewStyle[];
};

export function BottomNavBar({ items, activeKey, onChange, style }: BottomNavBarProps) {
  return (
    <View className="w-full flex-row items-center justify-between px-3 py-4 bg-white" style={style as any}>
      {items.map(item => (
        <View key={item.key} className="items-center">
          <NavTile icon={item.icon} label={item.label} active={activeKey === item.key} onPress={() => onChange(item.key)} size={64} />
        </View>
      ))}
    </View>
  );
}

// Dashboard nav tile (square/rounded) default and pressed
type NavTileProps = {
  icon: IconName;
  label: string;
  active?: boolean; // active style
  previewPressed?: boolean; // preview variant only
  onPress?: () => void;
  size?: number;
};

export function NavTile({ icon, label, active, previewPressed, onPress, size = 88 }: NavTileProps) {
  const p = useSharedValue(active ? 1 : 0);
  React.useEffect(() => {
    p.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active]);
  const bg = previewPressed ? colors.primaryTint2 : colors.white;
  const colorStyle = useAnimatedStyle(() => ({ color: interpolateColor(p.value, [0, 1], [colors.gray700, colors.primary]) }));
  const iconSize = Math.round(size * 0.36);
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className="items-center justify-center rounded-2xl py-5" style={{ width: size, height: size, backgroundColor: bg }}>
      <View className="relative">
        <View className="absolute inset-0 opacity-100">
          <IconFor name={icon} color={colors.gray500} />
        </View>
        <Animated.View className="absolute inset-0" style={{ opacity: p as unknown as number }}>
          <IconFor name={icon} color={colors.primary} />
        </Animated.View>
        <View style={{ width: iconSize, height: iconSize }}>
          <IconFor name={icon} color="transparent" />
        </View>
      </View>
      <Animated.Text className="text-[12px] leading-[12px] mt-2" style={[{ fontFamily: 'VisbyCF', fontWeight: '500' }, colorStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

// Ready-made navbars
export function TenantBottomNav({ activeKey, onChange }: { activeKey: string; onChange: (key: string) => void }) {
  const items = [
    { key: 'alerts', icon: 'alerts' as IconName, label: 'Alerts' },
    { key: 'reservation', icon: 'reservation' as IconName, label: 'Reservation' },
    { key: 'search', icon: 'search' as IconName, label: 'Search' },
    { key: 'messages', icon: 'messages' as IconName, label: 'Messages' },
    { key: 'favorites', icon: 'favorites' as IconName, label: 'Favorites' },
  ];
  return <BottomNavBar items={items} activeKey={activeKey} onChange={onChange} />;
}

export function AdvertiserBottomNav({ activeKey, onChange }: { activeKey: string; onChange: (key: string) => void }) {
  const items = [
    { key: 'dashboard', icon: 'dashboard' as IconName, label: 'Dashboard' },
    { key: 'requests', icon: 'reservation' as IconName, label: 'Requests' },
    { key: 'messages', icon: 'messages' as IconName, label: 'Messages' },
    { key: 'listings', icon: 'listings' as IconName, label: 'Listings' },
    { key: 'account', icon: 'account' as IconName, label: 'Account' },
  ];
  return <BottomNavBar items={items} activeKey={activeKey} onChange={onChange} />;
}

export default { BottomNavItem, BottomNavBar, NavTile, TenantBottomNav, AdvertiserBottomNav };


