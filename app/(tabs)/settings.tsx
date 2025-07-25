import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Bell, Shield, Smartphone, Download, CircleHelp as HelpCircle, MessageCircle, Star, LogOut, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [mealReminders, setMealReminders] = React.useState(true);
  const [waterReminders, setWaterReminders] = React.useState(false);

  const settingsGroups = [
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          title: 'Push Notifications',
          subtitle: 'Receive app notifications',
          type: 'switch',
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          icon: Bell,
          title: 'Meal Reminders',
          subtitle: 'Remind me to log meals',
          type: 'switch',
          value: mealReminders,
          onValueChange: setMealReminders,
        },
        {
          icon: Bell,
          title: 'Water Reminders',
          subtitle: 'Remind me to drink water',
          type: 'switch',
          value: waterReminders,
          onValueChange: setWaterReminders,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Shield,
          title: 'Privacy Settings',
          subtitle: 'Manage your data and privacy',
          type: 'navigation',
        },
        {
          icon: Download,
          title: 'Export Data',
          subtitle: 'Download your personal data',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          icon: Smartphone,
          title: 'App Version',
          subtitle: 'Version 1.0.0',
          type: 'info',
        },
        {
          icon: Star,
          title: 'Rate App',
          subtitle: 'Help us improve with your feedback',
          type: 'navigation',
        },
        {
          icon: HelpCircle,
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          type: 'navigation',
        },
        {
          icon: MessageCircle,
          title: 'Send Feedback',
          subtitle: 'Share your thoughts and suggestions',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: LogOut,
          title: 'Sign Out',
          subtitle: 'Sign out of your account',
          type: 'navigation',
          color: '#EF4444',
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    const Icon = item.icon;
    const isSignOut = item.title === 'Sign Out';
    return (
      <TouchableOpacity
        key={index}
        style={styles.settingItem}
        onPress={isSignOut ? () => router.replace('/onboarding/login') : undefined}
      >
        <View style={styles.settingLeft}>
          <View style={[
            styles.settingIcon, 
            { backgroundColor: `${item.color || '#14B8A6'}20` }
          ]}>
            <Icon size={20} color={item.color || '#14B8A6'} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[
              styles.settingTitle,
              item.color && { color: item.color }
            ]}>
              {item.title}
            </Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <View style={styles.settingRight}>
          {item.type === 'switch' ? (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: '#E2E8F0', true: '#14B8A6' }}
              thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
            />
          ) : item.type === 'navigation' ? (
            <ChevronRight size={20} color="#94A3B8" />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            
            <View style={styles.groupContainer}>
              {group.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </View>
        ))}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  scrollView: {
    flex: 1,
  },
  settingGroup: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  groupContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  settingRight: {
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});