import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, CreditCard as Edit, Star, Share, BookmarkPlus } from 'lucide-react-native';
import { MacroProgress } from '@/components/MacroProgress';

export default function AnalysisResultScreen() {
  const params = useLocalSearchParams();
  const { imageUri, mealName } = params;

  const nutritionData = {
    calories: 420,
    servingSize: '1 serving (300g)',
    confidence: 92,
    macros: {
      carbs: { value: 35, target: 120, unit: 'g' },
      protein: { value: 28, target: 50, unit: 'g' },
      fat: { value: 18, target: 30, unit: 'g' },
      fiber: { value: 8, target: 25, unit: 'g' },
    },
    micronutrients: [
      { name: 'Vitamin C', amount: '45mg', percentage: 50 },
      { name: 'Iron', amount: '3.2mg', percentage: 18 },
      { name: 'Calcium', amount: '120mg', percentage: 12 },
    ],
    ingredients: [
      { name: 'Grilled Chicken Breast', quantity: '150g' },
      { name: 'Mixed Greens', quantity: '100g' },
      { name: 'Cherry Tomatoes', quantity: '50g' },
      { name: 'Olive Oil Dressing', quantity: '15ml' },
    ],
  };

  const alternatives = [
    {
      id: '1',
      name: 'Lighter Caesar Salad',
      calories: 280,
      reason: '140 calories less, same protein',
      image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: '2',
      name: 'Quinoa Power Bowl',
      calories: 380,
      reason: 'More fiber and complete protein',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Share size={20} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <BookmarkPlus size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUri as string || 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400' }} 
              style={styles.mealImage} 
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Edit size={16} color="#14B8A6" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{mealName || 'Grilled Chicken Salad'}</Text>
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceText}>
                {nutritionData.confidence}% confidence
              </Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    color="#F59E0B" 
                    fill={star <= 4 ? "#F59E0B" : "none"} 
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Nutrition Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Overview</Text>
          
          <View style={styles.overviewCard}>
            <View style={styles.calorieInfo}>
              <Text style={styles.calorieNumber}>{nutritionData.calories}</Text>
              <Text style={styles.calorieLabel}>calories</Text>
            </View>
            
            <View style={styles.servingInfo}>
              <Text style={styles.servingSize}>{nutritionData.servingSize}</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceBadgeText}>
                  {nutritionData.confidence}% match
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Macronutrients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          
          <View style={styles.macroGrid}>
            <MacroProgress
              name="Carbs"
              value={nutritionData.macros.carbs.value}
              target={nutritionData.macros.carbs.target}
              unit={nutritionData.macros.carbs.unit}
              color="#F59E0B"
            />
            <MacroProgress
              name="Protein"
              value={nutritionData.macros.protein.value}
              target={nutritionData.macros.protein.target}
              unit={nutritionData.macros.protein.unit}
              color="#EF4444"
            />
            <MacroProgress
              name="Fat"
              value={nutritionData.macros.fat.value}
              target={nutritionData.macros.fat.target}
              unit={nutritionData.macros.fat.unit}
              color="#8B5CF6"
            />
            <MacroProgress
              name="Fiber"
              value={nutritionData.macros.fiber.value}
              target={nutritionData.macros.fiber.target}
              unit={nutritionData.macros.fiber.unit}
              color="#10B981"
            />
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          
          <View style={styles.insightCard}>
            <Text style={styles.insightText}>
              This meal is an excellent source of lean protein and provides good nutritional balance. 
              The high fiber content will help you feel full, making it perfect for your weight management goals.
            </Text>
            
            <View style={styles.goalImpact}>
              <Text style={styles.goalImpactLabel}>Goal Impact</Text>
              <Text style={styles.goalImpactText}>
                This meal brings you 65% closer to your daily protein goal and provides 25% of your daily fiber needs.
              </Text>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Ingredients</Text>
          
          <View style={styles.ingredientsList}>
            {nutritionData.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientQuantity}>{ingredient.quantity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Healthier Alternatives */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Healthier Alternatives</Text>
          
          <View style={styles.alternativesList}>
            {alternatives.map((alternative) => (
              <TouchableOpacity key={alternative.id} style={styles.alternativeCard}>
                <Image source={{ uri: alternative.image }} style={styles.alternativeImage} />
                
                <View style={styles.alternativeContent}>
                  <Text style={styles.alternativeName}>{alternative.name}</Text>
                  <Text style={styles.alternativeCalories}>{alternative.calories} kcal</Text>
                  <Text style={styles.alternativeReason}>{alternative.reason}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Log This Meal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Get More Info</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  mealImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  editImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealInfo: {
    alignItems: 'center',
  },
  mealName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confidenceText: {
    fontSize: 14,
    color: '#14B8A6',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  overviewCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  calorieInfo: {
    alignItems: 'center',
  },
  calorieNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#14B8A6',
  },
  calorieLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  servingInfo: {
    alignItems: 'flex-end',
  },
  servingSize: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  confidenceBadge: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  macroGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  insightCard: {
    backgroundColor: '#F0FDFA',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#14B8A6',
  },
  insightText: {
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 22,
    marginBottom: 16,
  },
  goalImpact: {},
  goalImpactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14B8A6',
    marginBottom: 4,
  },
  goalImpactText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  ingredientQuantity: {
    fontSize: 14,
    color: '#64748B',
  },
  alternativesList: {
    gap: 12,
  },
  alternativeCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  alternativeImage: {
    width: 80,
    height: 80,
    backgroundColor: '#E2E8F0',
  },
  alternativeContent: {
    flex: 1,
    padding: 16,
  },
  alternativeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  alternativeCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: '#14B8A6',
    marginBottom: 4,
  },
  alternativeReason: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  actionButtons: {
    paddingHorizontal: 24,
    gap: 12,
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
  secondaryButton: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#14B8A6',
  },
  bottomSpacing: {
    height: 40,
  },
});