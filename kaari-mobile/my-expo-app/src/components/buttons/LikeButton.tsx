import React from 'react';
import { View } from 'react-native';
import PressableSurface from '../primitives/PressableSurface';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '~/theme/colors';

export type LikeButtonProps = {
  liked: boolean;
  onToggle?: (liked: boolean) => void;
  size?: number;
};

export default function LikeButton({ liked, onToggle, size = 40 }: LikeButtonProps) {
  const progress = useSharedValue(liked ? 1 : 0);
  React.useEffect(() => {
    progress.value = withTiming(liked ? 1 : 0, { duration: 160 });
  }, [liked]);

  const heartStyle = useAnimatedStyle(() => ({
    backgroundColor: liked ? colors.danger : colors.gray200,
    transform: [{ scale: withTiming(liked ? 1 : 0.9, { duration: 160 }) }],
  }));

  return (
    <PressableSurface onPress={() => onToggle?.(!liked)} pressedBackground={colors.danger} borderRadius={100}>
      <Animated.View
        style={[{ width: size, height: size, borderRadius: 100 }, heartStyle]}
      />
    </PressableSurface>
  );
}


