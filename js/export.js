// ============================================================
// SIGE - EXPORT EXCEL
// ============================================================
// Export des enseignants actuellement présents dans la liste
// Export selon recherche + filtres
// Export SIAD
// ============================================================


// ============================================================
// INITIALISATION DES BOUTONS
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initialiserExport();

    }
);


// ============================================================
// INITIALISER EXPORT
// ============================================================

function initialiserExport() {

    // --------------------------------------------------------
    // Bouton Export Enseignants
    // --------------------------------------------------------

    const btnExport =
        document.getElementById(
            "btn-export"
        );


    if (btnExport) {

        btnExport.addEventListener(
            "click",
            function () {

                exporterEnseignantsFiltres();

            }
        );

    }
    else {

        console.warn(
            "Bouton #btn-export introuvable"
        );

    }


    // --------------------------------------------------------
    // Bouton Export SIAD
    // --------------------------------------------------------

    const btnExportSIAD =
        document.getElementById(
            "btn-export-siad"
        );


    if (btnExportSIAD) {

        btnExportSIAD.addEventListener(
            "click",
            function () {

                exportSIAD();

            }
        );

    }

}


// ============================================================
// EXPORT DES ENSEIGNANTS FILTRES
// ============================================================

function exporterEnseignantsFiltres() {

    // --------------------------------------------------------
    // Récupérer la liste filtrée
    // --------------------------------------------------------

    let liste = [];


    if (
        Array.isArray(
            window.enseignantsFiltresActuels
        )
    ) {

        liste =
            window.enseignantsFiltresActuels;

    }


    // --------------------------------------------------------
    // Sécurité : si la variable filtrée est vide
    // mais que les enseignants existent
    // --------------------------------------------------------

    if (
        liste.length === 0 &&
        typeof enseignantsData !== "undefined" &&
        Array.isArray(enseignantsData)
    ) {

        // Vérifier si réellement aucun enseignant
        if (enseignantsData.length === 0) {

            alert(
                "لا توجد بيانات الأساتذة"
            );

            return;

        }

        // Si les filtres n'ont pas encore été calculés,
        // utiliser les données disponibles.

        if (
            typeof appliquerFiltres ===
            "function"
        ) {

            appliquerFiltres();

        }


        if (
            Array.isArray(
                window.enseignantsFiltresActuels
            )
        ) {

            liste =
                window.enseignantsFiltresActuels;

        }

    }


    // --------------------------------------------------------
    // Vérification finale
    // --------------------------------------------------------

    if (
        !Array.isArray(liste) ||
        liste.length === 0
    ) {

        alert(
            "لا توجد بيانات مطابقة للتصدير"
        );

        return;

    }


    console.log(
        "Nombre d'enseignants à exporter :",
        liste.length
    );


    exportEnseignants(
        liste
    );

}


// ============================================================
// EXPORT LISTE ENSEIGNANTS
// ============================================================

function exportEnseignants(list) {

    // --------------------------------------------------------
    // Vérification
    // --------------------------------------------------------

    if (
        !Array.isArray(list) ||
        list.length === 0
    ) {

        alert(
            "لا توجد بيانات الأساتذة"
        );

        return;

    }


    // --------------------------------------------------------
    // Vérifier SheetJS
    // --------------------------------------------------------

    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "مكتبة Excel غير محملة. يرجى إعادة تحميل الصفحة."
        );


        console.error(
            "XLSX n'est pas chargé."
        );


        return;

    }


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
    // PREPARER LES DONNEES DE REFERENCE
    // ========================================================

    const grades =
        typeof getGradesData ===
        "function"
            ? getGradesData()
            : [];


    const specialites =
        typeof getSpecialitesData ===
        "function"
            ? getSpecialitesData()
            : [];


    const departements =
        typeof getDepartementsData ===
        "function"
            ? getDepartementsData()
            : [];


    const sifahData =
        typeof getSifahData ===
        "function"
            ? getSifahData()
            : [];


    const wadhiaData =
        typeof getWadhiaData ===
        "function"
            ? getWadhiaData()
            : [];


    // ========================================================
    // CONSTRUIRE LES LIGNES
    // ========================================================

    const rows =
        list.map(
            function (e) {

                // ------------------------------------------------
                // Grade
                // ------------------------------------------------

                const grade =
                    grades.find(
                        function (g) {

                            return (
                                g.id ===
                                e.gradeId
                            );

                        }
                    );


                const gradeNom =
                    grade
                        ? grade.nom || ""
                        : "";


                // ------------------------------------------------
                // Spécialité
                // ------------------------------------------------

                const specialite =
                    specialites.find(
                        function (s) {

                            return (
                                s.id ===
                                e.specialiteId
                            );

                        }
                    );


                const specialiteNom =
                    specialite
                        ? specialite.nom || ""
                        : "";


                // ------------------------------------------------
                // Département
                // ------------------------------------------------

                const departement =
                    departements.find(
                        function (d) {

                            return (
                                d.id ===
                                e.departementId
                            );

                        }
                    );


                const departementNom =
                    departement
                        ? departement.nom || ""
                        : "";


                // ------------------------------------------------
                // Sifah
                // ------------------------------------------------

                const sifah =
                    sifahData.find(
                        function (s) {

                            return (
                                s.code ===
                                e.sifah
                            );

                        }
                    );


                const sifahNom =
                    sifah
                        ? sifah.nom || ""
                        : (
                            e.sifah || ""
                        );


                // ------------------------------------------------
                // Wadhia
                // ------------------------------------------------

                const wadhia =
                    wadhiaData.find(
                        function (w) {

                            return (
                                w.code ===
                                e.wadhia
                            );

                        }
                    );


                const wadhiaNom =
                    wadhia
                        ? wadhia.nom || ""
                        : (
                            e.wadhia || ""
                        );


                // ------------------------------------------------
                // Genre
                // ------------------------------------------------

                let genreNom = "";


                if (
                    e.genre ===
                    "homme"
                ) {

                    genreNom =
                        "ذكر";

                }
                else if (
                    e.genre ===
                    "femme"
                ) {

                    genreNom =
                        "أنثى";

                }


                // ------------------------------------------------
                // Ligne Excel
                // ------------------------------------------------

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

                    e.anneeUniversitaire ?? "",

                    genreNom,

                    e.dateRecrutement ?? "",

                    e.dateNaissance ?? "",

                    e.dateDernierGrade ?? ""

                ];

            }
        );


    // ========================================================
    // FEUILLE EXCEL
    // ========================================================

    const ws =
        XLSX.utils.aoa_to_sheet(
            [
                headers,
                ...rows
            ]
        );


    // ========================================================
    // LARGEUR COLONNES
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
    // CLASSEUR
    // ========================================================

    const wb =
        XLSX.utils.book_new();


    // ========================================================
    // AJOUTER FEUILLE
    // ========================================================

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "الأساتذة"
    );


    // ========================================================
    // NOM FICHIER
    // ========================================================

    const date =
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );


    const filename =
        "SIGE_Enseignants_" +
        date +
        ".xlsx";


    // ========================================================
    // TELECHARGEMENT
    // ========================================================

    try {

        XLSX.writeFile(
            wb,
            filename
        );


        console.log(
            "Export Excel effectué :",
            filename
        );


        console.log(
            "Nombre de lignes exportées :",
            rows.length
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
    // Vérification
    // --------------------------------------------------------

    if (
        typeof enseignantsData ===
        "undefined" ||
        !Array.isArray(
            enseignantsData
        )
    ) {

        alert(
            "لا توجد بيانات الأساتذة"
        );

        return;

    }


    if (
        enseignantsData.length ===
        0
    ) {

        alert(
            "لا توجد بيانات الأساتذة"
        );

        return;

    }


    // --------------------------------------------------------
    // Vérifier XLSX
    // --------------------------------------------------------

    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "مكتبة Excel غير محملة."
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
            enseignantsData.filter(
                function (e) {

                    return (
                        e.sifah ===
                        "titulaire"
                    );

                }
            ).length
        ],

        [
            "متعاقد",
            enseignantsData.filter(
                function (e) {

                    return (
                        e.sifah ===
                        "contractuel"
                    );

                }
            ).length
        ],

        [
            "عرضي",
            enseignantsData.filter(
                function (e) {

                    return (
                        e.sifah ===
                        "vacataire"
                    );

                }
            ).length
        ],

        [
            "ذكور",
            enseignantsData.filter(
                function (e) {

                    return (
                        e.genre ===
                        "homme"
                    );

                }
            ).length
        ],

        [
            "إناث",
            enseignantsData.filter(
                function (e) {

                    return (
                        e.genre ===
                        "femme"
                    );

                }
            ).length
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

        {
            wch: 30
        },

        {
            wch: 15
        }

    ];


    // ========================================================
    // AJOUT
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
            .slice(
                0,
                10
            );


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
