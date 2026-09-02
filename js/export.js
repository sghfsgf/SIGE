// ============================================================
// SIGE - EXPORT EXCEL
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("SIGE - export.js démarrage");

    const btnExport = document.getElementById("btn-export");

    if (!btnExport) {
        console.error("Bouton #btn-export introuvable");
        return;
    }

    btnExport.addEventListener("click", function () {

        console.log("Bouton Export Excel cliqué");

        if (typeof enseignantsData === "undefined") {
            alert("Les données des enseignants ne sont pas disponibles.");
            console.error("enseignantsData est undefined");
            return;
        }

        console.log("Nombre d'enseignants :", enseignantsData.length);

        if (!Array.isArray(enseignantsData) || enseignantsData.length === 0) {
            alert("لا توجد بيانات الأساتذة");
            return;
        }

        if (typeof XLSX === "undefined") {
            alert("مكتبة Excel غير محملة.");
            console.error("XLSX est undefined");
            return;
        }

        exportEnseignants(enseignantsData);
    });


    const btnExportSIAD =
        document.getElementById("btn-export-siad");

    if (btnExportSIAD) {

        btnExportSIAD.addEventListener("click", function () {

            console.log("Bouton Export SIAD cliqué");

            exportSIAD();

        });

    }

});


function exportEnseignants(list) {

    console.log("Début export enseignants");
    console.log("Nombre de lignes :", list.length);

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

    const sifahs =
        typeof getSifahData === "function"
            ? getSifahData()
            : [];

    const wadhias =
        typeof getWadhiaData === "function"
            ? getWadhiaData()
            : [];


    const rows = list.map(function (e) {

        const grade =
            grades.find(g => g.id === e.gradeId);

        const specialite =
            specialites.find(s => s.id === e.specialiteId);

        const departement =
            departements.find(d => d.id === e.departementId);

        const sifah =
            sifahs.find(s => s.code === e.sifah);

        const wadhia =
            wadhias.find(w => w.code === e.wadhia);


        let genre = "";

        if (e.genre === "homme") {
            genre = "ذكر";
        }
        else if (e.genre === "femme") {
            genre = "أنثى";
        }


        return [

            e.numero ?? "",

            e.matriculeCNRPS ?? "",

            e.nom ?? "",

            e.prenom ?? "",

            grade ? grade.nom : "",

            specialite ? specialite.nom : "",

            departement ? departement.nom : "",

            e.tel1 ?? "",

            e.tel2 ?? "",

            e.email ?? "",

            sifah ? sifah.nom : (e.sifah ?? ""),

            wadhia ? wadhia.nom : (e.wadhia ?? ""),

            e.anneeUniversitaire ?? "",

            genre,

            e.dateRecrutement ?? "",

            e.dateNaissance ?? "",

            e.dateDernierGrade ?? ""

        ];

    });


    console.log("Lignes Excel préparées :", rows.length);


    const ws =
        XLSX.utils.aoa_to_sheet([
            headers,
            ...rows
        ]);


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


    const wb =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "الأساتذة"
    );


    const date =
        new Date()
            .toISOString()
            .slice(0, 10);


    const filename =
        "SIGE_Enseignants_" +
        date +
        ".xlsx";


    try {

        XLSX.writeFile(
            wb,
            filename
        );

        console.log(
            "Export Excel effectué :",
            filename
        );

        alert("تم تصدير قائمة الأساتذة بنجاح");

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


function exportSIAD() {

    if (
        typeof enseignantsData === "undefined" ||
        !Array.isArray(enseignantsData) ||
        enseignantsData.length === 0
    ) {

        alert("لا توجد بيانات الأساتذة");

        return;
    }


    if (typeof XLSX === "undefined") {

        alert("مكتبة Excel غير محملة.");

        return;
    }


    const kpis = [

        ["المؤشر", "القيمة"],

        [
            "إجمالي الأساتذة",
            enseignantsData.length
        ],

        [
            "مرسم",
            enseignantsData.filter(
                e => e.sifah === "titulaire"
            ).length
        ],

        [
            "متعاقد",
            enseignantsData.filter(
                e => e.sifah === "contractuel"
            ).length
        ],

        [
            "عرضي",
            enseignantsData.filter(
                e => e.sifah === "vacataire"
            ).length
        ],

        [
            "ذكور",
            enseignantsData.filter(
                e => e.genre === "homme"
            ).length
        ],

        [
            "إناث",
            enseignantsData.filter(
                e => e.genre === "femme"
            ).length
        ]

    ];


    const wb =
        XLSX.utils.book_new();


    const ws =
        XLSX.utils.aoa_to_sheet(kpis);


    ws["!cols"] = [
        { wch: 30 },
        { wch: 15 }
    ];


    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "المؤشرات"
    );


    const date =
        new Date()
            .toISOString()
            .slice(0, 10);


    const filename =
        "SIGE_SIAD_" +
        date +
        ".xlsx";


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


console.log(
    "SIGE - export.js chargé correctement"
);
