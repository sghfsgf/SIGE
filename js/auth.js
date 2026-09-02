```javascript
// ============================================================
// SIGE - AUTHENTIFICATION FIREBASE + RÔLES
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    const loginPage = document.getElementById("login-page");
    const appPage = document.getElementById("app");
    const loginForm = document.getElementById("login-form");
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");
    const loginError = document.getElementById("login-error");
    const logoutBtn = document.getElementById("logout-btn");

    console.log("SIGE - Authentification chargée");

    // ========================================================
    // ÉTAT INITIAL
    // ========================================================

    loginPage.classList.remove("hidden");
    appPage.classList.add("hidden");

    // ========================================================
    // SURVEILLER L'ÉTAT DE CONNEXION FIREBASE
    // ========================================================

    auth.onAuthStateChanged(function (user) {

        if (user) {

            console.log(
                "Utilisateur connecté :",
                user.email
            );

            loginPage.classList.add("hidden");
            appPage.classList.remove("hidden");

            // ==================================================
            // DÉTERMINER LE RÔLE SELON L'EMAIL
            // ==================================================

            const email =
                (user.email || "")
                    .toLowerCase()
                    .trim();

            if (email === "fsgf@fsgf.tn") {

                window.currentUserRole = "admin";

            }
            else if (email === "dep@dep.tn") {

                window.currentUserRole = "saisie";

            }
            else {

                window.currentUserRole = "saisie";

            }

            console.log(
                "Rôle détecté :",
                window.currentUserRole
            );

            // ==================================================
            // APPLIQUER LES PERMISSIONS
            // ==================================================

            appliquerPermissions();

        }
        else {

            console.log(
                "Aucun utilisateur connecté"
            );

            loginPage.classList.remove("hidden");
            appPage.classList.add("hidden");

            window.currentUserRole = null;

            // Cacher SIAD lorsque personne n'est connecté
            appliquerPermissions();

        }

    });

    // ========================================================
    // CONNEXION
    // ========================================================

    loginForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            console.log(
                "Tentative de connexion..."
            );

            const email =
                loginEmail.value.trim();

            const password =
                loginPassword.value;

            loginError.textContent = "";

            if (!email || !password) {

                loginError.textContent =
                    "يرجى إدخال البريد الإلكتروني وكلمة المرور";

                return;

            }

            const submitBtn =
                loginForm.querySelector(
                    "button[type='submit']"
                );

            if (submitBtn) {

                submitBtn.disabled = true;

                submitBtn.textContent =
                    "جاري تسجيل الدخول...";

            }

            auth.signInWithEmailAndPassword(
                email,
                password
            )
            .then(function (userCredential) {

                console.log(
                    "Connexion réussie :",
                    userCredential.user.email
                );

                loginError.textContent = "";

            })
            .catch(function (error) {

                console.error(
                    "Erreur Firebase :",
                    error
                );

                let message =
                    "حدث خطأ أثناء تسجيل الدخول";

                switch (error.code) {

                    case "auth/invalid-email":

                        message =
                            "البريد الإلكتروني غير صالح";

                        break;

                    case "auth/user-not-found":

                        message =
                            "المستخدم غير موجود";

                        break;

                    case "auth/wrong-password":

                        message =
                            "كلمة المرور غير صحيحة";

                        break;

                    case "auth/invalid-credential":

                        message =
                            "البريد الإلكتروني أو كلمة المرور غير صحيحة";

                        break;

                    case "auth/user-disabled":

                        message =
                            "تم تعطيل هذا المستخدم";

                        break;

                    case "auth/api-key-not-valid":

                        message =
                            "مفتاح Firebase API غير صالح";

                        break;

                    case "auth/network-request-failed":

                        message =
                            "فشل الاتصال بالإنترنت";

                        break;

                    default:

                        message =
                            "حدث خطأ أثناء تسجيل الدخول: " +
                            error.message;

                }

                loginError.textContent =
                    message;

            })
            .finally(function () {

                if (submitBtn) {

                    submitBtn.disabled = false;

                    submitBtn.textContent =
                        "تسجيل الدخول";

                }

            });

        }
    );

    // ========================================================
    // DÉCONNEXION
    // ========================================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (e) {

                e.preventDefault();

                auth.signOut()
                    .then(function () {

                        console.log(
                            "Utilisateur déconnecté"
                        );

                    })
                    .catch(function (error) {

                        console.error(
                            "Erreur de déconnexion :",
                            error
                        );

                    });

            }
        );

    }

});

// ============================================================
// PERMISSIONS SELON LE RÔLE
// ============================================================

function appliquerPermissions() {

    const role =
        window.currentUserRole || "saisie";

    console.log(
        "Application des permissions pour le rôle :",
        role
    );

    // ========================================================
    // MENUS
    // ========================================================

    const menuCategories =
        document.querySelector(
            '.menu-item[data-page="categories"]'
        );

    const menuSIAD =
        document.getElementById(
            "menu-siad"
        );

    const menuParametres =
        document.querySelector(
            '.menu-item[data-page="parametres"]'
        );

    const menuUsers =
        document.getElementById(
            "menu-users"
        );

    // ========================================================
    // CATÉGORIES
    // ========================================================

    if (menuCategories) {

        menuCategories.style.display =
            (role === "admin")
                ? "block"
                : "none";

    }

    // ========================================================
    // SIAD
    // ADMIN SEULEMENT
    // ========================================================

    if (menuSIAD) {

        menuSIAD.style.display =
            (role === "admin")
                ? "block"
                : "none";

    }

    // ========================================================
    // PARAMÈTRES
    // ========================================================

    if (menuParametres) {

        menuParametres.style.display =
            (role === "admin")
                ? "block"
                : "none";

    }

    // ========================================================
    // UTILISATEURS
    // ========================================================

    if (menuUsers) {

        menuUsers.style.display =
            "none";

    }

    // ========================================================
    // PAGE SIAD
    // ADMIN SEULEMENT
    // ========================================================

    const pageSIAD =
        document.getElementById(
            "siad-page"
        );

    if (pageSIAD) {

        if (role === "admin") {

            // La page peut être affichée
            // lorsque app.js la sélectionne

            pageSIAD.dataset.access =
                "allowed";

        }
        else {

            // Empêcher l'affichage
            pageSIAD.dataset.access =
                "denied";

            pageSIAD.classList.add(
                "hidden"
            );

        }

    }

    // ========================================================
    // BOUTON EXPORT SIAD
    // ADMIN SEULEMENT
    // ========================================================

    const btnExportSIAD =
        document.getElementById(
            "btn-export-siad"
        );

    if (btnExportSIAD) {

        btnExportSIAD.style.display =
            (role === "admin")
                ? ""
                : "none";

    }

    // ========================================================
    // BOUTONS ADMIN
    // ========================================================

    const boutonsAdmin = [

        "btn-add-grade",
        "btn-add-specialite",
        "btn-add-departement",
        "btn-add-sifah",
        "btn-add-wadhia",
        "btn-add-annee"

    ];

    boutonsAdmin.forEach(
        function (id) {

            const el =
                document.getElementById(id);

            if (el) {

                el.style.display =
                    (role === "admin")
                        ? ""
                        : "none";

            }

        }
    );

    // ========================================================
    // AJOUTER ENSEIGNANT
    // LES DEUX RÔLES PEUVENT
    // ========================================================

    const btnAddEnseignant =
        document.getElementById(
            "btn-add-enseignant"
        );

    if (btnAddEnseignant) {

        btnAddEnseignant.style.display =
            "";

    }

}

// ============================================================
// VÉRIFICATION D'ACCÈS SIAD
// ============================================================

function verifierAccesSIAD() {

    return (
        window.currentUserRole ===
        "admin"
    );

}
```
