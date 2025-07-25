import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { User, Target, Bell, Shield, CreditCard, ChevronRight, CreditCard as Edit } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { CircularProgress } from '@/components/CircularProgress';
import { router } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function ProfileScreen() {
  const { userData } = useUserData();

  const stats = [
    { label: 'Meals Logged', value: '127', icon: '🍽️' },
    { label: 'Days Active', value: '23', icon: '📅' },
    { label: 'Avg Calories', value: '1,850', icon: '🔥' },
    { label: 'Water Goal', value: '92%', icon: '💧' },
  ];

  const achievements = [
    { name: '7-Day Streak', icon: '🔥', earned: true },
    { name: 'Healthy Choice', icon: '🥗', earned: true },
    { name: 'Water Champion', icon: '💧', earned: false },
    { name: 'Goal Crusher', icon: '🎯', earned: false },
  ];

  const menuItems = [
    { title: 'Account Information', icon: User, color: '#14B8A6', onPress: () => router.push('/profile/account-info') },
    { title: 'Health Goals', icon: Target, color: '#3B82F6' },
    { title: 'Notifications', icon: Bell, color: '#F59E0B' },
    { 
      title: 'Privacy Settings', 
      icon: Shield, 
      color: '#8B5CF6', 
      onPress: () => router.push('/profile/account-info') 
    },
    { title: 'Subscription', icon: CreditCard, color: '#EF4444' },
  ];
  

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userData && 'firstName' in userData && typeof (userData as any).firstName === 'string'
                    ? (userData as any).firstName.charAt(0).toUpperCase()
                    : 'U'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => router.push('/profile/edit-profile')}
              >
                <Edit size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>
                  {(userData && 'firstName' in userData && (userData as any).firstName) ? (userData as any).firstName : 'User'}
                </Text>
                <TouchableOpacity 
                  style={styles.editNameButton}
                  onPress={() => router.push('/profile/edit-profile')}
                >
                  <Edit size={16} color="#14B8A6" />
                </TouchableOpacity>
              </View>
              <View style={styles.streakContainer}>
                <Text style={styles.streakText}>🔥 7-day streak</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progress Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Weight Goal Progress</Text>
              <Text style={styles.progressSubtitle}>
                3.2 lbs lost of 15 lbs goal
              </Text>
            </View>
            
            <CircularProgress
              size={80}
              strokeWidth={6}
              progress={0.21}
              color="#14B8A6"
              backgroundColor="#E2E8F0"
            >
              <View style={styles.progressContent}>
                <Text style={styles.progressPercentage}>21%</Text>
              </View>
            </CircularProgress>
          </View>
          {/* Weight Goal Graph */}
          <View style={styles.graphContainer}>
            <LineChart
              data={{
                labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25'],
                datasets: [
                  {
                    data: [180, 178, 176, 175, 174, 172],
                    color: () => '#14B8A6',
                    strokeWidth: 2,
                  },
                ],
              }}
              width={Dimensions.get('window').width - 48}
              height={180}
              chartConfig={{
                backgroundColor: '#F8FAFC',
                backgroundGradientFrom: '#F8FAFC',
                backgroundGradientTo: '#F8FAFC',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(20, 184, 166, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#14B8A6',
                },
              }}
              bezier
              style={{
                borderRadius: 16,
                marginVertical: 8,
              }}
            />
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <View 
                key={index} 
                style={[
                  styles.achievementBadge,
                  !achievement.earned && styles.achievementBadgeDisabled
                ]}
              >
                <Text style={[
                  styles.achievementIcon,
                  !achievement.earned && styles.achievementIconDisabled
                ]}>
                  {achievement.icon}
                </Text>
                <Text style={[
                  styles.achievementName,
                  !achievement.earned && styles.achievementNameDisabled
                ]}>
                  {achievement.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity 
                  key={index} 
                  style={styles.menuItem}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                      <Icon size={20} color={item.color} />
                    </View>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                  </View>
                  <ChevronRight size={20} color="#94A3B8" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#14B8A6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#14B8A6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  editNameButton: {
    marginLeft: 8,
    padding: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#14B8A6',
    fontWeight: '500',
  },
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  progressContent: {
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14B8A6',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementBadge: {
    width: '48%',
    backgroundColor: '#F0FDFA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#14B8A6',
  },
  achievementBadgeDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementIconDisabled: {
    opacity: 0.5,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#14B8A6',
    textAlign: 'center',
  },
  achievementNameDisabled: {
    color: '#94A3B8',
  },
  menuContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  bottomSpacing: {
    height: 20,
  },
  graphContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
});