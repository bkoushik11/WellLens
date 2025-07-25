import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useUserData, UserData } from '@/hooks/useUserData';

export default function IndexScreen() {
  const { userData, isLoading } = useUserData();
  const typedUserData = userData as UserData;

  useEffect(() => {
    if (!isLoading) {
      if (typedUserData?.is_onboarding_complete) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/welcome');
      }
    }
  }, [userData, isLoading]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});