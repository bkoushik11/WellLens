import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useOnboarding } from '../../hooks/OnboardingContext';
import OnboardingLayout from './OnboardingLayout';
import OnboardingProgressBar from './OnboardingProgressBar';
import BackButton from './BackButton';

type Gender = 'male' | 'female';

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const { onboardingData, setOnboardingData } = useOnboarding();

  const handleNext = () => {
    if (selectedGender) {
      setOnboardingData({
        ...onboardingData,
        gender: selectedGender,
      });
      router.push('/onboarding/goals');
    }
  };

  return (
    <OnboardingLayout>
      <BackButton color="#64748B" style={styles.absoluteBackButton} />
      <OnboardingProgressBar step={6} totalSteps={9} />
      <View style={styles.innerContent}>
        <View style={styles.content}>
          <Text style={styles.title}>What's your gender?</Text>
          <Text style={styles.subtitle}>This helps us personalize your experience</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderCard, selectedGender === 'male' && { backgroundColor: '#3B82F6', borderColor: '#3B82F6' }]}
              onPress={() => setSelectedGender('male')}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 36, marginBottom: 8 }}>👨</Text>
              <Text style={[styles.genderText, selectedGender === 'male' && { color: '#fff' }]}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderCard, selectedGender === 'female' && { backgroundColor: '#EC4899', borderColor: '#EC4899' }]}
              onPress={() => setSelectedGender('female')}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 36, marginBottom: 8 }}>👩</Text>
              <Text style={[styles.genderText, selectedGender === 'female' && { color: '#fff' }]}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.nextButton, !selectedGender && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedGender}
        >
          <Text style={[styles.nextButtonText, !selectedGender && styles.nextButtonTextDisabled]}>
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
    flex: 1,
    alignItems: 'center',
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#14B8A6',
    borderRadius: 2,
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
  cardsContainer: {
    gap: 16,
    marginTop: 8,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    marginBottom: 8,
    alignItems: 'center',
    flexDirection: 'column',
  },
  cardSelected: {
    shadowColor: '#14B8A6',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
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
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  genderCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  genderCardSelected: {
    borderColor: '#14B8A6',
    backgroundColor: '#EFF6FF',
  },
  genderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  absoluteBackButton: {
    position: 'absolute',
    top: -23,
    left: 14,
    zIndex: 10,
  },
});
  