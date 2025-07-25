import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Plus } from 'lucide-react-native';

interface Recommendation {
  id: string;
  name: string;
  calories: number;
  reason: string;
  image: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <Image source={{ uri: recommendation.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.name}>{recommendation.name}</Text>
          <Text style={styles.calories}>{recommendation.calories} kcal</Text>
          <Text style={styles.reason}>{recommendation.reason}</Text>
        </View>
        
        <TouchableOpacity style={styles.addButton}>
          <Plus size={16} color="#14B8A6" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
    backgroundColor: '#E2E8F0',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  calories: {
    fontSize: 14,
    fontWeight: '500',
    color: '#14B8A6',
    marginBottom: 4,
  },
  reason: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});