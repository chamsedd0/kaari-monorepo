import { View, Text } from 'react-native';
import { VerifiedTag } from './VerifiedTag';

export function Tenant({ name, verified, subtitle }: { name: string; verified?: boolean; subtitle?: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-10 h-10 rounded-full bg-gray100" />
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-black font-semibold">{name}</Text>
          {verified ? <VerifiedTag /> : null}
        </View>
        {subtitle ? <Text className="text-gray500 text-xs">{subtitle}</Text> : null}
      </View>
    </View>
  );
}


