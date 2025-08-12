import { useEffect, useState } from 'react';
import { Pressable, TextInput, TextInputProps } from 'react-native';
import { Icon } from './Icon';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../../theme/colors';

type Variant = 'default' | 'success' | 'disabled' | 'filled' | 'withAction' | 'password' | 'error';

type Props = TextInputProps & {
  variant?: Variant;
  onActionPress?: () => void;
  error?: boolean;
};

export function Input({ variant = 'default', onActionPress, secureTextEntry, error, ...props }: Props) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const isDisabled = variant === 'disabled' || props.editable === false;
  const isError = variant === 'error' || !!error;
  const base = 'rounded-full overflow-hidden flex-row items-center px-4 py-1';

  const focusSv = useSharedValue(0);
  const errorSv = useSharedValue(isError ? 1 : 0);

  useEffect(() => {
    focusSv.value = withTiming(focused ? 1 : 0, { duration: 180 });
  }, [focused]);

  useEffect(() => {
    errorSv.value = withTiming(isError ? 1 : 0, { duration: 120 });
  }, [isError]);

  const aStyle = useAnimatedStyle(() => {
    const borderColor = errorSv.value > 0.5
      ? colors.danger
      : interpolateColor(focusSv.value, [0, 1], [colors.gray100, colors.primary]);
    const borderWidth = errorSv.value > 0.5 ? 2 : 1 + focusSv.value;
    const backgroundColor = variant === 'filled' ? colors.primaryTint1 : colors.white;
    return { borderColor, borderWidth, backgroundColor, opacity: isDisabled ? 0.6 : 1 };
  });

  const inputColor = isDisabled ? '#B3B3B3' : variant === 'filled' ? '#FFFFFF' : '#252525';
  const placeholder = variant === 'filled' ? 'rgba(255,255,255,0.9)' : '#B3B3B3';

  return (
    <Animated.View className={base} style={aStyle}>
      <TextInput
        className="flex-1"
        placeholderTextColor={placeholder}
        editable={!isDisabled}
        secureTextEntry={variant === 'password' ? !show : secureTextEntry}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={{ color: inputColor }}
        {...props}
      />
      {variant === 'password' ? (
        <Pressable onPress={() => setShow((v) => !v)} className={variant === 'password'  ? 'bg-white/40 w-8 h-8 rounded-full items-center justify-center' : ''}>
          <Icon name={show ? 'show' : 'hide'} width={20} height={20} fill={variant === 'password'  ? '#771FAC' : '#8F27CE'} />
        </Pressable>
      ) : null}
      {variant === 'withAction' ? (
        <Pressable onPress={onActionPress} className={'bg-white/40 w-8 h-8 rounded-full items-center justify-center'}>
          <Icon name="arrowRight" width={20} height={20} fill={'#771FAC'} />
        </Pressable>
      ) : null}
    </Animated.View>
  );
}


