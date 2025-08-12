import { View, Text, TextInput } from 'react-native';

export function ReferralSimulator() {
  return (
    <View className="rounded-2xl border border-gray-100 bg-white p-4 gap-3">
      <Text className="font-semibold">Referral Simulator</Text>
      <View className="flex-row gap-2">
        <TextInput className="flex-1 border rounded-2xl px-3 py-2" placeholder="Monthly referrals" keyboardType="number-pad" />
        <TextInput className="flex-1 border rounded-2xl px-3 py-2" placeholder="Conversion %" keyboardType="number-pad" />
      </View>
      <Text className="text-gray-600">Estimated earnings: 0 MAD</Text>
    </View>
  );
}


