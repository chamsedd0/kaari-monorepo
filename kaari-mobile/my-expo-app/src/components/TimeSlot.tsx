import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';

type TimeSlotProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  style?: ViewStyle | ViewStyle[];
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TimeSlot({ label, selected = false, onPress, disabled, testID, style }: TimeSlotProps) {
  const progress = useSharedValue(selected ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 180 });
  }, [selected]);

  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, [0, 1], [colors.white, colors.primary]);
    const borderColor = interpolateColor(progress.value, [0, 1], [colors.primary, 'transparent']);
    const borderWidth = interpolate(progress.value, [0, 1], [1, 0]);
    return { backgroundColor, borderColor, borderWidth } as ViewStyle;
  });

  const textStyle = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, [0, 1], [colors.primary, colors.white]);
    return { color } as ViewStyle;
  });

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      className="rounded-[100px] px-6 py-3 items-center justify-center"
      style={style}
    >
      <Animated.View className="rounded-[100px] px-6 py-3 items-center justify-center border" style={containerStyle}>
        <Animated.Text
          className="text-[16px] leading-[16px]"
          style={{ fontFamily: 'VisbyCF-DemiBold' }}
          // merge animated color
          // eslint-disable-next-line react-native/no-inline-styles
          
        >
          {/* animated color via separate Animated.Text style prop below */}
        </Animated.Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

export function TimeSlotSimple({ label, selected = false, onPress, disabled, testID, style }: TimeSlotProps) {
  const progress = useSharedValue(selected ? 1 : 0);
  React.useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 180 });
  }, [selected]);
  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, [0, 1], [colors.white, colors.primary]);
    const borderColor = interpolateColor(progress.value, [0, 1], [colors.primary, 'transparent']);
    const borderWidth = interpolate(progress.value, [0, 1], [1, 0]);
    return { backgroundColor, borderColor, borderWidth } as ViewStyle;
  });
  const colorStyle = useAnimatedStyle(() => ({ color: interpolateColor(progress.value, [0, 1], [colors.primary, colors.white]) as unknown as string }));
  return (
    <AnimatedPressable accessibilityRole="button" disabled={disabled} onPress={onPress} testID={testID} className="self-start">
      <Animated.View className="rounded-[100px] px-6 py-3 items-center justify-center border" style={[containerStyle, style as any]}>
        <Animated.Text className="text-[16px] leading-[16px]" style={[{ fontFamily: 'VisbyCF-DemiBold' }, colorStyle]}>
          {label}
        </Animated.Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

export default { TimeSlot, TimeSlotSimple };

type TimeSlotToggleProps = {
  label: string;
  defaultSelected?: boolean;
  onChange?: (selected: boolean) => void;
  testID?: string;
  style?: ViewStyle | ViewStyle[];
};

export function TimeSlotToggle({ label, defaultSelected = false, onChange, testID, style }: TimeSlotToggleProps) {
  const [selected, setSelected] = React.useState(defaultSelected);
  const progress = useSharedValue(defaultSelected ? 1 : 0);
  React.useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 180 });
  }, [selected]);
  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value, [0, 1], [colors.white, colors.primary]);
    const borderColor = interpolateColor(progress.value, [0, 1], [colors.primary, 'transparent']);
    const borderWidth = interpolate(progress.value, [0, 1], [1, 0]);
    return { backgroundColor, borderColor, borderWidth } as ViewStyle;
  });
  const colorStyle = useAnimatedStyle(() => ({ color: interpolateColor(progress.value, [0, 1], [colors.primary, colors.white]) as unknown as string }));
  return (
    <AnimatedPressable
      accessibilityRole="button"
      testID={testID}
      onPress={() => {
        setSelected(s => {
          const next = !s;
          onChange?.(next);
          return next;
        });
      }}
      className="self-start"
    >
      <Animated.View className="rounded-[100px] px-6 py-3 items-center justify-center border" style={[containerStyle, style as any]}>
        <Animated.Text className="text-[16px] leading-[16px]" style={[{ fontFamily: 'VisbyCF-DemiBold' }, colorStyle]}>
          {label}
        </Animated.Text>
      </Animated.View>
    </AnimatedPressable>
  );
}

export const Components = { TimeSlot, TimeSlotSimple, TimeSlotToggle };


