// src/models/storiesModel.ts

export interface Story {
  id: number;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  project_id: number; // Id projektu
  status: 'todo' | 'doing' | 'done';
  created_at: string;  // Data utworzenia
  owner_user_id: number; // Id właściciela użytkownika
}
