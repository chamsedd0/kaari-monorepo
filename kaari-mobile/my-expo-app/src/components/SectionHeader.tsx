import React from 'react';
import { Image, ImageSourcePropType, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { VText } from './typography';
import { Timer } from './Timer';

type HeaderMode = 'image' | 'timer';

export type SectionHeaderProps = {
  mode: HeaderMode;
  bigText?: string;
  mediumText?: string;
  smallText?: string;
  rightImage?: ImageSourcePropType; // used when mode === 'image'
  timerUntilEpochMs?: number; // used when mode === 'timer'
  timerValue?: { days?: number; hours: number; minutes: number; seconds: number };
  // gradient colors (top-left to bottom-right)
  gradientStart?: string;
  gradientEnd?: string;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function SectionHeader({ mode, bigText, mediumText, smallText, rightImage, timerUntilEpochMs, timerValue, gradientStart = colors.primary, gradientEnd = colors.primaryDark, style, testID }: SectionHeaderProps) {
  const radius = 16;
  return (
    <View
      testID={testID}
      className="relative"
      style={{ borderTopLeftRadius: radius, borderTopRightRadius: radius, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, overflow: 'hidden' as ViewStyle['overflow'] }}
    >
      {/* Gradient background */}
      <Svg width="100%" height="100%" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
        <Defs>
          <SvgLinearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={gradientStart} stopOpacity={1} />
            <Stop offset="100%" stopColor={gradientEnd} stopOpacity={1} />
          </SvgLinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#headerGrad)" />
      </Svg>

      <View style={{ paddingVertical: 24, paddingHorizontal: 20 }}>
        {mode === 'timer' ? (
          <View className="items-center">
            {smallText ? (
              <VText className="text-[10px] leading-[12px]" weight="medium" style={{ color: colors.white }}>{smallText}</VText>
            ) : null}
            {bigText ? (
              <VText className="text-[24px] leading-[28px] mt-1" weight="bold" style={{ color: colors.white, textAlign: 'center' }}>{bigText}</VText>
            ) : null}
            {mediumText ? (
              <VText className="text-[12px] leading-[16px] mt-1" weight="medium" style={{ color: colors.white, textAlign: 'center' }}>{mediumText}</VText>
            ) : null}
            <View className="mt-3">
              {timerUntilEpochMs ? (
                <Timer variant="white" size="big" untilEpochMs={timerUntilEpochMs} />
              ) : timerValue ? (
                <Timer variant="white" size="big" value={timerValue} />
              ) : null}
            </View>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              {smallText ? (
                <VText className="text-[10px] leading-[12px]" weight="medium" style={{ color: colors.white }}>{smallText}</VText>
              ) : null}
              {bigText ? (
                <VText className="text-[24px] leading-[28px] mt-1" weight="bold" style={{ color: colors.white }}>{bigText}</VText>
              ) : null}
              {mediumText ? (
                <VText className="text-[12px] leading-[16px] mt-1" weight="medium" style={{ color: colors.white }}>{mediumText}</VText>
              ) : null}
            </View>
            {rightImage ? (
              <Image source={rightImage} style={{ width: 96, height: 96, resizeMode: 'contain' }} />
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}

export default { SectionHeader };


