import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="account-info" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}