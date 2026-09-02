// ============================================================
// SIGE - ENSEIGNANTS
// ============================================================
// Gestion complète des enseignants + Recherche + Pagination
// ============================================================

let enseignantsData = [];
let currentPage = 1;
const itemsPerPage = 15;

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

    liste.forEach(function (item, index) {
        const tr = document.createElement("tr");

        const grade = trouverNomGrade(item.gradeId);
        const specialite = trouverNomSpecialite(item.specialiteId);
        const departement = trouverNomDepartement(item.departementId);
        const sifah = trouverNomSifah(item.sifah);
        const wadhia = trouverNomWadhia(item.wadhia);
        const annee = trouverNomAnnee(item.anneeUniversitaire);

     const peutSupprimer = window.currentUserRole === "admin";
const peutSupprimer = window.currentUserRole === "admin";

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

        // Recherche
        const matchSearch = !search ||
            nom.includes(search) ||
            prenom.includes(search) ||
            matriculeItem.includes(search) ||
            numero.includes(search);

        // Filtres
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
    appliquerFiltres();
}

// ============================================================
// MODAL
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

// ============================================================
// REMPLIR SELECTS
// ============================================================
function remplirSelectsEnseignant() {
    remplirSelectGradesEnseignant();
    remplirSelectSpecialitesEnseignant();
    remplirSelectDepartementsEnseignant();
    remplirSelectSifahEnseignant();
    remplirSelectWadhiaEnseignant();
    remplirSelectAnneesEnseignant();
}

function remplirSelectGradesEnseignant() {
    const select = document.getElementById("gradeId");
    if (!select) return;
    const valeur = select.value;
    select.innerHTML = '<option value="">اختر الرتبة</option>';
    if (typeof getGradesData !== "function") return;

    getGradesData()
        .filter(function (item) { return item.actif !== false; })
        .forEach(function (item) {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.nom;
            select.appendChild(option);
        });
    if (valeur) select.value = valeur;
}

function remplirSelectSpecialitesEnseignant() {
    const select = document.getElementById("specialiteId");
    if (!select) return;
    const valeur = select.value;
    select.innerHTML = '<option value="">اختر التخصص</option>';
    if (typeof getSpecialitesData !== "function") return;

    getSpecialitesData()
        .filter(function (item) { return item.actif !== false; })
        .forEach(function (item) {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.nom;
            select.appendChild(option);
        });
    if (valeur) select.value = valeur;
}

function remplirSelectDepartementsEnseignant() {
    const select = document.getElementById("departementId");
    if (!select) return;
    const valeur = select.value;
    select.innerHTML = '<option value="">اختر القسم</option>';
    if (typeof getDepartementsData !== "function") return;

    getDepartementsData()
        .filter(function (item) { return item.actif !== false; })
        .forEach(function (item) {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.nom;
            select.appendChild(option);
        });
    if (valeur) select.value = valeur;
}

function remplirSelectSifahEnseignant() {
    const select = document.getElementById("sifah");
    if (!select) return;
    const valeur = select.value;
    select.innerHTML = '<option value="">اختر الصفة</option>';
    if (typeof getSifahData !== "function") return;

    getSifahData()
        .filter(function (item) { return item.actif !== false; })
        .forEach(function (item) {
            const option = document.createElement("option");
            option.value = item.code;
            option.textContent = item.nom;
            select.appendChild(option);
        });
    if (valeur) select.value = valeur;
}

function remplirSelectWadhiaEnseignant() {
    const select = document.getElementById("wadhia");
    if (!select) return;
    const valeur = select.value;
    select.innerHTML = '<option value="">اختر الوضعية</option>';
    if (typeof getWadhiaData !== "function") return;

    getWadhiaData()
        .filter(function (item) { return item.actif !== false; })
        .forEach(function (item) {
            const option = document.createElement("option");
            option.value = item.code;
            option.textContent = item.nom;
            select.appendChild(option);
        });
    if (valeur) select.value = valeur;
}

function remplirSelectAnneesEnseignant() {
    const select = document.getElementById("anneeUniversitaire");
    if (!select) return;
    const valeur = select.value;
    select.innerHTML = '<option value="">اختر السنة الجامعية</option>';
    if (typeof getAnneesData !== "function") return;

    getAnneesData()
        .filter(function (item) { return item.actif !== false; })
        .forEach(function (item) {
            const option = document.createElement("option");
            option.value = item.nom;
            option.textContent = item.nom;
            select.appendChild(option);
        });
    if (valeur) select.value = valeur;
}

// ============================================================
// ENREGISTRER / SUPPRIMER
// ============================================================
async function enregistrerEnseignant(event) {
    event.preventDefault();

    const id = document.getElementById("enseignant-id").value;

    const data = {
        numero: Number(document.getElementById("numero").value),
        matriculeCNRPS: document.getElementById("matriculeCNRPS").value.trim(),
        nom: document.getElementById("nom").value.trim(),
        prenom: document.getElementById("prenom").value.trim(),
        gradeId: document.getElementById("gradeId").value,
        specialiteId: document.getElementById("specialiteId").value,
        departementId: document.getElementById("departementId").value,
        tel1: document.getElementById("tel1").value.trim(),
        tel2: document.getElementById("tel2").value.trim(),
        email: document.getElementById("email").value.trim(),
        sifah: document.getElementById("sifah").value,
        wadhia: document.getElementById("wadhia").value,
        anneeUniversitaire: document.getElementById("anneeUniversitaire").value,
        genre: document.getElementById("genre").value,
        dateNaissance: document.getElementById("dateNaissance").value,
        dateRecrutement: document.getElementById("dateRecrutement").value,
        dateDernierGrade: document.getElementById("dateDernierGrade").value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!data.nom) {
        alert("يرجى إدخال اللقب");
        return;
    }
    if (!data.prenom) {
        alert("يرجى إدخال الاسم");
        return;
    }
    if (!data.matriculeCNRPS) {
        alert("يرجى إدخال رقم التسجيل CNRPS");
        return;
    }

    try {
        if (id) {
            await enseignantsRef.doc(id).update(data);
        } else {
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await enseignantsRef.add(data);
        }

        fermerModalEnseignant();
        document.getElementById("enseignant-form").reset();
        alert("تم حفظ بيانات الأستاذ بنجاح");
    } catch (error) {
        console.error("Erreur enseignant :", error);
        alert("حدث خطأ أثناء حفظ بيانات الأستاذ : " + error.message);
    }
}

async function supprimerEnseignant(id) {

    // Seul l'admin peut supprimer
    if (window.currentUserRole !== "admin") {
        alert("ليس لديك صلاحية لحذف الأساتذة");
        return;
    }

    if (!confirm("هل أنت متأكد من حذف هذا الأستاذ ؟")) return;

    try {
        await enseignantsRef.doc(id).delete();
        alert("تم حذف الأستاذ");
    } catch (error) {
        console.error("Erreur suppression enseignant :", error);
        alert("حدث خطأ أثناء الحذف : " + error.message);
    }
}

function fermerModalEnseignant() {
    const modal = document.getElementById("modal-enseignant");
    if (modal) {
        modal.classList.add("hidden");
    }
}

// ============================================================
// REMPLIR LES FILTRES
// ============================================================
function mettreAJourFiltres() {
    remplirFiltre("filter-grade", getGradesData(), "كل الرتب");
    remplirFiltre("filter-specialite", getSpecialitesData(), "كل التخصصات");
    remplirFiltre("filter-departement", getDepartementsData(), "كل الأقسام");
    remplirFiltreCodes("filter-sifah", getSifahData(), "كل الصفات");
    remplirFiltreCodes("filter-wadhia", getWadhiaData(), "كل الوضعيات");
    remplirFiltreAnnees();
}

function remplirFiltre(id, data, texteDefaut) {
    const select = document.getElementById(id);
    if (!select) return;
    const valeur = select.value;
    select.innerHTML = `<option value="">${texteDefaut}</option>`;

    if (!data) return;

    data.filter(function (item) { return item.actif !== false; })
        .forEach(function (item) {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.nom;
            select.appendChild(option);
        });

    if (valeur) select.value = valeur;
}

function remplirFiltreCodes(id, data, texteDefaut) {
    const select = document.getElementById(id);
    if (!select) return;
    const valeur = select.value;
    select.innerHTML = `<option value="">${texteDefaut}</option>`;

    if (!data) return;

    data.filter(function (item) { return item.actif !== false; })
        .forEach(function (item) {
            const option = document.createElement("option");
            option.value = item.code;
            option.textContent = item.nom;
            select.appendChild(option);
        });

    if (valeur) select.value = valeur;
}

function remplirFiltreAnnees() {
    const select = document.getElementById("filter-anneeUniversitaire");
    if (!select) return;
    const valeur = select.value;
    select.innerHTML = '<option value="">كل السنوات الجامعية</option>';

    if (typeof getAnneesData !== "function") return;

    getAnneesData()
        .filter(function (item) { return item.actif !== false; })
        .forEach(function (item) {
            const option = document.createElement("option");
            option.value = item.nom;
            option.textContent = item.nom;
            select.appendChild(option);
        });

    if (valeur) select.value = valeur;
}

// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================
function trouverNomGrade(id) {
    if (typeof getGradesData !== "function") return "";
    const item = getGradesData().find(function (el) { return el.id === id; });
    return item ? item.nom : "";
}

function trouverNomSpecialite(id) {
    if (typeof getSpecialitesData !== "function") return "";
    const item = getSpecialitesData().find(function (el) { return el.id === id; });
    return item ? item.nom : "";
}

function trouverNomDepartement(id) {
    if (typeof getDepartementsData !== "function") return "";
    const item = getDepartementsData().find(function (el) { return el.id === id; });
    return item ? item.nom : "";
}

function trouverNomSifah(code) {
    if (typeof getSifahData !== "function") return code || "";
    const item = getSifahData().find(function (el) { return el.code === code; });
    return item ? item.nom : (code || "");
}

function trouverNomWadhia(code) {
    if (typeof getWadhiaData !== "function") return code || "";
    const item = getWadhiaData().find(function (el) { return el.code === code; });
    return item ? item.nom : (code || "");
}

function trouverNomAnnee(nom) {
    return nom || "";
}

// ============================================================
// DASHBOARD COMPLET
// ============================================================
function mettreAJourDashboard() {
    const total = enseignantsData.length;

    // Total
    definirTexte("dash-total", total);
    definirTexte("kpi-total", total);

    // KPI SIAD
    const titulaire = enseignantsData.filter(item => item.sifah === "titulaire").length;
    const contractuel = enseignantsData.filter(item => item.sifah === "contractuel").length;
    const vacataire = enseignantsData.filter(item => item.sifah === "vacataire").length;
    const homme = enseignantsData.filter(item => item.genre === "homme").length;
    const femme = enseignantsData.filter(item => item.genre === "femme").length;

    definirTexte("kpi-titulaire", titulaire);
    definirTexte("kpi-contractuel", contractuel);
    definirTexte("kpi-vacataire", vacataire);
    definirTexte("kpi-homme", homme);
    definirTexte("kpi-femme", femme);

    // ===== Tableaux de répartition =====
    remplirTableauRepartition("dashboard-grade-body", "gradeId", getGradesData, "id");
    remplirTableauRepartition("dashboard-sifah-body", "sifah", getSifahData, "code");
    remplirTableauRepartition("dashboard-wadhia-body", "wadhia", getWadhiaData, "code");
    remplirTableauGenre();
    remplirTableauRepartition("dashboard-departement-body", "departementId", getDepartementsData, "id");
    remplirTableauRepartition("dashboard-specialite-body", "specialiteId", getSpecialitesData, "id");
    remplirTableauAnnees();
}

// ============================================================
// Fonction générique pour remplir un tableau de répartition
// ============================================================
function remplirTableauRepartition(tbodyId, champ, getDataFn, keyField) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    tbody.innerHTML = "";

    if (typeof getDataFn !== "function") return;

    const data = getDataFn().filter(item => item.actif !== false);
    const total = enseignantsData.length || 1;

    data.forEach(item => {
        const key = item[keyField];
        const count = enseignantsData.filter(e => e[champ] === key).length;
        const percent = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${echapperHTML(item.nom || key)}</td>
            <td>${count}</td>
            <td>${percent}%</td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================================
// Répartition par genre
// ============================================================
function remplirTableauGenre() {
    const tbody = document.getElementById("dashboard-genre-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    const total = enseignantsData.length || 1;

    const genres = [
        { key: "homme", nom: "ذكر" },
        { key: "femme", nom: "أنثى" }
    ];

    genres.forEach(g => {
        const count = enseignantsData.filter(e => e.genre === g.key).length;
        const percent = ((count / total) * 100).toFixed(1);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${g.nom}</td>
            <td>${count}</td>
            <td>${percent}%</td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================================
// Répartition par année universitaire
// ============================================================
function remplirTableauAnnees() {
    const tbody = document.getElementById("dashboard-annee-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (typeof getAnneesData !== "function") return;

    const data = getAnneesData().filter(item => item.actif !== false);
    const total = enseignantsData.length || 1;

    data.forEach(item => {
        const count = enseignantsData.filter(e => e.anneeUniversitaire === item.nom).length;
        const percent = ((count / total) * 100).toFixed(1);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${echapperHTML(item.nom)}</td>
            <td>${count}</td>
            <td>${percent}%</td>
        `;
        tbody.appendChild(tr);
    });
}

function definirTexte(id, valeur) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = valeur;
    }
}

function echapperHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Fermeture modal
document.addEventListener("click", function (event) {
    const bouton = event.target.closest("#modal-enseignant .close-modal");
    if (bouton) {
        fermerModalEnseignant();
    }
});

console.log("SIGE - enseignants.js chargé (recherche + pagination)");
