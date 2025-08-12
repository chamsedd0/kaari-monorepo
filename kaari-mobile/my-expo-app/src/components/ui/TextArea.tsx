import { useEffect, useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../../theme/colors';

type Variant = 'default' | 'success' | 'error' | 'disabled' | 'filled';

type Props = TextInputProps & {
  variant?: Variant;
  rows?: number;
};

export function TextArea({ variant = 'default', rows = 5, ...props }: Props) {
  const isDisabled = variant === 'disabled' || props.editable === false;
  const base = 'rounded-2xl overflow-hidden px-4 py-3';
  const [focused, setFocused] = useState(false as boolean);
  const isError = variant === 'error';
  const focusSv = useSharedValue(0);
  const errorSv = useSharedValue(isError ? 1 : 0);

  useEffect(() => {
    focusSv.value = withTiming(focused ? 1 : 0, { duration: 180 });
  }, [focused]);

  useEffect(() => {
    errorSv.value = withTiming(isError ? 1 : 0, { duration: 120 });
  }, [isError]);

  const aStyle = useAnimatedStyle(() => {
    const borderColor = errorSv.value > 0.5 ? colors.danger : interpolateColor(focusSv.value, [0, 1], [colors.gray100, colors.primary]);
    const borderWidth = errorSv.value > 0.5 ? 2 : 1 + focusSv.value;
    const backgroundColor = variant === 'filled' ? colors.primaryTint1 : colors.white;
    return { borderColor, borderWidth, backgroundColor };
  });
  const placeholder = variant === 'filled' ? 'rgba(255,255,255,0.9)' : '#B3B3B3';

  return (
    <Animated.View className={base} style={aStyle}>
      <TextInput
        className="min-h-[120px]"
        placeholderTextColor={placeholder}
        editable={!isDisabled}
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{ color: variant === 'filled' ? '#FFFFFF' : '#252525' }}
        {...props}
      />
    </Animated.View>
  );
}


