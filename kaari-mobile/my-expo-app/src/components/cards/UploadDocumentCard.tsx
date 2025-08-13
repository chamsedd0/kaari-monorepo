import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import UploadField from '~/components/inputs/UploadField';

export type UploadDocumentCardProps = {
  title?: string;
  onUpload?: () => void;
};

export default function UploadDocumentCard({ title = 'Upload document', onUpload }: UploadDocumentCardProps) {
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <Text style={{ color: colors.gray700, fontWeight: '800' }}>{title}</Text>
      <UploadField onPress={onUpload} />
    </View>
  );
}


