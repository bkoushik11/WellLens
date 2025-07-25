import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#E0F7FA", "#B2EBF2", "#14B8A6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {/* Logo Row */}
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.logoText}>WellLens</Text>
        </View>
        {/* Welcome Title */}
        <Text style={styles.title}>Welcome to WellLens</Text>
        {/* Centered Emoji Illustration */}
        <View style={styles.emojiRow}>
          <Text style={styles.emoji}>🧘‍♂️</Text>
        </View>
        {/* Subtitle */}
        <Text style={styles.subtitle}>Track your wellness and stay healthy</Text>
      </SafeAreaView>
      {/* Get Started Button */}
      <View style={styles.getStartedButtonContainer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => router.push('/onboarding/name')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#14B8A6", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: height * 0.06,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 32,
    marginBottom: 32,
    marginTop: 8,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#14B8A6',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    margin: 0,
    padding: 0,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#14B8A6',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 0,
    lineHeight: 44,
    letterSpacing: 0.5,
  },
  emojiRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    marginTop: 0,
  },
  emoji: {
    fontSize: 90,
    textAlign: 'center',
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },
  subtitle: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '500',
    color: '#2563EB',
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 30,
    letterSpacing: 0.2,
    paddingHorizontal: 24,
  },
  getStartedButtonContainer: {
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 44,
    backgroundColor: 'transparent',
  },
  getStartedButton: {
    borderRadius: 36,
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#334155',
  },
  buttonGradient: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 36,
    backgroundColor: 'transparent',
  },
  getStartedText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
});