import React, { createContext, useContext, useState } from 'react';
import { UserData } from './useUserData';

interface OnboardingContextType {
  onboardingData: UserData;
  setOnboardingData: React.Dispatch<React.SetStateAction<UserData>>;
}

const defaultOnboardingData: UserData = {
  user_id: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  age: 18,
  gender: 'male',
  height: 170,
  height_unit: 'cm',
  weight: 70,
  weight_unit: 'kg',
  health_goal: 'maintain_weight',
  activity_level: 'sedentary',
  diet_preferences: ['none'],
  is_onboarding_complete: false,
};

const OnboardingContext = createContext<OnboardingContextType>({
  onboardingData: defaultOnboardingData,
  setOnboardingData: () => {},
});

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [onboardingData, setOnboardingData] = useState<UserData>(defaultOnboardingData);
  return (
    <OnboardingContext.Provider value={{ onboardingData, setOnboardingData }}>
      {children}
    </OnboardingContext.Provider>
  );
}; 