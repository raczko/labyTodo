export interface Task {
    id: number;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'doing' | 'done';
    created_at: string;
    start_date: string | null;
    end_date: string | null;
    expected_time: string;
    assigned_user_id: number;
    story_id: number;
  }