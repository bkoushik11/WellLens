import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, TrendingDown, Minus, TrendingUp } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useOnboarding } from '../../hooks/OnboardingContext';
import OnboardingLayout from './OnboardingLayout';
import OnboardingProgressBar from './OnboardingProgressBar';
import BackButton from './BackButton';

type Goal = 'lose_weight' | 'maintain_weight' | 'gain_weight';

export default function GoalsScreen() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { onboardingData, setOnboardingData } = useOnboarding();

  const goals = [
    { id: 'lose_weight' as Goal, title: 'Lose Weight', description: 'Create a calorie deficit to lose weight safely', icon: TrendingDown, color: '#EF4444', bgColor: '#FEF2F2' },
    { id: 'maintain_weight' as Goal, title: 'Maintain Weight', description: 'Keep your current weight with balanced nutrition', icon: Minus, color: '#10B981', bgColor: '#F0FDF4' },
    { id: 'gain_weight' as Goal, title: 'Gain Weight', description: 'Build muscle and healthy weight gain', icon: TrendingUp, color: '#3B82F6', bgColor: '#EFF6FF' },
  ];

  const handleNext = () => {
    if (selectedGoal) {
      setOnboardingData({
        ...onboardingData,
        health_goal: selectedGoal,
      });
      router.push('/onboarding/activity');
    }
  };

  return (
    <OnboardingLayout>
      <OnboardingProgressBar step={7} totalSteps={9} />
      <View style={styles.innerContent}>
        <View style={styles.header}>
          <BackButton color="#64748B" style={styles.backButton} />
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          <Text style={styles.title}>What's your health goal?</Text>
          <Text style={styles.subtitle}>Choose your primary wellness objective</Text>
          <View style={styles.goalsContainer}>
            {goals.map((goal) => {
              const Icon = goal.icon;
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    selectedGoal === goal.id && styles.goalCardSelected,
                    { backgroundColor: goal.bgColor }
                  ]}
                  onPress={() => setSelectedGoal(goal.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: goal.color }]}> 
                    <Icon size={24} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.goalTitle, { color: goal.color }]}>{goal.title}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                  {selectedGoal === goal.id && (
                    <View style={[styles.selectedIndicator, { backgroundColor: goal.color }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[styles.nextButton, !selectedGoal && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedGoal}
        >
          <Text style={[styles.nextButtonText, !selectedGoal && styles.nextButtonTextDisabled]}>
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
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  goalCardSelected: {
    borderColor: '#14B8A6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
});