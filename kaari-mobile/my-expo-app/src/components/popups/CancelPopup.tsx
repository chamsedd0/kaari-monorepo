import { Text, View } from 'react-native';
import { PopupShell } from './PopupShell';
import { Button } from '../ui/Button';

export function CancelPopup({ visible, onKeep, onCancel }: { visible: boolean; onKeep: () => void; onCancel: () => void }) {
  return (
    <PopupShell visible={visible} title="Cancel reservation" footer={
      <View className="flex-row gap-3">
        <Button title="Keep" variant="secondary" onPress={onKeep} style={{ flex: 1 }} />
        <Button title="Cancel reservation" onPress={onCancel} style={{ flex: 1 }} />
      </View>
    }>
      <Text className="text-gray-700">Are you sure you want to cancel this reservation?</Text>
    </PopupShell>
  );
}



