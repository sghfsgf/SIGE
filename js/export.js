// ============================================================
// SIGE - EXPORT EXCEL (Version améliorée - Export des données affichées)
// ============================================================

// ============================================================
// BOUTON EXPORT ENSEIGNANTS
// ============================================================

document.getElementById("btn-export")?.addEventListener("click", function () {

    let dataToExport = [];

    // Priorité aux données actuellement filtrées et affichées
    if (typeof window.enseignantsFiltresActuels !== "undefined" && 
        Array.isArray(window.enseignantsFiltresActuels) && 
        window.enseignantsFiltresActuels.length > 0) {
        
        dataToExport = window.enseignantsFiltresActuels;
        
    } 
    // Sinon on prend toutes les données (comportement d'origine)
    else if (typeof enseignantsData !== "undefined" && Array.isArray(enseignantsData)) {
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

        // Utilisation sécurisée des fonctions de enseignants.js
        let gradeNom      = (typeof trouverNomGrade === "function")      ? trouverNomGrade(e.gradeId) : "";
        let specialiteNom = (typeof trouverNomSpecialite === "function") ? trouverNomSpecialite(e.specialiteId) : "";
        let departementNom= (typeof trouverNomDepartement === "function")? trouverNomDepartement(e.departementId) : "";
        let sifahNom      = (typeof trouverNomSifah === "function")      ? trouverNomSifah(e.sifah) : (e.sifah || "");
        let wadhiaNom     = (typeof trouverNomWadhia === "function")     ? trouverNomWadhia(e.wadhia) : (e.wadhia || "");
        
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
// EXPORT SIAD (conservé presque tel quel)
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
