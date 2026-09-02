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

// ====================== MENU MOBILE ======================
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");
const overlay = document.getElementById("sidebar-overlay");

if (menuToggle && sidebar && overlay) {
  // Ouvrir / fermer le menu
  menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  // Fermer en cliquant sur l'overlay
  overlay.addEventListener("click", function () {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });

  // Fermer le menu quand on clique sur un item (sur mobile)
  document.querySelectorAll(".menu-item").forEach(function (item) {
    item.addEventListener("click", function () {
      if (window.innerWidth <= 950) {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
      }
    });
  });
}
