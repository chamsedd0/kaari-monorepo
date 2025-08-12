import { Image, Text, View } from 'react-native';
import { SectionBadge } from '../ui/SectionBadge';

type Props = {
  title: string;
  subtitle: string;
  user: string;
  avatarUrl?: string;
  statusLabel?: string; // e.g., Approved
  imageUrl?: string;
};

export function ListingRequestCard({ title, subtitle, user, avatarUrl, statusLabel = 'Approved', imageUrl }: Props) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white overflow-hidden">
      <View className="relative">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 132 }} />
        ) : (
          <View className="w-full h-32 bg-gray100" />
        )}
        <View className="absolute right-3 top-3 bg-info/90 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">{statusLabel}</Text>
        </View>
      </View>
      <View className="p-3">
        <Text style={{ fontFamily: 'VisbyCF-DemiBold' }} className="text-black" numberOfLines={1}>{title} <Text style={{ fontFamily: 'VisbyCF' }} className="text-gray700">- {subtitle}</Text></Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text style={{ fontFamily: 'VisbyCF' }} className="text-gray500" numberOfLines={1}>{user}</Text>
          <View className="w-6 h-6 rounded-full bg-gray300" />
        </View>
      </View>
      <SectionBadge label="Latest Request" color="primary" />
    </View>
  );
}


