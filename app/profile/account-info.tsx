import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Save, User, Calendar, Scale, Ruler, Target, Activity } from 'lucide-react-native';
import { useUserData, UserData } from '@/hooks/useUserData';
import { Picker } from '@react-native-picker/picker';

type DietPreference = 'vegan' | 'vegetarian' | 'non-vegetarian' | 'keto' | 'none';

export default function AccountInfoScreen() {
  const { userData, updateUserData, isLoading } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UserData>>(userData || {});
  const [saving, setSaving] = useState(false);

  // Keep editedData in sync with userData
  useEffect(() => {
    setEditedData(userData || {});
  }, [userData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Convert numeric fields
      const toSave = {
        ...editedData,
        age: editedData.age ? Number(editedData.age) : null,
        weight: editedData.weight ? Number(editedData.weight) : null,
        height: editedData.height ? Number(editedData.height) : null,
      };
      // Fix: Remove nulls for numeric fields, use undefined instead to match Partial<UserData> type
      await updateUserData({
        ...editedData,
        age: editedData.age ? Number(editedData.age) : undefined,
        weight: editedData.weight ? Number(editedData.weight) : undefined,
        height: editedData.height ? Number(editedData.height) : undefined,
      });
      Alert.alert('Success', 'Your information has been updated successfully.');
      Alert.alert('Error', 'Failed to update information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(userData || {});
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getHealthGoalText = (goal?: string) => {
    const goals = {
      lose_weight: 'Lose Weight',
      maintain_weight: 'Maintain Weight',
      gain_weight: 'Gain Weight',
    };
    return goals[goal as keyof typeof goals] || 'Not set';
  };

  const getActivityLevelText = (level?: string) => {
    const levels = {
      sedentary: 'Sedentary',
      lightly_active: 'Lightly Active',
      moderately_active: 'Moderately Active',
      very_active: 'Very Active',
    };
    return levels[level as keyof typeof levels] || 'Not set';
  };

  const getDietPreferencesText = (preferences?: string[]) => {
    if (!preferences || preferences.length === 0) return 'Not set';
    if (preferences.includes('none')) return 'No restrictions';
      const prefs = {
        vegetarian: 'Vegetarian',
        vegan: 'Vegan',
        keto: 'Keto',
      'non-vegetarian': 'Non-Vegetarian',
      none: 'No restrictions',
      };
    return preferences.map(pref => prefs[pref as keyof typeof prefs] || pref).join(', ');
  };

  const getSelectedDietPreference = (prefs: UserData['diet_preferences']) => {
    return Array.isArray(prefs) && prefs.length > 0 ? prefs[0] : undefined;
  };

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];
  const healthGoalOptions = [
    { label: 'Lose Weight', value: 'lose_weight' },
    { label: 'Maintain Weight', value: 'maintain_weight' },
    { label: 'Gain Weight', value: 'gain_weight' },
  ];
  const activityLevelOptions = [
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly Active', value: 'lightly_active' },
    { label: 'Moderately Active', value: 'moderately_active' },
    { label: 'Very Active', value: 'very_active' },
  ];
  const heightUnitOptions = [
    { label: 'cm', value: 'cm' },
    { label: 'ft/inches', value: 'ft/inches' },
  ];
  const weightUnitOptions = [
    { label: 'kg', value: 'kg' },
    { label: 'lbs', value: 'lbs' },
  ];
  const dietOptions = [
    { label: 'No restrictions', value: 'none' },
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Keto', value: 'keto' },
    { label: 'Non-Vegetarian', value: 'non-vegetarian' },
  ];

  function setDietPreference(
    prev: Partial<UserData>,
    value: string
  ): Partial<UserData> {
    return {
      ...prev,
      diet_preferences: value
        ? ([value] as UserData['diet_preferences'])
        : undefined,
    };
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Account Information</Text>
        
        <TouchableOpacity 
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          style={styles.actionButton}
        >
          {isEditing ? (
            <Save size={20} color="#14B8A6" />
          ) : (
            <Text style={styles.editButtonText}>Edit</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Personal Information */}
        <View style={styles.section}>
              <View style={styles.sectionHeader}>
            <User size={20} color="#14B8A6" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <View style={styles.sectionContent}>
            {/* First Name */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>First Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedData.first_name || ''}
                  onChangeText={text => setEditedData(prev => ({ ...prev, first_name: text }))}
                  placeholder="Enter first name"
                />
              ) : (
                <Text style={styles.infoValue}>{editedData.first_name}</Text>
              )}
            </View>
            {/* Last Name */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedData.last_name || ''}
                  onChangeText={text => setEditedData(prev => ({ ...prev, last_name: text }))}
                  placeholder="Enter last name"
                />
              ) : (
                <Text style={styles.infoValue}>{editedData.last_name}</Text>
              )}
            </View>
            {/* Date of Birth */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedData.date_of_birth || ''}
                  onChangeText={text => setEditedData(prev => ({ ...prev, date_of_birth: text }))}
                  placeholder="YYYY-MM-DD"
                />
              ) : (
                <Text style={styles.infoValue}>{editedData.date_of_birth}</Text>
              )}
            </View>
            {/* Gender */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              {isEditing ? (
                <Picker
                  selectedValue={editedData.gender}
                  onValueChange={(value: string) => setEditedData(prev => ({ ...prev, gender: value as UserData['gender'] }))}
                  style={styles.infoInput}
                >
                  {genderOptions.map(opt => (
                    <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.infoValue}>{editedData.gender}</Text>
              )}
            </View>
          </View>
              </View>
              
        {/* Physical Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Scale size={20} color="#14B8A6" />
            <Text style={styles.sectionTitle}>Physical Information</Text>
          </View>
              <View style={styles.sectionContent}>
            {/* Age */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedData.age !== undefined && editedData.age !== null ? String(editedData.age) : ''}
                  onChangeText={text => setEditedData(prev => ({ ...prev, age: text ? Number(text) : undefined }))}
                  placeholder="Enter age"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>{editedData.age}</Text>
              )}
            </View>
            {/* Height */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Height</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedData.height !== undefined && editedData.height !== null ? String(editedData.height) : ''}
                  onChangeText={text => setEditedData(prev => ({ ...prev, height: text ? Number(text) : undefined }))}
                  placeholder="Enter height"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>{editedData.height}</Text>
              )}
            </View>
            {/* Height Unit */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Height Unit</Text>
              {isEditing ? (
                <Picker
                  selectedValue={editedData.height_unit}
                  onValueChange={(value: string) => setEditedData(prev => ({ ...prev, height_unit: value as UserData['height_unit'] }))}
                  style={styles.infoInput}
                >
                  {heightUnitOptions.map(opt => (
                    <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.infoValue}>{editedData.height_unit}</Text>
              )}
            </View>
            {/* Weight */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Weight</Text>
              {isEditing ? (
                      <TextInput
                        style={styles.infoInput}
                  value={editedData.weight !== undefined && editedData.weight !== null ? String(editedData.weight) : ''}
                  onChangeText={text => setEditedData(prev => ({ ...prev, weight: text ? Number(text) : undefined }))}
                  placeholder="Enter weight"
                  keyboardType="numeric"
                      />
                    ) : (
                <Text style={styles.infoValue}>{editedData.weight}</Text>
              )}
            </View>
            {/* Weight Unit */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Weight Unit</Text>
              {isEditing ? (
                <Picker
                  selectedValue={editedData.weight_unit}
                  onValueChange={(value: string) => setEditedData(prev => ({ ...prev, weight_unit: value as UserData['weight_unit'] }))}
                  style={styles.infoInput}
                >
                  {weightUnitOptions.map(opt => (
                    <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.infoValue}>{editedData.weight_unit}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Health & Fitness */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={20} color="#14B8A6" />
            <Text style={styles.sectionTitle}>Health & Fitness</Text>
          </View>
          <View style={styles.sectionContent}>
            {/* Health Goal */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Health Goal</Text>
              {isEditing ? (
                <Picker
                  selectedValue={editedData.health_goal}
                  onValueChange={(value: string) => setEditedData(prev => ({ ...prev, health_goal: value as UserData['health_goal'] }))}
                  style={styles.infoInput}
                >
                  {healthGoalOptions.map(opt => (
                    <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.infoValue}>{getHealthGoalText(editedData.health_goal)}</Text>
                    )}
                  </View>
            {/* Activity Level */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Activity Level</Text>
              {isEditing ? (
                <Picker
                  selectedValue={editedData.activity_level}
                  onValueChange={(value: string) => setEditedData(prev => ({ ...prev, activity_level: value as UserData['activity_level'] }))}
                  style={styles.infoInput}
                >
                  {activityLevelOptions.map(opt => (
                    <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.infoValue}>{getActivityLevelText(editedData.activity_level)}</Text>
              )}
              </View>
            {/* Diet Preferences */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Diet Preferences</Text>
              {isEditing ? (
                <Picker
                  selectedValue={getSelectedDietPreference(editedData.diet_preferences ?? ['none'])}
                  onValueChange={(value: string) =>
                    setEditedData(prev => setDietPreference(prev, value))
                  }
                  style={styles.infoInput}
                >
                  {dietOptions.map(opt => (
                    <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                  ))}
                </Picker>
              ) : (
                <Text style={styles.infoValue}>{editedData.diet_preferences && editedData.diet_preferences[0]}</Text>
              )}
            </View>
          </View>
        </View>
        
        {/* Save/Cancel Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={saving}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>
        )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  actionButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14B8A6',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  sectionContent: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  infoItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  infoInput: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#14B8A6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#14B8A6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 40,
  },
});