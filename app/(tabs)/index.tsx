import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Camera, Droplets, ChartBar as BarChart3, Plus } from 'lucide-react-native';
import { CircularProgress } from '@/components/CircularProgress';
import { MacroProgress } from '@/components/MacroProgress';
import { MealCard } from '@/components/MealCard';
import { RecommendationCard } from '@/components/RecommendationCard';
import { useUserData, UserData } from '@/hooks/useUserData';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { userData } = useUserData();
  const typedUserData = userData as UserData;
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  const calorieProgress = 1450 / 2200; // Example: consumed / target
  const waterProgress = 6 / 8; // glasses consumed / target

  const recentMeals = [
    {
      id: '1',
      name: 'Avocado Toast',
      calories: 320,
      image: 'https://images.pexels.com/photos/1833349/pexels-photo-1833349.jpeg?auto=compress&cs=tinysrgb&w=300',
      time: '8:30 AM',
    },
    {
      id: '2',
      name: 'Chicken Salad',
      calories: 450,
      image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=300',
      time: '12:45 PM',
    },
    {
      id: '3',
      name: 'Greek Yogurt',
      calories: 150,
      image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=300',
      time: '3:20 PM',
    },
  ];

  const recommendations = [
    {
      id: '1',
      name: 'Grilled Salmon',
      calories: 380,
      reason: 'High in protein, perfect for your goals',
      image: 'https://images.pexels.com/photos/3634741/pexels-photo-3634741.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: '2',
      name: 'Quinoa Bowl',
      calories: 420,
      reason: 'Balanced macros, vegetarian option',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {greeting}, {typedUserData?.first_name || 'User'}!
            </Text>
            <View style={styles.streakContainer}>
              <Text style={styles.streakText}>🔥 7-day streak</Text>
            </View>
          </View>
          
          <View style={styles.calorieRing}>
            <CircularProgress
              size={80}
              strokeWidth={6}
              progress={calorieProgress}
              color="#14B8A6"
              backgroundColor="#E2E8F0"
            >
              <View style={styles.calorieContent}>
                <Text style={styles.calorieNumber}>1450</Text>
                <Text style={styles.calorieLabel}>kcal</Text>
              </View>
            </CircularProgress>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryAction]}
            onPress={() => router.push('/(tabs)/camera')}
          >
            <Camera size={24} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Scan Meal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Droplets size={20} color="#14B8A6" />
            <Text style={styles.actionText}>Log Water</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <BarChart3 size={20} color="#14B8A6" />
            <Text style={styles.actionText}>View History</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Calories</Text>
              <Text style={styles.summaryValue}>1450 / 2200</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${calorieProgress * 100}%` }]} />
              </View>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Water</Text>
              <Text style={styles.summaryValue}>6 / 8 glasses</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${waterProgress * 100}%`, backgroundColor: '#3B82F6' }]} />
              </View>
            </View>
          </View>

          {/* Macronutrients */}
          <View style={styles.macroContainer}>
            <Text style={styles.macroTitle}>Macronutrients</Text>
            <View style={styles.macroGrid}>
              <MacroProgress name="Carbs" value={180} target={275} unit="g" color="#F59E0B" />
              <MacroProgress name="Protein" value={95} target={110} unit="g" color="#EF4444" />
              <MacroProgress name="Fat" value={65} target={80} unit="g" color="#8B5CF6" />
            </View>
          </View>
        </View>

        {/* Recent Meals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Meals</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealsList}>
            {recentMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </ScrollView>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested for you</Text>
          
          <View style={styles.recommendationsList}>
            {recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
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
  calorieRing: {
    alignItems: 'center',
  },
  calorieContent: {
    alignItems: 'center',
  },
  calorieNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14B8A6',
  },
  calorieLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  primaryAction: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#14B8A6',
    marginTop: 4,
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
  seeAllText: {
    fontSize: 14,
    color: '#14B8A6',
    fontWeight: '500',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#14B8A6',
    borderRadius: 2,
  },
  macroContainer: {
    marginTop: 20,
  },
  macroTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  macroGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  mealsList: {
    marginLeft: -24,
    paddingLeft: 24,
  },
  recommendationsList: {
    gap: 12,
  },
  bottomSpacing: {
    height: 20,
  },
});