import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircularProgress } from './CircularProgress';

interface MacroProgressProps {
  name: string;
  value: number;
  target: number;
  unit: string;
  color: string;
}

export function MacroProgress({ name, value, target, unit, color }: MacroProgressProps) {
  const progress = Math.min(value / target, 1);
  
  return (
    <View style={styles.container}>
      <CircularProgress
        size={60}
        strokeWidth={4}
        progress={progress}
        color={color}
        backgroundColor="#E2E8F0"
      >
        <View style={styles.content}>
          <Text style={[styles.value, { color }]}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </CircularProgress>
      
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.target}>of {target}{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 8,
    color: '#64748B',
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E293B',
    marginTop: 8,
  },
  target: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
});