import React from 'react';
import { View, Text, PanResponder, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '~/theme/colors';
// no shadows per request

export type BottomDrawerProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  initialSnap?: number; // 0..1 (1 = expanded)
  expandedHeightRatio?: number; // 0..1 of screen height
  background?: keyof typeof colors;
  onClose?: () => void;
};

export default function BottomDrawer({
  header,
  footer,
  children,
  initialSnap = 0.4,
  expandedHeightRatio = 0.86,
  background = 'white',
  onClose,
}: BottomDrawerProps) {
  const screenH = Dimensions.get('window').height;
  const expandedY = screenH * (1 - expandedHeightRatio);
  const collapsedY = screenH * (1 - initialSnap);

  const translateY = useSharedValue(collapsedY);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const pan = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        translateY.value = Math.max(expandedY, Math.min(collapsedY + g.dy, screenH));
      },
      onPanResponderRelease: (_, g) => {
        const shouldClose = g.vy > 1 || translateY.value > (collapsedY + expandedY) / 2;
        translateY.value = withSpring(shouldClose ? screenH : expandedY, { damping: 18, stiffness: 160 }, (finished) => {
          if (finished && shouldClose) onClose?.();
        });
      },
    }),
  ).current;

  React.useEffect(() => {
    // animate in
    translateY.value = withSpring(collapsedY, { damping: 18, stiffness: 160 });
  }, []);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: expandedY,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors[background],
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 8,
        }}
        {...pan.panHandlers}
      >
        <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
          <View style={{ width: 48, height: 4, backgroundColor: colors.gray200, borderRadius: 2 }} />
        </View>
        {!!header && <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>{header}</View>}
        <View style={{ flex: 1, paddingHorizontal: 16 }}>{children}</View>
        {!!footer && <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>{footer}</View>}
      </View>
    </Animated.View>
  );
}


