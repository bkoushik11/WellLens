import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Modal, Platform, KeyboardAvoidingView, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useOnboarding } from '../../hooks/OnboardingContext';
import OnboardingProgressBar from './OnboardingProgressBar';
import BackButton from './BackButton';

export default function BirthdayScreen() {
  const colorScheme = useColorScheme();
  const { onboardingData, setOnboardingData } = useOnboarding();
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [selected, setSelected] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const colors = {
    background: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    dateDisplay: colorScheme === 'dark' ? '#FFFFFF' : '#14B8A6',
    cardBackground: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
  };

  const themeVariant = colorScheme === 'dark' ? 'dark' : 'light';

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      setSelected(true);
    }
  };

  const handleDone = () => {
    setShowPicker(false);
    setSelected(true);
  };

  const calculateAge = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = () => {
    const dobString = date.toISOString().split('T')[0];
    const age = calculateAge(date);
    if (!dobString || isNaN(Date.parse(dobString))) {
      alert('Please select a valid date of birth.');
      return;
    }
    if (typeof age !== 'number' || age < 18 || age > 120) {
      alert('Please select a valid age (18-120).');
      return;
    }
    setOnboardingData({
      ...onboardingData,
      date_of_birth: dobString,
      age,
    });
    router.push('/onboarding/age');
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.topRow}>
        <BackButton color={colors.textSecondary} style={styles.backButton} />
        <View style={styles.progressBarContainer}>
          <OnboardingProgressBar step={2} totalSteps={9} />
        </View>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.innerContent}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>What is your birthday?</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>This helps us personalize your experience</Text>
            <View style={styles.birthdayContainer}>
              <View style={styles.birthdayInnerCircle}> 
                <Text style={[styles.birthdayDisplay, { color: colorScheme === 'dark' ? '#fff' : '#14B8A6' }]}> 
                  {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.selectButton} 
              onPress={() => {
                Keyboard.dismiss();
                setShowPicker(true);
              }}
            >
              <Text style={styles.selectButtonText}>Select Birthday</Text>
            </TouchableOpacity>
            {/* iOS Modal Date Picker */}
            {Platform.OS === 'ios' && (
              <Modal 
                transparent 
                animationType="slide" 
                visible={showPicker}
                presentationStyle="overFullScreen"
                onRequestClose={() => setShowPicker(false)}
              >
                <TouchableOpacity 
                  style={styles.modalOverlay} 
                  activeOpacity={1} 
                  onPress={() => setShowPicker(false)}
                >
                  <TouchableOpacity style={[styles.modalContent, { backgroundColor: colors.cardBackground }]} activeOpacity={1}>
                    <View style={styles.modalHeader}>
                      <TouchableOpacity onPress={() => setShowPicker(false)}>
                        <Text style={[styles.cancelButton, { color: colors.textSecondary }]}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleDone}>
                        <Text style={styles.doneButton}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="spinner"
                      onChange={onChange}
                      maximumDate={new Date()}
                      style={styles.datePicker}
                      themeVariant={themeVariant}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>
            )}
            {/* Android Date Picker */}
            {Platform.OS === 'android' && showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
                maximumDate={new Date()}
              />
            )}
          </View>
          <TouchableOpacity
            style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!selected}
          >
            <Text style={[styles.nextButtonText, !selected && styles.nextButtonTextDisabled]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 0,
    width: '100%',
    paddingHorizontal: 8,
  },
  progressBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
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
    paddingTop: 16,
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
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 8,
    marginBottom: 0,
  },
  title: {
    fontSize: 28,
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
  birthdayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 32,
  },
  birthdayInnerCircle: {
    minWidth: 180,
    minHeight: 60,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#14B8A6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'center',
  },
  birthdayDisplay: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  selectButton: {
    backgroundColor: '#14B8A6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 0,
    minHeight: 320,
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  cancelButton: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  doneButton: {
    fontSize: 16,
    color: '#14B8A6',
    fontWeight: 'bold',
  },
  datePicker: {
    width: '100%',
  },
  nextButton: {
    backgroundColor: '#14B8A6',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    width: 'auto',
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
