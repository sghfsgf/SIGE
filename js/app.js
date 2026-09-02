```javascript
// ============================================================
// SIGE - NAVIGATION & UTILITAIRES
// ============================================================

// ============================================================
// NAVIGATION ENTRE LES PAGES
// ============================================================

document.querySelectorAll('.menu-item[data-page]').forEach(function (item) {

    item.addEventListener('click', function (e) {

        e.preventDefault();

        const page = item.dataset.page;

        // ----------------------------------------------------
        // Menu actif
        // ----------------------------------------------------

        document.querySelectorAll('.menu-item').forEach(function (i) {
            i.classList.remove('active');
        });

        item.classList.add('active');

        // ----------------------------------------------------
        // Cacher toutes les pages
        // ----------------------------------------------------

        document.querySelectorAll('.page-section').forEach(function (section) {
            section.classList.add('hidden');
        });

        // ----------------------------------------------------
        // Afficher la page demandée
        // ----------------------------------------------------

        const pageElement =
            document.getElementById(page + '-page');

        if (pageElement) {
            pageElement.classList.remove('hidden');
        }

        // ----------------------------------------------------
        // Actions selon la page
        // ----------------------------------------------------

        if (page === 'siad') {

            // Le SIAD utilise enseignantsData
            if (typeof loadSIAD === 'function') {
                loadSIAD();
            }

        }

        if (page === 'categories') {

            if (typeof loadCategories === 'function') {
                loadCategories();
            }

        }

        // IMPORTANT :
        // Ne pas appeler loadEnseignants()
        // car enseignants.js utilise chargerEnseignants()
        //
        // Les enseignants sont déjà chargés par :
        // initialiserEnseignants() -> chargerEnseignants()

    });
});


// ============================================================
// MODALS
// ============================================================

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


// ============================================================
// FERMETURE DES MODALS
// ============================================================

document.querySelectorAll('.close-modal').forEach(function (btn) {

    btn.addEventListener('click', function () {

        closeModal(btn.dataset.modal);

    });

});


// ============================================================
// FERMER UN MODAL EN CLIQUANT À L'EXTÉRIEUR
// ============================================================

document.querySelectorAll('.modal').forEach(function (modal) {

    modal.addEventListener('click', function (e) {

        if (e.target === modal) {

            modal.classList.add('hidden');

        }

    });

});


// ============================================================
// MENU MOBILE
// ============================================================

const menuToggle =
    document.getElementById("menu-toggle");

const sidebar =
    document.querySelector(".sidebar");

const overlay =
    document.getElementById("sidebar-overlay");


if (menuToggle && sidebar && overlay) {

    // --------------------------------------------------------
    // Ouvrir / fermer le menu
    // --------------------------------------------------------

    menuToggle.addEventListener("click", function () {

        sidebar.classList.toggle("open");

        overlay.classList.toggle("show");

    });


    // --------------------------------------------------------
    // Fermer avec l'overlay
    // --------------------------------------------------------

    overlay.addEventListener("click", function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("show");

    });


    // --------------------------------------------------------
    // Fermer le menu après sélection
    // --------------------------------------------------------

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
