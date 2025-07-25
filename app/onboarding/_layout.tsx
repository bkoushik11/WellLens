import { Stack } from 'expo-router';
import { OnboardingProvider } from '../../hooks/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
        <Stack.Screen name="name" />
      <Stack.Screen name="age" />
        <Stack.Screen name="birthday" />
        <Stack.Screen name="height" />
      <Stack.Screen name="weight" />
        <Stack.Screen name="gender" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="activity" />
      <Stack.Screen name="diet" />
        <Stack.Screen name="createAccount" />
        <Stack.Screen name="login" />
    </Stack>
    </OnboardingProvider>
  );
}