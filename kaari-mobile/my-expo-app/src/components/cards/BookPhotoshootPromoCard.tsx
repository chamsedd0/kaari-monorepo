import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import PressableSurface from '~/components/primitives/PressableSurface';
import GirlCamera from '~/../assets/girl-camera.svg';

export type BookPhotoshootPromoCardProps = {
	title?: string;
	subtitle?: string;
	buttonLabel?: string;
	onPress?: () => void;
};

export default function BookPhotoshootPromoCard({
	title = 'Host your property',
	subtitle = 'Book a Photoshoot!',
	buttonLabel = 'Book a photoshoot',
	onPress,
}: BookPhotoshootPromoCardProps) {
	return (
		<View className="rounded-2xl p-5 overflow-hidden" style={{ backgroundColor: colors.primary }}>
			<View className="flex-row items-center justify-between">
				<View className="flex-1 pr-4">
					<Text className="text-white font-extrabold">{title}</Text>
					<Text className="text-white font-extrabold text-2xl mt-1">{subtitle}</Text>
					<Text className="text-white/90 mt-2">You want to host your property? Book a photoshoot right now!</Text>
					<View className="mt-4">
						<PressableSurface onPress={onPress} borderRadius={100} pressedBackground={'rgba(255,255,255,0.2)'}>
							<View className="px-5 py-3 flex-row items-center justify-center" style={{ backgroundColor: colors.white, borderRadius: 100 }}>
								<Text className="text-gray700 font-extrabold">{buttonLabel}</Text>
								<View className="ml-2 w-4 h-3 rounded-sm" style={{ backgroundColor: colors.primary }} />
							</View>
						</PressableSurface>
					</View>
				</View>
				<View className="absolute right-4 bottom-0 w-32 h-32 items-center justify-end">
					<GirlCamera width={88} height={100} />
				</View>
			</View>
		</View>
	);
}


