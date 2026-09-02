```javascript
// ============================================================
// SIGE - ENSEIGNANTS
// ============================================================
// Gestion complète des enseignants
// Recherche + filtres + pagination + ajout + modification
// + suppression + affichage
// + préparation pour export Excel filtré
// ============================================================


// ============================================================
// VARIABLES GLOBALES
// ============================================================

let enseignantsData = [];

// IMPORTANT :
// Contient TOUS les enseignants correspondant aux filtres,
// et non seulement les 15 enseignants de la page actuelle.
let enseignantsFiltres = [];

let currentPage = 1;

const itemsPerPage = 15;


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    initialiserEnseignants();

});


// ============================================================
// INITIALISER LA PAGE ENSEIGNANTS
// ============================================================

function initialiserEnseignants() {

    // --------------------------------------------------------
    // Bouton Ajouter
    // --------------------------------------------------------

    const btnAjouter =
        document.getElementById("btn-add-enseignant");

    if (btnAjouter) {

        btnAjouter.addEventListener(
            "click",
            function () {

                ouvrirModalEnseignant();

            }
        );

    }


    // --------------------------------------------------------
    // Formulaire
    // --------------------------------------------------------

    const form =
        document.getElementById("enseignant-form");

    if (form) {

        form.addEventListener(
            "submit",
            enregistrerEnseignant
        );

    }


    // --------------------------------------------------------
    // Recherche
    // --------------------------------------------------------

    const searchInput =
        document.getElementById("search-enseignants");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                currentPage = 1;

                appliquerFiltres();

            }
        );

    }
    else {

        console.warn(
            "Champ #search-enseignants introuvable."
        );

    }


    // --------------------------------------------------------
    // Filtres
    // --------------------------------------------------------

    const filtres = [

        "filter-matricule",
        "filter-grade",
        "filter-specialite",
        "filter-departement",
        "filter-sifah",
        "filter-wadhia",
        "filter-anneeUniversitaire",
        "filter-genre"

    ];


    filtres.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (!element) {

            return;

        }


        element.addEventListener(
            "change",
            function () {

                currentPage = 1;

                appliquerFiltres();

            }
        );


        // Pour les champs texte
        if (
            element.tagName === "INPUT"
        ) {

            element.addEventListener(
                "input",
                function () {

                    currentPage = 1;

                    appliquerFiltres();

                }
            );

        }

    });


    // --------------------------------------------------------
    // Bouton Réinitialiser
    // --------------------------------------------------------

    const btnReset =
        document.getElementById(
            "btn-reset-filters"
        );


    if (btnReset) {

        btnReset.addEventListener(
            "click",
            reinitialiserFiltres
        );

    }


    // --------------------------------------------------------
    // Charger les enseignants
    // --------------------------------------------------------

    chargerEnseignants();

}


// ============================================================
// CHARGER LES ENSEIGNANTS DEPUIS FIREBASE
// ============================================================

function chargerEnseignants() {

    if (
        typeof enseignantsRef === "undefined"
    ) {

        console.error(
            "enseignantsRef n'est pas défini."
        );

        return;

    }


    enseignantsRef
        .orderBy("numero", "asc")
        .onSnapshot(

            function (snapshot) {

                enseignantsData = [];


                snapshot.forEach(function (doc) {

                    enseignantsData.push({

                        id: doc.id,

                        ...doc.data()

                    });

                });


                // ------------------------------------------------
                // Appliquer les filtres
                // ------------------------------------------------

                currentPage = 1;

                appliquerFiltres();


                // ------------------------------------------------
                // Actualiser les listes de filtres
                // ------------------------------------------------

                mettreAJourFiltres();


                // ------------------------------------------------
                // Actualiser le dashboard
                // ------------------------------------------------

                mettreAJourDashboard();

            },


            function (error) {

                console.error(
                    "Erreur chargement enseignants :",
                    error
                );

                alert(
                    "حدث خطأ أثناء تحميل بيانات الأساتذة"
                );

            }

        );

}


// ============================================================
// AFFICHER LES ENSEIGNANTS
// ============================================================

function afficherEnseignants(liste) {

    const tbody =
        document.getElementById(
            "enseignants-body"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML = "";


    // --------------------------------------------------------
    // Aucun résultat
    // --------------------------------------------------------

    if (
        !Array.isArray(liste) ||
        liste.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="12"
                    style="
                        text-align:center;
                        padding:20px;
                    "
                >
                    لا توجد نتائج
                </td>
            </tr>
        `;

        return;

    }


    // --------------------------------------------------------
    // Affichage
    // --------------------------------------------------------

    liste.forEach(function (item) {


        const grade =
            trouverNomGrade(
                item.gradeId
            );


        const specialite =
            trouverNomSpecialite(
                item.specialiteId
            );


        const departement =
            trouverNomDepartement(
                item.departementId
            );


        const sifah =
            trouverNomSifah(
                item.sifah
            );


        const wadhia =
            trouverNomWadhia(
                item.wadhia
            );


        const annee =
            trouverNomAnnee(
                item.anneeUniversitaire
            );


        // ----------------------------------------------------
        // Autorisation suppression
        // ----------------------------------------------------

        const peutSupprimer =
            window.currentUserRole === "admin";


        // ----------------------------------------------------
        // Ligne
        // ----------------------------------------------------

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${echapperHTML(
                    item.numero ?? ""
                )}
            </td>


            <td>
                ${echapperHTML(
                    item.matriculeCNRPS ?? ""
                )}
            </td>


            <td>
                ${echapperHTML(
                    item.nom ?? ""
                )}
            </td>


            <td>
                ${echapperHTML(
                    item.prenom ?? ""
                )}
            </td>


            <td>
                ${echapperHTML(
                    grade
                )}
            </td>


            <td>
                ${echapperHTML(
                    specialite
                )}
            </td>


            <td>
                ${echapperHTML(
                    departement
                )}
            </td>


            <td>
                ${echapperHTML(
                    sifah
                )}
            </td>


            <td>
                ${echapperHTML(
                    wadhia
                )}
            </td>


            <td>
                ${echapperHTML(
                    annee
                )}
            </td>


            <td>
                ${
                    item.genre === "femme"
                        ? "أنثى"
                        : "ذكر"
                }
            </td>


            <td>

                <button
                    type="button"
                    class="btn-secondary"
                    onclick="
                        modifierEnseignant(
                            '${echapperAttribut(item.id)}'
                        )
                    "
                >
                    تعديل
                </button>


                ${
                    peutSupprimer

                    ?

                    `
                    <button
                        type="button"
                        class="btn-danger"
                        onclick="
                            supprimerEnseignant(
                                '${echapperAttribut(item.id)}'
                            )
                        "
                    >
                        حذف
                    </button>
                    `

                    :

                    ""
                }

            </td>

        `;


        tbody.appendChild(tr);

    });

}


// ============================================================
// PAGINATION
// ============================================================

function afficherAvecPagination(liste) {

    if (!Array.isArray(liste)) {

        liste = [];

    }


    const totalPages =
        Math.ceil(
            liste.length / itemsPerPage
        ) || 1;


    // --------------------------------------------------------
    // Sécurité
    // --------------------------------------------------------

    if (
        currentPage < 1
    ) {

        currentPage = 1;

    }


    if (
        currentPage > totalPages
    ) {

        currentPage = totalPages;

    }


    // --------------------------------------------------------
    // Calcul des lignes à afficher
    // --------------------------------------------------------

    const start =
        (currentPage - 1)
        * itemsPerPage;


    const pageData =
        liste.slice(
            start,
            start + itemsPerPage
        );


    // --------------------------------------------------------
    // Affichage
    // --------------------------------------------------------

    afficherEnseignants(
        pageData
    );


    // --------------------------------------------------------
    // Pagination
    // --------------------------------------------------------

    renderPagination(
        liste.length,
        totalPages
    );

}


// ============================================================
// AFFICHER LES BOUTONS DE PAGINATION
// ============================================================

function renderPagination(
    totalItems,
    totalPages
) {

    const container =
        document.getElementById(
            "pagination-container"
        );


    if (!container) {

        return;

    }


    // --------------------------------------------------------
    // Aucun résultat
    // --------------------------------------------------------

    if (totalItems === 0) {

        container.innerHTML = "";

        return;

    }


    // --------------------------------------------------------
    // Bouton précédent
    // --------------------------------------------------------

    const boutonPrecedent = `

        <button
            type="button"
            class="btn-secondary"
            ${currentPage === 1 ? "disabled" : ""}
            onclick="
                changePage(
                    ${currentPage - 1}
                )
            "
        >
            السابق
        </button>

    `;


    // --------------------------------------------------------
    // Informations page
    // --------------------------------------------------------

    const information = `

        <span
            style="
                padding:8px 14px;
                background:#f1f5f9;
                border-radius:8px;
                font-weight:600;
            "
        >

            صفحة
            ${currentPage}
            من
            ${totalPages}

            —
            
            ${totalItems}

            أستاذ

        </span>

    `;


    // --------------------------------------------------------
    // Bouton suivant
    // --------------------------------------------------------

    const boutonSuivant = `

        <button
            type="button"
            class="btn-secondary"
            ${currentPage === totalPages ? "disabled" : ""}
            onclick="
                changePage(
                    ${currentPage + 1}
                )
            "
        >
            التالي
        </button>

    `;


    container.innerHTML =
        boutonPrecedent +
        information +
        boutonSuivant;

}


// ============================================================
// CHANGER DE PAGE
// ============================================================

function changePage(page) {

    const totalPages =
        Math.ceil(
            enseignantsFiltres.length
            / itemsPerPage
        ) || 1;


    if (page < 1) {

        page = 1;

    }


    if (page > totalPages) {

        page = totalPages;

    }


    currentPage = page;


    // IMPORTANT :
    // On réutilise enseignantsFiltres.
    // On ne recharge pas Firebase.

    afficherAvecPagination(
        enseignantsFiltres
    );

}


// ============================================================
// FILTRES + RECHERCHE
// ============================================================

function appliquerFiltres() {


    // ========================================================
    // RECHERCHE GÉNÉRALE
    // ========================================================

    const searchInput =
        document.getElementById(
            "search-enseignants"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    // ========================================================
    // MATRICULE
    // ========================================================

    const matriculeElement =
        document.getElementById(
            "filter-matricule"
        );


    const matricule =
        matriculeElement
            ? matriculeElement.value
                .trim()
                .toLowerCase()
            : "";


    // ========================================================
    // AUTRES FILTRES
    // ========================================================

    const gradeElement =
        document.getElementById(
            "filter-grade"
        );


    const specialiteElement =
        document.getElementById(
            "filter-specialite"
        );


    const departementElement =
        document.getElementById(
            "filter-departement"
        );


    const sifahElement =
        document.getElementById(
            "filter-sifah"
        );


    const wadhiaElement =
        document.getElementById(
            "filter-wadhia"
        );


    const anneeElement =
        document.getElementById(
            "filter-anneeUniversitaire"
        );


    const genreElement =
        document.getElementById(
            "filter-genre"
        );


    const grade =
        gradeElement
            ? gradeElement.value
            : "";


    const specialite =
        specialiteElement
            ? specialiteElement.value
            : "";


    const departement =
        departementElement
            ? departementElement.value
            : "";


    const sifah =
        sifahElement
            ? sifahElement.value
            : "";


    const wadhia =
        wadhiaElement
            ? wadhiaElement.value
            : "";


    const annee =
        anneeElement
            ? anneeElement.value
            : "";


    const genre =
        genreElement
            ? genreElement.value
            : "";


    // ========================================================
    // APPLICATION DES FILTRES
    // ========================================================

    const resultat =
        enseignantsData.filter(
            function (item) {


                // ------------------------------------------------
                // Valeurs sécurisées
                // ------------------------------------------------

                const nom =
                    String(
                        item.nom || ""
                    ).toLowerCase();


                const prenom =
                    String(
                        item.prenom || ""
                    ).toLowerCase();


                const matriculeItem =
                    String(
                        item.matriculeCNRPS || ""
                    ).toLowerCase();


                const numero =
                    String(
                        item.numero ?? ""
                    ).toLowerCase();


                // ------------------------------------------------
                // Recherche générale
                // ------------------------------------------------

                const matchSearch =
                    !search ||

                    nom.includes(search) ||

                    prenom.includes(search) ||

                    matriculeItem.includes(search) ||

                    numero.includes(search);


                // ------------------------------------------------
                // Matricule
                // ------------------------------------------------

                const matchMatricule =
                    !matricule ||

                    matriculeItem.includes(
                        matricule
                    );


                // ------------------------------------------------
                // Grade
                // ------------------------------------------------

                const matchGrade =
                    !grade ||

                    String(
                        item.gradeId ?? ""
                    ) === String(grade);


                // ------------------------------------------------
                // Spécialité
                // ------------------------------------------------

                const matchSpecialite =
                    !specialite ||

                    String(
                        item.specialiteId ?? ""
                    ) === String(specialite);


                // ------------------------------------------------
                // Département
                // ------------------------------------------------

                const matchDepartement =
                    !departement ||

                    String(
                        item.departementId ?? ""
                    ) === String(departement);


                // ------------------------------------------------
                // Sifah
                // ------------------------------------------------

                const matchSifah =
                    !sifah ||

                    String(
                        item.sifah ?? ""
                    ) === String(sifah);


                // ------------------------------------------------
                // Wadhia
                // ------------------------------------------------

                const matchWadhia =
                    !wadhia ||

                    String(
                        item.wadhia ?? ""
                    ) === String(wadhia);


                // ------------------------------------------------
                // Année universitaire
                // ------------------------------------------------

                const matchAnnee =
                    !annee ||

                    String(
                        item.anneeUniversitaire ?? ""
                    ) === String(annee);


                // ------------------------------------------------
                // Genre
                // ------------------------------------------------

                const matchGenre =
                    !genre ||

                    String(
                        item.genre ?? ""
                    ) === String(genre);


                // ------------------------------------------------
                // Résultat
                // ------------------------------------------------

                return (

                    matchSearch &&

                    matchMatricule &&

                    matchGrade &&

                    matchSpecialite &&

                    matchDepartement &&

                    matchSifah &&

                    matchWadhia &&

                    matchAnnee &&

                    matchGenre

                );

            }
        );


    // ========================================================
    // IMPORTANT POUR L'EXPORT EXCEL
    // ========================================================

    // Cette variable contient TOUS les résultats filtrés.
    // Elle ne contient PAS seulement la page actuelle.

    enseignantsFiltres = resultat;


    // ========================================================
    // AFFICHAGE PAGINÉ
    // ========================================================

    afficherAvecPagination(
        enseignantsFiltres
    );

}


// ============================================================
// RÉINITIALISER LES FILTRES
// ============================================================

function reinitialiserFiltres() {

    const ids = [

        "search-enseignants",

        "filter-matricule",

        "filter-grade",

        "filter-specialite",

        "filter-departement",

        "filter-sifah",

        "filter-wadhia",

        "filter-anneeUniversitaire",

        "filter-genre"

    ];


    ids.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (element) {

            element.value = "";

        }

    });


    currentPage = 1;


    // Recalculer
    appliquerFiltres();

}


// ============================================================
// OUVRIR MODAL ENSEIGNANT
// ============================================================

function ouvrirModalEnseignant(
    id = null
) {

    const modal =
        document.getElementById(
            "modal-enseignant"
        );


    if (!modal) {

        return;

    }


    const form =
        document.getElementById(
            "enseignant-form"
        );


    if (form) {

        form.reset();

    }


    definirValeur(
        "enseignant-id",
        id || ""
    );


    // --------------------------------------------------------
    // Remplir les listes
    // --------------------------------------------------------

    remplirSelectsEnseignant();


    // --------------------------------------------------------
    // Nouvel enseignant
    // --------------------------------------------------------

    if (!id) {

        definirValeur(
            "modal-enseignant-title",
            "إضافة أستاذ جديد"
        );


        definirValeur(
            "genre",
            "homme"
        );


        modal.classList.remove(
            "hidden"
        );


        return;

    }


    // --------------------------------------------------------
    // Recherche enseignant
    // --------------------------------------------------------

    const enseignant =
        enseignantsData.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!enseignant) {

        alert(
            "لم يتم العثور على الأستاذ"
        );

        return;

    }


    // --------------------------------------------------------
    // Remplir formulaire
    // --------------------------------------------------------

    remplirFormulaireEnseignant(
        enseignant
    );


    definirValeur(
        "modal-enseignant-title",
        "تعديل بيانات الأستاذ"
    );


    modal.classList.remove(
        "hidden"
    );

}


// ============================================================
// MODIFIER ENSEIGNANT
// ============================================================

function modifierEnseignant(id) {

    ouvrirModalEnseignant(id);

}


// ============================================================
// REMPLIR FORMULAIRE
// ============================================================

function remplirFormulaireEnseignant(
    item
) {

    definirValeur(
        "numero",
        item.numero
    );


    definirValeur(
        "matriculeCNRPS",
        item.matriculeCNRPS
    );


    definirValeur(
        "nom",
        item.nom
    );


    definirValeur(
        "prenom",
        item.prenom
    );


    definirValeur(
        "gradeId",
        item.gradeId
    );


    definirValeur(
        "specialiteId",
        item.specialiteId
    );


    definirValeur(
        "departementId",
        item.departementId
    );


    definirValeur(
        "tel1",
        item.tel1
    );


    definirValeur(
        "tel2",
        item.tel2
    );


    definirValeur(
        "email",
        item.email
    );


    definirValeur(
        "sifah",
        item.sifah
    );


    definirValeur(
        "wadhia",
        item.wadhia
    );


    definirValeur(
        "anneeUniversitaire",
        item.anneeUniversitaire
    );


    definirValeur(
        "genre",
        item.genre || "homme"
    );


    definirValeur(
        "dateNaissance",
        item.dateNaissance
    );


    definirValeur(
        "dateRecrutement",
        item.dateRecrutement
    );


    definirValeur(
        "dateDernierGrade",
        item.dateDernierGrade
    );

}


// ============================================================
// DÉFINIR UNE VALEUR DANS UN ÉLÉMENT
// ============================================================

function definirValeur(
    id,
    valeur
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    // Pour input/select
    if (
        "value" in element
    ) {

        element.value =
            valeur ?? "";

        return;

    }


    // Pour texte
    element.textContent =
        valeur ?? "";

}


// ============================================================
// REMPLIR LES SELECTS
// ============================================================

function remplirSelectsEnseignant() {

    if (
        typeof remplirSelectGradesEnseignant ===
        "function"
    ) {

        remplirSelectGradesEnseignant();

    }


    if (
        typeof remplirSelectSpecialitesEnseignant ===
        "function"
    ) {

        remplirSelectSpecialitesEnseignant();

    }


    if (
        typeof remplirSelectDepartementsEnseignant ===
        "function"
    ) {

        remplirSelectDepartementsEnseignant();

    }


    if (
        typeof remplirSelectSifahEnseignant ===
        "function"
    ) {

        remplirSelectSifahEnseignant();

    }


    if (
        typeof remplirSelectWadhiaEnseignant ===
        "function"
    ) {

        remplirSelectWadhiaEnseignant();

    }


    if (
        typeof remplirSelectAnneesEnseignant ===
        "function"
    ) {

        remplirSelectAnneesEnseignant();

    }

}


// ============================================================
// FONCTIONS SELECTS
// ============================================================
// Ces fonctions utilisent les données déjà disponibles
// dans votre système SIGE.
// ============================================================

function remplirSelectGradesEnseignant() {

    const select =
        document.getElementById(
            "gradeId"
        );


    if (!select) {

        return;

    }


    if (
        typeof getGradesData !==
        "function"
    ) {

        return;

    }


    const data =
        getGradesData();


    const ancienneValeur =
        select.value;


    select.innerHTML =
        `<option value="">اختر الرتبة</option>`;


    data.forEach(function (item) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            item.id;


        option.textContent =
            item.nom || "";


        select.appendChild(
            option
        );

    });


    select.value =
        ancienneValeur;

}


// ============================================================

function remplirSelectSpecialitesEnseignant() {

    const select =
        document.getElementById(
            "specialiteId"
        );


    if (!select) {

        return;

    }


    if (
        typeof getSpecialitesData !==
        "function"
    ) {

        return;

    }


    const data =
        getSpecialitesData();


    const ancienneValeur =
        select.value;


    select.innerHTML =
        `<option value="">اختر التخصص</option>`;


    data.forEach(function (item) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            item.id;


        option.textContent =
            item.nom || "";


        select.appendChild(
            option
        );

    });


    select.value =
        ancienneValeur;

}


// ============================================================

function remplirSelectDepartementsEnseignant() {

    const select =
        document.getElementById(
            "departementId"
        );


    if (!select) {

        return;

    }


    if (
        typeof getDepartementsData !==
        "function"
    ) {

        return;

    }


    const data =
        getDepartementsData();


    const ancienneValeur =
        select.value;


    select.innerHTML =
        `<option value="">اختر القسم</option>`;


    data.forEach(function (item) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            item.id;


        option.textContent =
            item.nom || "";


        select.appendChild(
            option
        );

    });


    select.value =
        ancienneValeur;

}


// ============================================================

function remplirSelectSifahEnseignant() {

    const select =
        document.getElementById(
            "sifah"
        );


    if (!select) {

        return;

    }


    if (
        typeof getSifahData !==
        "function"
    ) {

        return;

    }


    const data =
        getSifahData();


    const ancienneValeur =
        select.value;


    select.innerHTML =
        `<option value="">اختر الصفة</option>`;


    data.forEach(function (item) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            item.code;


        option.textContent =
            item.nom || "";


        select.appendChild(
            option
        );

    });


    select.value =
        ancienneValeur;

}


// ============================================================

function remplirSelectWadhiaEnseignant() {

    const select =
        document.getElementById(
            "wadhia"
        );


    if (!select) {

        return;

    }


    if (
        typeof getWadhiaData !==
        "function"
    ) {

        return;

    }


    const data =
        getWadhiaData();


    const ancienneValeur =
        select.value;


    select.innerHTML =
        `<option value="">اختر الوضعية</option>`;


    data.forEach(function (item) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            item.code;


        option.textContent =
            item.nom || "";


        select.appendChild(
            option
        );

    });


    select.value =
        ancienneValeur;

}


// ============================================================

function remplirSelectAnneesEnseignant() {

    const select =
        document.getElementById(
            "anneeUniversitaire"
        );


    if (!select) {

        return;

    }


    if (
        typeof getAnneesData !==
        "function"
    ) {

        return;

    }


    const data =
        getAnneesData();


    const ancienneValeur =
        select.value;


    select.innerHTML =
        `<option value="">اختر السنة الجامعية</option>`;


    data.forEach(function (item) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            item.code || item.id || item;


        option.textContent =
            item.nom ||
            item.libelle ||
            item.code ||
            item;


        select.appendChild(
            option
        );

    });


    select.value =
        ancienneValeur;

}


// ============================================================
// ENREGISTRER ENSEIGNANT
// ============================================================

async function enregistrerEnseignant(
    event
) {

    event.preventDefault();


    if (
        typeof enseignantsRef ===
        "undefined"
    ) {

        alert(
            "La connexion à Firebase n'est pas disponible."
        );

        return;

    }


    const id =
        document.getElementById(
            "enseignant-id"
        )?.value || "";


    // --------------------------------------------------------
    // Données
    // --------------------------------------------------------

    const data = {

        numero:
            document.getElementById(
                "numero"
            )?.value.trim() || "",


        matriculeCNRPS:
            document.getElementById(
                "matriculeCNRPS"
            )?.value.trim() || "",


        nom:
            document.getElementById(
                "nom"
            )?.value.trim() || "",


        prenom:
            document.getElementById(
                "prenom"
            )?.value.trim() || "",


        gradeId:
            document.getElementById(
                "gradeId"
            )?.value || "",


        specialiteId:
            document.getElementById(
                "specialiteId"
            )?.value || "",


        departementId:
            document.getElementById(
                "departementId"
            )?.value || "",


        tel1:
            document.getElementById(
                "tel1"
            )?.value.trim() || "",


        tel2:
            document.getElementById(
                "tel2"
            )?.value.trim() || "",


        email:
            document.getElementById(
                "email"
            )?.value.trim() || "",


        sifah:
            document.getElementById(
                "sifah"
            )?.value || "",


        wadhia:
            document.getElementById(
                "wadhia"
            )?.value || "",


        anneeUniversitaire:
            document.getElementById(
                "anneeUniversitaire"
            )?.value || "",


        genre:
            document.getElementById(
                "genre"
            )?.value || "homme",


        dateNaissance:
            document.getElementById(
                "dateNaissance"
            )?.value || "",


        dateRecrutement:
            document.getElementById(
                "dateRecrutement"
            )?.value || "",


        dateDernierGrade:
            document.getElementById(
                "dateDernierGrade"
            )?.value || "",

    };


    // --------------------------------------------------------
    // Validation minimale
    // --------------------------------------------------------

    if (!data.nom) {

        alert(
            "يرجى إدخال اللقب"
        );

        return;

    }


    if (!data.prenom) {

        alert(
            "يرجى إدخال الاسم"
        );

        return;

    }


    try {


        // ====================================================
        // MODIFICATION
        // ====================================================

        if (id) {

            data.updatedAt =
                firebase.firestore.FieldValue
                    .serverTimestamp();


            await enseignantsRef
                .doc(id)
                .update(data);


            alert(
                "تم تعديل بيانات الأستاذ بنجاح"
            );

        }


        // ====================================================
        // AJOUT
        // ====================================================

        else {

            data.createdAt =
                firebase.firestore.FieldValue
                    .serverTimestamp();


            data.updatedAt =
                firebase.firestore.FieldValue
                    .serverTimestamp();


            await enseignantsRef
                .add(data);


            alert(
                "تمت إضافة الأستاذ بنجاح"
            );

        }


        // ----------------------------------------------------
        // Fermer modal
        // ----------------------------------------------------

        fermerModalEnseignant();


        // ----------------------------------------------------
        // Réinitialiser
        // ----------------------------------------------------

        const form =
            document.getElementById(
                "enseignant-form"
            );


        if (form) {

            form.reset();

        }


    }

    catch (error) {

        console.error(
            "Erreur enregistrement enseignant :",
            error
        );


        alert(
            "حدث خطأ أثناء حفظ بيانات الأستاذ : " +
            error.message
        );

    }

}


// ============================================================
// SUPPRIMER ENSEIGNANT
// ============================================================

async function supprimerEnseignant(
    id
) {

    // --------------------------------------------------------
    // Vérification rôle
    // --------------------------------------------------------

    if (
        window.currentUserRole !==
        "admin"
    ) {

        alert(
            "ليس لديك صلاحية حذف الأستاذ"
        );

        return;

    }


    if (
        !id
    ) {

        return;

    }


    // --------------------------------------------------------
    // Confirmation
    // --------------------------------------------------------

    const confirmation =
        confirm(
            "هل أنت متأكد من حذف هذا الأستاذ؟"
        );


    if (!confirmation) {

        return;

    }


    try {

        await enseignantsRef
            .doc(id)
            .delete();


        alert(
            "تم حذف الأستاذ بنجاح"
        );

    }

    catch (error) {

        console.error(
            "Erreur suppression enseignant :",
            error
        );


        alert(
            "حدث خطأ أثناء حذف الأستاذ : " +
            error.message
        );

    }

}


// ============================================================
// FERMER MODAL
// ============================================================

function fermerModalEnseignant() {

    const modal =
        document.getElementById(
            "modal-enseignant"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


// ============================================================
// FONCTIONS DE RECHERCHE DES NOMS
// ============================================================

function trouverNomGrade(
    id
) {

    if (
        !id ||
        typeof getGradesData !==
        "function"
    ) {

        return "";

    }


    const item =
        getGradesData().find(
            function (g) {

                return g.id === id;

            }
        );


    return item
        ? item.nom || ""
        : "";

}


// ============================================================

function trouverNomSpecialite(
    id
) {

    if (
        !id ||
        typeof getSpecialitesData !==
        "function"
    ) {

        return "";

    }


    const item =
        getSpecialitesData().find(
            function (s) {

                return s.id === id;

            }
        );


    return item
        ? item.nom || ""
        : "";

}


// ============================================================

function trouverNomDepartement(
    id
) {

    if (
        !id ||
        typeof getDepartementsData !==
        "function"
    ) {

        return "";

    }


    const item =
        getDepartementsData().find(
            function (d) {

                return d.id === id;

            }
        );


    return item
        ? item.nom || ""
        : "";

}


// ============================================================

function trouverNomSifah(
    code
) {

    if (
        !code ||
        typeof getSifahData !==
        "function"
    ) {

        return code || "";

    }


    const item =
        getSifahData().find(
            function (s) {

                return s.code === code;

            }
        );


    return item
        ? item.nom || code
        : code;

}


// ============================================================

function trouverNomWadhia(
    code
) {

    if (
        !code ||
        typeof getWadhiaData !==
        "function"
    ) {

        return code || "";

    }


    const item =
        getWadhiaData().find(
            function (w) {

                return w.code === code;

            }
        );


    return item
        ? item.nom || code
        : code;

}


// ============================================================

function trouverNomAnnee(
    code
) {

    if (
        !code
    ) {

        return "";

    }


    if (
        typeof getAnneesData !==
        "function"
    ) {

        return code;

    }


    const item =
        getAnneesData().find(
            function (a) {

                return (
                    a.code === code ||
                    a.id === code
                );

            }
        );


    if (!item) {

        return code;

    }


    return (
        item.nom ||
        item.libelle ||
        item.code ||
        code
    );

}


// ============================================================
// MISE À JOUR DES FILTRES
// ============================================================

function mettreAJourFiltres() {

    // Les fonctions de mise à jour des listes de filtres
    // peuvent être présentes dans catégories.js.
    //
    // On les appelle uniquement si elles existent.


    if (
        typeof remplirFiltreGrades ===
        "function"
    ) {

        remplirFiltreGrades();

    }


    if (
        typeof remplirFiltreSpecialites ===
        "function"
    ) {

        remplirFiltreSpecialites();

    }


    if (
        typeof remplirFiltreDepartements ===
        "function"
    ) {

        remplirFiltreDepartements();

    }


    if (
        typeof remplirFiltreSifah ===
        "function"
    ) {

        remplirFiltreSifah();

    }


    if (
        typeof remplirFiltreWadhia ===
        "function"
    ) {

        remplirFiltreWadhia();

    }


    if (
        typeof remplirFiltreAnnees ===
        "function"
    ) {

        remplirFiltreAnnees();

    }

}


// ============================================================
// DASHBOARD
// ============================================================

function mettreAJourDashboard() {

    // --------------------------------------------------------
    // Total
    // --------------------------------------------------------

    const total =
        document.getElementById(
            "total-enseignants"
        );


    if (total) {

        total.textContent =
            enseignantsData.length;

    }


    // --------------------------------------------------------
    // Titulaires
    // --------------------------------------------------------

    const titulaires =
        enseignantsData.filter(
            function (e) {

                return e.sifah ===
                    "titulaire";

            }
        ).length;


    const elementTitulaire =
        document.getElementById(
            "total-titulaires"
        );


    if (elementTitulaire) {

        elementTitulaire.textContent =
            titulaires;

    }


    // --------------------------------------------------------
    // Contractuels
    // --------------------------------------------------------

    const contractuels =
        enseignantsData.filter(
            function (e) {

                return e.sifah ===
                    "contractuel";

            }
        ).length;


    const elementContractuel =
        document.getElementById(
            "total-contractuels"
        );


    if (elementContractuel) {

        elementContractuel.textContent =
            contractuels;

    }


    // --------------------------------------------------------
    // Vacataires
    // --------------------------------------------------------

    const vacataires =
        enseignantsData.filter(
            function (e) {

                return e.sifah ===
                    "vacataire";

            }
        ).length;


    const elementVacataire =
        document.getElementById(
            "total-vacataires"
        );


    if (elementVacataire) {

        elementVacataire.textContent =
            vacataires;

    }


    // --------------------------------------------------------
    // Hommes
    // --------------------------------------------------------

    const hommes =
        enseignantsData.filter(
            function (e) {

                return e.genre ===
                    "homme";

            }
        ).length;


    const elementHommes =
        document.getElementById(
            "total-hommes"
        );


    if (elementHommes) {

        elementHommes.textContent =
            hommes;

    }


    // --------------------------------------------------------
    // Femmes
    // --------------------------------------------------------

    const femmes =
        enseignantsData.filter(
            function (e) {

                return e.genre ===
                    "femme";

            }
        ).length;


    const elementFemmes =
        document.getElementById(
            "total-femmes"
        );


    if (elementFemmes) {

        elementFemmes.textContent =
            femmes;

    }

}


// ============================================================
// PROTECTION HTML
// ============================================================

function echapperHTML(
    valeur
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        valeur ?? "";


    return div.innerHTML;

}


// ============================================================
// PROTECTION ATTRIBUT HTML
// ============================================================

function echapperAttribut(
    valeur
) {

    return String(
        valeur ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#39;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}


// ============================================================
// FIN
// ============================================================

console.log(
    "SIGE - enseignants.js chargé correctement"
);
```
