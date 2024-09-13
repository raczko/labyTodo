import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://caqydmhfynawyoslvzpa.supabase.co';  
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcXlkbWhmeW5hd3lvc2x2enBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxMzQwNzAsImV4cCI6MjA0MTcxMDA3MH0.fN-opez2ZjgxeBHb1x_-E82fJuCBNH4pb7VrrIZcpC0';  

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
