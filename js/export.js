```javascript
// ============================================================
// SIGE - EXPORT EXCEL
// ============================================================
// Export des enseignants + Export SIAD
// Compatible avec enseignants.js actuel
// ============================================================


// ============================================================
// INITIALISATION DES BOUTONS
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // --------------------------------------------------------
    // BOUTON EXPORT ENSEIGNANTS
    // --------------------------------------------------------

    const btnExport = document.getElementById("btn-export");

    if (btnExport) {

        btnExport.addEventListener("click", function (event) {

            event.preventDefault();

            console.log("SIGE : bouton Export Excel cliqué");

            // ------------------------------------------------
            // Récupérer les données
            // ------------------------------------------------

            let liste = [];

            // Priorité aux données filtrées
            if (
                Array.isArray(window.enseignantsFiltresActuels) &&
                window.enseignantsFiltresActuels.length > 0
            ) {

                liste = window.enseignantsFiltresActuels;

                console.log(
                    "Export des données filtrées :",
                    liste.length
                );

            }

            // Sinon toutes les données
            else if (
                Array.isArray(window.enseignantsData) &&
                window.enseignantsData.length > 0
            ) {

                liste = window.enseignantsData;

                console.log(
                    "Export de tous les enseignants :",
                    liste.length
                );

            }

            // ------------------------------------------------
            // Vérification
            // ------------------------------------------------

            if (liste.length === 0) {

                alert("لا توجد بيانات الأساتذة للتصدير");

                return;
            }

            // ------------------------------------------------
            // Export
            // ------------------------------------------------

            exportEnseignants(liste);

        });

    }
    else {

        console.error(
            "SIGE : bouton #btn-export introuvable"
        );

    }


    // ========================================================
    // BOUTON EXPORT SIAD
    // ========================================================

    const btnExportSIAD =
        document.getElementById("btn-export-siad");

    if (btnExportSIAD) {

        btnExportSIAD.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                console.log(
                    "SIGE : bouton Export SIAD cliqué"
                );

                exportSIAD();

            }
        );

    }
    else {

        console.warn(
            "SIGE : bouton #btn-export-siad introuvable"
        );

    }

});


// ============================================================
// EXPORT LISTE DES ENSEIGNANTS
// ============================================================

function exportEnseignants(list) {

    // --------------------------------------------------------
    // Vérification liste
    // --------------------------------------------------------

    if (
        !Array.isArray(list) ||
        list.length === 0
    ) {

        alert("لا توجد بيانات الأساتذة للتصدير");

        return;
    }


    // --------------------------------------------------------
    // Vérifier SheetJS
    // --------------------------------------------------------

    if (typeof XLSX === "undefined") {

        alert(
            "مكتبة Excel غير محملة. يرجى إعادة تحميل الصفحة."
        );

        console.error(
            "SIGE : XLSX / SheetJS n'est pas chargé."
        );

        return;
    }


    console.log(
        "SIGE : préparation export de",
        list.length,
        "enseignant(s)"
    );


    // ========================================================
    // DONNÉES DE RÉFÉRENCE
    // ========================================================

    const grades =
        typeof getGradesData === "function"
            ? getGradesData()
            : [];

    const specialites =
        typeof getSpecialitesData === "function"
            ? getSpecialitesData()
            : [];

    const departements =
        typeof getDepartementsData === "function"
            ? getDepartementsData()
            : [];

    const sifahData =
        typeof getSifahData === "function"
            ? getSifahData()
            : [];

    const wadhiaData =
        typeof getWadhiaData === "function"
            ? getWadhiaData()
            : [];


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
    // CONVERSION DES DONNÉES
    // ========================================================

    const rows = list.map(function (e) {

        // ----------------------------------------------------
        // GRADE
        // ----------------------------------------------------

        let gradeNom = "";

        const grade = grades.find(function (g) {

            return g.id === e.gradeId;

        });

        if (grade) {

            gradeNom = grade.nom || "";

        }


        // ----------------------------------------------------
        // SPECIALITE
        // ----------------------------------------------------

        let specialiteNom = "";

        const specialite = specialites.find(function (s) {

            return s.id === e.specialiteId;

        });

        if (specialite) {

            specialiteNom = specialite.nom || "";

        }


        // ----------------------------------------------------
        // DEPARTEMENT
        // ----------------------------------------------------

        let departementNom = "";

        const departement = departements.find(function (d) {

            return d.id === e.departementId;

        });

        if (departement) {

            departementNom = departement.nom || "";

        }


        // ----------------------------------------------------
        // SIFAH
        // ----------------------------------------------------

        let sifahNom = "";

        const sifah = sifahData.find(function (s) {

            return s.code === e.sifah;

        });

        if (sifah) {

            sifahNom = sifah.nom || "";

        }

        // Si aucun nom trouvé,
        // garder le code

        if (!sifahNom) {

            sifahNom = e.sifah || "";

        }


        // ----------------------------------------------------
        // WADHIA
        // ----------------------------------------------------

        let wadhiaNom = "";

        const wadhia = wadhiaData.find(function (w) {

            return w.code === e.wadhia;

        });

        if (wadhia) {

            wadhiaNom = wadhia.nom || "";

        }

        // Si aucun nom trouvé,
        // garder le code

        if (!wadhiaNom) {

            wadhiaNom = e.wadhia || "";

        }


        // ----------------------------------------------------
        // ANNÉE UNIVERSITAIRE
        // ----------------------------------------------------

        const annee =
            e.anneeUniversitaire || "";


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

            genreNom = e.genre || "";

        }


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
    // VÉRIFICATION
    // ========================================================

    if (rows.length === 0) {

        alert("لا توجد بيانات للتصدير");

        return;
    }


    // ========================================================
    // CRÉATION FEUILLE
    // ========================================================

    const ws =
        XLSX.utils.aoa_to_sheet([
            headers,
            ...rows
        ]);


    // ========================================================
    // LARGEUR DES COLONNES
    // ========================================================

    ws["!cols"] = [

        { wch: 8 },       // الرقم

        { wch: 18 },      // CNRPS

        { wch: 20 },      // اللقب

        { wch: 20 },      // الاسم

        { wch: 25 },      // الرتبة

        { wch: 25 },      // التخصص

        { wch: 25 },      // القسم

        { wch: 15 },      // الهاتف 1

        { wch: 15 },      // الهاتف 2

        { wch: 30 },      // email

        { wch: 20 },      // الصفة

        { wch: 20 },      // الوضعية

        { wch: 18 },      // السنة الجامعية

        { wch: 12 },      // الجنس

        { wch: 18 },      // تاريخ التوظيف

        { wch: 18 },      // تاريخ الميلاد

        { wch: 18 }       // تاريخ آخر رتبة

    ];


    // ========================================================
    // ALIGNEMENT
    // ========================================================

    ws["!rtl"] = true;


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

    const date =
        new Date()
            .toISOString()
            .slice(0, 10);


    const filename =
        "SIGE_Enseignants_" +
        date +
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
            "SIGE : Export Excel effectué avec succès :",
            filename
        );

    }
    catch (error) {

        console.error(
            "SIGE : erreur export Excel :",
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
    // Récupérer enseignants
    // --------------------------------------------------------

    let data = [];

    if (
        Array.isArray(window.enseignantsData)
    ) {

        data = window.enseignantsData;

    }


    // --------------------------------------------------------
    // Vérification
    // --------------------------------------------------------

    if (data.length === 0) {

        alert("لا توجد بيانات الأساتذة");

        return;
    }


    // --------------------------------------------------------
    // Vérifier XLSX
    // --------------------------------------------------------

    if (typeof XLSX === "undefined") {

        alert(
            "مكتبة Excel غير محملة."
        );

        console.error(
            "SIGE : XLSX / SheetJS n'est pas chargé."
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
    // CRÉATION CLASSEUR
    // ========================================================

    const wb =
        XLSX.utils.book_new();


    // ========================================================
    // CRÉATION FEUILLE
    // ========================================================

    const ws =
        XLSX.utils.aoa_to_sheet(kpis);


    // ========================================================
    // LARGEUR
    // ========================================================

    ws["!cols"] = [

        { wch: 30 },

        { wch: 15 }

    ];


    // ========================================================
    // RTL
    // ========================================================

    ws["!rtl"] = true;


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
    // TÉLÉCHARGEMENT
    // ========================================================

    try {

        XLSX.writeFile(
            wb,
            filename
        );

        console.log(
            "SIGE : Export SIAD effectué :",
            filename
        );

    }
    catch (error) {

        console.error(
            "SIGE : erreur export SIAD :",
            error
        );

        alert(
            "حدث خطأ أثناء تصدير إحصائيات SIAD : " +
            error.message
        );

    }

}


// ============================================================
// FIN
// ============================================================

console.log(
    "SIGE - export.js chargé correctement"
);
```
