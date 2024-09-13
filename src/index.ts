import { createUser, loginUser } from './models/userModel';

// Dane mokowanego użytkownika
const mockUser = {
  login: 'Wiktor_R',
  password: 'haslo123',
  firstName: 'Wiktor',
  lastName: 'Rogoz',
  role: 'admin' as 'admin',
};

// Funkcja sprawdzająca, czy mokowany użytkownik istnieje
const checkAndCreateMockUser = async () => {
  const user = await loginUser(mockUser.login, mockUser.password);
  if (!user) {
    console.log('Mock user not found, creating Wiktor_R...');
    await createUser(
      mockUser.login,
      mockUser.password,
      mockUser.firstName,
      mockUser.lastName,
      mockUser.role
    );
    console.log('Mock user Wiktor_R created.');
  } else {
    console.log('Mock user Wiktor_R already exists.');
  }
};

// Funkcja obsługi logowania
const handleLogin = async (event: Event) => {
  event.preventDefault();

  const loginInput = document.getElementById('login') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const login = loginInput.value;
  const password = passwordInput.value;

  const user = await loginUser(login, password); // Sprawdzenie, czy użytkownik istnieje
  const messageDiv = document.getElementById('message') as HTMLDivElement;

  if (user) {
    // Zapisz informację o użytkowniku w localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    // Przekieruj użytkownika do panelu
    window.location.href = '/dashboard.html';
  } else {
    messageDiv.textContent = 'Invalid login or password.';
  }
};

// Funkcja obsługi rejestracji
const handleRegister = async (event: Event) => {
  event.preventDefault();

  const loginInput = document.getElementById('registerLogin') as HTMLInputElement;
  const passwordInput = document.getElementById('registerPassword') as HTMLInputElement;
  const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
  const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
  const roleInput = document.getElementById('role') as HTMLSelectElement;

  const login = loginInput.value;
  const password = passwordInput.value;
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const role = roleInput.value as 'developer' | 'devops' | 'admin';

  const messageDiv = document.getElementById('message') as HTMLDivElement;

  // Stwórz użytkownika w bazie danych
  await createUser(login, password, firstName, lastName, role);

  // Po rejestracji wyświetl komunikat i wyczyść formularz
  messageDiv.textContent = 'User registered successfully. You can now log in.';
  loginInput.value = '';
  passwordInput.value = '';
  firstNameInput.value = '';
  lastNameInput.value = '';
};

// Dodanie event listenerów dla logowania i rejestracji
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm') as HTMLFormElement;
  loginForm.addEventListener('submit', handleLogin);

  const registerForm = document.getElementById('registerForm') as HTMLFormElement;
  registerForm.addEventListener('submit', handleRegister);

  // Sprawdź i stwórz mokowanego użytkownika przy starcie aplikacji
  checkAndCreateMockUser();
});
