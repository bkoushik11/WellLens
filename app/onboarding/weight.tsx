import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useOnboarding } from '../../hooks/OnboardingContext';
import OnboardingLayout from './OnboardingLayout';
import OnboardingProgressBar from './OnboardingProgressBar';
import BackButton from './BackButton';

export default function WeightScreen() {
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'lbs' | 'kg'>('lbs');
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const { onboardingData, setOnboardingData } = useOnboarding();

  // Example weights based on selected unit
  const getExampleWeights = () => {
    if (unit === 'kg') {
      return ['50', '60', '70'];
    } else {
      return ['110', '132', '154'];
    }
  };

  // Handle example weight selection
  const handleExampleSelect = (exampleWeight: string) => {
    const numericWeight = Number(exampleWeight);
    if (!isNaN(numericWeight) && numericWeight > 0) {
      setWeight(exampleWeight);
      setSelectedExample(exampleWeight);
    }
  };

  // Handle manual weight input with validation
  const handleWeightChange = (text: string) => {
    // Only allow numbers and decimal point
    const numericText = text.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = numericText.split('.');
    if (parts.length <= 2) {
      setWeight(numericText);
      setSelectedExample(null);
    }
  };

  const VALID_UNITS = ['kg', 'lbs'];

  const handleNext = () => {
    const parsedWeight = parseFloat(weight);
    // Validate weight ranges
    const isValidWeight = unit === 'kg' 
      ? parsedWeight >= 20 && parsedWeight <= 300 
      : parsedWeight >= 44 && parsedWeight <= 660;
    if (!VALID_UNITS.includes(unit)) {
      alert('Invalid weight unit selected.');
      return;
    }
    if (!isNaN(parsedWeight) && parsedWeight > 0 && isValidWeight) {
      setOnboardingData({
        ...onboardingData,
        weight: parsedWeight,
        weight_unit: unit,
      });
      router.push('/onboarding/gender');
    } else {
      alert('Please enter a valid weight.');
    }
  };

  return (
    <OnboardingLayout>
      <OnboardingProgressBar step={5} totalSteps={9} />
      <View style={styles.innerContent}>
        <View style={styles.header}>
          <BackButton color="#64748B" style={styles.backButton} />
          {/* Progress bar moved to top via OnboardingProgressBar */}
        </View>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>What's your current weight?</Text>
          <Text style={styles.subtitle}>We'll use this to track your progress</Text>
          {/* Unit Toggle */}
          <View style={styles.unitToggleContainer}>
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'kg' && styles.unitButtonActive]}
                onPress={() => {
                  setUnit('kg');
                  setWeight('');
                  setSelectedExample(null);
                }}
              >
                <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>
                  Kilograms
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'lbs' && styles.unitButtonActive]}
                onPress={() => {
                  setUnit('lbs');
                  setWeight('');
                  setSelectedExample(null);
                }}
              >
                <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>
                  Pounds
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Weight Input */}
          <View style={styles.weightInputContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.weightInput}
                value={weight}
                onChangeText={handleWeightChange}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor="#94A3B8"
                maxLength={6}
                returnKeyType="done"
              />
              <Text style={styles.unitLabel}>{unit}</Text>
            </View>
          </View>
          {/* Example Weights Section */}
          <View style={styles.examplesSection}>
            <Text style={styles.examplesTitle}>Quick Select</Text>
            <Text style={styles.examplesSubtitle}>
              Choose from common weights or enter your own above
            </Text>
            <View style={styles.examplesContainer}>
              {getExampleWeights().map((exampleWeight, index) => (
                <TouchableOpacity
                  key={`${exampleWeight}-${index}`}
                  style={[
                    styles.exampleButton,
                    selectedExample === exampleWeight && styles.exampleButtonSelected
                  ]}
                  onPress={() => handleExampleSelect(exampleWeight)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.exampleWeight,
                    selectedExample === exampleWeight && styles.exampleWeightSelected
                  ]}>
                    {exampleWeight}
                  </Text>
                  <Text style={[
                    styles.exampleUnit,
                    selectedExample === exampleWeight && styles.exampleUnitSelected
                  ]}>
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[styles.nextButton, !weight && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!weight}
        >
          <Text style={[styles.nextButtonText, !weight && styles.nextButtonTextDisabled]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
  },
  innerContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingBottom: 32,
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
    marginBottom: 48,
  },
  unitToggleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    width: '100%',
  },
  unitButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
  },
  unitTextActive: {
    color: '#14B8A6',
    fontWeight: '600',
  },
  weightInputContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  weightInput: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#14B8A6',
    textAlign: 'center',
    minWidth: 150,
  },
  unitLabel: {
    fontSize: 20,
    color: '#64748B',
    marginLeft: 8,
  },
  examplesSection: {
    marginBottom: 32,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  examplesSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  examplesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  exampleButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  exampleButtonSelected: {
    backgroundColor: '#F0FDFA',
    borderColor: '#14B8A6',
  },
  exampleWeight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  exampleWeightSelected: {
    color: '#14B8A6',
  },
  exampleUnit: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  exampleUnitSelected: {
    color: '#14B8A6',
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