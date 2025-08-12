import { ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BottomDrawer } from '../ui/BottomDrawer';

export function PopupShell({ visible, title, children, footer, onClose }: { visible: boolean; title: string; children: ReactNode; footer?: ReactNode; onClose?: () => void }) {
  return (
    <BottomDrawer visible={visible} onClose={onClose ?? (() => {})}>
      <View className="pt-3 pb-1 items-center">
        <View className="w-12 h-1.5 rounded-full bg-gray100" />
      </View>
      <View className="px-4 pb-2">
        <Text className="text-lg font-semibold text-black">{title}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="gap-3">{children}</View>
      </ScrollView>
      {footer ? <View className="p-4">{footer}</View> : null}
    </BottomDrawer>
  );
}



