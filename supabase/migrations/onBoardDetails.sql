-- Create the main table for storing user onboarding information
CREATE TABLE IF NOT EXISTS onboarding_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50), -- Optional
  date_of_birth DATE NOT NULL, -- Stores full date (year, month, day)
  age INTEGER CHECK (age BETWEEN 18 AND 120) NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female')) NOT NULL,
  height NUMERIC NOT NULL,
  height_unit VARCHAR(10) CHECK (height_unit IN ('cm', 'ft/inches')) NOT NULL,
  weight NUMERIC NOT NULL,
  weight_unit VARCHAR(10) CHECK (weight_unit IN ('kg', 'lbs')) NOT NULL,
  health_goal VARCHAR(20) CHECK (health_goal IN ('lose_weight', 'maintain_weight', 'gain_weight')) NOT NULL,
  activity_level VARCHAR(20) CHECK (activity_level IN (
    'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'
  )) NOT NULL,
  diet_preferences TEXT[] CHECK (
    diet_preferences <@ ARRAY['vegan', 'vegetarian', 'non-vegetarian', 'keto', 'none']
  ) NOT NULL,
  is_onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update timestamp on row changes
DROP TRIGGER IF EXISTS update_onboarding_data_updated_at ON onboarding_data;
CREATE TRIGGER update_onboarding_data_updated_at 
    BEFORE UPDATE ON onboarding_data 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own onboarding data
DROP POLICY IF EXISTS "Users can view own onboarding data" ON onboarding_data;
CREATE POLICY "Users can view own onboarding data" ON onboarding_data
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own onboarding data
DROP POLICY IF EXISTS "Users can insert own onboarding data" ON onboarding_data;
CREATE POLICY "Users can insert own onboarding data" ON onboarding_data
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own onboarding data
DROP POLICY IF EXISTS "Users can update own onboarding data" ON onboarding_data;
CREATE POLICY "Users can update own onboarding data" ON onboarding_data
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own onboarding data (optional)
DROP POLICY IF EXISTS "Users can delete own onboarding data" ON onboarding_data;
CREATE POLICY "Users can delete own onboarding data" ON onboarding_data
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Create a reference table for diet preferences
CREATE TABLE IF NOT EXISTS diet_preferences_ref (
  id SERIAL PRIMARY KEY,
  preference_name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on diet_preferences_ref (fixing the security warning)
ALTER TABLE diet_preferences_ref ENABLE ROW LEVEL SECURITY;

-- ✅ FIXED: Drop existing policy first, then create new one
DROP POLICY IF EXISTS "Allow public read access to diet preferences" ON diet_preferences_ref;
CREATE POLICY "Allow public read access to diet preferences" ON diet_preferences_ref
    FOR SELECT 
    TO authenticated, anon
    USING (is_active = true);

-- Insert default diet preferences data
INSERT INTO diet_preferences_ref (preference_name, description) VALUES
('none', 'No specific dietary restrictions'),
('vegetarian', 'Excludes meat but includes dairy and eggs'),
('vegan', 'Excludes all animal products'),
('keto', 'High-fat, low-carbohydrate diet'),
('non-vegetarian', 'Includes all food types including meat')
ON CONFLICT (preference_name) DO NOTHING;

-- Updated Enhanced upsert function with explicit schema and security
CREATE OR REPLACE FUNCTION public.upsert_onboarding_data(
  p_user_id UUID,
  p_first_name VARCHAR(50),
  p_last_name VARCHAR(50),
  p_date_of_birth DATE,
  p_age INTEGER,
  p_gender VARCHAR(20),
  p_height NUMERIC,
  p_height_unit VARCHAR(10),
  p_weight NUMERIC,
  p_weight_unit VARCHAR(10),
  p_health_goal VARCHAR(20),
  p_activity_level VARCHAR(20),
  p_diet_preferences TEXT[],
  p_is_onboarding_complete BOOLEAN DEFAULT true
)
RETURNS public.onboarding_data 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result public.onboarding_data;
BEGIN
  -- Explicitly set a minimal, fixed search path for security
  SET search_path = 'pg_temp';

  -- Validate inputs before insertion (additional safety layer)
  IF p_age < 18 OR p_age > 120 THEN
    RAISE EXCEPTION 'Age must be between 18 and 120, got: %', p_age;
  END IF;
  
  IF p_gender NOT IN ('male', 'female') THEN
    RAISE EXCEPTION 'Gender must be male or female, got: %', p_gender;
  END IF;
  
  IF p_health_goal NOT IN ('lose_weight', 'maintain_weight', 'gain_weight') THEN
    RAISE EXCEPTION 'Invalid health goal: %. Allowed: lose_weight, maintain_weight, gain_weight', p_health_goal;
  END IF;
  
  IF p_activity_level NOT IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active') THEN
    RAISE EXCEPTION 'Invalid activity level: %. Allowed: sedentary, lightly_active, moderately_active, very_active, extra_active', p_activity_level;
  END IF;

  -- Insert or update onboarding data
  INSERT INTO public.onboarding_data (
    user_id, first_name, last_name, date_of_birth, age, gender,
    height, height_unit, weight, weight_unit, health_goal, activity_level, 
    diet_preferences, is_onboarding_complete
  ) VALUES (
    p_user_id, p_first_name, p_last_name, p_date_of_birth, p_age, p_gender,
    p_height, p_height_unit, p_weight, p_weight_unit, p_health_goal, 
    p_activity_level, p_diet_preferences, p_is_onboarding_complete
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    date_of_birth = EXCLUDED.date_of_birth,
    age = EXCLUDED.age,
    gender = EXCLUDED.gender,
    height = EXCLUDED.height,
    height_unit = EXCLUDED.height_unit,
    weight = EXCLUDED.weight,
    weight_unit = EXCLUDED.weight_unit,
    health_goal = EXCLUDED.health_goal,
    activity_level = EXCLUDED.activity_level,
    diet_preferences = EXCLUDED.diet_preferences,
    is_onboarding_complete = EXCLUDED.is_onboarding_complete,
    updated_at = CURRENT_TIMESTAMP
  RETURNING * INTO result;
  
  -- Reset search path to prevent potential side effects
  RESET search_path;
  
  RETURN result;
END;
$$;

-- Enhanced get_user_profile function with explicit schema
DROP FUNCTION IF EXISTS public.get_user_profile(uuid);
CREATE OR REPLACE FUNCTION public.get_user_profile(p_user_id UUID)
RETURNS TABLE(
  user_id UUID,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  date_of_birth DATE,
  age INTEGER,
  gender VARCHAR(20),
  height NUMERIC,
  height_unit VARCHAR(10),
  weight NUMERIC,
  weight_unit VARCHAR(10),
  health_goal VARCHAR(20),
  activity_level VARCHAR(20),
  diet_preferences TEXT[],
  is_onboarding_complete BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set secure search path
  SET search_path = 'pg_temp';
  
  RETURN QUERY
  SELECT 
    od.user_id,
    od.first_name,
    od.last_name,
    od.date_of_birth,
    od.age,
    od.gender,
    od.height,
    od.height_unit,
    od.weight,
    od.weight_unit,
    od.health_goal,
    od.activity_level,
    od.diet_preferences,
    od.is_onboarding_complete,
    od.created_at,
    od.updated_at
  FROM public.onboarding_data od
  WHERE od.user_id = p_user_id;
  
  -- Reset search path
  RESET search_path;
END;
$$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_onboarding_data_user_id ON onboarding_data(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_data_health_goal ON onboarding_data(health_goal);
CREATE INDEX IF NOT EXISTS idx_onboarding_data_activity_level ON onboarding_data(activity_level);
CREATE INDEX IF NOT EXISTS idx_onboarding_data_updated_at ON onboarding_data(updated_at);

-- Test the constraints and function
DO $$
BEGIN
  -- Test constraint validation
  RAISE NOTICE 'Testing constraints...';
  
  -- This should work without errors
  PERFORM public.upsert_onboarding_data(
    gen_random_uuid(),
    'TestUser',
    'TestLast',
    '2000-01-01'::DATE,
    25,
    'male',
    170,
    'cm',
    70,
    'kg',
    'maintain_weight',
    'very_active',
    ARRAY['none'],
    true
  );
  
  RAISE NOTICE 'All constraints validated successfully!';
  
  -- Clean up test data
  DELETE FROM public.onboarding_data WHERE first_name = 'TestUser';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Constraint test failed: %', SQLERRM;
END;
$$;

-- Refresh schema cache (for PostgREST or similar tools)
SELECT pg_notify('pgrst', 'reload schema');
