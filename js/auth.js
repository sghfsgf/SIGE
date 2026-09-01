// =========================================================
// AUTHENTIFICATION FIREBASE - SIGE
// =========================================================

// Récupération des éléments HTML
const loginPage = document.getElementById("login-page");
const appPage = document.getElementById("app");
const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");
const loginError = document.getElementById("login-error");


// =========================================================
// AFFICHER LA PAGE DE CONNEXION
// =========================================================

function afficherLogin() {

    loginPage.classList.remove("hidden");

    appPage.classList.add("hidden");

}


// =========================================================
// AFFICHER L'APPLICATION
// =========================================================

function afficherApplication() {

    loginPage.classList.add("hidden");

    appPage.classList.remove("hidden");

}


// =========================================================
// VÉRIFICATION DE L'ÉTAT DE CONNEXION
// =========================================================

auth.onAuthStateChanged(function(user) {

    if (user) {

        // =============================================
        // UTILISATEUR CONNECTÉ
        // =============================================

        console.log(
            "Utilisateur connecté :",
            user.email
        );

        afficherApplication();

    } else {

        // =============================================
        // AUCUN UTILISATEUR CONNECTÉ
        // =============================================

        console.log(
            "Aucun utilisateur connecté"
        );

        afficherLogin();

    }

});


// =========================================================
// CONNEXION
// البريد الإلكتروني + كلمة المرور
// =========================================================

loginForm.addEventListener("submit", async function(e) {

    e.preventDefault();

    const email =
        document.getElementById("login-email").value.trim();

    const password =
        document.getElementById("login-password").value;

    // Effacer l'ancien message
    loginError.textContent = "";

    try {

        // Connexion Firebase
        await auth.signInWithEmailAndPassword(
            email,
            password
        );

        console.log(
            "Connexion réussie"
        );

    } catch (error) {

        console.error(
            "Erreur de connexion Firebase :",
            error
        );

        // Messages en arabe
        switch (error.code) {

            case "auth/invalid-email":

                loginError.textContent =
                    "البريد الإلكتروني غير صالح";

                break;


            case "auth/user-not-found":

                loginError.textContent =
                    "هذا المستخدم غير موجود";

                break;


            case "auth/wrong-password":

                loginError.textContent =
                    "كلمة المرور غير صحيحة";

                break;


            case "auth/invalid-credential":

                loginError.textContent =
                    "البريد الإلكتروني أو كلمة المرور غير صحيحة";

                break;


            case "auth/too-many-requests":

                loginError.textContent =
                    "تم تجاوز عدد محاولات الدخول. حاول لاحقاً";

                break;


            default:

                loginError.textContent =
                    "تعذر تسجيل الدخول. حاول مرة أخرى";

        }

    }

});


// =========================================================
// DÉCONNEXION
// تسجيل الخروج
// =========================================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", async function(e) {

        e.preventDefault();

        try {

            await auth.signOut();

            console.log(
                "Utilisateur déconnecté"
            );

        } catch (error) {

            console.error(
                "Erreur lors de la déconnexion :",
                error
            );

        }

    });

}
