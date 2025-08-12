import { View, Text, TextInput, Pressable } from 'react-native';

export function LoginBlock() {
  return (
    <View className="rounded-2xl border border-gray-100 bg-white p-4 gap-3">
      <Text className="text-xl font-bold">Welcome back</Text>
      <Text className="text-gray-600">Sign in to continue</Text>
      <TextInput className="border rounded-2xl px-4 py-3" placeholder="Email" keyboardType="email-address" />
      <TextInput className="border rounded-2xl px-4 py-3" placeholder="Password" secureTextEntry />
      <Pressable className="bg-black rounded-2xl px-4 py-3">
        <Text className="text-white text-center font-semibold">Sign In</Text>
      </Pressable>
    </View>
  );
}


