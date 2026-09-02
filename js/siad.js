// ============================================================
// SIGE - SIAD
// ============================================================
// Statistiques des enseignants
// Compatible avec enseignants.js actuel
// ============================================================

async function loadSIAD() {

    console.log("SIGE - Chargement SIAD...");

    // ========================================================
    // Vérification des données enseignants
    // ========================================================

    if (typeof enseignantsData === "undefined") {
        console.error("Erreur SIAD : enseignantsData est introuvable.");
        return;
    }

    const enseignants = enseignantsData;


    // ========================================================
    // TOTAL
    // ========================================================

    definirKPI("kpi-total", enseignants.length);


    // ========================================================
    // الصفة
    // ========================================================

    definirKPI(
        "kpi-titulaire",
        enseignants.filter(e => e.sifah === "titulaire").length
    );

    definirKPI(
        "kpi-contractuel",
        enseignants.filter(e => e.sifah === "contractuel").length
    );

    definirKPI(
        "kpi-vacataire",
        enseignants.filter(e => e.sifah === "vacataire").length
    );


    // ========================================================
    // الجنس
    // ========================================================

    definirKPI(
        "kpi-homme",
        enseignants.filter(e => e.genre === "homme").length
    );

    definirKPI(
        "kpi-femme",
        enseignants.filter(e => e.genre === "femme").length
    );


    // ========================================================
    // GRADES
    // ========================================================

    const grades =
        typeof getGradesData === "function"
            ? getGradesData().filter(item => item.actif !== false)
            : [];

    remplirTableauSIAD(
        grades,
        "gradeId",
        "id",
        "stats-grade-body",
        enseignants
    );


    // ========================================================
    // DEPARTEMENTS
    // ========================================================

    const departements =
        typeof getDepartementsData === "function"
            ? getDepartementsData().filter(item => item.actif !== false)
            : [];

    remplirTableauSIAD(
        departements,
        "departementId",
        "id",
        "stats-departement-body",
        enseignants
    );


    // ========================================================
    // SPECIALITES
    // ========================================================

    const specialites =
        typeof getSpecialitesData === "function"
            ? getSpecialitesData().filter(item => item.actif !== false)
            : [];

    remplirTableauSIAD(
        specialites,
        "specialiteId",
        "id",
        "stats-specialite-body",
        enseignants
    );


    // ========================================================
    // الصفة
    // ========================================================

    const sifah =
        typeof getSifahData === "function"
            ? getSifahData().filter(item => item.actif !== false)
            : [];

    remplirTableauSIAD(
        sifah,
        "sifah",
        "code",
        "stats-sifah-body",
        enseignants
    );


    // ========================================================
    // الوضعية
    // ========================================================

    const wadhia =
        typeof getWadhiaData === "function"
            ? getWadhiaData().filter(item => item.actif !== false)
            : [];

    remplirTableauSIAD(
        wadhia,
        "wadhia",
        "code",
        "stats-wadhia-body",
        enseignants
    );


    // ========================================================
    // ANNEE UNIVERSITAIRE
    // ========================================================

    const annees =
        typeof getAnneesData === "function"
            ? getAnneesData().filter(item => item.actif !== false)
            : [];

    remplirTableauSIAD(
        annees,
        "anneeUniversitaire",
        "nom",
        "stats-annee-body",
        enseignants
    );


    // ========================================================
    // GENRE
    // ========================================================

    remplirTableauGenreSIAD(enseignants);


    console.log("SIGE - SIAD chargé avec succès.");
}


// ============================================================
// KPI
// ============================================================

function definirKPI(id, valeur) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = valeur;
    }
}


// ============================================================
// TABLEAUX SIAD
// ============================================================

function remplirTableauSIAD(
    liste,
    champ,
    keyField,
    tbodyId,
    enseignants
) {

    const tbody = document.getElementById(tbodyId);

    if (!tbody) {
        console.warn(
            "Tableau SIAD introuvable : " + tbodyId
        );
        return;
    }

    tbody.innerHTML = "";


    if (!Array.isArray(liste) || liste.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center;">
                    لا توجد بيانات
                </td>
            </tr>
        `;

        return;
    }


    const total = enseignants.length;


    liste.forEach(function (item) {

        const key = item[keyField];

        const count =
            enseignants.filter(function (enseignant) {

                return enseignant[champ] === key;

            }).length;


        const percent =
            total > 0
                ? ((count / total) * 100).toFixed(1)
                : "0.0";


        const tr = document.createElement("tr");


        tr.innerHTML = `
            <td>${echapperHTML(item.nom || key || "")}</td>
            <td>${count}</td>
            <td>${percent}%</td>
        `;


        tbody.appendChild(tr);
    });
}


// ============================================================
// GENRE
// ============================================================

function remplirTableauGenreSIAD(enseignants) {

    const tbody =
        document.getElementById("stats-genre-body");

    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    const total = enseignants.length;


    const genres = [
        {
            key: "homme",
            nom: "ذكر"
        },
        {
            key: "femme",
            nom: "أنثى"
        }
    ];


    genres.forEach(function (genre) {

        const count =
            enseignants.filter(function (enseignant) {

                return enseignant.genre === genre.key;

            }).length;


        const percent =
            total > 0
                ? ((count / total) * 100).toFixed(1)
                : "0.0";


        const tr = document.createElement("tr");


        tr.innerHTML = `
            <td>${genre.nom}</td>
            <td>${count}</td>
            <td>${percent}%</td>
        `;


        tbody.appendChild(tr);
    });
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
