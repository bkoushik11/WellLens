import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { useUserData, UserData } from '@/hooks/useUserData';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '../../hooks/OnboardingContext';
import OnboardingLayout from './OnboardingLayout';
import OnboardingProgressBar from './OnboardingProgressBar';
import BackButton from './BackButton';

const { width } = Dimensions.get('window');

export default function AgeScreen() {
  const { onboardingData, setOnboardingData } = useOnboarding();
  const [age, setAge] = useState(onboardingData?.age || 25);
  const [animatedValue] = useState(new Animated.Value(onboardingData?.age || 25));

  const handleAgeChange = (newAge: number) => {
    setAge(Math.round(newAge));
    Animated.spring(animatedValue, {
      toValue: Math.round(newAge),
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleNext = () => {
    setOnboardingData({
      ...onboardingData,
      age: Math.round(age),
    });
    router.push('/onboarding/height');
  };

  // Check if age was auto-calculated from DOB
  const isAutoCalculated = onboardingData?.date_of_birth && onboardingData?.age;

  return (
    <OnboardingLayout>
      <OnboardingProgressBar step={3} totalSteps={9} />
      <View style={styles.innerContent}>
        <View style={styles.header}>
          <BackButton color="#64748B" style={styles.backButton} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>How old are you?</Text>
          <Text style={styles.subtitle}>
            {isAutoCalculated 
              ? 'We calculated this from your birthday. You can adjust if needed.'
              : 'This helps us calculate your nutritional needs more accurately'
            }
          </Text>
          <View style={styles.ageContainer}>
            <LinearGradient
              colors={['#14B8A6', '#3B82F6']}
              style={styles.ageCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.ageInnerCircle}>
                <Animated.Text style={styles.ageDisplay}>
                  {Math.round(age)}
                </Animated.Text>
                <Text style={styles.ageLabel}>years old</Text>
              </View>
            </LinearGradient>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={18}
              maximumValue={120}
              value={age}
              onValueChange={handleAgeChange}
              step={1}
              minimumTrackTintColor="#14B8A6"
              maximumTrackTintColor="#E2E8F0"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>18</Text>
              <Text style={styles.sliderLabel}>120</Text>
            </View>
          </View>
          {isAutoCalculated && (
            <View style={styles.autoCalculatedNote}>
              <Text style={styles.autoCalculatedText}>
                ✓ Auto-calculated from your birthday
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Continue</Text>
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
    alignItems: 'center',
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
  ageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ageCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  ageInnerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 76,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#14B8A6',
    textAlign: 'center',
  },
  ageLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 50,
  },
  thumbStyle: {
    backgroundColor: '#14B8A6',
    width: 28,
    height: 28,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  autoCalculatedNote: {
    backgroundColor: '#F0FDFA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  autoCalculatedText: {
    fontSize: 14,
    color: '#14B8A6',
    fontWeight: '500',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#14B8A6',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});