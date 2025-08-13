import React from 'react';
import { View, Text } from 'react-native';
import BottomDrawer from './BottomDrawer';
import { colors } from '~/theme/colors';
import TextField from '~/components/inputs/TextField';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type AddPaymentMethodDrawerProps = {
  visible: boolean;
  onClose?: () => void;
  onAdd?: (cardLast4: string) => void;
};

export default function AddPaymentMethodDrawer({ visible, onClose, onAdd }: AddPaymentMethodDrawerProps) {
  if (!visible) return null;
  const [number, setNumber] = React.useState('');
  const [name, setName] = React.useState('');
  const [expiry, setExpiry] = React.useState('');

  return (
    <BottomDrawer
      header={<Text className="text-gray700 font-extrabold text-lg">Add payment method</Text>}
      footer={
        <PrimaryButton
          label="Add card"
          onPress={() => {
            onAdd?.(number.slice(-4));
            onClose?.();
          }}
          fullWidth
        />
      }
      onClose={onClose}
    >
      <View className="gap-3">
        <TextField label="Card number" value={number} onChangeText={setNumber} placeholder="1234 5678 9012 3456" />
        <TextField label="Name on card" value={name} onChangeText={setName} placeholder="Full name" />
        <TextField label="Expiry" value={expiry} onChangeText={setExpiry} placeholder="MM/YY" />
      </View>
    </BottomDrawer>
  );
}


