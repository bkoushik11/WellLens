import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { supabase } from '../../utils/supabase';
import LottieView from 'lottie-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const { updateUserData } = useUserData();

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle form validation
  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    return isValid;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      // If error message indicates user not found, show create account option
      if (error.message.toLowerCase().includes('user') && error.message.toLowerCase().includes('not') && error.message.toLowerCase().includes('found')) {
        setShowCreateAccount(true);
      } else {
        setShowCreateAccount(false);
      }
      Alert.alert('Login Error', error.message);
      return;
    }
    if (data.user) {
      setShowCreateAccount(false);
      router.replace('/(tabs)');
    } else {
      setShowCreateAccount(true);
      Alert.alert('Login Error', 'No user found.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Animated Illustration (only while loading) */}
          {loading && (
            <View style={styles.lottieOverlay}>
              <LottieView
                source={require('../../assets/Login icon.json')}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>
          )}
          <View style={styles.header}>
            {/* Remove any TouchableOpacity, IconButton, or similar component that acts as a back button in the top left of the screen. */}
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>Sign in to continue your wellness journey</Text>
            <View style={styles.formCard}>
              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, emailError && styles.inputError]}> 
                  <Mail size={20} color={emailError ? "#EF4444" : "#64748B"} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>
              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, passwordError && styles.inputError]}> 
                  <Lock size={20} color={passwordError ? "#EF4444" : "#64748B"} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError('');
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={styles.eyeIcon}>
                    {showPassword ? <EyeOff size={20} color="#64748B" /> : <Eye size={20} color="#64748B" />}
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>
              {/* Forgot Password Link */}
              <TouchableOpacity style={styles.forgotPassword} onPress={() => Alert.alert('Forgot Password', 'Please contact support or implement password reset logic.')}> 
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
              {/* Show Create Account Button if login failed due to user not found */}
              {showCreateAccount && (
                <TouchableOpacity style={styles.createAccountButton} onPress={() => router.replace('/onboarding/createAccount')}>
                  <Text style={styles.createAccountButtonText}>Create an Account</Text>
                </TouchableOpacity>
              )}
              {/* Action Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} onPress={handleLogin} disabled={loading}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Login</Text>}
                </TouchableOpacity>
              </View>
              {/* Divider and Sign Up Link */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>
              <TouchableOpacity style={styles.signupLink} onPress={() => router.replace('/onboarding/createAccount')}>
                <Text style={styles.signupText}>Don't have an account? <Text style={{ color: '#14B8A6', fontWeight: 'bold' }}>Sign up</Text></Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
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
  form: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: '#14B8A6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#14B8A6',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  lottie: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 8,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 16,
    marginBottom: 16,
  },
  eyeIcon: {
    marginLeft: 8,
    padding: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  signupLink: {
    alignItems: 'center',
    marginTop: 4,
  },
  signupText: {
    fontSize: 16,
    color: '#64748B',
  },
  primaryButtonDisabled: {
    backgroundColor: '#A7F3D0',
  },
  createAccountButton: {
    backgroundColor: '#14B8A6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  createAccountButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lottieOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)', // nearly solid white, matches login bg
    zIndex: 10,
  },
}); 