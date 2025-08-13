import React from 'react';
import { View, Text } from 'react-native';
import PressableSurface from '../primitives/PressableSurface';
import { colors } from '~/theme/colors';

export type BottomNavItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

export type BottomNavBarProps = {
  items: BottomNavItem[];
  activeKey: string;
  onChange: (key: string) => void;
  background?: keyof typeof colors;
};

export default function BottomNavBar({ items, activeKey, onChange, background = 'white' }: BottomNavBarProps) {
  return (
    <View className="flex-row justify-around pt-2 pb-3 border-t" style={{ backgroundColor: colors[background], borderTopColor: colors.gray100 }}>
      {items.map((it) => (
        <PressableSurface key={it.key} onPress={() => onChange(it.key)} pressedBackground={colors.primary}>
          <View className="items-center p-1.5">
            <View style={{ opacity: it.key === activeKey ? 1 : 0.6 }}>{it.icon}</View>
            <Text className="mt-1 text-xs" style={{ color: it.key === activeKey ? colors.primary : colors.gray500 }}>{it.label}</Text>
          </View>
        </PressableSurface>
      ))}
    </View>
  );
}


