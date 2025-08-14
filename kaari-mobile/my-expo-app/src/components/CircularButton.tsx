import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';
import ShareIcon from '../../assets/Icon_Share.svg';
import HeartIcon from '../../assets/Icon_Favorites.svg';
import CloseIcon from '../../assets/Icon_Cross.svg';
import MessageIcon from '../../assets/Icon_Messages.svg';

type CircularVariant = 'glow' | 'glass' | 'close';

type CircularButtonProps = {
  variant: CircularVariant;
  size?: number; // diameter, default 44
  onPress?: () => void;
  disabled?: boolean;
  forcePressed?: boolean; // for gallery
  testID?: string;
  style?: ViewStyle | ViewStyle[];
  icon?: 'share' | 'like' | 'close'; // choose default icon for variants
  active?: boolean; // for like button to show red heart
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CircularButton({ variant, size = 44, onPress, disabled, forcePressed, testID, style, icon, active }: CircularButtonProps) {
  const progress = useSharedValue(0);
  const forced = useSharedValue(forcePressed ? 1 : 0);
  React.useEffect(() => {
    forced.value = forcePressed ? 1 : 0;
  }, [forcePressed]);

  // Static base style (non-animated)
  let borderWidth = 0;
  let borderColor = 'transparent';
  let baseBgStart = colors.white;
  let baseBgEnd = colors.primaryTint1;
  let shadow: ViewStyle = {};
  if (variant === 'glow') {
    baseBgStart = colors.white;
    baseBgEnd = colors.white;
    shadow = { shadowColor: colors.primary, shadowOpacity: 0.45, shadowRadius: 10, shadowOffset: { width: 0, height: 2 }, elevation: 8 };
  } else if (variant === 'glass') {
    baseBgStart = 'rgba(255,255,255,0.5)';
    baseBgEnd = 'rgba(255,255,255,0.65)';
    borderWidth = 3;
    borderColor = 'rgba(255,255,255,0.95)';
  } else if (variant === 'close') {
    baseBgStart = colors.primaryTint2; // #F7EBFF
    baseBgEnd = colors.primaryTint1; // #F1DBFF
  }

  const baseStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth,
    borderColor,
    ...shadow,
  };

  const trackStyle = useAnimatedStyle(() => {
    const t = forced.value > 0.5 ? 1 : progress.value;
    const backgroundColor = interpolateColor(t, [0, 1], [baseBgStart as string, baseBgEnd as string]);
    return { backgroundColor } as ViewStyle;
  });

  const iconStyle = useAnimatedStyle(() => {
    const t = forced.value > 0.5 ? 1 : progress.value;
    const scale = interpolate(t, [0, 1], [1, 0.95]);
    return { transform: [{ scale }] } as ViewStyle;
  });

  const rippleStyle = useAnimatedStyle(() => {
    const t = forced.value > 0.5 ? 1 : progress.value;
    const opacity = interpolate(t, [0, 1], [0, 0.12]);
    return { opacity } as ViewStyle;
  });

  const IconComp = icon === 'share' ? ShareIcon : icon === 'like' ? HeartIcon : CloseIcon;
  const iconColor = variant === 'glass' ? colors.white : variant === 'close' ? colors.white : colors.primary;
  const ring = variant === 'glow' ? { shadowColor: colors.primary, shadowOpacity: 0.55, shadowRadius: 12, shadowOffset: { width: 0, height: 3 }, elevation: 10 } : {};

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => (progress.value = withTiming(1, { duration: 120 }))}
      onPressOut={() => (progress.value = withTiming(0, { duration: 160 }))}
      testID={testID}
      className="items-center justify-center overflow-hidden"
      style={[baseStyle, trackStyle, ring as ViewStyle, style as any]}
    >
      {variant === 'glass' ? (
        <BlurView intensity={20} tint="light" style={{ position: 'absolute', inset: 0 as unknown as number }} />
      ) : null}
      {/* Inner subtle ring for polish */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', inset: 0 as unknown as number, borderRadius: size / 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' }}
      />
      {/* Press ripple overlay */}
      <Animated.View pointerEvents="none" style={[{ position: 'absolute', inset: 0 as unknown as number, backgroundColor: '#000' }, rippleStyle, { borderRadius: size / 2 }]} />
      <Animated.View style={iconStyle}>
        <IconComp
          width={size * 0.5}
          height={size * 0.5}
          color={icon === 'like' && active ? colors.danger : iconColor}
          fill={icon === 'like' && active ? colors.danger : iconColor}
          stroke={icon === 'like' && active ? colors.danger : iconColor}
        />
      </Animated.View>
    </AnimatedPressable>
  );
}

export default { CircularButton };


