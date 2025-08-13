import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import InfoIcon from '~/../assets/Icon_Info.svg';

export type AlertTone = 'info' | 'warning' | 'danger' | 'success';

const toneMap: Record<AlertTone, { bg: keyof typeof colors; fg: keyof typeof colors }> = {
  info: { bg: 'primaryTint2', fg: 'primary' },
  warning: { bg: 'warning', fg: 'white' },
  danger: { bg: 'danger', fg: 'white' },
  success: { bg: 'success', fg: 'white' },
};

export type AlertBannerProps = {
  title: string;
  subtitle?: string;
  tone?: AlertTone;
  actionLabel?: string;
  onActionPress?: () => void;
};

export default function AlertBanner({ title, subtitle, tone = 'info', actionLabel, onActionPress }: AlertBannerProps) {
  const { bg } = toneMap[tone];
  const lightOnDark = tone !== 'info';
  return (
    <View className="flex-row items-center gap-3 px-3.5 py-3 rounded-[14px]" style={{ backgroundColor: colors[bg] }}>
      <View className="items-center justify-center rounded-[8px]" style={{ width: 28, height: 28, backgroundColor: lightOnDark ? 'rgba(255,255,255,0.2)' : colors.white }}>
        <InfoIcon width={16} height={16} color={lightOnDark ? colors.white : colors.primary} />
      </View>
      <View className="flex-1">
        <Text style={{ color: lightOnDark ? colors.white : colors.primary, fontWeight: '800' }}>{title}</Text>
        {!!subtitle && <Text className="mt-0.5" style={{ color: lightOnDark ? 'rgba(255,255,255,0.9)' : colors.gray700 }}>{subtitle}</Text>}
      </View>
      {!!actionLabel && (
        <Text onPress={onActionPress} style={{ color: lightOnDark ? colors.white : colors.primary, fontWeight: '800' }}>
          {actionLabel}
        </Text>
      )}
    </View>
  );
}


