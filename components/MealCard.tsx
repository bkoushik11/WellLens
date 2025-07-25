import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface Meal {
  id: string;
  name: string;
  calories: number;
  image: string;
  time: string;
}

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <Image source={{ uri: meal.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{meal.name}</Text>
        <Text style={styles.calories}>{meal.calories} kcal</Text>
        <Text style={styles.time}>{meal.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 80,
    backgroundColor: '#E2E8F0',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    lineHeight: 18,
  },
  calories: {
    fontSize: 12,
    fontWeight: '500',
    color: '#14B8A6',
    marginBottom: 2,
  },
  time: {
    fontSize: 11,
    color: '#64748B',
  },
});