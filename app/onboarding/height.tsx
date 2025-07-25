import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import BackButton from './BackButton';
import OnboardingProgressBar from './OnboardingProgressBar';
import { useOnboarding } from '../../hooks/OnboardingContext';

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
    <View style={styles.safeArea}>
      <BackButton color="#64748B" style={styles.absoluteBackButton} />
      <View style={styles.progressBarMargin}>
        <OnboardingProgressBar step={4} totalSteps={9} />
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.innerContent}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            What's your height?
          </Text>
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
            <View>
              <View style={styles.inputRow}>
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
              <View style={styles.examplesSection}>
                <Text style={styles.examplesTitle}>Examples:</Text>
                <View style={styles.examplesContainer}>
                  {['130', '140', '150'].map((ex) => (
                    <TouchableOpacity
                      key={ex}
                      style={styles.exampleButton}
                      onPress={() => setHeightCm(ex)}
                    >
                      <Text style={styles.exampleText}>{ex} cm</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.inputRow}>
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
              <View style={styles.examplesSection}>
                <Text style={styles.examplesTitle}>Examples:</Text>
                <View style={styles.examplesContainer}>
                  {[
                    { ft: '4', in: '7', label: `4'7"` },
                    { ft: '5', in: '3', label: `5'3"` },
                    { ft: '5', in: '11', label: `5'11"` },
                  ].map((ex) => (
                    <TouchableOpacity
                      key={ex.label}
                      style={styles.exampleButton}
                      onPress={() => { setFeet(ex.ft); setInches(ex.in); }}
                    >
                      <Text style={styles.exampleText}>{ex.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
      <TouchableOpacity
        style={[
          styles.nextButton,
          ((unit === 'cm' && !heightCm) || (unit === 'ft/inches' && (!feet && !inches))) && styles.nextButtonDisabled,
        ]}
        onPress={handleNext}
        disabled={(unit === 'cm' && !heightCm) || (unit === 'ft/inches' && (!feet && !inches))}
      >
        <Text style={[
          styles.nextButtonText,
          ((unit === 'cm' && !heightCm) || (unit === 'ft/inches' && (!feet && !inches))) && styles.nextButtonTextDisabled,
        ]}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  absoluteBackButton: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 10,
  },
  progressBarMargin: {
    marginTop: 48,
    marginBottom: 0,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
  },
  innerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 56,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
    width: '100%',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    width: '100%',
  },
  unitToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  unitButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 4,
  },
  unitButtonActive: {
    backgroundColor: '#14B8A6',
  },
  unitText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  unitTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  heightInput: {
    width: 90,
    paddingVertical: 16,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  unitLabel: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: '#14B8A6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
    marginHorizontal: 24,
    alignSelf: 'stretch',
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
  examplesSection: {
    marginBottom: 24,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  examplesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 0,
    marginTop: 8,
    width: 360,
    maxWidth: '99%',
    alignSelf: 'center',
  },
  exampleButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    width: 90,
    minHeight: 56,
    justifyContent: 'center',
    flex: 0,
  },
  exampleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14B8A6',
  },
});