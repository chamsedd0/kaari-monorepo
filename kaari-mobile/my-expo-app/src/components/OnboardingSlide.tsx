import React from 'react';
import { View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';
import { SecondaryButton } from './Button';
import Icon from './ui/Icon';

export function StoryProgress({ index, total, progress }: { index: number; total: number; progress: Animated.SharedValue<number> }) {
  const items = Array.from({ length: total });
  const widthStyle = useAnimatedStyle(() => ({ width: `${Math.min(Math.max(progress.value, 0), 1) * 100}%` }));
  return (
    <View className="flex-row items-center gap-1 px-4 pt-4">
      {items.map((_, i) => {
        const isPast = i < index;
        const isCurrent = i === index;
        return (
          <View key={i} style={{ height: 3, flex: 1, borderRadius: 2, overflow: 'hidden', backgroundColor: colors.primaryTint1 }}>
            {isPast ? (
              <View style={{ backgroundColor: colors.white, width: '100%', height: '100%' }} />
            ) : isCurrent ? (
              <Animated.View style={[{ backgroundColor: colors.white, height: '100%' }, widthStyle]} />
            ) : (
              <View style={{ width: 0, height: '100%' }} />
            )}
          </View>
        );
      })}
    </View>
  );
}

export default function OnboardingSlide({
  index,
  total,
  title,
  subtitle,
  onNext,
  onBack,
  onSkip,
  Middle,
  finalLabel,
}: {
  index: number;
  total: number;
  title: string;
  subtitle: string;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  Middle?: React.ComponentType;
  finalLabel?: string;
}) {
  const MiddleCmp = Middle;
  const progress = useSharedValue(0);

  React.useEffect(() => {
    // restart segment progress on index change
    progress.value = 0;
    progress.value = withTiming(1, { duration: 4000 }, (finished) => {
      if (finished) runOnJS(onNext)();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  return (
    <View className="flex-1" style={{ backgroundColor: colors.primary }}>
      <StoryProgress index={index} total={total} progress={progress} />

      {/* Header controls */}
      <View className="flex-row items-center justify-between px-4 mt-3">
        <View className="items-start" style={{ width: 44 }}>
          {onBack ? (
            <Pressable onPress={onBack} accessibilityRole="button" hitSlop={10}>
              <Icon name="arrow-left" width={28} height={28} fill={colors.white} />
            </Pressable>
          ) : null}
        </View>
        <View className="items-center" style={{ width: 44 }} />
        <View className="items-end" style={{ width: 44 }}>
          {onSkip ? (
            <Pressable onPress={onSkip} accessibilityRole="button" hitSlop={10}>
              <Icon name="cross" width={28} height={28} fill={colors.white} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Illustration placeholder */}
      <View className="flex-1 items-center justify-center px-8">
        {MiddleCmp ? <MiddleCmp /> : <View style={{ width: 260, height: 260 }} />}
      </View>

      {/* Title + subtitle + next */}
      <View className="px-6 pb-8">
        <VText style={{ color: colors.white }} className="text-[24px] leading-[28px] text-center mb-2" weight="bold">
          {title}
        </VText>
        <VText style={{ color: colors.white, opacity: 0.9 }} className="text-[14px] leading-[20px] text-center mb-5" weight="medium">
          {subtitle}
        </VText>
        <View>
          <SecondaryButton
            label={index + 1 === total ? (finalLabel || 'Start Searching') : 'Next'}
            onPress={onNext}
            style={{ width: '100%' }}
            icon={<Icon name="arrow-right" width={18} height={18} fill={colors.primary} />}
          />
        </View>
      </View>
    </View>
  );
}


