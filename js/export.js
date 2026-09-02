```javascript
// ============================================================
// SIGE - EXPORT EXCEL
// ============================================================
// Export des enseignants + export SIAD
// L'export des enseignants utilise les données actuellement
// filtrées dans la page.
// ============================================================


// ============================================================
// INITIALISATION DES BOUTONS
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("SIGE - Initialisation export.js");

    // --------------------------------------------------------
    // Bouton export enseignants
    // --------------------------------------------------------

    const btnExport = document.getElementById("btn-export");

    if (btnExport) {

        console.log("Bouton #btn-export trouvé");

        btnExport.addEventListener("click", function (event) {

            event.preventDefault();

            console.log("Clic sur le bouton Export Enseignants");

            lancerExportEnseignants();

        });

    }
    else {

        console.error(
            "ERREUR : bouton #btn-export introuvable"
        );

    }


    // --------------------------------------------------------
    // Bouton export SIAD
    // --------------------------------------------------------

    const btnExportSIAD =
        document.getElementById("btn-export-siad");

    if (btnExportSIAD) {

        console.log("Bouton #btn-export-siad trouvé");

        btnExportSIAD.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                console.log(
                    "Clic sur le bouton Export SIAD"
                );

                exportSIAD();

            }
        );

    }
    else {

        console.warn(
            "Bouton #btn-export-siad introuvable"
        );

    }

});


// ============================================================
// LANCER EXPORT ENSEIGNANTS
// ============================================================

function lancerExportEnseignants() {

    console.log(
        "Début export enseignants..."
    );


    // --------------------------------------------------------
    // Vérifier SheetJS
    // --------------------------------------------------------

    if (typeof XLSX === "undefined") {

        alert(
            "مكتبة Excel غير محملة. يرجى إعادة تحميل الصفحة."
        );

        console.error(
            "ERREUR : XLSX est undefined"
        );

        return;
    }


    // --------------------------------------------------------
    // Récupérer la liste à exporter
    // --------------------------------------------------------
    //
    // Priorité :
    //
    // 1. enseignantsFiltresActuels
    // 2. enseignantsFiltres
    // 3. enseignantsData
    //
    // Ainsi, si l'utilisateur applique des filtres,
    // seuls les enseignants affichés seront exportés.
    // --------------------------------------------------------

    let liste = [];


    // 1. Liste filtrée globale

    if (
        Array.isArray(window.enseignantsFiltresActuels)
    ) {

        liste =
            window.enseignantsFiltresActuels;

        console.log(
            "Utilisation de enseignantsFiltresActuels :",
            liste.length
        );

    }


    // 2. Deuxième possibilité

    else if (
        typeof enseignantsFiltres !== "undefined" &&
        Array.isArray(enseignantsFiltres)
    ) {

        liste =
            enseignantsFiltres;

        console.log(
            "Utilisation de enseignantsFiltres :",
            liste.length
        );

    }


    // 3. Toutes les données

    else if (
        typeof enseignantsData !== "undefined" &&
        Array.isArray(enseignantsData)
    ) {

        liste =
            enseignantsData;

        console.log(
            "Utilisation de enseignantsData :",
            liste.length
        );

    }


    // --------------------------------------------------------
    // Vérifier les données
    // --------------------------------------------------------

    if (!Array.isArray(liste)) {

        alert(
            "لا توجد بيانات الأساتذة"
        );

        console.error(
            "Aucune liste d'enseignants disponible"
        );

        return;
    }


    if (liste.length === 0) {

        alert(
            "لا توجد بيانات الأساتذة للتصدير"
        );

        console.warn(
            "La liste à exporter est vide"
        );

        return;
    }


    console.log(
        "Nombre d'enseignants à exporter :",
        liste.length
    );


    // --------------------------------------------------------
    // Export
    // --------------------------------------------------------

    exportEnseignants(liste);

}


// ============================================================
// EXPORT ENSEIGNANTS
// ============================================================

function exportEnseignants(list) {

    // --------------------------------------------------------
    // Vérification liste
    // --------------------------------------------------------

    if (
        !Array.isArray(list) ||
        list.length === 0
    ) {

        alert(
            "لا توجد بيانات الأساتذة للتصدير"
        );

        return;
    }


    // --------------------------------------------------------
    // Vérification XLSX
    // --------------------------------------------------------

    if (typeof XLSX === "undefined") {

        alert(
            "مكتبة Excel غير محملة. يرجى إعادة تحميل الصفحة."
        );

        console.error(
            "XLSX n'est pas chargé."
        );

        return;
    }


    console.log(
        "Export de",
        list.length,
        "enseignant(s)"
    );


    // ========================================================
    // EN-TÊTES
    // ========================================================

    const headers = [

        "الرقم",

        "رقم التسجيل CNRPS",

        "اللقب",

        "الاسم",

        "الرتبة",

        "التخصص",

        "القسم",

        "الهاتف 1",

        "الهاتف 2",

        "البريد الإلكتروني",

        "الصفة",

        "الوضعية",

        "السنة الجامعية",

        "الجنس",

        "تاريخ التوظيف",

        "تاريخ الميلاد",

        "تاريخ آخر رتبة"

    ];


    // ========================================================
    // PRÉPARER LES DONNÉES DE RÉFÉRENCE
    // ========================================================

    let grades = [];
    let specialites = [];
    let departements = [];
    let sifahData = [];
    let wadhiaData = [];


    if (typeof getGradesData === "function") {

        try {

            grades = getGradesData() || [];

        }
        catch (error) {

            console.warn(
                "Erreur getGradesData :",
                error
            );

        }

    }


    if (typeof getSpecialitesData === "function") {

        try {

            specialites =
                getSpecialitesData() || [];

        }
        catch (error) {

            console.warn(
                "Erreur getSpecialitesData :",
                error
            );

        }

    }


    if (typeof getDepartementsData === "function") {

        try {

            departements =
                getDepartementsData() || [];

        }
        catch (error) {

            console.warn(
                "Erreur getDepartementsData :",
                error
            );

        }

    }


    if (typeof getSifahData === "function") {

        try {

            sifahData =
                getSifahData() || [];

        }
        catch (error) {

            console.warn(
                "Erreur getSifahData :",
                error
            );

        }

    }


    if (typeof getWadhiaData === "function") {

        try {

            wadhiaData =
                getWadhiaData() || [];

        }
        catch (error) {

            console.warn(
                "Erreur getWadhiaData :",
                error
            );

        }

    }


    // ========================================================
    // CONVERSION DES DONNÉES
    // ========================================================

    const rows = list.map(function (e) {


        // ----------------------------------------------------
        // GRADE
        // ----------------------------------------------------

        let gradeNom = "";

        const grade =
            grades.find(function (g) {

                return g.id === e.gradeId;

            });

        if (grade) {

            gradeNom =
                grade.nom || "";

        }


        // ----------------------------------------------------
        // SPECIALITE
        // ----------------------------------------------------

        let specialiteNom = "";

        const specialite =
            specialites.find(function (s) {

                return s.id === e.specialiteId;

            });

        if (specialite) {

            specialiteNom =
                specialite.nom || "";

        }


        // ----------------------------------------------------
        // DEPARTEMENT
        // ----------------------------------------------------

        let departementNom = "";

        const departement =
            departements.find(function (d) {

                return d.id === e.departementId;

            });

        if (departement) {

            departementNom =
                departement.nom || "";

        }


        // ----------------------------------------------------
        // SIFAH
        // ----------------------------------------------------

        let sifahNom = "";

        const sifah =
            sifahData.find(function (s) {

                return s.code === e.sifah;

            });

        if (sifah) {

            sifahNom =
                sifah.nom || "";

        }

        // Si le code n'a pas de correspondance

        if (!sifahNom) {

            sifahNom =
                e.sifah || "";

        }


        // ----------------------------------------------------
        // WADHIA
        // ----------------------------------------------------

        let wadhiaNom = "";

        const wadhia =
            wadhiaData.find(function (w) {

                return w.code === e.wadhia;

            });

        if (wadhia) {

            wadhiaNom =
                wadhia.nom || "";

        }

        // Si le code n'a pas de correspondance

        if (!wadhiaNom) {

            wadhiaNom =
                e.wadhia || "";

        }


        // ----------------------------------------------------
        // GENRE
        // ----------------------------------------------------

        let genreNom = "";

        if (e.genre === "homme") {

            genreNom = "ذكر";

        }
        else if (e.genre === "femme") {

            genreNom = "أنثى";

        }
        else {

            genreNom =
                e.genre || "";

        }


        // ----------------------------------------------------
        // ANNÉE UNIVERSITAIRE
        // ----------------------------------------------------

        const annee =
            e.anneeUniversitaire || "";


        // ====================================================
        // LIGNE EXCEL
        // ====================================================

        return [

            e.numero ?? "",

            e.matriculeCNRPS ?? "",

            e.nom ?? "",

            e.prenom ?? "",

            gradeNom,

            specialiteNom,

            departementNom,

            e.tel1 ?? "",

            e.tel2 ?? "",

            e.email ?? "",

            sifahNom,

            wadhiaNom,

            annee,

            genreNom,

            e.dateRecrutement ?? "",

            e.dateNaissance ?? "",

            e.dateDernierGrade ?? ""

        ];

    });


    // ========================================================
    // CRÉATION FEUILLE
    // ========================================================

    const ws =
        XLSX.utils.aoa_to_sheet(
            [
                headers,
                ...rows
            ]
        );


    // ========================================================
    // LARGEUR DES COLONNES
    // ========================================================

    ws["!cols"] = [

        { wch: 8 },

        { wch: 20 },

        { wch: 20 },

        { wch: 20 },

        { wch: 25 },

        { wch: 25 },

        { wch: 25 },

        { wch: 15 },

        { wch: 15 },

        { wch: 30 },

        { wch: 20 },

        { wch: 20 },

        { wch: 18 },

        { wch: 12 },

        { wch: 18 },

        { wch: 18 },

        { wch: 18 }

    ];


    // ========================================================
    // CRÉATION CLASSEUR
    // ========================================================

    const wb =
        XLSX.utils.book_new();


    // ========================================================
    // AJOUT FEUILLE
    // ========================================================

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "الأساتذة"
    );


    // ========================================================
    // NOM DU FICHIER
    // ========================================================

    const maintenant =
        new Date();

    const date =
        maintenant
            .toISOString()
            .slice(0, 10);

    const heure =
        maintenant
            .toTimeString()
            .slice(0, 8)
            .replace(/:/g, "-");


    const filename =
        "SIGE_Enseignants_" +
        date +
        "_" +
        heure +
        ".xlsx";


    // ========================================================
    // TÉLÉCHARGEMENT
    // ========================================================

    try {

        XLSX.writeFile(
            wb,
            filename
        );


        console.log(
            "======================================"
        );

        console.log(
            "Export Excel réussi"
        );

        console.log(
            "Nombre de lignes :",
            rows.length
        );

        console.log(
            "Fichier :",
            filename
        );

        console.log(
            "======================================"
        );


        // Message de confirmation

        alert(
            "تم تصدير " +
            rows.length +
            " أستاذ(ة) بنجاح إلى ملف Excel"
        );

    }

    catch (error) {

        console.error(
            "Erreur export Excel :",
            error
        );


        alert(
            "حدث خطأ أثناء تصدير ملف Excel : " +
            error.message
        );

    }

}


// ============================================================
// EXPORT SIAD
// ============================================================

function exportSIAD() {

    // --------------------------------------------------------
    // Vérifier XLSX
    // --------------------------------------------------------

    if (typeof XLSX === "undefined") {

        alert(
            "مكتبة Excel غير محملة."
        );

        return;
    }


    // --------------------------------------------------------
    // Récupérer données
    // --------------------------------------------------------

    let data = [];


    if (
        typeof enseignantsData !== "undefined" &&
        Array.isArray(enseignantsData)
    ) {

        data =
            enseignantsData;

    }


    if (data.length === 0) {

        alert(
            "لا توجد بيانات الأساتذة"
        );

        return;
    }


    // ========================================================
    // KPI
    // ========================================================

    const kpis = [

        [
            "المؤشر",
            "القيمة"
        ],

        [
            "إجمالي الأساتذة",
            data.length
        ],

        [
            "مرسم",
            data.filter(function (e) {

                return e.sifah === "titulaire";

            }).length
        ],

        [
            "متعاقد",
            data.filter(function (e) {

                return e.sifah === "contractuel";

            }).length
        ],

        [
            "عرضي",
            data.filter(function (e) {

                return e.sifah === "vacataire";

            }).length
        ],

        [
            "ذكور",
            data.filter(function (e) {

                return e.genre === "homme";

            }).length
        ],

        [
            "إناث",
            data.filter(function (e) {

                return e.genre === "femme";

            }).length
        ]

    ];


    // ========================================================
    // CLASSEUR
    // ========================================================

    const wb =
        XLSX.utils.book_new();


    // ========================================================
    // FEUILLE
    // ========================================================

    const ws =
        XLSX.utils.aoa_to_sheet(
            kpis
        );


    // ========================================================
    // LARGEUR
    // ========================================================

    ws["!cols"] = [

        { wch: 30 },

        { wch: 15 }

    ];


    // ========================================================
    // AJOUT FEUILLE
    // ========================================================

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "المؤشرات"
    );


    // ========================================================
    // NOM FICHIER
    // ========================================================

    const date =
        new Date()
            .toISOString()
            .slice(0, 10);


    const filename =
        "SIGE_SIAD_" +
        date +
        ".xlsx";


    // ========================================================
    // EXPORT
    // ========================================================

    try {

        XLSX.writeFile(
            wb,
            filename
        );


        console.log(
            "Export SIAD effectué :",
            filename
        );


        alert(
            "تم تصدير إحصائيات SIAD بنجاح"
        );

    }

    catch (error) {

        console.error(
            "Erreur export SIAD :",
            error
        );


        alert(
            "حدث خطأ أثناء تصدير إحصائيات SIAD : " +
            error.message
        );

    }

}


// ============================================================
// TEST MANUEL DANS LA CONSOLE
// ============================================================

function testerExport() {

    console.log(
        "========== TEST EXPORT =========="
    );


    console.log(
        "XLSX :",
        typeof XLSX
    );


    console.log(
        "enseignantsData :",
        typeof enseignantsData !== "undefined"
            ? enseignantsData.length
            : "undefined"
    );


    console.log(
        "enseignantsFiltres :",
        typeof enseignantsFiltres !== "undefined"
            ? enseignantsFiltres.length
            : "undefined"
    );


    console.log(
        "enseignantsFiltresActuels :",
        Array.isArray(
            window.enseignantsFiltresActuels
        )
            ? window.enseignantsFiltresActuels.length
            : "undefined"
    );


    console.log(
        "Bouton export :",
        document.getElementById("btn-export")
    );


    console.log(
        "================================"
    );

}


// ============================================================
// FIN
// ============================================================

console.log(
    "SIGE - export.js chargé correctement"
);
```
