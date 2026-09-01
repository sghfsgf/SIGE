// ============================================================
// SIGE - EXPORT EXCEL
// ============================================================


// ============================================================
// BOUTON EXPORT ENSEIGNANTS
// ============================================================

document
    .getElementById("btn-export")
    ?.addEventListener("click", function () {

        if (
            typeof enseignants === "undefined" ||
            !Array.isArray(enseignants)
        ) {

            alert("لا توجد بيانات الأساتذة");

            return;
        }

        exportEnseignants(enseignants);

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

    if (
        !Array.isArray(list) ||
        list.length === 0
    ) {

        alert("لا توجد بيانات");

        return;
    }


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


    const rows = list.map(function (e) {


        // ----------------------------------------------------
        // GRADE
        // ----------------------------------------------------

        let gradeNom = "";

        if (
            typeof gradesList !== "undefined" &&
            Array.isArray(gradesList)
        ) {

            const grade =
                gradesList.find(function (g) {

                    return g.id === e.gradeId;

                });

            if (grade) {

                gradeNom = grade.nom || "";

            }

        }


        // ----------------------------------------------------
        // SPECIALITE
        // ----------------------------------------------------

        let specialiteNom = "";

        if (
            typeof specialitesList !== "undefined" &&
            Array.isArray(specialitesList)
        ) {

            const specialite =
                specialitesList.find(function (s) {

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
            typeof departementsList !== "undefined" &&
            Array.isArray(departementsList)
        ) {

            const departement =
                departementsList.find(function (d) {

                    return d.id === e.departementId;

                });

            if (departement) {

                departementNom =
                    departement.nom || "";

            }

        }


        // ----------------------------------------------------
        // RETOURNEE
        // ----------------------------------------------------

        return [

            e.numero || "",

            e.matriculeCNRPS || "",

            e.nom || "",

            e.prenom || "",

            gradeNom,

            specialiteNom,

            departementNom,

            e.tel1 || "",

            e.tel2 || "",

            e.email || "",

            // الصفة
            e.sifah || "",

            // الوضعية
            e.wadhia || "",

            // السنة الجامعية
            e.anneeUniversitaire || "",

            // الجنس
            e.genre === "homme"
                ? "ذكر"
                : e.genre === "femme"
                    ? "أنثى"
                    : "",

            e.dateRecrutement || "",

            e.dateNaissance || "",

            e.dateDernierGrade || ""

        ];

    });


    // --------------------------------------------------------
    // CREATION FEUILLE EXCEL
    // --------------------------------------------------------

    const ws =
        XLSX.utils.aoa_to_sheet([
            headers,
            ...rows
        ]);


    // --------------------------------------------------------
    // CREATION CLASSEUR
    // --------------------------------------------------------

    const wb =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "الأساتذة"
    );


    // --------------------------------------------------------
    // NOM DU FICHIER
    // --------------------------------------------------------

    const date =
        new Date()
            .toISOString()
            .slice(0, 10);


    // Nom volontairement simple
    // pour éviter tout problème de syntaxe
    const filename =
        "SIGE_Enseignants_" +
        date +
        ".xlsx";


    XLSX.writeFile(
        wb,
        filename
    );

}


// ============================================================
// EXPORT SIAD
// ============================================================

function exportSIAD() {

    if (
        typeof enseignants === "undefined" ||
        !Array.isArray(enseignants)
    ) {

        alert("لا توجد بيانات الأساتذة");

        return;
    }


    const kpis = [

        [
            "المؤشر",
            "القيمة"
        ],


        [
            "إجمالي الأساتذة",
            enseignants.length
        ],


        [
            "مرسم",
            enseignants.filter(function (e) {

                return e.sifah === "titulaire";

            }).length
        ],


        [
            "متعاقد",
            enseignants.filter(function (e) {

                return e.sifah === "contractuel";

            }).length
        ],


        [
            "عرضي",
            enseignants.filter(function (e) {

                return e.sifah === "vacataire";

            }).length
        ],


        [
            "ذكور",
            enseignants.filter(function (e) {

                return e.genre === "homme";

            }).length
        ],


        [
            "إناث",
            enseignants.filter(function (e) {

                return e.genre === "femme";

            }).length
        ]

    ];


    // --------------------------------------------------------
    // CREATION EXCEL
    // --------------------------------------------------------

    const wb =
        XLSX.utils.book_new();


    const ws =
        XLSX.utils.aoa_to_sheet(kpis);


    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "المؤشرات"
    );


    // --------------------------------------------------------
    // NOM DU FICHIER
    // --------------------------------------------------------

    const date =
        new Date()
            .toISOString()
            .slice(0, 10);


    XLSX.writeFile(
        wb,
        "SIGE_SIAD_" +
        date +
        ".xlsx"
    );

}


// ============================================================
// FIN
// ============================================================

console.log(
    "SIGE - export.js chargé correctement"
);
