import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export function useOnboardingData() {
  const [onboardingData, setOnboardingData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('health_goal, activity_level, diet_preferences, gender, date_of_birth, age, height, height_unit, weight, weight_unit')
        .eq('id', userId)
        .single();
      if (data) setOnboardingData(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return { onboardingData, isLoading };
}
