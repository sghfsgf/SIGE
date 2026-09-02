```javascript
// ============================================================
// SIGE - EXPORT EXCEL
// ============================================================
// Export des enseignants + Export SIAD
// Version robuste
// ============================================================


// ============================================================
// INITIALISATION DES BOUTONS
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    initialiserExport();

});


// ============================================================
// INITIALISER EXPORT
// ============================================================

function initialiserExport() {

    console.log("SIGE - Initialisation export.js");

    // --------------------------------------------------------
    // Bouton Export Enseignants
    // --------------------------------------------------------

    const btnExport = document.getElementById("btn-export");

    if (btnExport) {

        // Éviter d'attacher plusieurs fois le même événement
        btnExport.removeEventListener("click", gererExportEnseignants);
        btnExport.addEventListener("click", gererExportEnseignants);

        console.log("Bouton #btn-export trouvé");

    } else {

        console.warn(
            "Bouton #btn-export introuvable."
        );

    }


    // --------------------------------------------------------
    // Bouton Export SIAD
    // --------------------------------------------------------

    const btnExportSIAD =
        document.getElementById("btn-export-siad");

    if (btnExportSIAD) {

        btnExportSIAD.removeEventListener(
            "click",
            gererExportSIAD
        );

        btnExportSIAD.addEventListener(
            "click",
            gererExportSIAD
        );

        console.log(
            "Bouton #btn-export-siad trouvé"
        );

    }

}


// ============================================================
// GESTION EXPORT ENSEIGNANTS
// ============================================================

function gererExportEnseignants(event) {

    event.preventDefault();

    console.log(
        "Clic sur bouton Export Enseignants"
    );


    // --------------------------------------------------------
    // Vérifier enseignantsData
    // --------------------------------------------------------

    if (
        typeof enseignantsData === "undefined" ||
        !Array.isArray(enseignantsData)
    ) {

        alert(
            "لا توجد بيانات الأساتذة"
        );

        console.error(
            "enseignantsData est introuvable."
        );

        return;
    }


    // --------------------------------------------------------
    // Déterminer les données à exporter
    // --------------------------------------------------------
    //
    // Si enseignantsFiltresActuels contient des données :
    // export des résultats filtrés.
    //
    // Sinon :
    // export de tous les enseignants chargés.
    //
    // --------------------------------------------------------

    let listeExport = enseignantsData;


    if (
        Array.isArray(window.enseignantsFiltresActuels) &&
        window.enseignantsFiltresActuels.length > 0
    ) {

        listeExport =
            window.enseignantsFiltresActuels;

        console.log(
            "Export des résultats filtrés :",
            listeExport.length
        );

    } else {

        console.log(
            "Export de tous les enseignants :",
            listeExport.length
        );

    }


    // --------------------------------------------------------
    // Vérifier nombre
    // --------------------------------------------------------

    if (
        !Array.isArray(listeExport) ||
        listeExport.length === 0
    ) {

        alert(
            "لا توجد بيانات الأساتذة للتصدير"
        );

        return;
    }


    // --------------------------------------------------------
    // Lancer export
    // --------------------------------------------------------

    exportEnseignants(listeExport);

}


// ============================================================
// GESTION EXPORT SIAD
// ============================================================

function gererExportSIAD(event) {

    event.preventDefault();

    console.log(
        "Clic sur bouton Export SIAD"
    );

    exportSIAD();

}


// ============================================================
// EXPORT LISTE DES ENSEIGNANTS
// ============================================================

function exportEnseignants(list) {

    console.log(
        "Début export enseignants :",
        list.length
    );


    // ========================================================
    // VÉRIFICATION DES DONNÉES
    // ========================================================

    if (
        !Array.isArray(list) ||
        list.length === 0
    ) {

        alert(
            "لا توجد بيانات الأساتذة"
        );

        return;
    }


    // ========================================================
    // VÉRIFICATION SHEETJS
    // ========================================================

    if (typeof XLSX === "undefined") {

        alert(
            "مكتبة Excel غير محملة. يرجى التأكد من تحميل SheetJS."
        );

        console.error(
            "Erreur : XLSX est undefined."
        );

        return;
    }


    console.log(
        "SheetJS détecté correctement."
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
    // PRÉPARER LES DONNÉES
    // ========================================================

    const rows = list.map(function (e) {


        // ====================================================
        // GRADE
        // ====================================================

        let gradeNom = "";

        if (
            typeof getGradesData === "function"
        ) {

            const grades =
                getGradesData() || [];

            const grade =
                grades.find(function (g) {

                    return g.id === e.gradeId;

                });

            if (grade) {

                gradeNom =
                    grade.nom || "";

            }

        }


        // ====================================================
        // SPECIALITE
        // ====================================================

        let specialiteNom = "";

        if (
            typeof getSpecialitesData === "function"
        ) {

            const specialites =
                getSpecialitesData() || [];

            const specialite =
                specialites.find(function (s) {

                    return s.id === e.specialiteId;

                });

            if (specialite) {

                specialiteNom =
                    specialite.nom || "";

            }

        }


        // ====================================================
        // DEPARTEMENT
        // ====================================================

        let departementNom = "";

        if (
            typeof getDepartementsData === "function"
        ) {

            const departements =
                getDepartementsData() || [];

            const departement =
                departements.find(function (d) {

                    return d.id === e.departementId;

                });

            if (departement) {

                departementNom =
                    departement.nom || "";

            }

        }


        // ====================================================
        // SIFAH
        // ====================================================

        let sifahNom = "";

        if (
            typeof getSifahData === "function"
        ) {

            const sifahData =
                getSifahData() || [];

            const sifah =
                sifahData.find(function (s) {

                    return s.code === e.sifah;

                });

            if (sifah) {

                sifahNom =
                    sifah.nom || "";

            }

        }

        // Si aucun libellé trouvé,
        // conserver le code

        if (!sifahNom) {

            sifahNom =
                e.sifah || "";

        }


        // ====================================================
        // WADHIA
        // ====================================================

        let wadhiaNom = "";

        if (
            typeof getWadhiaData === "function"
        ) {

            const wadhiaData =
                getWadhiaData() || [];

            const wadhia =
                wadhiaData.find(function (w) {

                    return w.code === e.wadhia;

                });

            if (wadhia) {

                wadhiaNom =
                    wadhia.nom || "";

            }

        }

        // Si aucun libellé trouvé,
        // conserver le code

        if (!wadhiaNom) {

            wadhiaNom =
                e.wadhia || "";

        }


        // ====================================================
        // ANNÉE UNIVERSITAIRE
        // ====================================================

        const annee =
            e.anneeUniversitaire || "";


        // ====================================================
        // GENRE
        // ====================================================

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
        // LIGNE
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

        alert(
            "لا توجد بيانات صالحة للتصدير"
        );

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

        { wch: 8 },

        { wch: 18 },

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
    // ALIGNEMENT RTL
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
            "Export Excel effectué avec succès :",
            filename
        );

        alert(
            "تم تصدير بيانات الأساتذة بنجاح"
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


    // ========================================================
    // VÉRIFICATION
    // ========================================================

    if (
        typeof enseignantsData === "undefined" ||
        !Array.isArray(enseignantsData)
    ) {

        alert(
            "لا توجد بيانات الأساتذة"
        );

        return;
    }


    if (enseignantsData.length === 0) {

        alert(
            "لا توجد بيانات الأساتذة"
        );

        return;
    }


    // ========================================================
    // VÉRIFICATION XLSX
    // ========================================================

    if (typeof XLSX === "undefined") {

        alert(
            "مكتبة Excel غير محملة."
        );

        console.error(
            "XLSX est undefined."
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
            enseignantsData.length
        ],

        [
            "مرسم",
            enseignantsData.filter(function (e) {

                return e.sifah === "titulaire";

            }).length
        ],

        [
            "متعاقد",
            enseignantsData.filter(function (e) {

                return e.sifah === "contractuel";

            }).length
        ],

        [
            "عرضي",
            enseignantsData.filter(function (e) {

                return e.sifah === "vacataire";

            }).length
        ],

        [
            "ذكور",
            enseignantsData.filter(function (e) {

                return e.genre === "homme";

            }).length
        ],

        [
            "إناث",
            enseignantsData.filter(function (e) {

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
            "تم تصدير مؤشرات SIAD بنجاح"
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
// FIN
// ============================================================

console.log(
    "SIGE - export.js chargé correctement"
);
```
