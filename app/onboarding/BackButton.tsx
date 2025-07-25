import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

interface BackButtonProps {
  color?: string;
  style?: ViewStyle;
}

const BackButton: React.FC<BackButtonProps> = ({ color = '#64748B', style }) => (
  <TouchableOpacity onPress={() => router.back()} style={[styles.button, style]}>
    <View style={styles.circle}>
      <ChevronLeft size={24} color={color} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 0,
    marginRight: 0,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BackButton; 