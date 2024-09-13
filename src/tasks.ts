import { supabase } from './supabaseClient';  // Importujemy klienta Supabase
import { Task } from './models/taskModel';    // Importujemy model Task (możesz stworzyć go osobno)

// Funkcja do pobierania tasks dla wybranego story
const loadTasks = async (storyId: number) => {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('story_id', storyId); // Pobieranie zadań dla konkretnej historii (story)

  const tasksDiv = document.getElementById('tasks') as HTMLDivElement;
  tasksDiv.innerHTML = '';

  if (error) {
    console.error('Error fetching tasks:', error.message);
    tasksDiv.innerHTML = '<p>Error loading tasks.</p>';
    return;
  }

  if (tasks && tasks.length > 0) {
    tasks.forEach((task: Task) => {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task');
      taskElement.innerHTML = `
        <h4>${task.name}</h4>
        <p>${task.description}</p>
        <p>Priority: ${task.priority}</p>
        <p>Status: ${task.status}</p>
        <p>Expected Time: ${task.expected_time}</p>
        <p>Start Date: ${task.start_date ? task.start_date : 'Not started yet'}</p>
        <p>End Date: ${task.end_date ? task.end_date : 'Not finished yet'}</p>
      `;
      tasksDiv.appendChild(taskElement);
    });
  } else {
    tasksDiv.innerHTML = '<p>No tasks found for this story.</p>';
  }
};

// Funkcja uruchamiana po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
  const storyId = localStorage.getItem('selectedStoryId'); // Pobieramy selectedStoryId z localStorage

  if (storyId) {
    loadTasks(Number(storyId)); // Ładujemy tasks dla wybranego story
  } else {
    console.error('No story ID found in localStorage.');
    const tasksDiv = document.getElementById('tasks') as HTMLDivElement;
    tasksDiv.innerHTML = '<p>No story selected.</p>';
  }
});
