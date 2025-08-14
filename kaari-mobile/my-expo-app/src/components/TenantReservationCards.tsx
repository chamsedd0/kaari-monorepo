import React from 'react';
import { View, Text, Image, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { SectionBadge, StatusBadge } from './Badges';

type BaseProps = {
  imageUri: string;
  title: string; // split by " - " for bold type
  style?: ViewStyle | ViewStyle[];
};

function SplitTitle({ title }: { title: string }) {
  const parts = title.split(' - ');
  const type = parts[0] ?? title;
  const rest = parts.slice(1).join(' - ');
  return (
    <Text className="text-[16px]" style={{ color: colors.gray700 }}>
      <Text style={{ fontFamily: 'VisbyCF-Bold', lineHeight: 16 }}>{type}</Text>
      {rest ? <Text style={{ fontFamily: 'VisbyCF', fontWeight: '500', lineHeight: 22 }}>{` - ${rest}`}</Text> : null}
    </Text>
  );
}

export function TenantLatestReservationRequestCard({ imageUri, title, pricePerMonth, dateLabel, status = 'success', style }: BaseProps & { pricePerMonth: string; dateLabel: string; status?: 'info' | 'success' | 'danger' | 'primary' }) {
  return (
    <View style={style as any}>
      <View>
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: 180, borderRadius: 16 }} resizeMode="cover" />
        <View style={{ position: 'absolute', left: 0, top: 0 }}>
          <SectionBadge label="Latest Request" variant="purple" />
        </View>
        <View style={{ position: 'absolute', right: 8, top: 8 }}>
          <StatusBadge label={status === 'success' ? 'Approved' : status === 'danger' ? 'Rejected' : 'Pending'} variant={status} />
        </View>
      </View>
      <View className="px-0 pt-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-2">
            <SplitTitle title={title} />
          </View>
          <View className="items-end">
            <Text className="text-[12px] leading-[12px] mb-1" style={{ color: colors.gray500, fontFamily: 'VisbyCF' }}>{dateLabel}</Text>
            <Text className="text-[24px] leading-[24px]" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Heavy' }}>{pricePerMonth}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function TenantPastReservationRequestCard({ imageUri, title, sectionDateLabel, userNameAge, timeAgo, avatarUri, style }: BaseProps & { sectionDateLabel: string; userNameAge: string; timeAgo: string; avatarUri: string }) {
  return (
    <View style={style as any}>
      <View>
        <Image source={{ uri: imageUri }} style={{ width: '100%', height: 180, borderRadius: 16 }} resizeMode="cover" />
        <View style={{ position: 'absolute', left: 0, top: 0 }}>
          <SectionBadge label={sectionDateLabel} variant="purple" />
        </View>
      </View>
      <View className="px-0 pt-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-2" style={{ maxWidth: '50%' }}>
            <SplitTitle title={title} />
          </View>
          <View className="flex-row items-center gap-3">
            <View className="items-end">
              <Text className="text-[14px] leading-[16px]" style={{ color: colors.gray700, fontFamily: 'VisbyCF-Bold' }}>{userNameAge}</Text>
              <Text className="text-[12px] leading-[12px] mt-1" style={{ color: colors.gray500, fontFamily: 'VisbyCF' }}>{timeAgo}</Text>
            </View>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={{ width: 36, height: 36, borderRadius: 18 }} />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

export default { TenantLatestReservationRequestCard, TenantPastReservationRequestCard };


