// ============================================================
// SIGE - ENSEIGNANTS
// ============================================================
// Gestion complète des enseignants
// ============================================================

let enseignantsData = [];


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    initialiserEnseignants();

});


// ============================================================
// INITIALISATION
// ============================================================

function initialiserEnseignants() {

    // --------------------------------------------------------
    // BOUTON AJOUTER
    // --------------------------------------------------------

    const btnAjouter =
        document.getElementById(
            "btn-add-enseignant"
        );


    if (btnAjouter) {

        btnAjouter.addEventListener(
            "click",
            function () {

                ouvrirModalEnseignant();

            }
        );

    }


    // --------------------------------------------------------
    // FORMULAIRE
    // --------------------------------------------------------

    const form =
        document.getElementById(
            "enseignant-form"
        );


    if (form) {

        form.addEventListener(
            "submit",
            enregistrerEnseignant
        );

    }


    // --------------------------------------------------------
    // FILTRES
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


        if (element) {

            element.addEventListener(
                "input",
                appliquerFiltres
            );


            element.addEventListener(
                "change",
                appliquerFiltres
            );

        }

    });


    // --------------------------------------------------------
    // RESET
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
    // FIRESTORE
    // --------------------------------------------------------

    chargerEnseignants();

}


// ============================================================
// CHARGER ENSEIGNANTS
// ============================================================

function chargerEnseignants() {

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


                afficherEnseignants(
                    enseignantsData
                );


                mettreAJourFiltres();

                mettreAJourDashboard();

            },

            function (error) {

                console.error(
                    "Erreur chargement enseignants :",
                    error
                );

            }

        );

}


// ============================================================
// AFFICHER ENSEIGNANTS
// ============================================================

function afficherEnseignants(
    liste
) {

    const tbody =
        document.getElementById(
            "enseignants-body"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    liste.forEach(function (item, index) {

        const tr =
            document.createElement("tr");


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


        tr.innerHTML = `

            <td>
                ${item.numero ?? index + 1}
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
                ${echapperHTML(grade)}
            </td>

            <td>
                ${echapperHTML(specialite)}
            </td>

            <td>
                ${echapperHTML(departement)}
            </td>

            <td>
                ${echapperHTML(sifah)}
            </td>

            <td>
                ${echapperHTML(wadhia)}
            </td>

            <td>
                ${echapperHTML(annee)}
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
                    class="btn-secondary"
                    onclick="modifierEnseignant('${item.id}')"
                >
                    تعديل
                </button>

                <button
                    class="btn-danger"
                    onclick="supprimerEnseignant('${item.id}')"
                >
                    حذف
                </button>

            </td>

        `;


        tbody.appendChild(tr);

    });

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


    if (!modal) return;


    const form =
        document.getElementById(
            "enseignant-form"
        );


    if (form) {

        form.reset();

    }


    document.getElementById(
        "enseignant-id"
    ).value = id || "";


    // --------------------------------------------------------
    // REMPLIR LES SELECTS
    // --------------------------------------------------------

    remplirSelectsEnseignant();


    // --------------------------------------------------------
    // AJOUT
    // --------------------------------------------------------

    if (!id) {

        document.getElementById(
            "modal-enseignant-title"
        ).textContent =
            "إضافة أستاذ جديد";


        document.getElementById(
            "genre"
        ).value = "homme";


        modal.classList.remove("hidden");

        return;

    }


    // --------------------------------------------------------
    // MODIFICATION
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


    remplirFormulaireEnseignant(
        enseignant
    );


    document.getElementById(
        "modal-enseignant-title"
    ).textContent =
        "تعديل بيانات الأستاذ";


    modal.classList.remove("hidden");

}


// ============================================================
// MODIFIER
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

    definirValeur("numero", item.numero);

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
// DEFINIR VALEUR
// ============================================================

function definirValeur(
    id,
    valeur
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.value =
        valeur ?? "";

}


// ============================================================
// REMPLIR TOUS LES SELECTS
// ============================================================

function remplirSelectsEnseignant() {

    remplirSelectGradesEnseignant();

    remplirSelectSpecialitesEnseignant();

    remplirSelectDepartementsEnseignant();

    remplirSelectSifahEnseignant();

    remplirSelectWadhiaEnseignant();

    remplirSelectAnneesEnseignant();

}


// ============================================================
// GRADES
// ============================================================

function remplirSelectGradesEnseignant() {

    const select =
        document.getElementById(
            "gradeId"
        );


    if (!select) return;


    const valeur =
        select.value;


    select.innerHTML =
        '<option value="">اختر الرتبة</option>';


    if (typeof getGradesData !== "function") {

        return;

    }


    getGradesData()
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.id;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (valeur) {

        select.value =
            valeur;

    }

}


// ============================================================
// SPECIALITES
// ============================================================

function remplirSelectSpecialitesEnseignant() {

    const select =
        document.getElementById(
            "specialiteId"
        );


    if (!select) return;


    const valeur =
        select.value;


    select.innerHTML =
        '<option value="">اختر التخصص</option>';


    if (
        typeof getSpecialitesData !==
        "function"
    ) {

        return;

    }


    getSpecialitesData()
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.id;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (valeur) {

        select.value =
            valeur;

    }

}


// ============================================================
// DEPARTEMENTS
// ============================================================

function remplirSelectDepartementsEnseignant() {

    const select =
        document.getElementById(
            "departementId"
        );


    if (!select) return;


    const valeur =
        select.value;


    select.innerHTML =
        '<option value="">اختر القسم</option>';


    if (
        typeof getDepartementsData !==
        "function"
    ) {

        return;

    }


    getDepartementsData()
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.id;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (valeur) {

        select.value =
            valeur;

    }

}


// ============================================================
// SIFAH
// ============================================================

function remplirSelectSifahEnseignant() {

    const select =
        document.getElementById(
            "sifah"
        );


    if (!select) return;


    const valeur =
        select.value;


    select.innerHTML =
        '<option value="">اختر الصفة</option>';


    if (
        typeof getSifahData !==
        "function"
    ) {

        return;

    }


    getSifahData()
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement(
                    "option"
                );


            // On enregistre le CODE
            option.value =
                item.code;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (valeur) {

        select.value =
            valeur;

    }

}


// ============================================================
// WADHIA
// ============================================================

function remplirSelectWadhiaEnseignant() {

    const select =
        document.getElementById(
            "wadhia"
        );


    if (!select) return;


    const valeur =
        select.value;


    select.innerHTML =
        '<option value="">اختر الوضعية</option>';


    if (
        typeof getWadhiaData !==
        "function"
    ) {

        return;

    }


    getWadhiaData()
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.code;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (valeur) {

        select.value =
            valeur;

    }

}


// ============================================================
// ANNÉES
// ============================================================

function remplirSelectAnneesEnseignant() {

    const select =
        document.getElementById(
            "anneeUniversitaire"
        );


    if (!select) return;


    const valeur =
        select.value;


    select.innerHTML =
        '<option value="">اختر السنة الجامعية</option>';


    if (
        typeof getAnneesData !==
        "function"
    ) {

        return;

    }


    getAnneesData()
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.nom;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (valeur) {

        select.value =
            valeur;

    }

}


// ============================================================
// ENREGISTRER ENSEIGNANT
// ============================================================

async function enregistrerEnseignant(
    event
) {

    event.preventDefault();


    const id =
        document.getElementById(
            "enseignant-id"
        ).value;


    const data = {

        numero:
            Number(
                document.getElementById(
                    "numero"
                ).value
            ),

        matriculeCNRPS:
            document.getElementById(
                "matriculeCNRPS"
            ).value.trim(),

        nom:
            document.getElementById(
                "nom"
            ).value.trim(),

        prenom:
            document.getElementById(
                "prenom"
            ).value.trim(),

        gradeId:
            document.getElementById(
                "gradeId"
            ).value,

        specialiteId:
            document.getElementById(
                "specialiteId"
            ).value,

        departementId:
            document.getElementById(
                "departementId"
            ).value,

        tel1:
            document.getElementById(
                "tel1"
            ).value.trim(),

        tel2:
            document.getElementById(
                "tel2"
            ).value.trim(),

        email:
            document.getElementById(
                "email"
            ).value.trim(),

        // IMPORTANT :
        // on enregistre le CODE de sifah
        sifah:
            document.getElementById(
                "sifah"
            ).value,

        // IMPORTANT :
        // on enregistre le CODE de wadhia
        wadhia:
            document.getElementById(
                "wadhia"
            ).value,

        // année
        anneeUniversitaire:
            document.getElementById(
                "anneeUniversitaire"
            ).value,

        genre:
            document.getElementById(
                "genre"
            ).value,

        dateNaissance:
            document.getElementById(
                "dateNaissance"
            ).value,

        dateRecrutement:
            document.getElementById(
                "dateRecrutement"
            ).value,

        dateDernierGrade:
            document.getElementById(
                "dateDernierGrade"
            ).value,

        updatedAt:
            firebase.firestore.FieldValue
                .serverTimestamp()

    };


    // --------------------------------------------------------
    // VALIDATION
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


    if (!data.matriculeCNRPS) {

        alert(
            "يرجى إدخال رقم التسجيل CNRPS"
        );

        return;

    }


    try {

        // ----------------------------------------------------
        // MODIFICATION
        // ----------------------------------------------------

        if (id) {

            await enseignantsRef
                .doc(id)
                .update(data);

        }

        // ----------------------------------------------------
        // AJOUT
        // ----------------------------------------------------

        else {

            data.createdAt =
                firebase.firestore.FieldValue
                    .serverTimestamp();


            await enseignantsRef.add(data);

        }


        fermerModalEnseignant();


        document.getElementById(
            "enseignant-form"
        ).reset();


        alert(
            "تم حفظ بيانات الأستاذ بنجاح"
        );

    }

    catch (error) {

        console.error(
            "Erreur enseignant :",
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

    if (!confirm(
        "هل أنت متأكد من حذف هذا الأستاذ ؟"
    )) {

        return;

    }


    try {

        await enseignantsRef
            .doc(id)
            .delete();


        alert(
            "تم حذف الأستاذ"
        );

    }

    catch (error) {

        console.error(
            "Erreur suppression enseignant :",
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
// FILTRES
// ============================================================

function appliquerFiltres() {

    const matricule =
        document.getElementById(
            "filter-matricule"
        )?.value
        .trim()
        .toLowerCase() || "";


    const grade =
        document.getElementById(
            "filter-grade"
        )?.value || "";


    const specialite =
        document.getElementById(
            "filter-specialite"
        )?.value || "";


    const departement =
        document.getElementById(
            "filter-departement"
        )?.value || "";


    const sifah =
        document.getElementById(
            "filter-sifah"
        )?.value || "";


    const wadhia =
        document.getElementById(
            "filter-wadhia"
        )?.value || "";


    const annee =
        document.getElementById(
            "filter-anneeUniversitaire"
        )?.value || "";


    const genre =
        document.getElementById(
            "filter-genre"
        )?.value || "";


    const resultat =
        enseignantsData.filter(
            function (item) {

                const matriculeItem =
                    String(
                        item.matriculeCNRPS || ""
                    )
                    .toLowerCase();


                if (
                    matricule &&
                    !matriculeItem.includes(
                        matricule
                    )
                ) {

                    return false;

                }


                if (
                    grade &&
                    item.gradeId !== grade
                ) {

                    return false;

                }


                if (
                    specialite &&
                    item.specialiteId !== specialite
                ) {

                    return false;

                }


                if (
                    departement &&
                    item.departementId !== departement
                ) {

                    return false;

                }


                if (
                    sifah &&
                    item.sifah !== sifah
                ) {

                    return false;

                }


                if (
                    wadhia &&
                    item.wadhia !== wadhia
                ) {

                    return false;

                }


                if (
                    annee &&
                    item.anneeUniversitaire !== annee
                ) {

                    return false;

                }


                if (
                    genre &&
                    item.genre !== genre
                ) {

                    return false;

                }


                return true;

            }
        );


    afficherEnseignants(
        resultat
    );

}


// ============================================================
// REMPLIR LES FILTRES
// ============================================================

function mettreAJourFiltres() {

    remplirFiltre(
        "filter-grade",
        getGradesData(),
        "كل الرتب"
    );


    remplirFiltre(
        "filter-specialite",
        getSpecialitesData(),
        "كل التخصصات"
    );


    remplirFiltre(
        "filter-departement",
        getDepartementsData(),
        "كل الأقسام"
    );


    remplirFiltreCodes(
        "filter-sifah",
        getSifahData(),
        "كل الصفات"
    );


    remplirFiltreCodes(
        "filter-wadhia",
        getWadhiaData(),
        "كل الوضعيات"
    );


    remplirFiltreAnnees();

}


// ============================================================
// FILTRE NORMAL
// ============================================================

function remplirFiltre(
    id,
    data,
    texteDefaut
) {

    const select =
        document.getElementById(id);


    if (!select) return;


    const valeur =
        select.value;


    select.innerHTML =
        `<option value="">${texteDefaut}</option>`;


    data
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.id;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (valeur) {

        select.value =
            valeur;

    }

}


// ============================================================
// FILTRE CODE
// ============================================================

function remplirFiltreCodes(
    id,
    data,
    texteDefaut
) {

    const select =
        document.getElementById(id);


    if (!select) return;


    const valeur =
        select.value;


    select.innerHTML =
        `<option value="">${texteDefaut}</option>`;


    data
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.code;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (valeur) {

        select.value =
            valeur;

    }

}


// ============================================================
// FILTRE ANNÉES
// ============================================================

function remplirFiltreAnnees() {

    const select =
        document.getElementById(
            "filter-anneeUniversitaire"
        );


    if (!select) return;


    const valeur =
        select.value;


    select.innerHTML =
        '<option value="">كل السنوات الجامعية</option>';


    getAnneesData()
        .filter(function (item) {

            return item.actif !== false;

        })
        .forEach(function (item) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.nom;


            option.textContent =
                item.nom;


            select.appendChild(option);

        });


    if (valeur) {

        select.value =
            valeur;

    }

}


// ============================================================
// RESET FILTRES
// ============================================================

function reinitialiserFiltres() {

    const ids = [

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


    afficherEnseignants(
        enseignantsData
    );

}


// ============================================================
// RECHERCHE GRADE
// ============================================================

function trouverNomGrade(id) {

    const item =
        getGradesData().find(
            function (element) {

                return element.id === id;

            }
        );


    return item
        ? item.nom
        : "";

}


// ============================================================
// RECHERCHE SPECIALITE
// ============================================================

function trouverNomSpecialite(id) {

    const item =
        getSpecialitesData().find(
            function (element) {

                return element.id === id;

            }
        );


    return item
        ? item.nom
        : "";

}


// ============================================================
// RECHERCHE DEPARTEMENT
// ============================================================

function trouverNomDepartement(id) {

    const item =
        getDepartementsData().find(
            function (element) {

                return element.id === id;

            }
        );


    return item
        ? item.nom
        : "";

}


// ============================================================
// RECHERCHE SIFAH
// ============================================================

function trouverNomSifah(code) {

    const item =
        getSifahData().find(
            function (element) {

                return element.code === code;

            }
        );


    return item
        ? item.nom
        : code || "";

}


// ============================================================
// RECHERCHE WADHIA
// ============================================================

function trouverNomWadhia(code) {

    const item =
        getWadhiaData().find(
            function (element) {

                return element.code === code;

            }
        );


    return item
        ? item.nom
        : code || "";

}


// ============================================================
// RECHERCHE ANNÉE
// ============================================================

function trouverNomAnnee(nom) {

    return nom || "";

}


// ============================================================
// DASHBOARD
// ============================================================

function mettreAJourDashboard() {

    const total =
        enseignantsData.length;


    const titulaire =
        enseignantsData.filter(
            function (item) {

                return item.sifah === "titulaire";

            }
        ).length;


    const contractuel =
        enseignantsData.filter(
            function (item) {

                return item.sifah === "contractuel";

            }
        ).length;


    const vacataire =
        enseignantsData.filter(
            function (item) {

                return item.sifah === "vacataire";

            }
        ).length;


    definirTexte(
        "dash-total",
        total
    );


    definirTexte(
        "dash-titulaire",
        titulaire
    );


    definirTexte(
        "dash-contractuel",
        contractuel
    );


    definirTexte(
        "dash-vacataire",
        vacataire
    );


    definirTexte(
        "kpi-total",
        total
    );


    definirTexte(
        "kpi-titulaire",
        titulaire
    );


    definirTexte(
        "kpi-contractuel",
        contractuel
    );


    definirTexte(
        "kpi-vacataire",
        vacataire
    );


    const homme =
        enseignantsData.filter(
            item => item.genre === "homme"
        ).length;


    const femme =
        enseignantsData.filter(
            item => item.genre === "femme"
        ).length;


    definirTexte(
        "kpi-homme",
        homme
    );


    definirTexte(
        "kpi-femme",
        femme
    );

}


// ============================================================
// TEXTE
// ============================================================

function definirTexte(
    id,
    valeur
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            valeur;

    }

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
// FERMETURE MODAL
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        const bouton =
            event.target.closest(
                "#modal-enseignant .close-modal"
            );


        if (!bouton) return;


        fermerModalEnseignant();

    }
);


console.log(
    "SIGE - enseignants.js chargé"
);
