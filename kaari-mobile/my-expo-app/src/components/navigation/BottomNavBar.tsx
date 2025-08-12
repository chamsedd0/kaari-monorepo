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
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8, paddingBottom: 12, backgroundColor: colors[background], borderTopColor: colors.gray100, borderTopWidth: 1 }}>
      {items.map((it) => (
        <PressableSurface key={it.key} onPress={() => onChange(it.key)} pressedBackground={colors.primary}>
          <View style={{ alignItems: 'center', padding: 6 }}>
            <View style={{ opacity: it.key === activeKey ? 1 : 0.6 }}>{it.icon}</View>
            <Text style={{ color: it.key === activeKey ? colors.primary : colors.gray500, fontSize: 12, marginTop: 4 }}>{it.label}</Text>
          </View>
        </PressableSurface>
      ))}
    </View>
  );
}


