// ============================================================
// SIGE - SIAD
// Statistiques et indicateurs d'aide à la décision
// ============================================================

console.log("SIGE - siad.js chargé correctement");

// ============================================================
// CHARGEMENT DU SIAD
// ============================================================

function loadSIAD() {

    console.log("===== Chargement SIAD =====");

    // Vérifier les données
    if (typeof enseignantsData === "undefined") {
        console.error("enseignantsData est introuvable.");
        return;
    }

    var total = enseignantsData.length;

    console.log("Nombre total d'enseignants :", total);

    // ========================================================
    // KPI TOTAL
    // ========================================================

    definirTexteSIAD("kpi-total", total);

    // ========================================================
    // KPI - الصفة
    // ========================================================

    var titulaire = enseignantsData.filter(function (e) {
        return e.sifah === "titulaire";
    }).length;

    var contractuel = enseignantsData.filter(function (e) {
        return e.sifah === "contractuel";
    }).length;

    var vacataire = enseignantsData.filter(function (e) {
        return e.sifah === "vacataire";
    }).length;

    definirTexteSIAD("kpi-titulaire", titulaire);
    definirTexteSIAD("kpi-contractuel", contractuel);
    definirTexteSIAD("kpi-vacataire", vacataire);

    // ========================================================
    // KPI - الجنس
    // ========================================================

    var homme = enseignantsData.filter(function (e) {
        return e.genre === "homme";
    }).length;

    var femme = enseignantsData.filter(function (e) {
        return e.genre === "femme";
    }).length;

    definirTexteSIAD("kpi-homme", homme);
    definirTexteSIAD("kpi-femme", femme);

    console.log("KPI SIAD chargés.");

    // ========================================================
    // GRADE
    // ========================================================

    if (typeof getGradesData === "function") {

        var grades = getGradesData();

        remplirTableauSIAD(
            "stats-grade-body",
            grades,
            "gradeId",
            "id"
        );

    } else {

        console.warn("getGradesData() introuvable.");

    }

    // ========================================================
    // DEPARTEMENT
    // ========================================================

    if (typeof getDepartementsData === "function") {

        var departements = getDepartementsData();

        remplirTableauSIAD(
            "stats-departement-body",
            departements,
            "departementId",
            "id"
        );

    } else {

        console.warn("getDepartementsData() introuvable.");

    }

    // ========================================================
    // SPECIALITE
    // ========================================================

    if (typeof getSpecialitesData === "function") {

        var specialites = getSpecialitesData();

        remplirTableauSIAD(
            "stats-specialite-body",
            specialites,
            "specialiteId",
            "id"
        );

    } else {

        console.warn("getSpecialitesData() introuvable.");

    }

    console.log("===== SIAD chargé =====");
}


// ============================================================
// TABLEAU STATISTIQUE GENERIQUE
// ============================================================

function remplirTableauSIAD(
    tbodyId,
    liste,
    champEnseignant,
    champReference
) {

    var tbody = document.getElementById(tbodyId);

    if (!tbody) {
        console.warn("Élément introuvable :", tbodyId);
        return;
    }

    tbody.innerHTML = "";

    if (!Array.isArray(liste)) {
        console.warn("La liste n'est pas un tableau :", tbodyId);
        return;
    }

    var total = enseignantsData.length;

    if (total === 0) {

        tbody.innerHTML =
            '<tr>' +
                '<td colspan="3" style="text-align:center;">' +
                    'لا توجد بيانات' +
                '</td>' +
            '</tr>';

        return;
    }

    liste
        .filter(function (item) {
            return item.actif !== false;
        })
        .forEach(function (item) {

            var valeurReference = item[champReference];

            var count = enseignantsData.filter(function (enseignant) {
                return enseignant[champEnseignant] === valeurReference;
            }).length;

            var percent = ((count / total) * 100).toFixed(1);

            var tr = document.createElement("tr");

            tr.innerHTML =
                "<td>" +
                    echapperHTMLSIAD(item.nom || "") +
                "</td>" +
                "<td>" +
                    count +
                "</td>" +
                "<td>" +
                    percent +
                    "%" +
                "</td>";

            tbody.appendChild(tr);
        });
}


// ============================================================
// AFFICHER UNE VALEUR
// ============================================================

function definirTexteSIAD(id, valeur) {

    var element = document.getElementById(id);

    if (element) {
        element.textContent = valeur;
    } else {
        console.warn("Élément KPI introuvable :", id);
    }
}


// ============================================================
// PROTECTION HTML
// ============================================================

function echapperHTMLSIAD(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
