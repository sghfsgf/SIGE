```javascript
// ============================================================
// SIGE - CATEGORIES.JS
// الرتب - التخصصات - الأقسام
// ============================================================

let categoriesData = {

    grades: [],

    specialites: [],

    departements: []

};


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initialiserCategories();

    }
);


// ============================================================
// INITIALISATION
// ============================================================

function initialiserCategories() {

    // --------------------------------------------------------
    // Onglets
    // --------------------------------------------------------

    document.querySelectorAll(".tab-btn").forEach(
        function (button) {

            // uniquement les onglets catégories
            if (
                button.dataset.tab
            ) {

                button.addEventListener(
                    "click",
                    function () {

                        afficherCategorieTab(
                            this.dataset.tab
                        );

                    }
                );

            }

        }
    );


    // --------------------------------------------------------
    // Ajouter grade
    // --------------------------------------------------------

    const btnGrade =
        document.getElementById(
            "btn-add-grade"
        );

    if (btnGrade) {

        btnGrade.addEventListener(
            "click",
            function () {

                ouvrirModalCategorie(
                    "grade"
                );

            }
        );

    }


    // --------------------------------------------------------
    // Ajouter spécialité
    // --------------------------------------------------------

    const btnSpecialite =
        document.getElementById(
            "btn-add-specialite"
        );

    if (btnSpecialite) {

        btnSpecialite.addEventListener(
            "click",
            function () {

                ouvrirModalCategorie(
                    "specialite"
                );

            }
        );

    }


    // --------------------------------------------------------
    // Ajouter département
    // --------------------------------------------------------

    const btnDepartement =
        document.getElementById(
            "btn-add-departement"
        );

    if (btnDepartement) {

        btnDepartement.addEventListener(
            "click",
            function () {

                ouvrirModalCategorie(
                    "departement"
                );

            }
        );

    }


    // --------------------------------------------------------
    // Formulaire
    // --------------------------------------------------------

    const form =
        document.getElementById(
            "categorie-form"
        );

    if (form) {

        form.addEventListener(
            "submit",
            enregistrerCategorie
        );

    }


    // --------------------------------------------------------
    // Firebase
    // --------------------------------------------------------

    chargerGrades();

    chargerSpecialites();

    chargerDepartements();

}


// ============================================================
// ONGLET CATEGORIE
// ============================================================

function afficherCategorieTab(type) {

    document
        .querySelectorAll(
            "#categories-page .tab-btn"
        )
        .forEach(function (button) {

            button.classList.remove(
                "active"
            );

        });


    const bouton =
        document.querySelector(
            `#categories-page .tab-btn[data-tab="${type}"]`
        );


    if (bouton) {

        bouton.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(
            "#categories-page .tab-content"
        )
        .forEach(function (content) {

            content.classList.add(
                "hidden"
            );

        });


    const contenu =
        document.getElementById(
            "tab-" + type
        );


    if (contenu) {

        contenu.classList.remove(
            "hidden"
        );

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

                categoriesData.grades = [];

                snapshot.forEach(
                    function (doc) {

                        categoriesData.grades.push({

                            id: doc.id,

                            ...doc.data()

                        });

                    }
                );

                afficherGrades();

            },

            function (error) {

                console.error(
                    "Firebase grades :",
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
        document.getElementById(
            "grades-body"
        );

    if (!tbody) return;

    tbody.innerHTML = "";


    categoriesData.grades.forEach(
        function (item) {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${item.ordre ?? ""}
                </td>

                <td>
                    ${echapperHTML(
                        item.nom ?? ""
                    )}
                </td>

                <td>
                    ${
                        item.actif === true
                            ? '<span class="status-active">نشط</span>'
                            : '<span class="status-inactive">غير نشط</span>'
                    }
                </td>

                <td>

                    <button
                        class="btn-secondary"
                        onclick="modifierCategorie(
                            'grade',
                            '${item.id}'
                        )"
                    >
                        تعديل
                    </button>

                    <button
                        class="btn-danger"
                        onclick="supprimerCategorie(
                            'grade',
                            '${item.id}'
                        )"
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
// SPECIALITES
// ============================================================

function chargerSpecialites() {

    specialitesRef
        .orderBy("ordre", "asc")
        .onSnapshot(

            function (snapshot) {

                categoriesData.specialites = [];

                snapshot.forEach(
                    function (doc) {

                        categoriesData.specialites.push({

                            id: doc.id,

                            ...doc.data()

                        });

                    }
                );

                afficherSpecialites();

            },

            function (error) {

                console.error(
                    "Firebase spécialités :",
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


    categoriesData.specialites.forEach(
        function (item) {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${item.ordre ?? ""}
                </td>

                <td>
                    ${echapperHTML(
                        item.nom ?? ""
                    )}
                </td>

                <td>
                    ${
                        item.actif === true
                            ? '<span class="status-active">نشط</span>'
                            : '<span class="status-inactive">غير نشط</span>'
                    }
                </td>

                <td>

                    <button
                        class="btn-secondary"
                        onclick="modifierCategorie(
                            'specialite',
                            '${item.id}'
                        )"
                    >
                        تعديل
                    </button>

                    <button
                        class="btn-danger"
                        onclick="supprimerCategorie(
                            'specialite',
                            '${item.id}'
                        )"
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

                categoriesData.departements = [];

                snapshot.forEach(
                    function (doc) {

                        categoriesData.departements.push({

                            id: doc.id,

                            ...doc.data()

                        });

                    }
                );

                afficherDepartements();

            },

            function (error) {

                console.error(
                    "Firebase départements :",
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


    categoriesData.departements.forEach(
        function (item) {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${item.ordre ?? ""}
                </td>

                <td>
                    ${echapperHTML(
                        item.nom ?? ""
                    )}
                </td>

                <td>
                    ${
                        item.actif === true
                            ? '<span class="status-active">نشط</span>'
                            : '<span class="status-inactive">غير نشط</span>'
                    }
                </td>

                <td>

                    <button
                        class="btn-secondary"
                        onclick="modifierCategorie(
                            'departement',
                            '${item.id}'
                        )"
                    >
                        تعديل
                    </button>

                    <button
                        class="btn-danger"
                        onclick="supprimerCategorie(
                            'departement',
                            '${item.id}'
                        )"
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
    ).value =
        id || "";


    document.getElementById(
        "categorie-type"
    ).value =
        type;


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
    // Modification
    // --------------------------------------------------------

    if (id) {

        let liste = [];


        if (type === "grade") {

            liste =
                categoriesData.grades;

        }

        else if (type === "specialite") {

            liste =
                categoriesData.specialites;

        }

        else if (type === "departement") {

            liste =
                categoriesData.departements;

        }


        const item =
            liste.find(function (x) {

                return x.id === id;

            });


        if (item) {

            document.getElementById(
                "categorie-nom"
            ).value =
                item.nom || "";


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


    let titre = "إضافة";


    if (type === "grade") {

        titre =
            id
                ? "تعديل رتبة"
                : "إضافة رتبة";

    }

    else if (type === "specialite") {

        titre =
            id
                ? "تعديل تخصص"
                : "إضافة تخصص";

    }

    else if (type === "departement") {

        titre =
            id
                ? "تعديل قسم"
                : "إضافة قسم";

    }


    document.getElementById(
        "modal-categorie-title"
    ).textContent =
        titre;


    modal.classList.remove(
        "hidden"
    );

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


    let collection;


    if (type === "grade") {

        collection =
            gradesRef;

    }

    else if (type === "specialite") {

        collection =
            specialitesRef;

    }

    else if (type === "departement") {

        collection =
            departementsRef;

    }

    else {

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
            firebase.firestore
                .FieldValue
                .serverTimestamp()

    };


    try {

        // -------------------------------
        // MODIFICATION
        // -------------------------------

        if (id) {

            await collection
                .doc(id)
                .update(data);

        }

        // -------------------------------
        // AJOUT
        // -------------------------------

        else {

            data.createdAt =
                firebase.firestore
                    .FieldValue
                    .serverTimestamp();


            await collection.add(data);

        }


        fermerModal(
            "modal-categorie"
        );

    }

    catch (error) {

        console.error(
            "Erreur Firebase catégorie :",
            error
        );

        alert(
            "حدث خطأ أثناء حفظ التصنيف\n" +
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

    if (
        !confirm(
            "هل أنت متأكد من حذف هذا العنصر ؟"
        )
    ) {

        return;

    }


    let collection;


    if (type === "grade") {

        collection =
            gradesRef;

    }

    else if (type === "specialite") {

        collection =
            specialitesRef;

    }

    else if (type === "departement") {

        collection =
            departementsRef;

    }

    else {

        return;

    }


    try {

        await collection
            .doc(id)
            .delete();

    }

    catch (error) {

        console.error(
            "Erreur suppression :",
            error
        );

        alert(
            "حدث خطأ أثناء الحذف\n" +
            error.message
        );

    }

}


// ============================================================
// FONCTIONS POUR ENSEIGNANTS.JS
// ============================================================

function getGradesData() {

    return categoriesData.grades;

}


function getSpecialitesData() {

    return categoriesData.specialites;

}


function getDepartementsData() {

    return categoriesData.departements;

}


// ============================================================
// FIN
// ============================================================

console.log(
    "SIGE - categories.js chargé avec Firebase"
);
```
