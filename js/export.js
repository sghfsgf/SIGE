// ============================================================
// SIGE - EXPORT EXCEL
// ============================================================


// ============================================================
// BOUTON EXPORT ENSEIGNANTS
// ============================================================

document
    .getElementById("btn-export")
    ?.addEventListener("click", function () {

        // ----------------------------------------------------
        // Vérifier que les données existent
        // ----------------------------------------------------

        if (
            typeof enseignantsData === "undefined" ||
            !Array.isArray(enseignantsData)
        ) {

            alert("لا توجد بيانات الأساتذة");

            return;
        }


        // ----------------------------------------------------
        // Vérifier qu'il y a des enseignants
        // ----------------------------------------------------

        if (enseignantsData.length === 0) {

            alert("لا توجد بيانات الأساتذة");

            return;
        }


        // ----------------------------------------------------
        // Export
        // ----------------------------------------------------

        exportEnseignants(enseignantsData);

    });


// ============================================================
// BOUTON EXPORT SIAD
// ============================================================

document
    .getElementById("btn-export-siad")
    ?.addEventListener("click", function () {

        exportSIAD();

    });


// ============================================================
// EXPORT LISTE DES ENSEIGNANTS
// ============================================================

function exportEnseignants(list) {

    // --------------------------------------------------------
    // Vérification
    // --------------------------------------------------------

    if (
        !Array.isArray(list) ||
        list.length === 0
    ) {

        alert("لا توجد بيانات الأساتذة");

        return;
    }


    // --------------------------------------------------------
    // Vérifier que SheetJS est chargé
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
    // DONNÉES
    // ========================================================

    const rows = list.map(function (e) {


        // ----------------------------------------------------
        // GRADE
        // ----------------------------------------------------

        let gradeNom = "";


        if (
            typeof getGradesData === "function"
        ) {

            const grades =
                getGradesData();


            const grade =
                grades.find(function (g) {

                    return g.id === e.gradeId;

                });


            if (grade) {

                gradeNom =
                    grade.nom || "";

            }

        }


        // ----------------------------------------------------
        // SPECIALITE
        // ----------------------------------------------------

        let specialiteNom = "";


        if (
            typeof getSpecialitesData === "function"
        ) {

            const specialites =
                getSpecialitesData();


            const specialite =
                specialites.find(function (s) {

                    return s.id === e.specialiteId;

                });


            if (specialite) {

                specialiteNom =
                    specialite.nom || "";

            }

        }


        // ----------------------------------------------------
        // DEPARTEMENT
        // ----------------------------------------------------

        let departementNom = "";


        if (
            typeof getDepartementsData === "function"
        ) {

            const departements =
                getDepartementsData();


            const departement =
                departements.find(function (d) {

                    return d.id === e.departementId;

                });


            if (departement) {

                departementNom =
                    departement.nom || "";

            }

        }


        // ----------------------------------------------------
        // SIFAH
        // ----------------------------------------------------
        // Dans enseignants.js :
        //
        // e.sifah = CODE
        //
        // Exemple :
        // titulaire
        // contractuel
        // vacataire
        //
        // On cherche donc le NOM correspondant.
        // ----------------------------------------------------

        let sifahNom = "";


        if (
            typeof getSifahData === "function"
        ) {

            const sifahData =
                getSifahData();


            const sifah =
                sifahData.find(function (s) {

                    return s.code === e.sifah;

                });


            if (sifah) {

                sifahNom =
                    sifah.nom || "";

            }

        }


        // Si aucun nom n'est trouvé,
        // on exporte le code

        if (!sifahNom) {

            sifahNom =
                e.sifah || "";

        }


        // ----------------------------------------------------
        // WADHIA
        // ----------------------------------------------------
        // Même principe :
        // e.wadhia contient le CODE.
        // ----------------------------------------------------

        let wadhiaNom = "";


        if (
            typeof getWadhiaData === "function"
        ) {

            const wadhiaData =
                getWadhiaData();


            const wadhia =
                wadhiaData.find(function (w) {

                    return w.code === e.wadhia;

                });


            if (wadhia) {

                wadhiaNom =
                    wadhia.nom || "";

            }

        }


        // Si aucun nom n'est trouvé,
        // on exporte le code

        if (!wadhiaNom) {

            wadhiaNom =
                e.wadhia || "";

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
        XLSX.utils.aoa_to_sheet([
            headers,
            ...rows
        ]);


    // ========================================================
    // LARGEUR DES COLONNES
    // ========================================================

    ws["!cols"] = [

        { wch: 8 },   // الرقم

        { wch: 18 },  // CNRPS

        { wch: 20 },  // اللقب

        { wch: 20 },  // الاسم

        { wch: 25 },  // الرتبة

        { wch: 25 },  // التخصص

        { wch: 25 },  // القسم

        { wch: 15 },  // الهاتف 1

        { wch: 15 },  // الهاتف 2

        { wch: 30 },  // email

        { wch: 20 },  // الصفة

        { wch: 20 },  // الوضعية

        { wch: 18 },  // السنة

        { wch: 12 },  // الجنس

        { wch: 18 },  // تاريخ التوظيف

        { wch: 18 },  // تاريخ الميلاد

        { wch: 18 }   // تاريخ آخر رتبة

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
            "Export Excel effectué :",
            filename
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
    // Vérification données
    // --------------------------------------------------------

    if (
        typeof enseignantsData === "undefined" ||
        !Array.isArray(enseignantsData)
    ) {

        alert("لا توجد بيانات الأساتذة");

        return;
    }


    if (enseignantsData.length === 0) {

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
    // CLASSEUR
    // ========================================================

    const wb =
        XLSX.utils.book_new();


    // ========================================================
    // FEUILLE
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
