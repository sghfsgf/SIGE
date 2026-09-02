// ============================================================
// SIGE - EXPORT EXCEL (Export des enseignants affichés)
// ============================================================

// ============================================================
// BOUTON EXPORT ENSEIGNANTS
// ============================================================

document
    .getElementById("btn-export")
    ?.addEventListener("click", function () {

        let dataToExport = [];

        // Priorité aux données filtrées et affichées actuellement
        if (typeof window.enseignantsFiltresActuels !== "undefined" && 
            Array.isArray(window.enseignantsFiltresActuels) && 
            window.enseignantsFiltresActuels.length > 0) {
            
            dataToExport = window.enseignantsFiltresActuels;
        } 
        // Sinon on prend toutes les données (comportement d'origine)
        else if (typeof enseignantsData !== "undefined" && Array.isArray(enseignantsData)) {
            dataToExport = enseignantsData;
        }

        if (!Array.isArray(dataToExport) || dataToExport.length === 0) {
            alert("لا توجد بيانات الأساتذة");
            return;
        }

        exportEnseignants(dataToExport);
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

        let gradeNom = "";
        let specialiteNom = "";
        let departementNom = "";
        let sifahNom = "";
        let wadhiaNom = "";
        let genreNom = "";

        if (typeof getGradesData === "function") {
            const grades = getGradesData();
            const grade = grades.find(g => g.id === e.gradeId);
            if (grade) gradeNom = grade.nom || "";
        }

        if (typeof getSpecialitesData === "function") {
            const specialites = getSpecialitesData();
            const specialite = specialites.find(s => s.id === e.specialiteId);
            if (specialite) specialiteNom = specialite.nom || "";
        }

        if (typeof getDepartementsData === "function") {
            const departements = getDepartementsData();
            const departement = departements.find(d => d.id === e.departementId);
            if (departement) departementNom = departement.nom || "";
        }

        if (typeof getSifahData === "function") {
            const sifahData = getSifahData();
            const sifah = sifahData.find(s => s.code === e.sifah);
            sifahNom = sifah ? (sifah.nom || "") : (e.sifah || "");
        }

        if (typeof getWadhiaData === "function") {
            const wadhiaData = getWadhiaData();
            const wadhia = wadhiaData.find(w => w.code === e.wadhia);
            wadhiaNom = wadhia ? (wadhia.nom || "") : (e.wadhia || "");
        }

        if (e.genre === "homme") genreNom = "ذكر";
        else if (e.genre === "femme") genreNom = "أنثى";

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
        { wch: 8 }, { wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 25 },
        { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 30 },
        { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 18 },
        { wch: 18 }, { wch: 18 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "الأساتذة");

    const date = new Date().toISOString().slice(0, 10);
    const filename = "SIGE_Enseignants_" + date + ".xlsx";

    try {
        XLSX.writeFile(wb, filename);
        console.log("Export Excel effectué :", filename);
    } catch (error) {
        console.error("Erreur export Excel :", error);
        alert("حدث خطأ أثناء تصدير ملف Excel : " + error.message);
    }
}


// ============================================================
// EXPORT SIAD (identique à ton code original)
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

    try {
        XLSX.writeFile(wb, filename);
        console.log("Export SIAD effectué :", filename);
    } catch (error) {
        console.error("Erreur export SIAD :", error);
        alert("حدث خطأ أثناء تصدير إحصائيات SIAD : " + error.message);
    }
}


// ============================================================
// FIN
// ============================================================

console.log("SIGE - export.js chargé correctement (export des données affichées)");
