
Voici votre `auth.js` corrigé et prêt à remplacer entièrement l'ancien :

:::writing{variant="standard" id="58321"}
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
    // VÉRIFICATION DES ÉLÉMENTS HTML
    // ========================================================

    if (!loginPage || !appPage) {
        console.error("Erreur : #login-page ou #app introuvable.");
        return;
    }

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

            console.log("Utilisateur connecté :", user.email);

            loginPage.classList.add("hidden");
            appPage.classList.remove("hidden");

            // ==================================================
            // DÉTERMINER LE RÔLE SELON L'EMAIL
            // ==================================================

            const email = (user.email || "").toLowerCase().trim();

            if (email === "fsgf@fsgf.tn") {

                window.currentUserRole = "admin";

            } else if (email === "dep@dep.tn") {

                window.currentUserRole = "saisie";

            } else {

                // Par défaut
                window.currentUserRole = "saisie";
            }

            console.log(
                "Utilisateur :",
                email,
                "| Rôle :",
                window.currentUserRole
            );

            // ==================================================
            // APPLIQUER LES PERMISSIONS
            // ==================================================

            appliquerPermissions();

        } else {

            console.log("Aucun utilisateur connecté");

            loginPage.classList.remove("hidden");
            appPage.classList.add("hidden");

            window.currentUserRole = null;
        }
    });

    // ========================================================
    // CONNEXION
    // ========================================================

    if (loginForm) {

        loginForm.addEventListener("submit", function (e) {

            e.preventDefault();

            console.log("Tentative de connexion...");

            const email = loginEmail.value.trim();
            const password = loginPassword.value;

            loginError.textContent = "";

            if (!email || !password) {

                loginError.textContent =
                    "يرجى إدخال البريد الإلكتروني وكلمة المرور";

                return;
            }

            const submitBtn =
                loginForm.querySelector("button[type='submit']");

            if (submitBtn) {

                submitBtn.disabled = true;
                submitBtn.textContent = "جاري تسجيل الدخول...";
            }

            auth.signInWithEmailAndPassword(email, password)

                .then(function (userCredential) {

                    console.log(
                        "Connexion réussie :",
                        userCredential.user.email
                    );

                    loginError.textContent = "";
                })

                .catch(function (error) {

                    console.error("Erreur Firebase :", error);

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

                    loginError.textContent = message;
                })

                .finally(function () {

                    if (submitBtn) {

                        submitBtn.disabled = false;
                        submitBtn.textContent = "تسجيل الدخول";
                    }
                });
        });
    }

    // ========================================================
    // DÉCONNEXION
    // ========================================================

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function (e) {

            e.preventDefault();

            auth.signOut()

                .then(function () {

                    console.log("Utilisateur déconnecté");
                })

                .catch(function (error) {

                    console.error(
                        "Erreur de déconnexion :",
                        error
                    );
                });
        });
    }
});


// ============================================================
// PERMISSIONS SELON LE RÔLE
// ============================================================

function appliquerPermissions() {

    const role = window.currentUserRole || "saisie";

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
        document.querySelector(
            '.menu-item[data-page="siad"]'
        );

    const menuParametres =
        document.querySelector(
            '.menu-item[data-page="parametres"]'
        );

    const menuUsers =
        document.getElementById("menu-users");


    // ========================================================
    // CATÉGORIES → ADMIN SEULEMENT
    // ========================================================

    if (menuCategories) {

        menuCategories.style.display =
            (role === "admin") ? "block" : "none";
    }


    // ========================================================
    // SIAD → ADMIN SEULEMENT
    // ========================================================

    if (menuSIAD) {

        menuSIAD.style.display =
            (role === "admin") ? "block" : "none";
    }


    // ========================================================
    // PARAMÈTRES → ADMIN SEULEMENT
    // ========================================================

    if (menuParametres) {

        menuParametres.style.display =
            (role === "admin") ? "block" : "none";
    }


    // ========================================================
    // UTILISATEURS
    // ========================================================

    if (menuUsers) {

        menuUsers.style.display = "none";
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


    boutonsAdmin.forEach(function (id) {

        const el = document.getElementById(id);

        if (el) {

            el.style.display =
                (role === "admin") ? "" : "none";
        }
    });


    // ========================================================
    // AJOUTER ENSEIGNANT
    // ADMIN + SAISIE
    // ========================================================

    const btnAddEnseignant =
        document.getElementById("btn-add-enseignant");

    if (btnAddEnseignant) {

        btnAddEnseignant.style.display = "";
    }


    // ========================================================
    // FIN
    // ========================================================

    console.log(
        "Permissions appliquées avec succès pour :",
        role
    );
}
