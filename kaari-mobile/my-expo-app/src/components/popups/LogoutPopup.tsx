import { View, Text } from 'react-native';
import { PopupShell } from './PopupShell';
import { Button } from '../ui/Button';

export function LogoutPopup({ visible, onConfirm, onCancel }: { visible: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <PopupShell visible={visible} title="Log out" footer={
      <View className="flex-row gap-3">
        <Button title="Cancel" variant="secondary" onPress={onCancel} style={{ flex: 1 }} />
        <Button title="Log out" onPress={onConfirm} style={{ flex: 1 }} />
      </View>
    }>
      <Text className="text-gray-700">Are you sure you want to log out?</Text>
    </PopupShell>
  );
}



