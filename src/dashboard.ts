import { supabase } from './supabaseClient';

// Funkcja do sprawdzenia i dodania projektów
const checkAndAddProjects = async () => {
  // Sprawdzenie, czy istnieją już projekty w tabeli
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*');

  if (error) {
    console.error('Error fetching projects:', error.message);
    return;
  }

  // Jeśli tabela jest pusta, dodaj trzy projekty
  if (projects.length === 0) {
    console.log('No projects found, adding sample projects...');

    const { error: insertError } = await supabase
      .from('projects')
      .insert([
        {
          name: 'Projekt Mobilna APka',
          description: 'Todos do projektu mobilnego',
        },
        {
          name: 'Projekt Webowka APka',
          description: 'Todos do projektu Webowego',
        },
        {
          name: 'Projekt Desktop APka',
          description: 'Todos do projektu Desktopowego',
        },
      ]);

    if (insertError) {
      console.error('Error inserting projects:', insertError.message);
    } else {
      console.log('Sample projects added successfully.');
    }
  } else {
    console.log('Projects already exist in the database.');
  }
};

// Funkcja do dodania nowego projektu
const addProject = async (name: string, description: string) => {
  const { error } = await supabase
    .from('projects')
    .insert([{ name, description }]);

  if (error) {
    console.error('Error adding project:', error.message);
  } else {
    console.log('Project added successfully.');
    loadProjects(); // Odśwież listę projektów
  }
};

// Funkcja do edycji projektu
const editProject = async (id: number, name: string, description: string) => {
  const { error } = await supabase
    .from('projects')
    .update({ name, description })
    .eq('id', id);

  if (error) {
    console.error('Error updating project:', error.message);
  } else {
    console.log('Project updated successfully.');
    loadProjects(); // Odśwież listę projektów
  }
};

// Funkcja do usunięcia projektu
const deleteProject = async (id: number) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error.message);
  } else {
    console.log('Project deleted successfully.');
    loadProjects(); // Odśwież listę projektów
  }
};

// Funkcja do pobierania i wyświetlania projektów
const loadProjects = async () => {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, description');

  if (error) {
    console.error('Error fetching projects:', error.message);
    return;
  }

  const projectsDiv = document.getElementById('projects') as HTMLDivElement;
  projectsDiv.innerHTML = '';

  projects.forEach((project) => {
    const projectElement = document.createElement('div');
    projectElement.classList.add('project');
    projectElement.innerHTML = `
      <h4>${project.name}</h4>
      <p>${project.description}</p>
      <button class="select-button" data-id="${project.id}">Select</button>
      <button class="edit-button" data-id="${project.id}">Edit</button>
      <button class="delete-button" data-id="${project.id}">Delete</button>
    `;
    projectsDiv.appendChild(projectElement);
  });

  // Obsługa przycisku Select
  const selectButtons = document.querySelectorAll('.select-button');
  selectButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const id = (event.target as HTMLElement).getAttribute('data-id');
      if (id) {
        // Zapisz id projektu do localStorage i przekieruj na stronę stories.html
        localStorage.setItem('selectedProjectId', id);
        window.location.href = '/stories.html';
      }
    });
  });

  // Dodanie event listenerów do przycisków edycji i usunięcia
  const editButtons = document.querySelectorAll('.edit-button');
  const deleteButtons = document.querySelectorAll('.delete-button');

  editButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const id = (event.target as HTMLElement).getAttribute('data-id');
      if (id) {
        // Pobierz dane projektu i wyświetl w formularzu edycji
        const project = projects.find(p => p.id == Number(id));
        if (project) {
          const nameInput = document.getElementById('editProjectName') as HTMLInputElement;
          const descriptionInput = document.getElementById('editProjectDescription') as HTMLInputElement;
          nameInput.value = project.name;
          descriptionInput.value = project.description;

          const saveButton = document.getElementById('saveProjectButton') as HTMLButtonElement;
          saveButton.onclick = () => editProject(Number(id), nameInput.value, descriptionInput.value);
        }
      }
    });
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const id = (event.target as HTMLElement).getAttribute('data-id');
      if (id) {
        deleteProject(Number(id));
      }
    });
  });
};

// Funkcja do obsługi wylogowania
const handleLogout = () => {
  // Usuń dane użytkownika z localStorage
  localStorage.removeItem('loggedInUser');

  // Przekieruj użytkownika na stronę logowania
  window.location.href = '/index.html';
};

// Funkcja uruchamiana po załadowaniu strony
document.addEventListener('DOMContentLoaded', async () => {
  await checkAndAddProjects();  // Sprawdzenie i dodanie projektów, jeśli ich nie ma
  loadProjects();  // Załaduj i wyświetl projekty

  // Dodaj nowy projekt po kliknięciu przycisku
  const addButton = document.getElementById('addProjectButton') as HTMLButtonElement;
  addButton.onclick = () => {
    const nameInput = document.getElementById('newProjectName') as HTMLInputElement;
    const descriptionInput = document.getElementById('newProjectDescription') as HTMLInputElement;
    addProject(nameInput.value, descriptionInput.value);
  };

  const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
});
