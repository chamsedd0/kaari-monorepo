import React from 'react';
import { View, Text } from 'react-native';
import BottomDrawer from './BottomDrawer';
import TextArea from '~/components/inputs/TextArea';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type AskForEditPropertyDrawerProps = {
  visible: boolean;
  onClose?: () => void;
  onSend?: (message: string) => void;
};

export default function AskForEditPropertyDrawer({ visible, onClose, onSend }: AskForEditPropertyDrawerProps) {
  if (!visible) return null;
  const [msg, setMsg] = React.useState('');
  return (
    <BottomDrawer
      header={<Text className="text-gray700 font-extrabold text-lg">Ask to edit property</Text>}
      footer={<PrimaryButton label="Send request" onPress={() => { onSend?.(msg); onClose?.(); }} fullWidth />}
      onClose={onClose}
    >
      <View className="gap-3">
        <Text className="text-gray500">Explain what you need to edit.</Text>
        <TextArea value={msg} onChangeText={setMsg} placeholder="Write your request" />
      </View>
    </BottomDrawer>
  );
}


