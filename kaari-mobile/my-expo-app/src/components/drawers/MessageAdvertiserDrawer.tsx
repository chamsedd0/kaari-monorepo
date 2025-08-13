import React from 'react';
import { View, Text } from 'react-native';
import BottomDrawer from './BottomDrawer';
import SendMessageField from '~/components/inputs/SendMessageField';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type MessageAdvertiserDrawerProps = {
  visible: boolean;
  onClose?: () => void;
  onSend?: (msg: string) => void;
};

export default function MessageAdvertiserDrawer({ visible, onClose, onSend }: MessageAdvertiserDrawerProps) {
  if (!visible) return null;
  const [msg, setMsg] = React.useState('');
  return (
    <BottomDrawer
      header={<Text className="text-gray700 font-extrabold text-lg">Message advertiser</Text>}
      footer={<PrimaryButton label="Send" onPress={() => { onSend?.(msg); onClose?.(); }} fullWidth />}
      onClose={onClose}
    >
      <View className="gap-3">
        <SendMessageField value={msg} onChangeText={setMsg} />
      </View>
    </BottomDrawer>
  );
}


