import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  step: number;
  totalSteps: number;
}

export default function OnboardingProgressBar({ step, totalSteps }: Props) {
  const percent = (step / totalSteps) * 100;
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>
      <Text style={styles.progressText}>{`Step ${step} of ${totalSteps}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: { width: '100%', alignItems: 'center', marginTop: 16, marginBottom: 8 },
  progressBar: { width: 240, height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: '#14B8A6', borderRadius: 4 },
  progressText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
}); 