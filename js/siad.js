```javascript
// ============================================================
// SIGE - SIAD
// Statistiques et indicateurs d'aide à la décision
// ============================================================

// ============================================================
// CHARGEMENT DU SIAD
// ============================================================
async function loadSIAD() {

    console.log("===== Chargement SIAD =====");

    // Vérifier que les données enseignants existent
    if (typeof enseignantsData === "undefined") {
        console.error("enseignantsData est introuvable.");
        return;
    }

    const total = enseignantsData.length;

    console.log("Nombre total d'enseignants :", total);

    // ========================================================
    // KPI TOTAL
    // ========================================================

    definirTexteSIAD("kpi-total", total);

    // ========================================================
    // KPI - الصفة
    // ========================================================

    const titulaire = enseignantsData.filter(function (e) {
        return e.sifah === "titulaire";
    }).length;

    const contractuel = enseignantsData.filter(function (e) {
        return e.sifah === "contractuel";
    }).length;

    const vacataire = enseignantsData.filter(function (e) {
        return e.sifah === "vacataire";
    }).length;

    definirTexteSIAD("kpi-titulaire", titulaire);
    definirTexteSIAD("kpi-contractuel", contractuel);
    definirTexteSIAD("kpi-vacataire", vacataire);

    // ========================================================
    // KPI - الجنس
    // ========================================================

    const homme = enseignantsData.filter(function (e) {
        return e.genre === "homme";
    }).length;

    const femme = enseignantsData.filter(function (e) {
        return e.genre === "femme";
    }).length;

    definirTexteSIAD("kpi-homme", homme);
    definirTexteSIAD("kpi-femme", femme);

    // ========================================================
    // DISTRIBUTION PAR GRADE
    // ========================================================

    if (typeof getGradesData === "function") {

        const grades = getGradesData();

        console.log("Grades :", grades);

        remplirTableauSIAD(
            "stats-grade-body",
            grades,
            "gradeId",
            "id"
        );

    } else {

        console.error("getGradesData() est introuvable.");

    }

    // ========================================================
    // DISTRIBUTION PAR DEPARTEMENT
    // ========================================================

    if (typeof getDepartementsData === "function") {

        const departements = getDepartementsData();

        console.log("Départements :", departements);

        remplirTableauSIAD(
            "stats-departement-body",
            departements,
            "departementId",
            "id"
        );

    } else {

        console.error("getDepartementsData() est introuvable.");

    }

    // ========================================================
    // DISTRIBUTION PAR SPECIALITE
    // ========================================================

    if (typeof getSpecialitesData === "function") {

        const specialites = getSpecialitesData();

        console.log("Spécialités :", specialites);

        remplirTableauSIAD(
            "stats-specialite-body",
            specialites,
            "specialiteId",
            "id"
        );

    } else {

        console.error("getSpecialitesData() est introuvable.");

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

    const tbody = document.getElementById(tbodyId);

    if (!tbody) {
        console.error(
            "Élément HTML introuvable :",
            tbodyId
        );
        return;
    }

    tbody.innerHTML = "";

    // --------------------------------------------------------
    // Vérification
    // --------------------------------------------------------

    if (!Array.isArray(liste)) {

        console.error(
            "La liste n'est pas un tableau :",
            tbodyId,
            liste
        );

        return;
    }

    const total = enseignantsData.length;

    // --------------------------------------------------------
    // Aucun enseignant
    // --------------------------------------------------------

    if (total === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center;">
                    لا توجد بيانات
                </td>
            </tr>
        `;

        return;
    }

    // --------------------------------------------------------
    // Parcours des catégories
    // --------------------------------------------------------

    liste
        .filter(function (item) {
            return item.actif !== false;
        })
        .forEach(function (item) {

            const valeurReference =
                item[champReference];

            // ------------------------------------------------
            // Compter les enseignants
            // ------------------------------------------------

            const count =
                enseignantsData.filter(function (enseignant) {

                    return enseignant[champEnseignant] ===
                           valeurReference;

                }).length;

            // ------------------------------------------------
            // Pourcentage
            // ------------------------------------------------

            const percent =
                ((count / total) * 100).toFixed(1);

            // ------------------------------------------------
            // Création ligne
            // ------------------------------------------------

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${echapperHTMLSIAD(item.nom || "")}</td>
                <td>${count}</td>
                <td>${percent}%</td>
            `;

            tbody.appendChild(tr);

        });
}


// ============================================================
// AFFICHAGE DES KPI
// ============================================================

function definirTexteSIAD(id, valeur) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = valeur;

    } else {

        console.warn(
            "Élément KPI introuvable :",
            id
        );

    }
}


// ============================================================
// PROTECTION HTML
// ============================================================

function echapperHTMLSIAD(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


console.log("SIGE - siad.js chargé correctement");
```
