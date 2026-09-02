```javascript
// ====================== NAVIGATION & UTILITAIRES ======================

// Navigation entre pages
document.querySelectorAll('.menu-item[data-page]').forEach(item => {

    item.addEventListener('click', (e) => {

        e.preventDefault();

        const page = item.dataset.page;

        // Menu actif
        document.querySelectorAll('.menu-item').forEach(i => {
            i.classList.remove('active');
        });

        item.classList.add('active');

        // Cacher toutes les pages
        document.querySelectorAll('.page-section').forEach(s => {
            s.classList.add('hidden');
        });

        // Afficher la page demandée
        const pageElement = document.getElementById(page + '-page');

        if (pageElement) {
            pageElement.classList.remove('hidden');
        }

        // ============================
        // CHARGEMENT DES PAGES
        // ============================

        if (page === 'siad') {

            if (typeof loadSIAD === 'function') {
                loadSIAD();
            }

        }

        if (page === 'enseignants') {

            // Ton enseignants.js actuel utilise
            // chargerEnseignants() et non loadEnseignants()

            if (typeof chargerEnseignants === 'function') {
                // Les données sont déjà surveillées par onSnapshot.
                // On ne relance pas le listener inutilement.
                appliquerFiltres();
            }

        }

        if (page === 'categories') {

            if (typeof loadCategories === 'function') {
                loadCategories();
            }

        }

    });

});


// ====================== MODALS ======================

function openModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove('hidden');
    }

}


function closeModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.add('hidden');
    }

}


// ====================== FERMETURE DES MODALS ======================

document.querySelectorAll('.close-modal').forEach(btn => {

    btn.addEventListener('click', () => {

        closeModal(btn.dataset.modal);

    });

});


// ====================== FERMER MODAL EN CLIQUANT DEHORS ======================

document.querySelectorAll('.modal').forEach(modal => {

    modal.addEventListener('click', (e) => {

        if (e.target === modal) {

            modal.classList.add('hidden');

        }

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


    // Fermer avec l'overlay
    overlay.addEventListener("click", function () {

        sidebar.classList.remove("open");
        overlay.classList.remove("show");

    });


    // Fermer le menu après sélection
    document.querySelectorAll(".menu-item").forEach(function (item) {

        item.addEventListener("click", function () {

            if (window.innerWidth <= 950) {

                sidebar.classList.remove("open");
                overlay.classList.remove("show");

            }

        });

    });

}


console.log("SIGE - app.js chargé correctement");
```
