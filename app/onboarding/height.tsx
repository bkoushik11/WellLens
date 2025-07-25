import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useOnboarding } from '../../hooks/OnboardingContext';
import OnboardingLayout from './OnboardingLayout';
import OnboardingProgressBar from './OnboardingProgressBar';
import BackButton from './BackButton';

export default function HeightScreen() {
  const [heightCm, setHeightCm] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [unit, setUnit] = useState<'cm' | 'ft/inches'>('cm');
  const { onboardingData, setOnboardingData } = useOnboarding();

  const handleNext = () => {
    let finalHeight = 0;
    let heightUnit = unit;
    if (unit === 'cm') {
      const parsed = parseFloat(heightCm);
      if (isNaN(parsed) || parsed < 100 || parsed > 250) {
        alert('Please enter a valid height in centimeters (100-250 cm).');
        return;
      }
      finalHeight = parsed;
      heightUnit = 'cm';
    } else {
      const parsedFeet = parseInt(feet, 10);
      const parsedInches = parseInt(inches, 10) || 0;
      if (
        isNaN(parsedFeet) || parsedFeet < 3 || parsedFeet > 8 ||
        isNaN(parsedInches) || parsedInches < 0 || parsedInches > 11
      ) {
        alert('Please enter a valid height (feet: 3-8, inches: 0-11).');
        return;
      }
      // Convert to centimeters
      finalHeight = Math.round((parsedFeet * 30.48 + parsedInches * 2.54) * 100) / 100;
      heightUnit = 'cm';
    }
    setOnboardingData({
      ...onboardingData,
      height: finalHeight,
      height_unit: heightUnit,
    });
    router.push('/onboarding/weight');
  };

  return (
    <OnboardingLayout>
      <OnboardingProgressBar step={4} totalSteps={9} />
      <View style={styles.innerContent}>
        <View style={styles.header}>
          <BackButton color="#64748B" style={styles.backButton} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>What's your height?</Text>
          <Text style={styles.subtitle}>We'll use this to personalize your experience</Text>
          <View style={styles.unitToggleContainer}>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'cm' && styles.unitButtonActive]}
              onPress={() => {
                setUnit('cm');
                setHeightCm('');
                setFeet('');
                setInches('');
              }}
            >
              <Text style={[styles.unitText, unit === 'cm' && styles.unitTextActive]}>Centimeters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'ft/inches' && styles.unitButtonActive]}
              onPress={() => {
                setUnit('ft/inches');
                setHeightCm('');
                setFeet('');
                setInches('');
              }}
            >
              <Text style={[styles.unitText, unit === 'ft/inches' && styles.unitTextActive]}>Feet/Inches</Text>
            </TouchableOpacity>
          </View>
          {unit === 'cm' ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.heightInput}
                value={heightCm}
                onChangeText={setHeightCm}
                keyboardType="decimal-pad"
                placeholder="cm"
                placeholderTextColor="#94A3B8"
                maxLength={6}
                returnKeyType="done"
              />
              <Text style={styles.unitLabel}>cm</Text>
            </View>
          ) : (
            <View style={styles.dualInputContainer}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.heightInput}
                  value={feet}
                  onChangeText={setFeet}
                  keyboardType="number-pad"
                  placeholder="ft"
                  placeholderTextColor="#94A3B8"
                  maxLength={1}
                  returnKeyType="next"
                />
                <Text style={styles.unitLabel}>ft</Text>
              </View>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.heightInput}
                  value={inches}
                  onChangeText={setInches}
                  keyboardType="number-pad"
                  placeholder="in"
                  placeholderTextColor="#94A3B8"
                  maxLength={2}
                  returnKeyType="done"
                />
                <Text style={styles.unitLabel}>in</Text>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={[styles.nextButton, ((unit === 'cm' && !heightCm) || (unit === 'ft/inches' && (!feet && !inches))) && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={(unit === 'cm' && !heightCm) || (unit === 'ft/inches' && (!feet && !inches))}
        >
          <Text style={[styles.nextButtonText, ((unit === 'cm' && !heightCm) || (unit === 'ft/inches' && (!feet && !inches))) && styles.nextButtonTextDisabled]}>
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
  unitToggleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    width: 200,
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
  inputContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 32,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  dualInputContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  inputGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heightInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  unitLabel: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    marginLeft: 8,
  },
  singleInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heightInputLarge: {
    flex: 1,
    paddingVertical: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  unitLabelLarge: {
    fontSize: 20,
    color: '#64748B',
    fontWeight: '500',
    marginLeft: 12,
  },
  examplesSection: {
    marginBottom: 32,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  examplesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  exampleButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  exampleText: {
    fontSize: 16,
    fontWeight: '600',
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