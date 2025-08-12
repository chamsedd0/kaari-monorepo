import React from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '~/theme/colors';

export type TabItem = { key: string; title: string };

export type TabsProps = {
  items: TabItem[];
  activeKey: string;
  onTabPress: (key: string) => void;
};

export default function Tabs({ items, activeKey, onTabPress }: TabsProps) {
  const indicatorLeft = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const containerRef = React.useRef<View>(null);
  const labelLayouts = React.useRef<Record<string, { x: number; width: number }>>({}).current;

  React.useEffect(() => {
    const layout = labelLayouts[activeKey];
    if (!layout) return;
    indicatorLeft.value = withTiming(layout.x, { duration: 160 });
    indicatorWidth.value = withTiming(layout.width, { duration: 160 });
  }, [activeKey]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: indicatorLeft.value,
    width: indicatorWidth.value,
  }));

  const onLabelLayout = (key: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    labelLayouts[key] = { x, width };
  };

  return (
    <View ref={containerRef} style={{ paddingHorizontal: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {items.map((t) => (
          <Pressable key={t.key} onPress={() => onTabPress(t.key)} style={{ paddingVertical: 12, alignItems: 'center' }}>
            <View onLayout={onLabelLayout(t.key)}>
              <Text style={{ color: t.key === activeKey ? colors.gray700 : colors.gray500, fontWeight: t.key === activeKey ? '800' : '600' }}>{t.title}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <View style={{ height: 8 }} />
      <View style={{ height: 1, backgroundColor: colors.gray100 }} />
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 1,
            height: 3,
            backgroundColor: colors.primary,
            borderRadius: 999,
          },
          indicatorStyle,
        ]}
      />
    </View>
  );
}


