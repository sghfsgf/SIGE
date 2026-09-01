// ============================================================
// SIGE - AUTHENTIFICATION FIREBASE
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    const loginPage = document.getElementById("login-page");
    const appPage = document.getElementById("app");
    const loginForm = document.getElementById("login-form");
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");
    const loginError = document.getElementById("login-error");
    const logoutBtn = document.getElementById("logout-btn");


    // ========================================================
    // VÉRIFICATION DES ÉLÉMENTS HTML
    // ========================================================

    console.log("SIGE - Authentification chargée");

    console.log("loginPage :", loginPage);
    console.log("appPage :", appPage);
    console.log("loginForm :", loginForm);
    console.log("auth :", auth);


    // ========================================================
    // ÉTAT INITIAL
    // ========================================================

    // Par défaut :
    // afficher la page de connexion
    // cacher l'application

    loginPage.classList.remove("hidden");
    appPage.classList.add("hidden");


    // ========================================================
    // SURVEILLER L'ÉTAT DE CONNEXION FIREBASE
    // ========================================================

    auth.onAuthStateChanged(function (user) {

        if (user) {

            console.log("Utilisateur connecté :", user.email);

            // Utilisateur connecté
            loginPage.classList.add("hidden");
            appPage.classList.remove("hidden");

        } else {

            console.log("Aucun utilisateur connecté");

            // Aucun utilisateur connecté
            loginPage.classList.remove("hidden");
            appPage.classList.add("hidden");
        }

    });


    // ========================================================
    // CONNEXION
    // ========================================================

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        console.log("Tentative de connexion...");

        const email = loginEmail.value.trim();
        const password = loginPassword.value;

        // Effacer ancien message
        loginError.textContent = "";

        // Vérification
        if (!email || !password) {

            loginError.textContent =
                "يرجى إدخال البريد الإلكتروني وكلمة المرور";

            return;
        }


        // Désactiver le bouton pendant la connexion
        const submitBtn = loginForm.querySelector("button[type='submit']");

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "جاري تسجيل الدخول...";
        }


        // ====================================================
        // FIREBASE AUTH
        // ====================================================

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

                let message = "حدث خطأ أثناء تسجيل الدخول";


                // Messages Firebase
                switch (error.code) {

                    case "auth/invalid-email":
                        message = "البريد الإلكتروني غير صالح";
                        break;

                    case "auth/user-not-found":
                        message = "المستخدم غير موجود";
                        break;

                    case "auth/wrong-password":
                        message = "كلمة المرور غير صحيحة";
                        break;

                    case "auth/invalid-credential":
                        message = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
                        break;

                    case "auth/user-disabled":
                        message = "تم تعطيل هذا المستخدم";
                        break;

                    case "auth/api-key-not-valid":
                        message = "مفتاح Firebase API غير صالح";
                        break;

                    case "auth/network-request-failed":
                        message = "فشل الاتصال بالإنترنت";
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
