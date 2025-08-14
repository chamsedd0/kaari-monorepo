import React from 'react';
import { Image, ImageBackground, Pressable, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';
import { PeopleTag } from './Tag';
import InfoIcon from '../../assets/Icon_Info.svg';
import ChatIcon from '../../assets/Icon_Messages.svg';
import CrossIcon from '../../assets/Icon_Cross.svg';

export type TenantInfoCardProps = {
  imageUri: string;
  propertyType: string;
  propertyTitle: string;
  peopleCount: number;
  tenantNameAge: string;
  tenantRole: string;
  tenantAvatarUri: string;
  details?: { label: string; value: string }[];
  defaultExpanded?: boolean;
  onToggleDetails?: (expanded: boolean) => void;
  onPressChat?: () => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function TenantInfoCard({ imageUri, propertyType, propertyTitle, peopleCount, tenantNameAge, tenantRole, tenantAvatarUri, details = [], defaultExpanded, onToggleDetails, onPressChat, style, testID }: TenantInfoCardProps) {
  const [expanded, setExpanded] = React.useState(!!defaultExpanded);
  function toggle() {
    const next = !expanded;
    setExpanded(next);
    onToggleDetails?.(next);
  }

  return (
    <Animated.View
      testID={testID}
      className="rounded-2xl overflow-hidden bg-white"
      style={style as any}
      layout={LinearTransition.springify().damping(26).stiffness(200)}
    >
      {/* Header image with overlay and top controls */}
      <View className="relative" style={{ width: '100%', aspectRatio: 10 / 4, maxHeight: 155 }}>
        <ImageBackground source={{ uri: imageUri }} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
        </ImageBackground>
        <View style={{ padding: 12, flex: 1 }}>
          <View className="flex-row items-start justify-between">
            <PeopleTag count={peopleCount} variant="white" />
            <Pressable accessibilityRole="button" onPress={toggle} className="rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', width: 32, height: 32 }}>
              {expanded ? (
                <CrossIcon width={20} height={20} color={colors.white} stroke={colors.white} />
              ) : (
                <InfoIcon width={20} height={20} color={colors.white} stroke={colors.white} />
              )}
            </Pressable>
          </View>
          <View style={{ flex: 1 }} />
          <View>
            <VText className="text-white text-[12px] leading-[12px]" weight="medium">{propertyType}</VText>
            <VText className="text-white text-[16px] leading-[16px] mt-1" weight="bold">{propertyTitle}</VText>
          </View>
        </View>
      </View>

      {/* Footer: tenant summary row */}
      <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
        <View className="flex-row items-center">
          <Image source={{ uri: tenantAvatarUri }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          <View className="ml-3 flex-1">
            <VText className="text-[18px] leading-[20px]" weight="bold" style={{ color: colors.gray700 }}>{tenantNameAge}</VText>
            <VText className="text-[12px] leading-[12px] mt-1" weight="medium" style={{ color: colors.gray500 }}>{tenantRole}</VText>
          </View>
          <Pressable accessibilityRole="button" onPress={onPressChat} className="rounded-full items-center justify-center" style={{ width: 40, height: 40, borderWidth: 1, borderColor: colors.primary }}>
            <ChatIcon width={18} height={18} color={colors.primary} stroke={colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* Expanded details */}
      {expanded ? (
        <Animated.View entering={FadeInDown.springify().damping(26).stiffness(200).mass(0.6)} exiting={FadeOutUp.duration(140)}>
          <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
            {details.map((d, idx) => (
              <View key={`${d.label}-${idx}`} className="flex-row items-center py-2">
                <VText className="text-[12px] leading-[12px]" weight="medium" style={{ color: colors.gray500, flexShrink: 0 }}>
                  {d.label}
                </VText>
                <View className="flex-1 mx-2" style={{ borderBottomWidth: 1, borderColor: '#E5E5E5' }} />
                <VText className="text-[12px] leading-[12px]" weight="bold" style={{ color: colors.gray700 }}>
                  {d.value}
                </VText>
              </View>
            ))}
          </View>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

export default { TenantInfoCard };


