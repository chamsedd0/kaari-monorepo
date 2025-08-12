import { ReactNode } from 'react';
import { Modal as RNModal, View, Pressable } from 'react-native';

type Props = { visible: boolean; onClose: () => void; children: ReactNode };

export function Modal({ visible, onClose, children }: Props) {
  return (
    <RNModal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 bg-black/40 items-center justify-center p-6" onPress={onClose}>
        <Pressable className="bg-white rounded-2xl p-4 w-full" onPress={(e) => e.stopPropagation()}>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}


