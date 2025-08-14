import React from 'react';
import { View, Image, ViewStyle, Pressable } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { VText } from './typography';
import { RecommendUsInput } from './Input';
import Artwork from '../../assets/Artwork.png';

// Props for the Recommend Us card
type AdvertiserRecommendUsCardProps = {
	onSubmitEmail?: (email: string) => void;
	style?: ViewStyle | ViewStyle[];
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AdvertiserRecommendUsCard({ onSubmitEmail, style }: AdvertiserRecommendUsCardProps) {
	const p = useSharedValue(0);
	const bgStyle = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(p.value, [0, 1], [colors.primary, colors.primaryDark]),
	}));

	const [email, setEmail] = React.useState('');

	return (
		<AnimatedPressable
			className="rounded-2xl overflow-hidden"
			style={[bgStyle, style as any]}
			onPressIn={() => (p.value = withTiming(1, { duration: 120 }))}
			onPressOut={() => (p.value = withTiming(0, { duration: 160 }))}
			onPress={() => onSubmitEmail?.(email)}
		>
			<View className="p-6 relative">
				{/* Illustration positioned on the left behind the input */}
				<Image
					source={Artwork}
					style={{ position: 'absolute', left: 16, bottom: 24, width: 128, height: 138, opacity: 1 }}
					resizeMode="contain"
				/>
                

				<View className="flex-row">
					{/* Placeholder to reserve space for the artwork image */}
					<View style={{ width: '37%', height: 1, marginRight: 22 }} />
					<View className="flex-1">
						<VText className="text-white text-[16px] leading-[16px]" weight="bold">Recommend us</VText>
						<VText className="text-white text-[24px] leading-[28px] mt-2" weight="bold">Get 100 EUR!</VText>
						<VText className="text-white text-[12px] leading-[16px] mt-2" weight="medium">
							Refer property owners. Earn 100 EUR!
						</VText>
					</View>
				</View>

				{/* Glass input */}
				<View className="mt-4">
					<RecommendUsInput
						value={email}
						onChangeText={setEmail}
						placeholder="Emails of property owners"
						style={{ borderColor: colors.white }}
					/>
				</View>
			</View>
		</AnimatedPressable>
	);
}

export default { AdvertiserRecommendUsCard };
