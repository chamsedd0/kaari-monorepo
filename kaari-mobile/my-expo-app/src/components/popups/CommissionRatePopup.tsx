import { View, Text, TextInput } from 'react-native';
import { PopupShell } from './PopupShell';
import { Button } from '../ui/Button';

export function CommissionRatePopup({ visible, value, onChange, onSave, onClose }: { visible: boolean; value: string; onChange: (v: string) => void; onSave: () => void; onClose: () => void }) {
  return (
    <PopupShell visible={visible} title="Commission rate" onClose={onClose} footer={
      <View className="flex-row gap-3">
        <Button title="Close" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
        <Button title="Save" onPress={onSave} style={{ flex: 1 }} />
      </View>
    }>
      <Text className="text-gray-700">Set your broker/agency extra percentage (0–75%).</Text>
      <TextInput className="border rounded-2xl px-4 py-3" value={value} onChangeText={onChange} keyboardType="number-pad" />
    </PopupShell>
  );
}



