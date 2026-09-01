// ============================================================
// SIGE - CONFIGURATION FIREBASE
// ============================================================

// Configuration de votre projet Firebase
// ============================================================

const firebaseConfig = {

  apiKey: "VOTRE_API_KEY",

  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",

  projectId: "VOTRE_PROJECT_ID",

  storageBucket: "VOTRE_PROJECT_ID.firebasestorage.app",

  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",

  appId: "VOTRE_APP_ID"

};


// ============================================================
// INITIALISATION FIREBASE
// ============================================================

if (!firebase.apps.length) {

  firebase.initializeApp(firebaseConfig);

}


// ============================================================
// SERVICES FIREBASE
// ============================================================

const auth = firebase.auth();

const db = firebase.firestore();


// ============================================================
// VARIABLES GLOBALES SIGE
// ============================================================

// Collections principales

const enseignantsRef = db.collection("enseignants");

const gradesRef = db.collection("grades");

const specialitesRef = db.collection("specialites");

const departementsRef = db.collection("departements");


// Paramètres

const sifahRef = db.collection("sifah");

const wadhiaRef = db.collection("wadhia");

const anneesRef = db.collection("anneesUniversitaires");

const etablissementRef = db.collection("etablissement");


// ============================================================
// VÉRIFICATION
// ============================================================

console.log("======================================");

console.log("SIGE - Firebase initialisé");

console.log("Projet Firebase :", firebaseConfig.projectId);

console.log("Firestore :", db);

console.log("Authentication :", auth);

console.log("======================================");
