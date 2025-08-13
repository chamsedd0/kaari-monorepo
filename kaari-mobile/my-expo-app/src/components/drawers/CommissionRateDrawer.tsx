import React from 'react';
import { View, Text } from 'react-native';
import BottomDrawer from './BottomDrawer';
import { colors } from '~/theme/colors';
import Slider from '~/components/inputs/Slider';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type CommissionRateDrawerProps = {
  visible: boolean;
  initialRate?: number; // 0..1
  onClose?: () => void;
  onSave?: (rate: number) => void;
};

export default function CommissionRateDrawer({ visible, initialRate = 0.1, onClose, onSave }: CommissionRateDrawerProps) {
  if (!visible) return null;
  const [rate, setRate] = React.useState(initialRate);
  return (
    <BottomDrawer
      header={<Text className="text-gray700 font-extrabold text-lg">Commission rate</Text>}
      footer={<PrimaryButton label="Save" onPress={() => { onSave?.(rate); onClose?.(); }} fullWidth />}
      onClose={onClose}
    >
      <View className="gap-3">
        <Text className="text-gray500">Adjust the commission rate.</Text>
        <Slider value={rate} onChange={setRate} />
        <Text className="text-gray700 font-extrabold">{Math.round(rate * 100)}%</Text>
      </View>
    </BottomDrawer>
  );
}


