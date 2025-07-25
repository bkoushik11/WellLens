import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

// Sign up: hash password and store email + hash
export async function signUpWithEmail(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  const { data, error } = await supabase
    .from('account_credentials')
    .insert({ email, password_hash: passwordHash })
    .single();
  if (error) throw error;
  return data;
}

// Login: fetch hash by email and compare
export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase
    .from('account_credentials')
    .select('password_hash')
    .eq('email', email)
    .single();
  if (error || !data) throw new Error('Invalid email or password');
  const isValid = await bcrypt.compare(password, data.password_hash);
  if (!isValid) throw new Error('Invalid email or password');
  return true;
} 