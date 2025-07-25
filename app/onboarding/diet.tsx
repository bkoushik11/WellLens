import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useOnboarding } from '../../hooks/OnboardingContext';
import OnboardingLayout from './OnboardingLayout';
import OnboardingProgressBar from './OnboardingProgressBar';
import BackButton from './BackButton';

const { width } = Dimensions.get('window');

type DietPreference = 'vegan' | 'vegetarian' | 'non-vegetarian' | 'keto' | 'none';

const dietOptions = [
  { id: 'vegan' as DietPreference, title: 'Vegan', description: 'Plant-based only', color: '#22C55E', emoji: '🥦' },
  { id: 'vegetarian' as DietPreference, title: 'Vegetarian', description: 'No meat or fish', color: '#F59E42', emoji: '🥕' },
  { id: 'non-vegetarian' as DietPreference, title: 'Non-Vegetarian', description: 'Includes all foods', color: '#EF4444', emoji: '🍗' },
  { id: 'keto' as DietPreference, title: 'Keto', description: 'Low carb, high fat', color: '#3B82F6', emoji: '🥓' },
  { id: 'none' as DietPreference, title: 'No Preference', description: 'Open to all options', color: '#A855F7', emoji: '🤗' },
];

export default function DietScreen() {
  const [selectedDiet, setSelectedDiet] = useState<DietPreference | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { onboardingData, setOnboardingData } = useOnboarding();
  const { updateUserData, userData } = useUserData();

  const handleSelect = (diet: DietPreference) => setSelectedDiet(diet);

  const VALID_DIET_PREFERENCES = ['vegan', 'vegetarian', 'non-vegetarian', 'keto', 'none'];

  const handleNext = async () => {
    if (!selectedDiet) return;
    if (!VALID_DIET_PREFERENCES.includes(selectedDiet)) {
      Alert.alert('Invalid Diet', 'Please select a valid diet preference.');
      return;
    }
    setIsLoading(true);
    try {
      const updatedData = {
        ...onboardingData,
        diet_preferences: [selectedDiet as DietPreference],
        is_onboarding_complete: true,
      };
      setOnboardingData(updatedData);
      await updateUserData(updatedData);
      if (userData) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/createAccount');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save your diet preference. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      const updatedData = {
        ...onboardingData,
        diet_preferences: ['none' as DietPreference],
        is_onboarding_complete: true,
      };
      setOnboardingData(updatedData);
      await updateUserData(updatedData);
      if (userData) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/createAccount');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingLayout>
      <OnboardingProgressBar step={9} totalSteps={9} />
      <View style={styles.innerContent}>
        <View style={styles.header}>
          <BackButton color="#64748B" style={styles.backButton} />
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>What's your diet preference?</Text>
          <Text style={styles.subtitle}>We'll suggest meals that match your lifestyle</Text>
          <View style={styles.gridContainer}>
            {dietOptions.map((diet) => {
              const isSelected = selectedDiet === diet.id;
              return (
                <TouchableOpacity
                  key={diet.id}
                  style={[
                    styles.card,
                    isSelected
                      ? { borderColor: diet.color, backgroundColor: `${diet.color}22`, shadowColor: diet.color, shadowOpacity: 0.18, elevation: 6 }
                      : { borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.08, elevation: 2 },
                  ]}
                  onPress={() => handleSelect(diet.id)}
                  activeOpacity={0.85}
                  disabled={isLoading}
                >
                  <View style={[styles.emojiCircle, { backgroundColor: isSelected ? diet.color : '#F8FAFC' }]}> 
                    <Text style={styles.emoji}>{diet.emoji}</Text>
                  </View>
                  <Text style={[styles.cardTitle, isSelected && { color: diet.color }]}>{diet.title}</Text>
                  <Text style={styles.cardDesc}>{diet.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[styles.nextButton, (!selectedDiet || isLoading) && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedDiet || isLoading}
        >
          <Text style={[styles.nextButtonText, (!selectedDiet || isLoading) && styles.nextButtonTextDisabled]}>
            {isLoading ? 'Completing...' : 'Complete Onboarding'}
          </Text>
        </TouchableOpacity>
      </View>
    </OnboardingLayout>
  );
}

const CARD_WIDTH = (width - 64) / 2;

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
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#14B8A6',
    fontWeight: '500',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    width: '100%',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  emoji: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
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