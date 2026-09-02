// ====================== TEST SIAD ======================

console.log("SIAD JS : début du fichier");

function loadSIAD() {
    console.log("SIAD JS : loadSIAD() exécutée");

    if (typeof enseignantsData === "undefined") {
        console.error("SIAD : enseignantsData n'existe pas");
        return;
    }

    console.log("SIAD : nombre enseignants =", enseignantsData.length);

    const total = enseignantsData.length;

    const elementTotal = document.getElementById("kpi-total");

    if (elementTotal) {
        elementTotal.textContent = total;
    }

    console.log("SIAD JS : fin de loadSIAD()");
}

console.log("SIAD JS : fichier chargé correctement");
