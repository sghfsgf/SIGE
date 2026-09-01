```javascript
// ============================================================
// SIGE - PARAMETRES.JS
// Gestion Firebase Firestore
// ============================================================

let parametresData = {
    sifah: [],
    wadhia: [],
    annees: []
};


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    initialiserParametres();

});


// ============================================================
// INITIALISATION
// ============================================================

function initialiserParametres() {

    // -------------------------------
    // Onglets paramètres
    // -------------------------------

    document.querySelectorAll(".param-tab-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            afficherParametreTab(
                this.dataset.paramTab
            );

        });

    });


    // -------------------------------
    // Ajouter SIFAH
    // -------------------------------

    const btnSifah =
        document.getElementById("btn-add-sifah");

    if (btnSifah) {

        btnSifah.addEventListener("click", function () {

            ouvrirModalParametre("sifah");

        });

    }


    // -------------------------------
    // Ajouter WADHIA
    // -------------------------------

    const btnWadhia =
        document.getElementById("btn-add-wadhia");

    if (btnWadhia) {

        btnWadhia.addEventListener("click", function () {

            ouvrirModalParametre("wadhia");

        });

    }


    // -------------------------------
    // Ajouter ANNEE
    // -------------------------------

    const btnAnnee =
        document.getElementById("btn-add-annee");

    if (btnAnnee) {

        btnAnnee.addEventListener("click", function () {

            ouvrirModalParametre("annee");

        });

    }


    // -------------------------------
    // Formulaire paramètre
    // -------------------------------

    const formParametre =
        document.getElementById("parametre-form");

    if (formParametre) {

        formParametre.addEventListener(
            "submit",
            enregistrerParametre
        );

    }


    // -------------------------------
    // Formulaire établissement
    // -------------------------------

    const formEtablissement =
        document.getElementById("etablissement-form");

    if (formEtablissement) {

        formEtablissement.addEventListener(
            "submit",
            enregistrerEtablissement
        );

    }


    // -------------------------------
    // Chargement Firebase
    // -------------------------------

    chargerSifah();

    chargerWadhia();

    chargerAnnees();

    chargerEtablissement();

}


// ============================================================
// AFFICHER ONGLET
// ============================================================

function afficherParametreTab(type) {

    document
        .querySelectorAll(".param-tab-btn")
        .forEach(function (button) {

            button.classList.remove("active");

        });


    const bouton =
        document.querySelector(
            `.param-tab-btn[data-param-tab="${type}"]`
        );


    if (bouton) {

        bouton.classList.add("active");

    }


    document
        .querySelectorAll(".param-tab-content")
        .forEach(function (content) {

            content.classList.add("hidden");

        });


    const contenu =
        document.getElementById(
            "param-tab-" + type
        );


    if (contenu) {

        contenu.classList.remove("hidden");

    }

}


// ============================================================
// SIFAH
// ============================================================

function chargerSifah() {

    sifahRef
        .orderBy("ordre", "asc")
        .onSnapshot(

            function (snapshot) {

                parametresData.sifah = [];

                snapshot.forEach(function (doc) {

                    parametresData.sifah.push({

                        id: doc.id,

                        ...doc.data()

                    });

                });

                afficherSifah();

            },

            function (error) {

                console.error(
                    "Firebase SIFAH :",
                    error
                );

            }

        );

}


// ============================================================
// AFFICHER SIFAH
// ============================================================

function afficherSifah() {

    const tbody =
        document.getElementById("sifah-body");

    if (!tbody) return;

    tbody.innerHTML = "";


    parametresData.sifah.forEach(function (item) {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>${item.ordre ?? ""}</td>

            <td>${echapperHTML(item.code ?? "")}</td>

            <td>${echapperHTML(item.nom ?? "")}</td>

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
                    onclick="modifierParametre('sifah','${item.id}')"
                >
                    تعديل
                </button>

                <button
                    class="btn-danger"
                    onclick="supprimerParametre('sifah','${item.id}')"
                >
                    حذف
                </button>

            </td>

        `;


        tbody.appendChild(tr);

    });

}


// ============================================================
// WADHIA
// ============================================================

function chargerWadhia() {

    wadhiaRef
        .orderBy("ordre", "asc")
        .onSnapshot(

            function (snapshot) {

                parametresData.wadhia = [];

                snapshot.forEach(function (doc) {

                    parametresData.wadhia.push({

                        id: doc.id,

                        ...doc.data()

                    });

                });

                afficherWadhia();

            },

            function (error) {

                console.error(
                    "Firebase WADHIA :",
                    error
                );

            }

        );

}


// ============================================================
// AFFICHER WADHIA
// ============================================================

function afficherWadhia() {

    const tbody =
        document.getElementById("wadhia-body");

    if (!tbody) return;

    tbody.innerHTML = "";


    parametresData.wadhia.forEach(function (item) {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>${item.ordre ?? ""}</td>

            <td>${echapperHTML(item.code ?? "")}</td>

            <td>${echapperHTML(item.nom ?? "")}</td>

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
                    onclick="modifierParametre('wadhia','${item.id}')"
                >
                    تعديل
                </button>

                <button
                    class="btn-danger"
                    onclick="supprimerParametre('wadhia','${item.id}')"
                >
                    حذف
                </button>

            </td>

        `;


        tbody.appendChild(tr);

    });

}


// ============================================================
// ANNEES UNIVERSITAIRES
// ============================================================

function chargerAnnees() {

    anneesRef
        .orderBy("ordre", "asc")
        .onSnapshot(

            function (snapshot) {

                parametresData.annees = [];

                snapshot.forEach(function (doc) {

                    parametresData.annees.push({

                        id: doc.id,

                        ...doc.data()

                    });

                });

                afficherAnnees();

            },

            function (error) {

                console.error(
                    "Firebase ANNEES :",
                    error
                );

            }

        );

}


// ============================================================
// AFFICHER ANNEES
// ============================================================

function afficherAnnees() {

    const tbody =
        document.getElementById("annees-body");

    if (!tbody) return;

    tbody.innerHTML = "";


    parametresData.annees.forEach(function (item) {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>${item.ordre ?? ""}</td>

            <td>${echapperHTML(item.nom ?? "")}</td>

            <td>
                ${
                    item.current === true
                        ? '<span class="status-active">نعم</span>'
                        : '<span class="status-inactive">لا</span>'
                }
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
                    onclick="modifierParametre('annee','${item.id}')"
                >
                    تعديل
                </button>

                <button
                    class="btn-danger"
                    onclick="supprimerParametre('annee','${item.id}')"
                >
                    حذف
                </button>

            </td>

        `;


        tbody.appendChild(tr);

    });

}


// ============================================================
// OUVRIR MODAL PARAMETRE
// ============================================================

function ouvrirModalParametre(type, id = null) {

    const modal =
        document.getElementById("modal-parametre");

    if (!modal) return;


    const inputId =
        document.getElementById("parametre-id");

    const inputType =
        document.getElementById("parametre-type");

    const inputCode =
        document.getElementById("parametre-code");

    const inputNom =
        document.getElementById("parametre-nom");

    const inputOrdre =
        document.getElementById("parametre-ordre");

    const inputCurrent =
        document.getElementById("parametre-current");

    const currentGroup =
        document.getElementById(
            "parametre-current-group"
        );

    const inputActif =
        document.getElementById("parametre-actif");


    inputId.value = id || "";

    inputType.value = type;

    inputCode.value = "";

    inputNom.value = "";

    inputOrdre.value = "1";

    inputCurrent.checked = false;

    inputActif.checked = true;


    if (type === "annee") {

        inputCode.parentElement.style.display =
            "none";

        currentGroup.style.display =
            "block";

    }

    else {

        inputCode.parentElement.style.display =
            "block";

        currentGroup.style.display =
            "none";

    }


    // -------------------------------
    // Modification
    // -------------------------------

    if (id) {

        let liste = [];


        if (type === "sifah") {

            liste = parametresData.sifah;

        }

        else if (type === "wadhia") {

            liste = parametresData.wadhia;

        }

        else if (type === "annee") {

            liste = parametresData.annees;

        }


        const item =
            liste.find(function (x) {

                return x.id === id;

            });


        if (item) {

            inputCode.value =
                item.code || "";

            inputNom.value =
                item.nom || "";

            inputOrdre.value =
                item.ordre || 1;

            inputCurrent.checked =
                item.current === true;

            inputActif.checked =
                item.actif !== false;

        }

    }


    document.getElementById(
        "modal-parametre-title"
    ).textContent =
        id ? "تعديل" : "إضافة";


    modal.classList.remove("hidden");

}


// ============================================================
// ENREGISTRER PARAMETRE
// ============================================================

async function enregistrerParametre(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "parametre-id"
        ).value;


    const type =
        document.getElementById(
            "parametre-type"
        ).value;


    const code =
        document.getElementById(
            "parametre-code"
        ).value.trim();


    const nom =
        document.getElementById(
            "parametre-nom"
        ).value.trim();


    const ordre =
        Number(
            document.getElementById(
                "parametre-ordre"
            ).value
        );


    const current =
        document.getElementById(
            "parametre-current"
        ).checked;


    const actif =
        document.getElementById(
            "parametre-actif"
        ).checked;


    if (!nom) {

        alert("يرجى إدخال الاسم");

        return;

    }


    if (
        type !== "annee" &&
        !code
    ) {

        alert("يرجى إدخال الرمز");

        return;

    }


    let collection;


    if (type === "sifah") {

        collection = sifahRef;

    }

    else if (type === "wadhia") {

        collection = wadhiaRef;

    }

    else if (type === "annee") {

        collection = anneesRef;

    }

    else {

        alert("نوع المعلمة غير معروف");

        return;

    }


    const data = {

        nom: nom,

        ordre: ordre,

        actif: actif,

        updatedAt:
            firebase.firestore.FieldValue
                .serverTimestamp()

    };


    if (type !== "annee") {

        data.code = code;

    }

    else {

        data.current = current;

    }


    try {

        let idFinal = id;


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
                firebase.firestore.FieldValue
                    .serverTimestamp();

            const docRef =
                await collection.add(data);

            idFinal = docRef.id;

        }


        // -------------------------------
        // Une seule année courante
        // -------------------------------

        if (
            type === "annee" &&
            current
        ) {

            await rendreAnneesNonCourantes(
                idFinal
            );

        }


        fermerModal(
            "modal-parametre"
        );

    }

    catch (error) {

        console.error(
            "Erreur enregistrement :",
            error
        );

        alert(
            "حدث خطأ أثناء حفظ البيانات\n" +
            error.message
        );

    }

}


// ============================================================
// UNE SEULE ANNEE COURANTE
// ============================================================

async function rendreAnneesNonCourantes(
    idCourante
) {

    const snapshot =
        await anneesRef.get();


    const batch =
        db.batch();


    snapshot.forEach(function (doc) {

        if (doc.id !== idCourante) {

            batch.update(
                doc.ref,
                {
                    current: false
                }
            );

        }

    });


    await batch.commit();

}


// ============================================================
// SUPPRIMER PARAMETRE
// ============================================================

async function supprimerParametre(
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


    if (type === "sifah") {

        collection = sifahRef;

    }

    else if (type === "wadhia") {

        collection = wadhiaRef;

    }

    else if (type === "annee") {

        collection = anneesRef;

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
// ETABLISSEMENT
// ============================================================

async function chargerEtablissement() {

    try {

        const doc =
            await etablissementRef
                .doc("principal")
                .get();


        if (!doc.exists) return;


        const data = doc.data();


        document.getElementById(
            "etablissement-nom"
        ).value =
            data.nom || "";


        document.getElementById(
            "etablissement-universite"
        ).value =
            data.universite || "";


        document.getElementById(
            "etablissement-code"
        ).value =
            data.code || "";


        document.getElementById(
            "etablissement-adresse"
        ).value =
            data.adresse || "";


        document.getElementById(
            "etablissement-tel"
        ).value =
            data.tel || "";


        document.getElementById(
            "etablissement-email"
        ).value =
            data.email || "";

    }

    catch (error) {

        console.error(
            "Erreur établissement :",
            error
        );

    }

}


// ============================================================
// ENREGISTRER ETABLISSEMENT
// ============================================================

async function enregistrerEtablissement(event) {

    event.preventDefault();


    const data = {

        nom:
            document.getElementById(
                "etablissement-nom"
            ).value.trim(),

        universite:
            document.getElementById(
                "etablissement-universite"
            ).value.trim(),

        code:
            document.getElementById(
                "etablissement-code"
            ).value.trim(),

        adresse:
            document.getElementById(
                "etablissement-adresse"
            ).value.trim(),

        tel:
            document.getElementById(
                "etablissement-tel"
            ).value.trim(),

        email:
            document.getElementById(
                "etablissement-email"
            ).value.trim(),

        updatedAt:
            firebase.firestore.FieldValue
                .serverTimestamp()

    };


    try {

        await etablissementRef
            .doc("principal")
            .set(
                data,
                {
                    merge: true
                }
            );


        alert(
            "تم حفظ معلومات المؤسسة بنجاح"
        );

    }

    catch (error) {

        console.error(
            "Erreur établissement :",
            error
        );

        alert(
            "حدث خطأ أثناء حفظ معلومات المؤسسة\n" +
            error.message
        );

    }

}


// ============================================================
// FERMER MODAL
// ============================================================

function fermerModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.classList.add("hidden");

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
// DONNEES POUR ENSEIGNANTS.JS
// ============================================================

function getSifahData() {

    return parametresData.sifah;

}


function getWadhiaData() {

    return parametresData.wadhia;

}


function getAnneesData() {

    return parametresData.annees;

}


// ============================================================
// FIN
// ============================================================

console.log(
    "SIGE - parametres.js chargé avec Firebase"
);
```
