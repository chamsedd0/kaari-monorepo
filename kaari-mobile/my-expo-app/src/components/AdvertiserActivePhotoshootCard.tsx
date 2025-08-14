import React from 'react';
import { View, Image, ActivityIndicator, ViewStyle, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { VText } from './typography';
import { SectionBadge } from './Badges';
import { CardDualButton } from './Button';
import { Timer } from './Timer';
import DownloadIcon from '../../assets/Icon_Download.svg';

type Status = 'assigned' | 'unassigned';

export type AdvertiserActivePhotoshootCardProps = {
  status: Status;
  title?: string; // e.g., Photoshoot
  dateLabel?: string; // e.g., 20.09.2024 6:00 PM
  untilEpochMs?: number; // when assigned, deadline for the timer
  agentName?: string;
  agentRole?: string;
  agentAvatarUri?: string;
  onContact?: () => void;
  onReschedule?: () => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function AdvertiserActivePhotoshootCard({
  status,
  title = 'Photoshoot',
  dateLabel,
  untilEpochMs,
  agentName = 'Derek Xavier',
  agentRole = 'Kaari Photography Agent',
  agentAvatarUri = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
  onContact,
  onReschedule,
  style,
  testID,
}: AdvertiserActivePhotoshootCardProps) {
  return (
    <View testID={testID} className="bg-white rounded-2xl overflow-hidden" style={style as any}>
      {/* Header */}
      <View className="p-4">
        {/* Absolute Section Badge */}
        <View style={{ position: 'absolute', left: 0, top: 0 }}>
          <SectionBadge label={title} variant="purple" />
        </View>
        <View className="flex-row items-start">
          {/* Invisible placeholder to reserve space for the absolute badge */}
          <SectionBadge label={title} variant="purple" style={{ opacity: 0 }} />
          <View className="flex-1">
            {dateLabel ? (
              <VText className="text-[12px] leading-[12px]" weight="medium" style={{ color: colors.gray500 }}>
                {dateLabel}
              </VText>
            ) : null}
          </View>
          <Pressable accessibilityRole="button" hitSlop={8}>
            <DownloadIcon width={18} height={18} color={colors.primary}  />
          </Pressable>
        </View>
      </View>

      {/* Body */}
      <View className="px-4 pb-2">
        {status === 'assigned' ? (
          <View className="flex-row items-center">
            {/* Left column: timer + agent info */}
            <View className="flex-1">
              <Timer variant="purple" size="small" untilEpochMs={untilEpochMs} />
              {/* Agent row */}
              <View className="flex-row items-center mt-3">
                <Image
                  source={{ uri: agentAvatarUri }}
                  style={{ width: 32, height: 32, borderRadius: 16 }}
                />
                <View className="ml-3">
                  <VText className="text-[16px] leading-[18px]" weight="bold" style={{ color: colors.gray700 }}>
                    {agentName}
                  </VText>
                  <VText className="text-[12px] leading-[12px] mt-1" weight="medium" style={{ color: colors.gray500 }}>
                    {agentRole}
                  </VText>
                </View>
              </View>
            </View>
            {/* Illustration */}
            <Image
              source={require('../../assets/Girl_with_camera.png')}
              style={{ width: 90, height: 90, resizeMode: 'contain', marginLeft: 8 }}
            />
          </View>
        ) : (
          <View className="flex-row items-center">
            <View className="flex-1 flex-row items-center">
              <ActivityIndicator color={colors.primary} />
              <VText className="text-[16px] leading-[18px] ml-2" weight="bold" style={{ color: colors.primaryDark }}>
                Not assigned yet
              </VText>
            </View>
            <Image
              source={require('../../assets/Girl_with_camera.png')}
              style={{ width: 100, height: 100, resizeMode: 'contain', marginLeft: 8 }}
            />
          </View>
        )}
      </View>

      {/* Footer actions */}
      <View className="mt-2">
        <CardDualButton leftLabel="Contact Agent" rightLabel="Reschedule" onLeftPress={onContact} onRightPress={onReschedule} />
      </View>
    </View>
  );
}

export default { AdvertiserActivePhotoshootCard };


