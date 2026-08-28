// ====================== AUTH TEMPORAIRE (pour tester l’interface) ======================

const loginPage = document.getElementById('login-page');
const appPage = document.getElementById('app');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');

// Afficher directement l’application (sans connexion)
loginPage.classList.add('hidden');
appPage.classList.remove('hidden');

// Simuler la déconnexion
logoutBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  loginPage.classList.remove('hidden');
  appPage.classList.add('hidden');
});

// Simuler la connexion
loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  loginPage.classList.add('hidden');
  appPage.classList.remove('hidden');
});
