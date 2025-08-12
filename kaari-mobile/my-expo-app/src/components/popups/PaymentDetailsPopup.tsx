import { View, Text } from 'react-native';
import { PopupShell } from './PopupShell';

export function PaymentDetailsPopup({ visible, amount, method, status, onClose }: { visible: boolean; amount: string; method: string; status: string; onClose: () => void }) {
  return (
    <PopupShell visible={visible} title="Payment Details" onClose={onClose}>
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-600">Amount</Text>
          <Text className="font-semibold">{amount}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-600">Method</Text>
          <Text>{method}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-600">Status</Text>
          <Text>{status}</Text>
        </View>
      </View>
    </PopupShell>
  );
}



