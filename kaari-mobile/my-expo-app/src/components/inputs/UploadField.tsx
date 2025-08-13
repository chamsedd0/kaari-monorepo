import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import UploadIcon from '~/../assets/Icon_Upload.svg';

export type UploadFieldProps = {
  label?: string;
  onPress?: () => void;
};

export default function UploadField({ label = 'Upload document', onPress }: UploadFieldProps) {
  return (
    <View className="rounded-[100px] p-3" style={{ borderWidth: 1, borderColor: colors.gray200, backgroundColor: colors.white }}>
      <View onTouchEnd={onPress} className="flex-row items-center gap-2.5">
        <View className="items-center justify-center" style={{ width: 36, height: 36, borderRadius: 100, backgroundColor: colors.primaryTint2 }}>
          <UploadIcon width={18} height={18} color={colors.primary} />
        </View>
        <Text style={{ color: colors.gray700, fontWeight: '700' }}>{label}</Text>
      </View>
    </View>
  );
}


