import { supabase } from '../supabaseClient'; // Ścieżka do supabaseClient.ts

// Definicja użytkownika
export interface User {
  id: number;
  login: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'devops' | 'developer' | 'admin';
}

// Funkcja do tworzenia użytkownika (rejestracja)
export const createUser = async (login: string, password: string, firstName: string, lastName: string, role: 'devops' | 'developer' | 'admin') => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ login, password, first_name: firstName, last_name: lastName, role }]);

  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('User created:', data);
  }
};

// Funkcja do logowania
export const loginUser = async (login: string, password: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('login', login)
    .eq('password', password)
    .single();  // Pobierz tylko jeden rekord

  if (error) {
    console.error('Error logging in:', error.message);
    return null;
  }

  console.log('User logged in:', data);
  return data;
};