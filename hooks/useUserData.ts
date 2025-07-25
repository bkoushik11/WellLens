import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export interface UserData {
  user_id: string;
  first_name: string;
  last_name?: string;
  date_of_birth: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  height_unit: 'cm' | 'ft/inches';
  weight: number;
  weight_unit: 'kg' | 'lbs';
  health_goal: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  diet_preferences: ('none' | 'vegetarian' | 'vegan' | 'keto' | 'non-vegetarian')[];
  is_onboarding_complete?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Database constraint constants (matching your Supabase schema)
export const DB_CONSTRAINTS = {
  HEALTH_GOALS: ['lose_weight', 'maintain_weight', 'gain_weight'] as const,
  ACTIVITY_LEVELS: ['sedentary', 'lightly_active', 'moderately_active', 'very_active'] as const,
  DIET_PREFERENCES: ['none', 'vegetarian', 'vegan', 'keto', 'non-vegetarian'] as const,
  GENDERS: ['male', 'female'] as const,
  HEIGHT_UNITS: ['cm', 'ft/inches'] as const,
  WEIGHT_UNITS: ['kg', 'lbs'] as const,
} as const;

// Enhanced validation with specific constraint checking
function validateOnboardingData(data: Partial<UserData>): { valid: boolean; message?: string } {
  // Required field validation
  if (!data.first_name?.trim()) return { valid: false, message: 'First name is required.' };
  if (!data.date_of_birth || isNaN(Date.parse(data.date_of_birth))) return { valid: false, message: 'Valid date of birth is required.' };
  
  // Age validation (matching database constraint)
  if (typeof data.age !== 'number' || data.age < 18 || data.age > 120) return { valid: false, message: 'Age must be between 18 and 120.' };
  
  // Gender validation (exact database constraint match)
  if (!data.gender || !DB_CONSTRAINTS.GENDERS.includes(data.gender)) return { valid: false, message: 'Valid gender is required (male or female).' };
  
  // Height validation
  if (typeof data.height !== 'number' || data.height <= 0) return { valid: false, message: 'Valid height is required.' };
  if (!data.height_unit || !DB_CONSTRAINTS.HEIGHT_UNITS.includes(data.height_unit)) return { valid: false, message: 'Valid height unit is required (cm or ft/inches).' };
  
  // Weight validation
  if (typeof data.weight !== 'number' || data.weight <= 0) return { valid: false, message: 'Valid weight is required.' };
  if (!data.weight_unit || !DB_CONSTRAINTS.WEIGHT_UNITS.includes(data.weight_unit)) return { valid: false, message: 'Valid weight unit is required (kg or lbs).' };
  
  // Health goal validation (exact database constraint match)
  if (!data.health_goal || !DB_CONSTRAINTS.HEALTH_GOALS.includes(data.health_goal)) return { valid: false, message: `Valid health goal is required. Allowed: ${DB_CONSTRAINTS.HEALTH_GOALS.join(', ')}.` };
  
  // Activity level validation (exact database constraint match)
  if (!data.activity_level || !DB_CONSTRAINTS.ACTIVITY_LEVELS.includes(data.activity_level)) return { valid: false, message: `Valid activity level is required. Allowed: ${DB_CONSTRAINTS.ACTIVITY_LEVELS.join(', ')}.` };
  
  // Diet preferences validation (exact database constraint match)
  if (!Array.isArray(data.diet_preferences) || data.diet_preferences.length === 0) return { valid: false, message: 'At least one diet preference is required.' };
  
  const invalidDietPrefs = data.diet_preferences.filter(pref => !DB_CONSTRAINTS.DIET_PREFERENCES.includes(pref));
  if (invalidDietPrefs.length > 0) return { valid: false, message: `Invalid diet preferences: ${invalidDietPrefs.join(', ')}. Allowed: ${DB_CONSTRAINTS.DIET_PREFERENCES.join(', ')}.` };
  
  return { valid: true };
}

// Debug function to log exact data being sent
function debugDataBeforeSave(data: UserData, operation: string) {
  // Removed console.log statements
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        // Removed console.log('No user session found');
        setIsLoading(false);
        return;
      }

      // Use the RPC function to get user profile
      const { data, error } = await supabase.rpc('get_user_profile', { p_user_id: userId });
      
      if (error) {
        console.error('Supabase profile fetch error:', error);
        setError(`Failed to fetch profile: ${error.message}`);
        setIsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // Removed console.log('✅ User profile fetched successfully:', data[0]);
        setUserData(data[0]);
      } else {
        // Removed console.log('No profile data found for user');
        setUserData(null);
      }
    } catch (err) {
      console.error('Unexpected error fetching user data:', err);
      setError('Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateUserData = async (newData: Partial<UserData>) => {
    setError(null);
    
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        setError('Session error occurred');
        return;
      }

      const userId = session?.user?.id;
      if (!userId) {
        console.error('No user ID found');
        setError('User not authenticated');
        return;
      }

      // Merge with existing data
      const mergedData = { ...userData, ...newData, user_id: userId } as UserData;

      // Defensive validation with exact constraint matching
      if (!mergedData.health_goal || !DB_CONSTRAINTS.HEALTH_GOALS.includes(mergedData.health_goal)) {
        console.warn('⚠️ Invalid health_goal, setting default:', mergedData.health_goal);
        mergedData.health_goal = 'maintain_weight';
      }

      if (!mergedData.activity_level || !DB_CONSTRAINTS.ACTIVITY_LEVELS.includes(mergedData.activity_level)) {
        console.warn('⚠️ Invalid activity_level, setting default:', mergedData.activity_level);
        mergedData.activity_level = 'sedentary';
      }

      // Ensure diet_preferences is valid array
      if (!Array.isArray(mergedData.diet_preferences) || mergedData.diet_preferences.length === 0) {
        console.warn('⚠️ Invalid diet_preferences, setting default:', mergedData.diet_preferences);
        mergedData.diet_preferences = ['none'];
      }

      // Validate complete data
      const validation = validateOnboardingData(mergedData);
      if (!validation.valid) {
        console.error('❌ Validation failed:', validation.message);
        setError(`Validation failed: ${validation.message}`);
        return;
      }

      // Debug log before sending to Supabase
      debugDataBeforeSave(mergedData, 'updateUserData');

      // Use the RPC function to upsert data
      const { data: upserted, error } = await supabase.rpc('upsert_onboarding_data', {
        p_user_id: mergedData.user_id,
        p_first_name: mergedData.first_name,
        p_last_name: mergedData.last_name || null,
        p_date_of_birth: mergedData.date_of_birth,
        p_age: mergedData.age,
        p_gender: mergedData.gender,
        p_height: mergedData.height,
        p_height_unit: mergedData.height_unit,
        p_weight: mergedData.weight,
        p_weight_unit: mergedData.weight_unit,
        p_health_goal: mergedData.health_goal,
        p_activity_level: mergedData.activity_level,
        p_diet_preferences: mergedData.diet_preferences,
        p_is_onboarding_complete: mergedData.is_onboarding_complete ?? true
      });

      if (error) {
        console.error('❌ Supabase upsert error:', error);
        // Optionally, set an error state if you want to show in UI
        // setError(`Database error: ${error.message}`);
        return;
      }

      // Removed console.log('✅ Upsert result:', upserted);
      // Removed console.log('✅ Upsert result type:', typeof upserted);

      // 🐛 DEBUG: Immediately query the database to see if data exists
      const { data: immediateCheck, error: checkError } = await supabase
        .from('onboarding_data')
        .select('*')
        .eq('user_id', mergedData.user_id)
        .single();

      // Removed console.log('🔍 Immediate data check:', immediateCheck);
      // Removed console.log('🔍 Immediate check error:', checkError);

      // Removed console.log('✅ Data saved successfully:', upserted);

      // Refetch to ensure latest data
      await fetchUserData();

    } catch (err) {
      console.error('Unexpected error updating user data:', err);
      setError('Unexpected error occurred while saving');
    }
  };

  return {
    userData,
    updateUserData, 
    isLoading,
    error,
    refetch: fetchUserData,
    // Export validation constants for use in components
    constraints: DB_CONSTRAINTS
  };
}
