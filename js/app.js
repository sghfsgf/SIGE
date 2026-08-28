// ====================== NAVIGATION & UTILITAIRES ======================

// Navigation entre pages
document.querySelectorAll('.menu-item[data-page]').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const page = item.dataset.page;

    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(page + '-page')?.classList.remove('hidden');

    if (page === 'siad') loadSIAD();
    if (page === 'enseignants') loadEnseignants();
    if (page === 'categories') loadCategories();
  });
});

// Modals
function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden');
}
function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    closeModal(btn.dataset.modal);
  });
});

// Fermer modal en cliquant dehors
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
});
