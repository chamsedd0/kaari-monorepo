import React from 'react';
import { Image, ImageSourcePropType, Pressable, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { VText } from './typography';
import EditIcon from '../../assets/Icon_Review.svg';

export type EditProfileCardProps = {
  avatarUri: string;
  fullName: string;
  phone?: string;
  dob?: string;
  onPressEdit?: () => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

export function EditProfileCard({ avatarUri, fullName, phone, dob, onPressEdit, style, testID }: EditProfileCardProps) {
  const shadow: ViewStyle = {
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  };
  return (
    <View testID={testID} className="rounded-2xl bg-white" style={[{ paddingVertical: 33, paddingHorizontal: 16 }, shadow, style as any]}>
      <View className="flex-row items-center">
        <Image source={{ uri: avatarUri }} style={{ width: 56, height: 56, borderRadius: 28, marginRight: 12 }} />
        <View className="flex-1">
          <VText className="text-[18px] leading-[20px]" weight="bold" style={{ color: colors.gray700 }}>{fullName}</VText>
          {phone ? (
            <VText className="mt-1 text-[14px] leading-[18px]" weight="medium" style={{ color: colors.gray500 }}>{phone}</VText>
          ) : null}
          {dob ? (
            <VText className="mt-1 text-[14px] leading-[18px]" weight="medium" style={{ color: colors.gray500 }}>{dob}</VText>
          ) : null}
        </View>
        <Pressable accessibilityRole="button" onPress={onPressEdit} hitSlop={8} className="w-[40px] h-[40px] rounded-full items-center justify-center" style={{ borderWidth: 2, borderColor: colors.primary }}>
          <EditIcon width={22} height={22} color={colors.primary} stroke={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

export default { EditProfileCard };


