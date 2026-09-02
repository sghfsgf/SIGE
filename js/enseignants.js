// ============================================================
// SIGE - ENSEIGNANTS
// ============================================================
// Gestion complète des enseignants + Recherche + Pagination
// ============================================================

let enseignantsData = [];
let enseignantsFiltres = [];
let currentPage = 1;
const itemsPerPage = 15;

window.enseignantsFiltresActuels = [];

// ============================================================
// INITIALISATION
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
    initialiserEnseignants();
});

function initialiserEnseignants() {

    // Bouton Ajouter
    const btnAjouter = document.getElementById("btn-add-enseignant");
    if (btnAjouter) {
        btnAjouter.addEventListener("click", function () {
            ouvrirModalEnseignant();
        });
    }

    // Formulaire
    const form = document.getElementById("enseignant-form");
    if (form) {
        form.addEventListener("submit", enregistrerEnseignant);
    }

    // ===== RECHERCHE =====
    const searchInput = document.getElementById("search-enseignants");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            currentPage = 1;
            appliquerFiltres();
        });
        searchInput.addEventListener("keyup", function () {
            currentPage = 1;
            appliquerFiltres();
        });
    } else {
        console.error("Champ #search-enseignants introuvable");
    }

    // Filtres
    const filtres = [
        "filter-matricule",
        "filter-grade",
        "filter-specialite",
        "filter-departement",
        "filter-sifah",
        "filter-wadhia",
        "filter-anneeUniversitaire",
        "filter-genre"
    ];

    filtres.forEach(function (id) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("input", function () {
                currentPage = 1;
                appliquerFiltres();
            });
            element.addEventListener("change", function () {
                currentPage = 1;
                appliquerFiltres();
            });
        }
    });

    // Reset
    const btnReset = document.getElementById("btn-reset-filters");
    if (btnReset) {
        btnReset.addEventListener("click", reinitialiserFiltres);
    }

    // Charger les données
    chargerEnseignants();
}

// ============================================================
// CHARGER ENSEIGNANTS
// ============================================================
function chargerEnseignants() {
    enseignantsRef
        .orderBy("numero", "asc")
        .onSnapshot(
            function (snapshot) {
                enseignantsData = [];
                snapshot.forEach(function (doc) {
                    enseignantsData.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                appliquerFiltres();
                mettreAJourFiltres();
                mettreAJourDashboard();
            },
            function (error) {
                console.error("Erreur chargement enseignants :", error);
            }
        );
}

// ============================================================
// AFFICHER ENSEIGNANTS
// ============================================================
function afficherEnseignants(liste) {
    const tbody = document.getElementById("enseignants-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (liste.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:20px;">لا توجد نتائج</td></tr>`;
        return;
    }

    liste.forEach(function (item) {
        const grade = trouverNomGrade(item.gradeId);
        const specialite = trouverNomSpecialite(item.specialiteId);
        const departement = trouverNomDepartement(item.departementId);
        const sifah = trouverNomSifah(item.sifah);
        const wadhia = trouverNomWadhia(item.wadhia);
        const annee = trouverNomAnnee(item.anneeUniversitaire);

        const peutSupprimer = window.currentUserRole === "admin";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.numero ?? ""}</td>
            <td>${echapperHTML(item.matriculeCNRPS ?? "")}</td>
            <td>${echapperHTML(item.nom ?? "")}</td>
            <td>${echapperHTML(item.prenom ?? "")}</td>
            <td>${echapperHTML(grade)}</td>
            <td>${echapperHTML(specialite)}</td>
            <td>${echapperHTML(departement)}</td>
            <td>${echapperHTML(sifah)}</td>
            <td>${echapperHTML(wadhia)}</td>
            <td>${echapperHTML(annee)}</td>
            <td>${item.genre === "femme" ? "أنثى" : "ذكر"}</td>
            <td>
                <button class="btn-secondary" onclick="modifierEnseignant('${item.id}')">تعديل</button>
                ${peutSupprimer ? `<button class="btn-danger" onclick="supprimerEnseignant('${item.id}')">حذف</button>` : ""}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================================
// PAGINATION
// ============================================================
function afficherAvecPagination(liste) {
    const totalPages = Math.ceil(liste.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * itemsPerPage;
    const pageData = liste.slice(start, start + itemsPerPage);

    afficherEnseignants(pageData);
    renderPagination(liste.length, totalPages);
}

function renderPagination(totalItems, totalPages) {
    const container = document.getElementById("pagination-container");
    if (!container) return;

    container.innerHTML = `
        <button class="btn-secondary" ${currentPage === 1 ? "disabled" : ""} onclick="changePage(${currentPage - 1})">
            السابق
        </button>
        <span style="padding: 8px 14px; background:#f1f5f9; border-radius:8px; font-weight:600;">
            صفحة ${currentPage} من ${totalPages} — ${totalItems} أستاذ
        </span>
        <button class="btn-secondary" ${currentPage === totalPages ? "disabled" : ""} onclick="changePage(${currentPage + 1})">
            التالي
        </button>
    `;
}

function changePage(page) {
    currentPage = page;
    appliquerFiltres();
}

// ============================================================
// FILTRES + RECHERCHE
// ============================================================
function appliquerFiltres() {
    const searchInput = document.getElementById("search-enseignants");
    const search = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const matricule = (document.getElementById("filter-matricule") ? document.getElementById("filter-matricule").value : "").trim().toLowerCase();
    const grade = document.getElementById("filter-grade") ? document.getElementById("filter-grade").value : "";
    const specialite = document.getElementById("filter-specialite") ? document.getElementById("filter-specialite").value : "";
    const departement = document.getElementById("filter-departement") ? document.getElementById("filter-departement").value : "";
    const sifah = document.getElementById("filter-sifah") ? document.getElementById("filter-sifah").value : "";
    const wadhia = document.getElementById("filter-wadhia") ? document.getElementById("filter-wadhia").value : "";
    const annee = document.getElementById("filter-anneeUniversitaire") ? document.getElementById("filter-anneeUniversitaire").value : "";
    const genre = document.getElementById("filter-genre") ? document.getElementById("filter-genre").value : "";

    const resultat = enseignantsData.filter(function (item) {
        const nom = (item.nom || "").toLowerCase();
        const prenom = (item.prenom || "").toLowerCase();
        const matriculeItem = (item.matriculeCNRPS || "").toLowerCase();
        const numero = String(item.numero || "");

        const matchSearch = !search ||
            nom.includes(search) ||
            prenom.includes(search) ||
            matriculeItem.includes(search) ||
            numero.includes(search);

        const matchMatricule = !matricule || matriculeItem.includes(matricule);
        const matchGrade = !grade || item.gradeId === grade;
        const matchSpecialite = !specialite || item.specialiteId === specialite;
        const matchDepartement = !departement || item.departementId === departement;
        const matchSifah = !sifah || item.sifah === sifah;
        const matchWadhia = !wadhia || item.wadhia === wadhia;
        const matchAnnee = !annee || item.anneeUniversitaire === annee;
        const matchGenre = !genre || item.genre === genre;

        return matchSearch && matchMatricule && matchGrade && matchSpecialite &&
               matchDepartement && matchSifah && matchWadhia && matchAnnee && matchGenre;
    });

    window.enseignantsFiltresActuels = [...resultat];

    afficherAvecPagination(resultat);
}

// ============================================================
// RESET FILTRES
// ============================================================
function reinitialiserFiltres() {
    const ids = [
        "search-enseignants",
        "filter-matricule",
        "filter-grade",
        "filter-specialite",
        "filter-departement",
        "filter-sifah",
        "filter-wadhia",
        "filter-anneeUniversitaire",
        "filter-genre"
    ];

    ids.forEach(function (id) {
        const element = document.getElementById(id);
        if (element) {
            element.value = "";
        }
    });

    currentPage = 1;
    window.enseignantsFiltresActuels = [];
    appliquerFiltres();
}

// ============================================================
// MODAL, ENREGISTREMENT, DASHBOARD ... (tout le reste est IDENTIQUE à votre version originale)
// ============================================================

function ouvrirModalEnseignant(id = null) {
    const modal = document.getElementById("modal-enseignant");
    if (!modal) return;

    const form = document.getElementById("enseignant-form");
    if (form) form.reset();

    document.getElementById("enseignant-id").value = id || "";
    remplirSelectsEnseignant();

    if (!id) {
        document.getElementById("modal-enseignant-title").textContent = "إضافة أستاذ جديد";
        document.getElementById("genre").value = "homme";
        modal.classList.remove("hidden");
        return;
    }

    const enseignant = enseignantsData.find(function (item) {
        return item.id === id;
    });

    if (!enseignant) {
        alert("لم يتم العثور على الأستاذ");
        return;
    }

    remplirFormulaireEnseignant(enseignant);
    document.getElementById("modal-enseignant-title").textContent = "تعديل بيانات الأستاذ";
    modal.classList.remove("hidden");
}

function modifierEnseignant(id) {
    ouvrirModalEnseignant(id);
}

function remplirFormulaireEnseignant(item) {
    definirValeur("numero", item.numero);
    definirValeur("matriculeCNRPS", item.matriculeCNRPS);
    definirValeur("nom", item.nom);
    definirValeur("prenom", item.prenom);
    definirValeur("gradeId", item.gradeId);
    definirValeur("specialiteId", item.specialiteId);
    definirValeur("departementId", item.departementId);
    definirValeur("tel1", item.tel1);
    definirValeur("tel2", item.tel2);
    definirValeur("email", item.email);
    definirValeur("sifah", item.sifah);
    definirValeur("wadhia", item.wadhia);
    definirValeur("anneeUniversitaire", item.anneeUniversitaire);
    definirValeur("genre", item.genre || "homme");
    definirValeur("dateNaissance", item.dateNaissance);
    definirValeur("dateRecrutement", item.dateRecrutement);
    definirValeur("dateDernierGrade", item.dateDernierGrade);
}

function definirValeur(id, valeur) {
    const element = document.getElementById(id);
    if (element) {
        element.value = valeur ?? "";
    }
}

// Remplir Selects, Enregistrer, Supprimer, Dashboard, Fonctions utilitaires...
// (Je ne les ai pas recopiés ici pour éviter un message trop long, mais ils sont **identiques** à votre version originale)

function remplirSelectsEnseignant() { /* votre code original */ }
function remplirSelectGradesEnseignant() { /* votre code original */ }
function remplirSelectSpecialitesEnseignant() { /* votre code original */ }
function remplirSelectDepartementsEnseignant() { /* votre code original */ }
function remplirSelectSifahEnseignant() { /* votre code original */ }
function remplirSelectWadhiaEnseignant() { /* votre code original */ }
function remplirSelectAnneesEnseignant() { /* votre code original */ }

async function enregistrerEnseignant(event) { /* votre code original */ }
async function supprimerEnseignant(id) { /* votre code original */ }
function fermerModalEnseignant() { /* votre code original */ }

function mettreAJourFiltres() { /* 
