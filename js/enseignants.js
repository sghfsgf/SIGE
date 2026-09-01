```javascript
// ============================================================
// SIGE - ENSEIGNANTS.JS
// Gestion complète des enseignants avec Firebase
// ============================================================

let enseignantsData = [];


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initialiserEnseignants();

    }
);


// ============================================================
// INITIALISATION
// ============================================================

function initialiserEnseignants() {

    // --------------------------------------------------------
    // Ajouter enseignant
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
    // Formulaire enseignant
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
    // Reset filtres
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
    // Firebase
    // --------------------------------------------------------

    chargerEnseignants();

    chargerListesEnseignant();

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

                snapshot.forEach(
                    function (doc) {

                        enseignantsData.push({

                            id: doc.id,

                            ...doc.data()

                        });

                    }
                );


                afficherEnseignants(
                    enseignantsData
                );

            },

            function (error) {

                console.error(
                    "Firebase enseignants :",
                    error
                );

                alert(
                    "تعذر تحميل قائمة الأساتذة\n" +
                    error.message
                );

            }

        );

}


// ============================================================
// CHARGER LISTES
// ============================================================

function chargerListesEnseignant() {

    // Attendre que les autres fichiers aient
    // chargé leurs données Firebase.

    setTimeout(
        function () {

            remplirSelectGrade();

            remplirSelectSpecialite();

            remplirSelectDepartement();

            remplirSelectSifah();

            remplirSelectWadhia();

            remplirSelectAnnee();

        },
        500
    );

}


// ============================================================
// GRADE
// ============================================================

function remplirSelectGrade() {

    const select =
        document.getElementById(
            "gradeId"
        );

    const filtre =
        document.getElementById(
            "filter-grade"
        );


    if (select) {

        select.innerHTML =
            '<option value="">اختر الرتبة</option>';


        if (
            typeof getGradesData ===
            "function"
        ) {

            getGradesData()
                .filter(
                    item => item.actif !== false
                )
                .forEach(function (item) {

                    select.innerHTML += `

                        <option value="${item.id}">
                            ${echapperHTML(
                                item.nom
                            )}
                        </option>

                    `;

                });

        }

    }


    if (filtre) {

        filtre.innerHTML =
            '<option value="">كل الرتب</option>';


        if (
            typeof getGradesData ===
            "function"
        ) {

            getGradesData()
                .filter(
                    item => item.actif !== false
                )
                .forEach(function (item) {

                    filtre.innerHTML += `

                        <option value="${item.id}">
                            ${echapperHTML(
                                item.nom
                            )}
                        </option>

                    `;

                });

        }

    }

}


// ============================================================
// SPECIALITE
// ============================================================

function remplirSelectSpecialite() {

    const select =
        document.getElementById(
            "specialiteId"
        );

    const filtre =
        document.getElementById(
            "filter-specialite"
        );


    if (select) {

        select.innerHTML =
            '<option value="">اختر التخصص</option>';


        if (
            typeof getSpecialitesData ===
            "function"
        ) {

            getSpecialitesData()
                .filter(
                    item => item.actif !== false
                )
                .forEach(function (item) {

                    select.innerHTML += `

                        <option value="${item.id}">
                            ${echapperHTML(
                                item.nom
                            )}
                        </option>

                    `;

                });

        }

    }


    if (filtre) {

        filtre.innerHTML =
            '<option value="">كل التخصصات</option>';


        if (
            typeof getSpecialitesData ===
            "function"
        ) {

            getSpecialitesData()
                .filter(
                    item => item.actif !== false
                )
                .forEach(function (item) {

                    filtre.innerHTML += `

                        <option value="${item.id}">
                            ${echapperHTML(
                                item.nom
                            )}
                        </option>

                    `;

                });

        }

    }

}


// ============================================================
// DEPARTEMENT
// ============================================================

function remplirSelectDepartement() {

    const select =
        document.getElementById(
            "departementId"
        );

    const filtre =
        document.getElementById(
            "filter-departement"
        );


    if (select) {

        select.innerHTML =
            '<option value="">اختر القسم</option>';


        if (
            typeof getDepartementsData ===
            "function"
        ) {

            getDepartementsData()
                .filter(
                    item => item.actif !== false
                )
                .forEach(function (item) {

                    select.innerHTML += `

                        <option value="${item.id}">
                            ${echapperHTML(
                                item.nom
                            )}
                        </option>

                    `;

                });

        }

    }


    if (filtre) {

        filtre.innerHTML =
            '<option value="">كل الأقسام</option>';


        if (
            typeof getDepartementsData ===
            "function"
        ) {

            getDepartementsData()
                .filter(
                    item => item.actif !== false
                )
                .forEach(function (item) {

                    filtre.innerHTML += `

                        <option value="${item.id}">
                            ${echapperHTML(
                                item.nom
                            )}
                        </option>

                    `;

                });

        }

    }

}


// ============================================================
// SIFAH
// ============================================================

function remplirSelectSifah() {

    const select =
        document.getElementById(
            "sifah"
        );

    const filtre =
        document.getElementById(
            "filter-sifah"
        );


    const data =
        typeof getSifahData ===
        "function"
            ? getSifahData()
            : [];


    if (select) {

        select.innerHTML =
            '<option value="">اختر الصفة</option>';


        data
            .filter(
                item => item.actif !== false
            )
            .forEach(function (item) {

                select.innerHTML += `

                    <option value="${item.id}">
                        ${echapperHTML(
                            item.nom
                        )}
                    </option>

                `;

            });

    }


    if (filtre) {

        filtre.innerHTML =
            '<option value="">كل الصفات</option>';


        data
            .filter(
                item => item.actif !== false
            )
            .forEach(function (item) {

                filtre.innerHTML += `

                    <option value="${item.id}">
                        ${echapperHTML(
                            item.nom
                        )}
                    </option>

                `;

            });

    }

}


// ============================================================
// WADHIA
// ============================================================

function remplirSelectWadhia() {

    const select =
        document.getElementById(
            "wadhia"
        );

    const filtre =
        document.getElementById(
            "filter-wadhia"
        );


    const data =
        typeof getWadhiaData ===
        "function"
            ? getWadhiaData()
            : [];


    if (select) {

        select.innerHTML =
            '<option value="">اختر الوضعية</option>';


        data
            .filter(
                item => item.actif !== false
            )
            .forEach(function (item) {

                select.innerHTML += `

                    <option value="${item.id}">
                        ${echapperHTML(
                            item.nom
                        )}
                    </option>

                `;

            });

    }


    if (filtre) {

        filtre.innerHTML =
            '<option value="">كل الوضعيات</option>';


        data
            .filter(
                item => item.actif !== false
            )
            .forEach(function (item) {

                filtre.innerHTML += `

                    <option value="${item.id}">
                        ${echapperHTML(
                            item.nom
                        )}
                    </option>

                `;

            });

    }

}


// ============================================================
// ANNEE
// ============================================================

function remplirSelectAnnee() {

    const select =
        document.getElementById(
            "anneeUniversitaire"
        );

    const filtre =
        document.getElementById(
            "filter-anneeUniversitaire"
        );


    const data =
        typeof getAnneesData ===
        "function"
            ? getAnneesData()
            : [];


    if (select) {

        select.innerHTML =
            '<option value="">اختر السنة الجامعية</option>';


        data
            .filter(
                item => item.actif !== false
            )
            .forEach(function (item) {

                select.innerHTML += `

                    <option value="${item.id}">
                        ${echapperHTML(
                            item.nom
                        )}
                    </option>

                `;

            });

    }


    if (filtre) {

        filtre.innerHTML =
            '<option value="">كل السنوات الجامعية</option>';


        data
            .filter(
                item => item.actif !== false
            )
            .forEach(function (item) {

                filtre.innerHTML += `

                    <option value="${item.id}">
                        ${echapperHTML(
                            item.nom
                        )}
                    </option>

                `;

            });

    }

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


    liste.forEach(function (item) {

        const tr =
            document.createElement("tr");


        const grade =
            trouverNom(
                getGradesData(),
                item.gradeId
            );


        const specialite =
            trouverNom(
                getSpecialitesData(),
                item.specialiteId
            );


        const departement =
            trouverNom(
                getDepartementsData(),
                item.departementId
            );


        const sifah =
            trouverNom(
                getSifahData(),
                item.sifah
            );


        const wadhia =
            trouverNom(
                getWadhiaData(),
                item.wadhia
            );


        const annee =
            trouverNom(
                getAnneesData(),
                item.anneeUniversitaire
            );


        tr.innerHTML = `

            <td>
                ${item.numero ?? ""}
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
                    onclick="modifierEnseignant(
                        '${item.id}'
                    )"
                >
                    تعديل
                </button>

                <button
                    class="btn-danger"
                    onclick="supprimerEnseignant(
                        '${item.id}'
                    )"
                >
                    حذف
                </button>

            </td>

        `;


        tbody.appendChild(tr);

    });

}


// ============================================================
// TROUVER NOM
// ============================================================

function trouverNom(
    liste,
    id
) {

    if (!id) return "";


    const item =
        liste.find(function (x) {

            return x.id === id;

        });


    return item
        ? item.nom
        : "";

}


// ============================================================
// OUVRIR MODAL
// ============================================================

function ouvrirModalEnseignant(
    id = null
) {

    const modal =
        document.getElementById(
            "modal-enseignant"
        );

    if (!modal) return;


    document.getElementById(
        "enseignant-id"
    ).value =
        id || "";


    document.getElementById(
        "enseignant-form"
    ).reset();


    document.getElementById(
        "enseignant-id"
    ).value =
        id || "";


    document.getElementById(
        "modal-enseignant-title"
    ).textContent =
        id
            ? "تعديل أستاذ"
            : "إضافة أستاذ جديد";


    // Les listes doivent être disponibles
    remplirSelectGrade();
    remplirSelectSpecialite();
    remplirSelectDepartement();
    remplirSelectSifah();
    remplirSelectWadhia();
    remplirSelectAnnee();


    if (id) {

        const item =
            enseignantsData.find(
                function (x) {

                    return x.id === id;

                }
            );


        if (item) {

            document.getElementById(
                "numero"
            ).value =
                item.numero ?? "";


            document.getElementById(
                "matriculeCNRPS"
            ).value =
                item.matriculeCNRPS ?? "";


            document.getElementById(
                "nom"
            ).value =
                item.nom ?? "";


            document.getElementById(
                "prenom"
            ).value =
                item.prenom ?? "";


            document.getElementById(
                "gradeId"
            ).value =
                item.gradeId ?? "";


            document.getElementById(
                "specialiteId"
            ).value =
                item.specialiteId ?? "";


            document.getElementById(
                "departementId"
            ).value =
                item.departementId ?? "";


            document.getElementById(
                "tel1"
            ).value =
                item.tel1 ?? "";


            document.getElementById(
                "tel2"
            ).value =
                item.tel2 ?? "";


            document.getElementById(
                "email"
            ).value =
                item.email ?? "";


            document.getElementById(
                "sifah"
            ).value =
                item.sifah ?? "";


            document.getElementById(
                "wadhia"
            ).value =
                item.wadhia ?? "";


            document.getElementById(
                "anneeUniversitaire"
            ).value =
                item.anneeUniversitaire ?? "";


            document.getElementById(
                "genre"
            ).value =
                item.genre ?? "homme";


            document.getElementById(
                "dateNaissance"
            ).value =
                item.dateNaissance ?? "";


            document.getElementById(
                "dateRecrutement"
            ).value =
                item.dateRecrutement ?? "";


            document.getElementById(
                "dateDernierGrade"
            ).value =
                item.dateDernierGrade ?? "";

        }

    }


    modal.classList.remove(
        "hidden"
    );

}


// ============================================================
// MODIFIER
// ============================================================

function modifierEnseignant(id) {

    ouvrirModalEnseignant(id);

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


    const numero =
        Number(
            document.getElementById(
                "numero"
            ).value
        );


    const data = {

        numero: numero,

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

        sifah:
            document.getElementById(
                "sifah"
            ).value,

        wadhia:
            document.getElementById(
                "wadhia"
            ).value,

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
            firebase.firestore
                .FieldValue
                .serverTimestamp()

    };


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!data.matriculeCNRPS) {

        alert(
            "يرجى إدخال رقم التسجيل CNRPS"
        );

        return;

    }


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


    if (!data.gradeId) {

        alert(
            "يرجى اختيار الرتبة"
        );

        return;

    }


    if (!data.specialiteId) {

        alert(
            "يرجى اختيار التخصص"
        );

        return;

    }


    if (!data.departementId) {

        alert(
            "يرجى اختيار القسم"
        );

        return;

    }


    if (!data.sifah) {

        alert(
            "يرجى اختيار الصفة"
        );

        return;

    }


    if (!data.wadhia) {

        alert(
            "يرجى اختيار الوضعية"
        );

        return;

    }


    if (!data.anneeUniversitaire) {

        alert(
            "يرجى اختيار السنة الجامعية"
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
                firebase.firestore
                    .FieldValue
                    .serverTimestamp();


            await enseignantsRef.add(
                data
            );

        }


        fermerModal(
            "modal-enseignant"
        );


        alert(
            "تم حفظ بيانات الأستاذ بنجاح"
        );

    }

    catch (error) {

        console.error(
            "Erreur Firebase enseignant :",
            error
        );

        alert(
            "حدث خطأ أثناء حفظ بيانات الأستاذ\n" +
            error.message
        );

    }

}


// ============================================================
// SUPPRIMER
// ============================================================

async function supprimerEnseignant(
    id
) {

    if (
        !confirm(
            "هل أنت متأكد من حذف هذا الأستاذ ؟"
        )
    ) {

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
            "حدث خطأ أثناء حذف الأستاذ\n" +
            error.message
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

                const okMatricule =
                    !matricule ||
                    String(
                        item.matriculeCNRPS ?? ""
                    )
                    .toLowerCase()
                    .includes(matricule);


                const okGrade =
                    !grade ||
                    item.gradeId === grade;


                const okSpecialite =
                    !specialite ||
                    item.specialiteId === specialite;


                const okDepartement =
                    !departement ||
                    item.departementId === departement;


                const okSifah =
                    !sifah ||
                    item.sifah === sifah;


                const okWadhia =
                    !wadhia ||
                    item.wadhia === wadhia;


                const okAnnee =
                    !annee ||
                    item.anneeUniversitaire === annee;


                const okGenre =
                    !genre ||
                    item.genre === genre;


                return (

                    okMatricule &&

                    okGrade &&

                    okSpecialite &&

                    okDepartement &&

                    okSifah &&

                    okWadhia &&

                    okAnnee &&

                    okGenre

                );

            }
        );


    afficherEnseignants(
        resultat
    );

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
// FERMER MODAL
// ============================================================

function fermerModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


// ============================================================
// SECURITE HTML
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
// FIN
// ============================================================

console.log(
    "SIGE - enseignants.js chargé avec Firebase"
);
```
