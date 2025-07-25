import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Armchair, Footprints, Bike, Zap, Flame } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useOnboarding } from '../../hooks/OnboardingContext';
import OnboardingLayout from './OnboardingLayout';
import OnboardingProgressBar from './OnboardingProgressBar';
import BackButton from './BackButton';

type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';

export default function ActivityScreen() {
  const [selectedLevel, setSelectedLevel] = useState<ActivityLevel | null>(null);
  const { onboardingData, setOnboardingData } = useOnboarding();

  const activityLevels = [
    { id: 'sedentary' as ActivityLevel, title: 'Sedentary', description: 'Desk job, little to no exercise, mostly sitting', icon: Armchair, multiplier: '1.2x', color: '#6B7280', bgColor: '#F9FAFB' },
    { id: 'lightly_active' as ActivityLevel, title: 'Lightly Active', description: 'Light exercise 1-3 days/week, some walking', icon: Footprints, multiplier: '1.55x', color: '#10B981', bgColor: '#F0FDF4' },
    { id: 'moderately_active' as ActivityLevel, title: 'Moderately Active', description: 'Moderate exercise 3-5 days/week, regular activity', icon: Bike, multiplier: '1.725x', color: '#3B82F6', bgColor: '#EFF6FF' },
    { id: 'very_active' as ActivityLevel, title: 'Very Active', description: 'Hard exercise 6-7 days/week, physically demanding job', icon: Zap, multiplier: '1.9x', color: '#F59E0B', bgColor: '#FFFBEB' },
  ];

  const VALID_ACTIVITY_LEVELS = ['sedentary', 'lightly_active', 'moderately_active', 'very_active'];

  const handleNext = () => {
    if (!selectedLevel) {
      alert('Please select your activity level.');
      return;
    }
    if (!VALID_ACTIVITY_LEVELS.includes(selectedLevel)) {
      alert('Invalid activity level selected.');
      return;
    }
    setOnboardingData({
      ...onboardingData,
      activity_level: selectedLevel,
    });
      router.push('/onboarding/diet');
  };

  return (
    <OnboardingLayout>
      <BackButton color="#64748B" style={styles.absoluteBackButton} />
      <OnboardingProgressBar step={8} totalSteps={9} />
      <View style={styles.innerContent}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
        <Text style={styles.title}>What's your activity level?</Text>
        <Text style={styles.subtitle}>This helps us calculate your daily calorie needs</Text>
        <View style={styles.levelsContainer}>
          {activityLevels.map((level) => {
            const Icon = level.icon;
            return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                selectedLevel === level.id && styles.levelCardSelected,
                { backgroundColor: level.bgColor }
              ]}
              onPress={() => setSelectedLevel(level.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <View style={[styles.iconCircle, { backgroundColor: level.color }]}>
                  <Icon size={24} color="#FFFFFF" />
                </View>
                <View style={[styles.multiplierBadge, { backgroundColor: level.color }]}>
                  <Text style={styles.multiplierText}>{level.multiplier}</Text>
                </View>
              </View>
              <Text style={[styles.levelTitle, { color: level.color }]}>{level.title}</Text>
              <Text style={styles.levelDescription}>{level.description}</Text>
              {selectedLevel === level.id && (
                <View style={[styles.selectedIndicator, { backgroundColor: level.color }]}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
              );
          })}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[styles.nextButton, !selectedLevel && styles.nextButtonDisabled]}
        onPress={handleNext}
        disabled={!selectedLevel}
      >
        <Text style={[styles.nextButtonText, !selectedLevel && styles.nextButtonTextDisabled]}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  innerContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  progressBar: {
    width: 240,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#14B8A6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 18,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  levelsContainer: {
    gap: 12,
  },
  levelCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  levelCardSelected: {
    borderColor: '#14B8A6',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  multiplierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  multiplierText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#14B8A6',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  nextButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nextButtonTextDisabled: {
    color: '#94A3B8',
  },
  absoluteBackButton: {
    position: 'absolute',
    top: -23,
    left: 14,
    zIndex: 10,
  },
});