import { View, Text } from 'react-native';
import { PopupShell } from './PopupShell';
import { Button } from '../ui/Button';

export function SupportedDocumentsPopup({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <PopupShell visible={visible} title="Supported documents" footer={
      <View className="flex-row gap-3">
        <Button title="Close" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
        <Button title="Upload" onPress={onClose} style={{ flex: 1 }} />
      </View>
    }>
      <View className="gap-2">
        <Text className="text-gray700">• Passport or National ID</Text>
        <Text className="text-gray700">• Proof of income</Text>
        <Text className="text-gray700">• Employment letter</Text>
      </View>
    </PopupShell>
  );
}


