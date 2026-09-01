```javascript
console.log("AUTH.JS CHARGÉ !");

const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

console.log("loginForm =", loginForm);
console.log("loginError =", loginError);

if (loginForm) {

    loginForm.addEventListener("submit", function(e) {

        e.preventDefault();

        console.log("BOUTON LOGIN CLIQUÉ !");

        loginError.textContent = "TEST : le bouton fonctionne !";

    });

} else {

    console.error("ERREUR : login-form introuvable !");

}
```
