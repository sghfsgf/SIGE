// ============================================================
// SIGE - EXPORT EXCEL (Version améliorée - Export des données affichées)
// ============================================================

// ============================================================
// BOUTON EXPORT ENSEIGNANTS
// ============================================================

document.getElementById("btn-export")?.addEventListener("click", function () {

    let dataToExport = [];

    if (typeof enseignantsFiltresActuels !== "undefined" && enseignantsFiltresActuels.length > 0) {
        dataToExport = enseignantsFiltresActuels;
    } else if (typeof enseignantsData !== "undefined" && Array.isArray(enseignantsData)) {
        dataToExport = enseignantsData;
    }

    if (dataToExport.length === 0) {
        alert("لا توجد بيانات الأساتذة");
        return;
    }

    exportEnseignants(dataToExport);
});


// ============================================================
// BOUTON EXPORT SIAD
// ============================================================

document.getElementById("btn-export-siad")?.addEventListener("click", function () {
    exportSIAD();
});


// ============================================================
// EXPORT LISTE DES ENSEIGNANTS
// ============================================================

function exportEnseignants(list) {

    if (!Array.isArray(list) || list.length === 0) {
        alert("لا توجد بيانات الأساتذة");
        return;
    }

    if (typeof XLSX === "undefined") {
        alert("مكتبة Excel غير محملة. يرجى إعادة تحميل الصفحة.");
        console.error("XLSX n'est pas chargé.");
        return;
    }

    const headers = [
        "الرقم", "رقم التسجيل CNRPS", "اللقب", "الاسم", "الرتبة", "التخصص",
        "القسم", "الهاتف 1", "الهاتف 2", "البريد الإلكتروني", "الصفة",
        "الوضعية", "السنة الجامعية", "الجنس", "تاريخ التوظيف", 
        "تاريخ الميلاد", "تاريخ آخر رتبة"
    ];

    const rows = list.map(function (e) {

        let gradeNom = trouverNomGrade ? trouverNomGrade(e.gradeId) : "";
        let specialiteNom = trouverNomSpecialite ? trouverNomSpecialite(e.specialiteId) : "";
        let departementNom = trouverNomDepartement ? trouverNomDepartement(e.departementId) : "";
        let sifahNom = trouverNomSifah ? trouverNomSifah(e.sifah) : (e.sifah || "");
        let wadhiaNom = trouverNomWadhia ? trouverNomWadhia(e.wadhia) : (e.wadhia || "");
        let genreNom = (e.genre === "femme") ? "أنثى" : "ذكر";

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
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    ws["!cols"] = [
        { wch: 8 }, { wch: 18 }, { wch: 22 }, { wch: 22 }, { wch: 25 },
        { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 30 },
        { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 18 },
        { wch: 18 }, { wch: 18 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "الأساتذة");

    const date = new Date().toISOString().slice(0, 10);
    const filename = "SIGE_Enseignants_" + date + ".xlsx";

    XLSX.writeFile(wb, filename);
    console.log("Export Enseignants terminé :", filename);
}


// ============================================================
// EXPORT SIAD (gardé tel quel pour ne rien casser)
// ============================================================

function exportSIAD() {
    if (typeof enseignantsData === "undefined" || !Array.isArray(enseignantsData)) {
        alert("لا توجد بيانات الأساتذة");
        return;
    }

    if (enseignantsData.length === 0) {
        alert("لا توجد بيانات الأساتذة");
        return;
    }

    if (typeof XLSX === "undefined") {
        alert("مكتبة Excel غير محملة.");
        return;
    }

    const kpis = [
        ["المؤشر", "القيمة"],
        ["إجمالي الأساتذة", enseignantsData.length],
        ["مرسم", enseignantsData.filter(e => e.sifah === "titulaire").length],
        ["متعاقد", enseignantsData.filter(e => e.sifah === "contractuel").length],
        ["عرضي", enseignantsData.filter(e => e.sifah === "vacataire").length],
        ["ذكور", enseignantsData.filter(e => e.genre === "homme").length],
        ["إناث", enseignantsData.filter(e => e.genre === "femme").length]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(kpis);
    ws["!cols"] = [{ wch: 30 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, "المؤشرات");

    const date = new Date().toISOString().slice(0, 10);
    const filename = "SIGE_SIAD_" + date + ".xlsx";

    XLSX.writeFile(wb, filename);
    console.log("Export SIAD effectué :", filename);
}

// ============================================================
// FIN
// ============================================================
console.log("SIGE - export.js chargé correctement (export des enseignants affichés)");
