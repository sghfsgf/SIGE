```javascript
// ============================================================
// SIGE - APP.JS
// Navigation + Menu mobile + Modals
// ============================================================


// ============================================================
// NAVIGATION ENTRE LES VOLETS
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("SIGE - app.js démarré");

    const menuItems =
        document.querySelectorAll(".menu-item[data-page]");

    const pages =
        document.querySelectorAll(".page-section");


    menuItems.forEach(function (item) {

        item.addEventListener("click", function (event) {

            event.preventDefault();

            const pageName =
                item.getAttribute("data-page");

            const page =
                document.getElementById(pageName + "-page");


            if (!page) {
                console.error(
                    "Page introuvable : " +
                    pageName + "-page"
                );
                return;
            }


            // ==============================
            // MENU ACTIF
            // ==============================

            menuItems.forEach(function (menu) {
                menu.classList.remove("active");
            });

            item.classList.add("active");


            // ==============================
            // CACHER TOUTES LES PAGES
            // ==============================

            pages.forEach(function (section) {
                section.classList.add("hidden");
            });


            // ==============================
            // AFFICHER LA PAGE
            // ==============================

            page.classList.remove("hidden");


            // ==============================
            // CHARGEMENT SIAD
            // ==============================

            if (pageName === "siad") {

                if (typeof loadSIAD === "function") {
                    loadSIAD();
                }

            }


            // ==============================
            // MENU MOBILE
            // ==============================

            fermerMenuMobile();

        });

    });


    // ========================================================
    // BOUTONS FERMETURE DES MODALS
    // ========================================================

    document.querySelectorAll(".close-modal")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const modalId =
                    button.getAttribute("data-modal");

                if (!modalId) return;

                const modal =
                    document.getElementById(modalId);

                if (modal) {
                    modal.classList.add("hidden");
                }

            });

        });


    // ========================================================
    // FERMER MODAL EN CLIQUANT À L'EXTÉRIEUR
    // ========================================================

    document.querySelectorAll(".modal")
        .forEach(function (modal) {

            modal.addEventListener("click", function (event) {

                if (event.target === modal) {
                    modal.classList.add("hidden");
                }

            });

        });


    // ========================================================
    // MENU MOBILE
    // ========================================================

    const menuToggle =
        document.getElementById("menu-toggle");

    const sidebar =
        document.querySelector(".sidebar");

    const overlay =
        document.getElementById("sidebar-overlay");


    if (menuToggle && sidebar && overlay) {

        menuToggle.addEventListener("click", function () {

            sidebar.classList.toggle("open");

            overlay.classList.toggle("show");

        });


        overlay.addEventListener("click", function () {

            sidebar.classList.remove("open");

            overlay.classList.remove("show");

        });

    }


    // ========================================================
    // FERMER LE MENU MOBILE
    // ========================================================

    function fermerMenuMobile() {

        if (!sidebar || !overlay) return;

        if (window.innerWidth <= 950) {

            sidebar.classList.remove("open");

            overlay.classList.remove("show");

        }

    }


    // ========================================================
    // FONCTIONS MODALS GLOBALES
    // ========================================================

    window.openModal = function (id) {

        const modal =
            document.getElementById(id);

        if (modal) {
            modal.classList.remove("hidden");
        }

    };


    window.closeModal = function (id) {

        const modal =
            document.getElementById(id);

        if (modal) {
            modal.classList.add("hidden");
        }

    };


    console.log("SIGE - Navigation prête");

});
```
