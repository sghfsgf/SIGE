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
// VÉRIFICATION DES ÉLÉMENTS
// ============================================================

if (!loginPage) {
    console.error("Erreur : #login-page introuvable");
}

if (!appPage) {
    console.error("Erreur : #app introuvable");
}

if (!loginForm) {
    console.error("Erreur : #login-form introuvable");
}


// ============================================================
// AFFICHAGE LOGIN
// ============================================================

function afficherLogin() {

    loginPage.classList.remove("hidden");

    appPage.classList.add("hidden");

}


// ============================================================
// AFFICHAGE APPLICATION
// ============================================================

function afficherApplication() {

    loginPage.classList.add("hidden");

    appPage.classList.remove("hidden");

}


// ============================================================
// MESSAGE D'ERREUR
// ============================================================

function afficherErreur(message) {

    if (loginError) {
        loginError.textContent = message;
    }

}


// ============================================================
// NETTOYER ERREUR
// ============================================================

function nettoyerErreur() {

    if (loginError) {
        loginError.textContent = "";
    }

}


// ============================================================
// VÉRIFICATION DE LA SESSION FIREBASE
// ============================================================

auth.onAuthStateChanged((user) => {

    if (user) {

        console.log("Utilisateur connecté :", user.email);

        afficherApplication();

    } else {

        console.log("Aucun utilisateur connecté");

        afficherLogin();

    }

});


// ============================================================
// CONNEXION
// ============================================================

loginForm?.addEventListener("submit", async (e) => {

    e.preventDefault();

    nettoyerErreur();


    const email = loginEmail.value.trim();

    const password = loginPassword.value;


    if (!email || !password) {

        afficherErreur(
            "يرجى إدخال البريد الإلكتروني وكلمة المرور"
        );

        return;
    }


    // Désactiver le bouton pendant la connexion

    const bouton = loginForm.querySelector(
        'button[type="submit"]'
    );

    if (bouton) {
        bouton.disabled = true;
        bouton.textContent = "جاري تسجيل الدخول...";
    }


    try {

        await auth.signInWithEmailAndPassword(
            email,
            password
        );

        console.log(
            "Connexion Firebase réussie"
        );


    } catch (error) {

        console.error(
            "Erreur Firebase Authentication :",
            error
        );


        switch (error.code) {

            case "auth/invalid-email":

                afficherErreur(
                    "البريد الإلكتروني غير صالح"
                );

                break;


            case "auth/user-not-found":

                afficherErreur(
                    "البريد الإلكتروني غير موجود"
                );

                break;


            case "auth/wrong-password":

                afficherErreur(
                    "كلمة المرور غير صحيحة"
                );

                break;


            case "auth/invalid-credential":

                afficherErreur(
                    "البريد الإلكتروني أو كلمة المرور غير صحيحة"
                );

                break;


            case "auth/too-many-requests":

                afficherErreur(
                    "تم تعطيل تسجيل الدخول مؤقتًا بسبب كثرة المحاولات"
                );

                break;


            default:

                afficherErreur(
                    "حدث خطأ أثناء تسجيل الدخول"
                );

                break;
        }

    } finally {

        if (bouton) {

            bouton.disabled = false;

            bouton.textContent = "تسجيل الدخول";

        }

    }

});


// ============================================================
// DÉCONNEXION
// ============================================================

logoutBtn?.addEventListener("click", async (e) => {

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
