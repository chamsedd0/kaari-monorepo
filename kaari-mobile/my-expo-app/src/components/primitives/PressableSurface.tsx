import React, { PropsWithChildren, useMemo } from 'react';
import { Pressable, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
// no shadows per request

export type PressableSurfaceProps = PropsWithChildren<{
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  className?: string;
  pressedBackground?: string; // must be a color from theme; caller responsibility
  pressedOverlayOpacity?: number; // default 0.08
  scaleFrom?: number;
  scaleTo?: number;
  accessibilityLabel?: string;
  borderRadius?: number;
}>;

export default function PressableSurface({
  children,
  onPress,
  disabled,
  style,
  className,
  pressedBackground,
  pressedOverlayOpacity = 0.08,
  scaleFrom = 1,
  scaleTo = 0.98,
  accessibilityLabel,
  borderRadius = 12,
}: PressableSurfaceProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? scaleTo : scaleFrom, { duration: 120 }) }],
  }));

  const underlayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(pressedBackground ? (pressed.value ? pressedOverlayOpacity : 0) : 0, { duration: 120 }),
  }));

  const containerStyle = useMemo(() => [{ borderRadius } as ViewStyle, style], [style, borderRadius]);

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      style={containerStyle}
      className={className}
    >
      <Animated.View style={[animatedStyle, { overflow: 'hidden', borderRadius }]}>{children}</Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: pressedBackground,
            borderRadius,
          },
          underlayStyle,
        ]}
      />
    </Pressable>
  );
}


