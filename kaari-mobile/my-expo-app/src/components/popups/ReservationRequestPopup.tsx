import { View, Text } from 'react-native';
import { PopupShell } from './PopupShell';
import { Button } from '../ui/Button';

export function ReservationRequestPopup({ visible, guestName, moveInDate, onAccept, onReject }: { visible: boolean; guestName: string; moveInDate: string; onAccept: () => void; onReject: () => void }) {
  return (
    <PopupShell visible={visible} title="Reservation request" onClose={onReject} footer={
      <View className="flex-row gap-3">
        <Button title="Reject" variant="secondary" onPress={onReject} style={{ flex: 1 }} />
        <Button title="Accept" onPress={onAccept} style={{ flex: 1 }} />
      </View>
    }>
      <Text className="text-gray-700">{guestName} requests to move in on {moveInDate}.</Text>
    </PopupShell>
  );
}



