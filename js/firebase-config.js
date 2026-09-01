// ============================================================
// SIGE - CONFIGURATION FIREBASE
// ============================================================


// ============================================================
// CONFIGURATION DU PROJET FIREBASE
// ============================================================

const firebaseConfig = {

  apiKey: "AIzaSyAlz1RpBJJFWHvjlaTODxF1YX5Jnyfz60",

  authDomain: "sige-fsgf.firebaseapp.com",

  projectId: "sige-fsgf",

  storageBucket: "sige-fsgf.firebasestorage.app",

  messagingSenderId: "952214498038",

  appId: "1:952214498038:web:2850b4f103530dd70e5ad7"

};


// ============================================================
// INITIALISATION FIREBASE
// ============================================================

if (!firebase.apps.length) {

  firebase.initializeApp(firebaseConfig);

}


// ============================================================
// FIREBASE AUTHENTICATION
// ============================================================

const auth = firebase.auth();


// ============================================================
// FIRESTORE
// ============================================================

const db = firebase.firestore();


// ============================================================
// COLLECTION : ENSEIGNANTS
// ============================================================

const enseignantsRef =
  db.collection("enseignants");


// ============================================================
// COLLECTIONS : CATEGORIES
// ============================================================

const gradesRef =
  db.collection("grades");

const specialitesRef =
  db.collection("specialites");

const departementsRef =
  db.collection("departements");


// ============================================================
// COLLECTIONS : PARAMETRES
// ============================================================

const sifahRef =
  db.collection("sifah");

const wadhiaRef =
  db.collection("wadhia");

const anneesRef =
  db.collection("anneesUniversitaires");

const etablissementRef =
  db.collection("etablissement");


// ============================================================
// INFORMATIONS DE CONTROLE
// ============================================================

console.log("======================================");

console.log("SIGE - Firebase initialisé");

console.log(
  "Projet Firebase :",
  firebaseConfig.projectId
);

console.log(
  "Authentication :",
  auth
);

console.log(
  "Firestore :",
  db
);

console.log("======================================");
