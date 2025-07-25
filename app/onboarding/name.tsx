
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, Animated } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useOnboarding } from '../../hooks/OnboardingContext';
import OnboardingLayout from './OnboardingLayout';
import OnboardingProgressBar from './OnboardingProgressBar';

export default function NameScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const greetingTopAnim = useRef(new Animated.Value(0)).current;
  const greetingBottomAnim = useRef(new Animated.Value(0)).current;
  const { onboardingData, setOnboardingData } = useOnboarding();

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Animate greeting for top and bottom positions
  useEffect(() => {
    if (firstName.trim()) {
      if (keyboardVisible) {
        // Animate in at top
        Animated.parallel([
          Animated.timing(greetingTopAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(greetingBottomAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Animate in at bottom
        Animated.parallel([
          Animated.timing(greetingTopAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(greetingBottomAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else {
      // Hide both
      Animated.parallel([
        Animated.timing(greetingTopAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(greetingBottomAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [firstName, keyboardVisible]);

  const handleNext = () => {
    if (firstName.trim()) {
      setOnboardingData({
        ...onboardingData,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      router.push('/onboarding/birthday');
    }
  };

  // Animation for top position (slide down, fade in, scale up)
  const greetingTopStyle = {
    opacity: greetingTopAnim,
    transform: [
      { translateY: greetingTopAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) },
      { scale: greetingTopAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
    ],
  };
  // Animation for bottom position (slide up, fade in, scale up)
  const greetingBottomStyle = {
    opacity: greetingBottomAnim,
    transform: [
      { translateY: greetingBottomAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
      { scale: greetingBottomAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
    ],
  };

  return (
    <OnboardingLayout>
      <OnboardingProgressBar step={1} totalSteps={9} />
      <View style={styles.innerContent}>
        <View style={styles.header}>
          {/* Back button removed */}
        </View>
        <View style={styles.content}>
          {/* Greeting at top only while typing */}
          {firstName.trim() && keyboardVisible && (
            <Animated.View style={[styles.greetingContainer, greetingTopStyle]}> 
              <Text style={styles.greetingText}>
                Nice to meet you, {firstName}! 👋
              </Text>
            </Animated.View>
          )}
          <Text style={styles.title}>What's your name?</Text>
          <Text style={styles.subtitle}>Let's make it personal</Text>
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#94A3B8"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Last Name (Optional)"
                placeholderTextColor="#94A3B8"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleNext}
              />
            </View>
          </View>
          {/* Greeting below input when keyboard is hidden */}
          {firstName.trim() && !keyboardVisible && (
            <Animated.View style={[styles.greetingContainer, greetingBottomStyle]}> 
              <Text style={styles.greetingText}>
                Nice to meet you, {firstName}! 👋
              </Text>
            </Animated.View>
          )}
        </View>
        <TouchableOpacity
          style={[styles.nextButton, !firstName.trim() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!firstName.trim()}
        >
          <Text style={[styles.nextButtonText, !firstName.trim() && styles.nextButtonTextDisabled]}>
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
    marginBottom: 48,
  },
  inputSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  input: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '500',
  },
  greetingContainer: {
    backgroundColor: '#F0FDFA',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#14B8A6',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 16,
    color: '#14B8A6',
    fontWeight: '600',
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