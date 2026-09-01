// ============================================================
// SIGE - AUTHENTIFICATION FIREBASE
// ============================================================


// ============================================================
// ÉLÉMENTS HTML
// ============================================================

const loginPage = document.getElementById("login-page");
const appPage = document.getElementById("app");

const loginForm = document.getElementById("login-form");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

const loginError = document.getElementById("login-error");

const logoutBtn = document.getElementById("logout-btn");


// ============================================================
// VÉRIFICATION
// ============================================================

console.log("SIGE - auth.js chargé");


// ============================================================
// ÉTAT D'AUTHENTIFICATION
// ============================================================

auth.onAuthStateChanged((user) => {

    console.log("État utilisateur :", user);


    if (user) {

        // ================================================
        // UTILISATEUR CONNECTÉ
        // ================================================

        console.log("Utilisateur connecté :", user.email);

        loginPage.classList.add("hidden");

        appPage.classList.remove("hidden");

    } else {

        // ================================================
        // UTILISATEUR NON CONNECTÉ
        // ================================================

        console.log("Aucun utilisateur connecté");

        loginPage.classList.remove("hidden");

        appPage.classList.add("hidden");
    }

});


// ============================================================
// CONNEXION
// ============================================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    console.log("Tentative de connexion...");


    const email = loginEmail.value.trim();

    const password = loginPassword.value;


    // Effacer ancien message
    loginError.textContent = "";


    if (!email || !password) {

        loginError.textContent =
            "يرجى إدخال البريد الإلكتروني وكلمة المرور";

        return;
    }


    try {

        console.log("Connexion Firebase :", email);


        const result =
            await auth.signInWithEmailAndPassword(
                email,
                password
            );


        console.log(
            "Connexion réussie :",
            result.user.email
        );


    } catch (error) {

        console.error(
            "Erreur Firebase :",
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


            case "auth/user-disabled":

                loginError.textContent =
                    "تم تعطيل هذا الحساب";

                break;


            case "auth/too-many-requests":

                loginError.textContent =
                    "تم إجراء عدد كبير من المحاولات. حاول لاحقاً";

                break;


            default:

                loginError.textContent =
                    "حدث خطأ أثناء تسجيل الدخول: " +
                    error.message;

                break;
        }

    }

});


// ============================================================
// DÉCONNEXION
// ============================================================

logoutBtn?.addEventListener("click", async (e) => {

    e.preventDefault();

    console.log("Déconnexion...");


    try {

        await auth.signOut();

        console.log("Déconnexion réussie");

    } catch (error) {

        console.error(
            "Erreur de déconnexion :",
            error
        );

    }

});
