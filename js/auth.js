// ====================== AUTHENTIFICATION ======================

const loginPage = document.getElementById('login-page');
const appPage = document.getElementById('app');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// Vérifier l'état de connexion
auth.onAuthStateChanged(user => {
  if (user) {
    loginPage.classList.add('hidden');
    appPage.classList.remove('hidden');
    // Charger les données initiales
    if (typeof loadEnseignants === 'function') loadEnseignants();
    if (typeof loadCategories === 'function') loadCategories();
  } else {
    loginPage.classList.remove('hidden');
    appPage.classList.add('hidden');
  }
});

// Connexion
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    loginError.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
  }
});

// Déconnexion
logoutBtn?.addEventListener('click', async (e) => {
  e.preventDefault();
  await auth.signOut();
});
