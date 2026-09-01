// ============================================================
// SIGE - CATEGORIES
// ============================================================
// Gestion de :
// 1. الرتب
// 2. التخصصات
// 3. الأقسام
// ============================================================

let categoriesData = {

    grade: [],

    specialite: [],

    departement: []

};


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    initialiserCategories();

});


// ============================================================
// INITIALISATION
// ============================================================

function initialiserCategories() {

    // --------------------------------------------------------
    // ONGLET CATEGORIES
    // --------------------------------------------------------

    document.querySelectorAll(".tab-btn").forEach(function (button) {

        // On ne traite ici que les boutons des catégories
        if (
            button.classList.contains("param-tab-btn")
        ) {
            return;
        }


        button.addEventListener("click", function () {

            const tab =
                this.dataset.tab;

            if (!tab) return;

            afficherCategorieTab(tab);

        });

    });


    // --------------------------------------------------------
    // AJOUT GRADE
    // --------------------------------------------------------

    const btnGrade =
        document.getElementById("btn-add-grade");

    if (btnGrade) {

        btnGrade.addEventListener(
            "click",
            function () {

                ouvrirModalCategorie("grade");

            }
        );

    }


    // --------------------------------------------------------
    // AJOUT SPECIALITE
    // --------------------------------------------------------

    const btnSpecialite =
        document.getElementById("btn-add-specialite");

    if (btnSpecialite) {

        btnSpecialite.addEventListener(
            "click",
            function () {

                ouvrirModalCategorie("specialite");

            }
        );

    }


    // --------------------------------------------------------
    // AJOUT DEPARTEMENT
    // --------------------------------------------------------

    const btnDepartement =
        document.getElementById("btn-add-departement");

    if (btnDepartement) {

        btnDepartement.addEventListener(
            "click",
            function () {

                ouvrirModalCategorie("departement");

            }
        );

    }


    // --------------------------------------------------------
    // FORMULAIRE
    // --------------------------------------------------------

    const form =
        document.getElementById("categorie-form");

    if (form) {

        form.addEventListener(
            "submit",
            enregistrerCategorie
        );

    }


    // --------------------------------------------------------
    // FIRESTORE
    // --------------------------------------------------------

    chargerGrades();

    chargerSpecialites();

    chargerDepartements();

}


// ============================================================
// AFFICHER ONGLET
// ============================================================

function afficherCategorieTab(type) {

    document.querySelectorAll(
        "#categories-page .tab-btn"
    ).forEach(function (button) {

        button.classList.remove("active");

    });


    const bouton =
        document.querySelector(
            `#categories-page .tab-btn[data-tab="${type}"]`
        );


    if (bouton) {

        bouton.classList.add("active");

    }


    document.querySelectorAll(
        "#categories-page .tab-content"
    ).forEach(function (content) {

        content.classList.add("hidden");

    });


    const contenu =
        document.getElementById(
            "tab-" + type
        );


    if (contenu) {

        contenu.classList.remove("hidden");

    }

}


// ============================================================
// GRADES
// ============================================================

function chargerGrades() {

    gradesRef
        .orderBy("ordre", "asc")
        .onSnapshot(

            function (snapshot) {

                categoriesData.grade = [];

                snapshot.forEach(function (doc) {

                    categoriesData.grade.push({

                        id: doc.id,

                        ...doc.data()

                    });

                });


                afficherGrades();

                remplirSelectGrades();

            },

            function (error) {

                console.error(
                    "Erreur grades :",
                    error
                );

            }

        );

}


// ============================================================
// AFFICHER GRADES
// ============================================================

function afficherGrades() {

    const tbody =
        document.getElementById("grades-body");

    if (!tbody) return;

    tbody.innerHTML = "";


    categoriesData.grade.forEach(function (item) {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>${item.ordre ?? ""}</td>

            <td>
                ${echapperHTML(item.nom ?? "")}
            </td>

            <td>
                ${
                    item.actif !== false
                        ? '<span class="status-active">نشط</span>'
                        : '<span class="status-inactive">غير نشط</span>'
                }
            </td>

            <td>

                <button
                    class="btn-secondary"
                    onclick="modifierCategorie('grade','${item.id}')"
                >
                    تعديل
                </button>

                <button
                    class="btn-danger"
                    onclick="supprimerCategorie('grade','${item.id}')"
                >
                    حذف
                </button>

            </td>

        `;


        tbody.appendChild(tr);

    });

}


// ============================================================
// SPECIALITES
// ============================================================

function chargerSpecialites() {

    specialitesRef
        .orderBy("ordre", "asc")
        .onSnapshot(

            function (snapshot) {

                categoriesData.specialite = [];

                snapshot.forEach(function (doc) {

                    categoriesData.specialite.push({

                        id: doc.id,

                        ...doc.data()

                    });

                });


                afficherSpecialites();

                remplirSelectSpecialites();

            },

            function (error) {

                console.error(
                    "Erreur specialites :",
                    error
                );

            }

        );

}


// ============================================================
// AFFICHER SPECIALITES
// ============================================================

function afficherSpecialites() {

    const tbody =
        document.getElementById(
            "specialites-body"
        );

    if (!tbody) return;

    tbody.innerHTML = "";


    categoriesData.specialite.forEach(
        function (item) {

            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td>${item.ordre ?? ""}</td>

                <td>
                    ${echapperHTML(item.nom ?? "")}
                </td>

                <td>
                    ${
                        item.actif !== false
                            ? '<span class="status-active">نشط</span>'
                            : '<span class="status-inactive">غير نشط</span>'
                    }
                </td>

                <td>

                    <button
                        class="btn-secondary"
                        onclick="modifierCategorie('specialite','${item.id}')"
                    >
                        تعديل
                    </button>

                    <button
                        class="btn-danger"
                        onclick="supprimerCategorie('specialite','${item.id}')"
                    >
                        حذف
                    </button>

                </td>

            `;


            tbody.appendChild(tr);

        }
    );

}


// ============================================================
// DEPARTEMENTS
// ============================================================

function chargerDepartements() {

    departementsRef
        .orderBy("ordre", "asc")
        .onSnapshot(

            function (snapshot) {

                categoriesData.departement = [];

                snapshot.forEach(function (doc) {

                    categoriesData.departement.push({

                        id: doc.id,

                        ...doc.data()

                    });

                });


                afficherDepartements();

                remplirSelectDepartements();

            },

            function (error) {

                console.error(
                    "Erreur departements :",
                    error
                );

            }

        );

}


// ============================================================
// AFFICHER DEPARTEMENTS
// ============================================================

function afficherDepartements() {

    const tbody =
        document.getElementById(
            "departements-body"
        );

    if (!tbody) return;

    tbody.innerHTML = "";


    categoriesData.departement.forEach(
        function (item) {

            const tr =
                document.createElement("tr");


            tr.innerHTML = `

                <td>${item.ordre ?? ""}</td>

                <td>
                    ${echapperHTML(item.nom ?? "")}
                </td>

                <td>
                    ${
                        item.actif !== false
                            ? '<span class="status-active">نشط</span>'
                            : '<span class="status-inactive">غير نشط</span>'
                    }
                </td>

                <td>

                    <button
                        class="btn-secondary"
                        onclick="modifierCategorie('departement','${item.id}')"
                    >
                        تعديل
                    </button>

                    <button
                        class="btn-danger"
                        onclick="supprimerCategorie('departement','${item.id}')"
                    >
                        حذف
                    </button>

                </td>

            `;


            tbody.appendChild(tr);

        }
    );

}


// ============================================================
// RÉFÉRENCE COLLECTION
// ============================================================

function getCategorieCollection(type) {

    if (type === "grade") {

        return gradesRef;

    }

    if (type === "specialite") {

        return specialitesRef;

    }

    if (type === "departement") {

        return departementsRef;

    }

    return null;

}


// ============================================================
// DONNÉES LOCALES
// ============================================================

function getCategorieData(type) {

    if (type === "grade") {

        return categoriesData.grade;

    }

    if (type === "specialite") {

        return categoriesData.specialite;

    }

    if (type === "departement") {

        return categoriesData.departement;

    }

    return [];

}


// ============================================================
// OUVRIR MODAL
// ============================================================

function ouvrirModalCategorie(
    type,
    id = null
) {

    const modal =
        document.getElementById(
            "modal-categorie"
        );

    if (!modal) return;


    document.getElementById(
        "categorie-id"
    ).value = id || "";


    document.getElementById(
        "categorie-type"
    ).value = type;


    document.getElementById(
        "categorie-nom"
    ).value = "";


    document.getElementById(
        "categorie-ordre"
    ).value = "1";


    document.getElementById(
        "categorie-actif"
    ).checked = true;


    // --------------------------------------------------------
    // MODIFICATION
    // --------------------------------------------------------

    if (id) {

        const collection =
            getCategorieData(type);


        const item =
            collection.find(function (element) {

                return element.id === id;

            });


        if (item) {

            document.getElementById(
                "categorie-nom"
            ).value = item.nom || "";


            document.getElementById(
                "categorie-ordre"
            ).value =
                item.ordre || 1;


            document.getElementById(
                "categorie-actif"
            ).checked =
                item.actif !== false;

        }

    }


    document.getElementById(
        "modal-categorie-title"
    ).textContent =
        id ? "تعديل" : "إضافة";


    modal.classList.remove("hidden");

}


// ============================================================
// MODIFIER
// ============================================================

function modifierCategorie(
    type,
    id
) {

    ouvrirModalCategorie(
        type,
        id
    );

}


// ============================================================
// ENREGISTRER
// ============================================================

async function enregistrerCategorie(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "categorie-id"
        ).value;


    const type =
        document.getElementById(
            "categorie-type"
        ).value;


    const nom =
        document.getElementById(
            "categorie-nom"
        ).value.trim();


    const ordre =
        Number(
            document.getElementById(
                "categorie-ordre"
            ).value
        );


    const actif =
        document.getElementById(
            "categorie-actif"
        ).checked;


    if (!nom) {

        alert(
            "يرجى إدخال الاسم"
        );

        return;

    }


    const collection =
        getCategorieCollection(type);


    if (!collection) {

        alert(
            "نوع التصنيف غير معروف"
        );

        return;

    }


    const data = {

        nom: nom,

        ordre: ordre,

        actif: actif,

        updatedAt:
            firebase.firestore.FieldValue.serverTimestamp()

    };


    try {

        // ----------------------------------------------------
        // MODIFICATION
        // ----------------------------------------------------

        if (id) {

            await collection
                .doc(id)
                .update(data);

        }

        // ----------------------------------------------------
        // AJOUT
        // ----------------------------------------------------

        else {

            data.createdAt =
                firebase.firestore.FieldValue.serverTimestamp();


            await collection.add(data);

        }


        fermerModalCategorie();

        document.getElementById(
            "categorie-form"
        ).reset();

    }

    catch (error) {

        console.error(
            "Erreur catégorie :",
            error
        );

        alert(
            "حدث خطأ أثناء حفظ التصنيف : " +
            error.message
        );

    }

}


// ============================================================
// SUPPRIMER
// ============================================================

async function supprimerCategorie(
    type,
    id
) {

    if (!confirm(
        "هل أنت متأكد من حذف هذا العنصر ؟"
    )) {

        return;

    }


    const collection =
        getCategorieCollection(type);


    if (!collection) return;


    try {

        await collection
            .doc(id)
            .delete();

    }

    catch (error) {

        console.error(
            "Erreur suppression catégorie :",
            error
        );

        alert(
            "حدث خطأ أثناء الحذف : " +
            error.message
        );

    }

}


// ============================================================
// FERMER MODAL
// ============================================================

function fermerModalCategorie() {

    const modal =
        document.getElementById(
            "modal-categorie"
        );

    if (modal) {

        modal.classList.add("hidden");

    }

}


// ============================================================
// SELECT GRADE
// ============================================================

function remplirSelectGrades() {

    const select =
        document.getElementById(
            "gradeId"
        );

    if (!select) return;


    const ancienneValeur =
        select.value;


    select.innerHTML =
        '<option value="">اختر الرتبة</option>';


    categoriesData.grade
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement("option");


            option.value =
                item.id;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (
        ancienneValeur &&
        categoriesData.grade.some(
            item => item.id === ancienneValeur
        )
    ) {

        select.value =
            ancienneValeur;

    }

}


// ============================================================
// SELECT SPECIALITE
// ============================================================

function remplirSelectSpecialites() {

    const select =
        document.getElementById(
            "specialiteId"
        );

    if (!select) return;


    const ancienneValeur =
        select.value;


    select.innerHTML =
        '<option value="">اختر التخصص</option>';


    categoriesData.specialite
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement("option");


            option.value =
                item.id;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (
        ancienneValeur &&
        categoriesData.specialite.some(
            item => item.id === ancienneValeur
        )
    ) {

        select.value =
            ancienneValeur;

    }

}


// ============================================================
// SELECT DEPARTEMENT
// ============================================================

function remplirSelectDepartements() {

    const select =
        document.getElementById(
            "departementId"
        );

    if (!select) return;


    const ancienneValeur =
        select.value;


    select.innerHTML =
        '<option value="">اختر القسم</option>';


    categoriesData.departement
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement("option");


            option.value =
                item.id;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (
        ancienneValeur &&
        categoriesData.departement.some(
            item => item.id === ancienneValeur
        )
    ) {

        select.value =
            ancienneValeur;

    }

}


// ============================================================
// API PUBLIQUE
// ============================================================

function getGradesData() {

    return categoriesData.grade;

}


function getSpecialitesData() {

    return categoriesData.specialite;

}


function getDepartementsData() {

    return categoriesData.departement;

}


// ============================================================
// SÉCURITÉ HTML
// ============================================================

function echapperHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ============================================================
// FERMETURE PAR .close-modal
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        const bouton =
            event.target.closest(
                "#modal-categorie .close-modal"
            );


        if (!bouton) return;


        fermerModalCategorie();

    }
);


console.log(
    "SIGE - categories.js chargé"
);
