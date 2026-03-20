import { Stack } from 'expo-router';

export default function CityReviewLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
      <Stack.Screen name="[cityId]" />
    </Stack>
  );
}
