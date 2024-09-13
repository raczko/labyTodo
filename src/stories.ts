import { supabase } from './supabaseClient';
import { Story } from './models/storiesModel';  // Importujemy model Story

// Funkcja do pobierania stories dla projektu
const loadStories = async (projectId: number) => {
  const { data: stories, error } = await supabase
    .from('stories')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching stories:', error.message);
    return;
  }

  const storiesDiv = document.getElementById('stories') as HTMLDivElement;
  storiesDiv.innerHTML = '';

  if (stories && stories.length > 0) {
    stories.forEach((story: Story) => {
      const storyElement = document.createElement('div');
      storyElement.classList.add('story');
      storyElement.innerHTML = `
        <h4>${story.name}</h4>
        <p>${story.description}</p>
        <p>Priority: ${story.priority}</p>
        <p>Status: ${story.status}</p>
        <button class="details-story" data-id="${story.id}">Details</button>
        <button class="edit-story" data-id="${story.id}">Edit</button>
        <button class="delete-story" data-id="${story.id}">Delete</button>
      `;
      storiesDiv.appendChild(storyElement);
    });

    // Dodaj obsługę edycji, usunięcia i szczegółów
    attachStoryEventListeners();
  } else {
    storiesDiv.innerHTML = '<p>No stories found for this project.</p>';
  }
};

// Funkcja do dodania nowego story
const addStory = async (projectId: number, name: string, description: string, priority: string, status: string, owner_user_id: number) => {
  const { error } = await supabase
    .from('stories')
    .insert([{ 
      name,
      description,
      priority,
      project_id: projectId,
      status,
      owner_user_id
    }]);

  if (error) {
    console.error('Error adding story:', error.message);
  } else {
    console.log('Story added successfully.');
    loadStories(projectId); // Odśwież listę stories
  }
};

// Funkcja do edycji story
const editStory = async (storyId: number, name: string, description: string, priority: string, status: string) => {
  const { error } = await supabase
    .from('stories')
    .update({ 
      name, 
      description, 
      priority, 
      status 
    })
    .eq('id', storyId);

  if (error) {
    console.error('Error editing story:', error.message);
  } else {
    console.log('Story updated successfully.');
    const projectId = Number(localStorage.getItem('selectedProjectId'));
    loadStories(projectId); // Odśwież listę stories
  }
};

// Funkcja do usunięcia story
const deleteStory = async (storyId: number) => {
  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', storyId);

  if (error) {
    console.error('Error deleting story:', error.message);
  } else {
    console.log('Story deleted successfully.');
    const projectId = Number(localStorage.getItem('selectedProjectId'));
    loadStories(projectId); // Odśwież listę stories
  }
};

// Funkcja do obsługi eventów (edycji, usunięcia i szczegółów)
const attachStoryEventListeners = () => {
  const editButtons = document.querySelectorAll('.edit-story');
  const deleteButtons = document.querySelectorAll('.delete-story');
  const detailsButtons = document.querySelectorAll('.details-story');

  // Obsługa edycji
  editButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const storyId = (event.target as HTMLElement).getAttribute('data-id');
      const storyElement = (event.target as HTMLElement).parentElement;
      const name = storyElement?.querySelector('h4')?.textContent;
      const description = storyElement?.querySelector('p')?.textContent;

      // Pytania do uzupełnienia nowych wartości
      const newName = prompt("Edit story name", name || '') || name;
      const newDescription = prompt("Edit story description", description || '') || description;
      const newPriority = prompt("Edit story priority", 'medium'); // Domyślny priorytet 'medium'
      const newStatus = prompt("Edit story status", 'todo');  // Domyślny status 'todo'

      if (storyId) {
        editStory(Number(storyId), newName || '', newDescription || '', newPriority || 'medium', newStatus || 'todo');
      }
    });
  });

  // Obsługa usunięcia
  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const storyId = (event.target as HTMLElement).getAttribute('data-id');
      if (storyId && confirm('Are you sure you want to delete this story?')) {
        deleteStory(Number(storyId));
      }
    });
  });

  // Obsługa szczegółów
  detailsButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const storyId = (event.target as HTMLElement).getAttribute('data-id');
      if (storyId) {
        // Zapisujemy ID historii w localStorage, aby przekazać je na stronę z zadaniami
        localStorage.setItem('selectedStoryId', storyId);
        // Przekierowanie na stronę z zadaniami (tasks.html)
        window.location.href = 'tasks.html';  // Upewnij się, że istnieje taka strona
      }
    });
  });
};

// Funkcja uruchamiana po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
  const projectId = localStorage.getItem('selectedProjectId');

  if (projectId !== null) { // Upewnij się, że projectId nie jest null
    loadStories(Number(projectId)); // Załaduj stories dla projektu

    // Dodanie nowego story
    const addButton = document.getElementById('addStoryButton') as HTMLButtonElement;
    if (addButton) {
      addButton.addEventListener('click', () => {
        const nameInput = (document.getElementById('storyName') as HTMLInputElement).value;
        const descriptionInput = (document.getElementById('storyDescription') as HTMLInputElement).value;
        const priorityInput = (document.getElementById('storyPriority') as HTMLSelectElement).value; // Pobieranie wartości priorytetu
        const statusInput = (document.getElementById('storyStatus') as HTMLSelectElement).value; // Pobieranie wartości statusu
        const owner_user_id = 1;  // Zakładamy ID właściciela jako 1 dla testów

        if (nameInput && descriptionInput) {
          addStory(Number(projectId), nameInput, descriptionInput, priorityInput, statusInput, owner_user_id);
        } else {
          alert('Please fill in all fields.');
        }
      });
    }
  } else {
    console.error('No project ID found in localStorage.');
    const storiesDiv = document.getElementById('stories') as HTMLDivElement;
    storiesDiv.innerHTML = '<p>No project selected.</p>';
  }
});
