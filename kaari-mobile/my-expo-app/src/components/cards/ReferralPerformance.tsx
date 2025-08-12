import { View, Text } from 'react-native';

export function ReferralPerformance({ clicks, signups, earnings }: { clicks: number; signups: number; earnings: string }) {
  return (
    <View className="rounded-2xl border border-gray-100 bg-white p-4 gap-2">
      <Text className="text-gray-600 text-sm">Referral Performance</Text>
      <View className="flex-row justify-between">
        <View>
          <Text className="text-xs text-gray-600">Clicks</Text>
          <Text className="text-lg font-semibold">{clicks}</Text>
        </View>
        <View>
          <Text className="text-xs text-gray-600">Signups</Text>
          <Text className="text-lg font-semibold">{signups}</Text>
        </View>
        <View>
          <Text className="text-xs text-gray-600">Earnings</Text>
          <Text className="text-lg font-semibold">{earnings}</Text>
        </View>
      </View>
    </View>
  );
}


