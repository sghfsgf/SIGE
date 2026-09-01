// ============================================================
// SIGE - PARAMÈTRES
// ============================================================
// Gestion complète de :
// 1. الصفة
// 2. الوضعية
// 3. السنوات الجامعية
// 4. معلومات المؤسسة
// ============================================================


// ============================================================
// VARIABLES
// ============================================================

let parametresData = {

    sifah: [],

    wadhia: [],

    annees: [],

    etablissement: {}

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

    // --------------------------------------------------------
    // ONGLET PARAMÈTRES
    // --------------------------------------------------------

    document
        .querySelectorAll(".param-tab-btn")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const tab = this.dataset.paramTab;

                afficherParametreTab(tab);

            });

        });


    // --------------------------------------------------------
    // BOUTON AJOUTER SIFAH
    // --------------------------------------------------------

    const btnSifah =
        document.getElementById("btn-add-sifah");

    if (btnSifah) {

        btnSifah.addEventListener("click", function () {

            ouvrirModalParametre("sifah");

        });

    }


    // --------------------------------------------------------
    // BOUTON AJOUTER WADHIA
    // --------------------------------------------------------

    const btnWadhia =
        document.getElementById("btn-add-wadhia");

    if (btnWadhia) {

        btnWadhia.addEventListener("click", function () {

            ouvrirModalParametre("wadhia");

        });

    }


    // --------------------------------------------------------
    // BOUTON AJOUTER ANNÉE
    // --------------------------------------------------------

    const btnAnnee =
        document.getElementById("btn-add-annee");

    if (btnAnnee) {

        btnAnnee.addEventListener("click", function () {

            ouvrirModalParametre("annee");

        });

    }


    // --------------------------------------------------------
    // FORMULAIRE PARAMÈTRE
    // --------------------------------------------------------

    const parametreForm =
        document.getElementById("parametre-form");

    if (parametreForm) {

        parametreForm.addEventListener(
            "submit",
            enregistrerParametre
        );

    }


    // --------------------------------------------------------
    // FORMULAIRE ÉTABLISSEMENT
    // --------------------------------------------------------

    const etablissementForm =
        document.getElementById("etablissement-form");

    if (etablissementForm) {

        etablissementForm.addEventListener(
            "submit",
            enregistrerEtablissement
        );

    }


    // --------------------------------------------------------
    // CHARGEMENT FIREBASE
    // --------------------------------------------------------

    chargerSifah();

    chargerWadhia();

    chargerAnnees();

    chargerEtablissement();

}


// ============================================================
// AFFICHER ONGLET
// ============================================================

function afficherParametreTab(type) {

    // Boutons

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


    // Contenus

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
// SIFAH - CHARGER
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
                    "Erreur chargement sifah :",
                    error
                );

            }

        );

}


// ============================================================
// SIFAH - AFFICHER
// ============================================================

function afficherSifah() {

    const tbody =
        document.getElementById("sifah-body");

    if (!tbody) return;


    tbody.innerHTML = "";


    if (parametresData.sifah.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    لا توجد بيانات
                </td>
            </tr>
        `;

        return;

    }


    parametresData.sifah.forEach(function (item) {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${item.ordre ?? ""}
            </td>

            <td>
                ${echapperHTML(item.code ?? "")}
            </td>

            <td>
                ${echapperHTML(item.nom ?? "")}
            </td>

            <td>
                ${
                    item.actif
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
// WADHIA - CHARGER
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
                    "Erreur chargement wadhia :",
                    error
                );

            }

        );

}


// ============================================================
// WADHIA - AFFICHER
// ============================================================

function afficherWadhia() {

    const tbody =
        document.getElementById("wadhia-body");

    if (!tbody) return;


    tbody.innerHTML = "";


    if (parametresData.wadhia.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    لا توجد بيانات
                </td>
            </tr>
        `;

        return;

    }


    parametresData.wadhia.forEach(function (item) {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${item.ordre ?? ""}
            </td>

            <td>
                ${echapperHTML(item.code ?? "")}
            </td>

            <td>
                ${echapperHTML(item.nom ?? "")}
            </td>

            <td>
                ${
                    item.actif
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
// ANNÉES UNIVERSITAIRES - CHARGER
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
                    "Erreur chargement années :",
                    error
                );

            }

        );

}


// ============================================================
// ANNÉES UNIVERSITAIRES - AFFICHER
// ============================================================

function afficherAnnees() {

    const tbody =
        document.getElementById("annees-body");

    if (!tbody) return;


    tbody.innerHTML = "";


    if (parametresData.annees.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    لا توجد سنوات جامعية
                </td>
            </tr>
        `;

        return;

    }


    parametresData.annees.forEach(function (item) {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${item.ordre ?? ""}
            </td>

            <td>
                ${echapperHTML(item.nom ?? "")}
            </td>

            <td>
                ${
                    item.current
                        ? '<span class="status-active">نعم</span>'
                        : '<span class="status-inactive">لا</span>'
                }
            </td>

            <td>
                ${
                    item.actif
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
// OUVRIR MODAL PARAMÈTRE
// ============================================================

function ouvrirModalParametre(type, id = null) {

    const modal =
        document.getElementById("modal-parametre");

    if (!modal) return;


    const idInput =
        document.getElementById("parametre-id");

    const typeInput =
        document.getElementById("parametre-type");

    const code =
        document.getElementById("parametre-code");

    const nom =
        document.getElementById("parametre-nom");

    const ordre =
        document.getElementById("parametre-ordre");

    const current =
        document.getElementById("parametre-current");

    const currentGroup =
        document.getElementById(
            "parametre-current-group"
        );

    const actif =
        document.getElementById("parametre-actif");


    // Valeurs initiales

    idInput.value = id || "";

    typeInput.value = type;

    code.value = "";

    nom.value = "";

    ordre.value = "1";

    current.checked = false;

    actif.checked = true;


    // --------------------------------------------------------
    // ANNÉE
    // --------------------------------------------------------

    if (type === "annee") {

        code.parentElement.style.display = "none";

        currentGroup.style.display = "block";

        nom.placeholder =
            "مثال: 2026-2027";

    }

    // --------------------------------------------------------
    // SIFAH / WADHIA
    // --------------------------------------------------------

    else {

        code.parentElement.style.display = "block";

        currentGroup.style.display = "none";

        if (type === "sifah") {

            code.placeholder =
                "مثال: TIT";

            nom.placeholder =
                "مثال: مرسم";

        }

        if (type === "wadhia") {

            code.placeholder =
                "مثال: ACT";

            nom.placeholder =
                "مثال: مباشر";

        }

    }


    // --------------------------------------------------------
    // MODIFICATION
    // --------------------------------------------------------

    if (id) {

        let collection = [];


        if (type === "sifah") {

            collection =
                parametresData.sifah;

        }

        else if (type === "wadhia") {

            collection =
                parametresData.wadhia;

        }

        else if (type === "annee") {

            collection =
                parametresData.annees;

        }


        const item =
            collection.find(function (x) {

                return x.id === id;

            });


        if (item) {

            code.value =
                item.code || "";

            nom.value =
                item.nom || "";

            ordre.value =
                item.ordre || 1;

            current.checked =
                item.current === true;

            actif.checked =
                item.actif !== false;

        }

    }


    // --------------------------------------------------------
    // TITRE
    // --------------------------------------------------------

    document.getElementById(
        "modal-parametre-title"
    ).textContent = id
        ? "تعديل"
        : "إضافة";


    modal.classList.remove("hidden");

}


// ============================================================
// MODIFIER
// ============================================================

function modifierParametre(type, id) {

    ouvrirModalParametre(type, id);

}


// ============================================================
// ENREGISTRER PARAMÈTRE
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


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!nom) {

        alert("يرجى إدخال الاسم");

        return;

    }


    if (!Number.isFinite(ordre) || ordre < 1) {

        alert("يرجى إدخال ترتيب صحيح");

        return;

    }


    if (
        type !== "annee" &&
        !code
    ) {

        alert("يرجى إدخال الرمز");

        return;

    }


    // --------------------------------------------------------
    // COLLECTION FIREBASE
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // DATA
    // --------------------------------------------------------

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


    if (type === "annee") {

        data.current = current;

    }


    // --------------------------------------------------------
    // FIREBASE
    // --------------------------------------------------------

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
                firebase.firestore.FieldValue
                    .serverTimestamp();


            const docRef =
                await collection.add(data);


            // Si cette année est définie comme actuelle

            if (
                type === "annee" &&
                current
            ) {

                await rendreAnneesNonCourantes(
                    docRef.id
                );

            }

        }


        // ----------------------------------------------------
        // SI MODIFICATION D'UNE ANNÉE COURANTE
        // ----------------------------------------------------

        if (
            type === "annee" &&
            current
        ) {

            await rendreAnneesNonCourantes(id);

        }


        fermerModal("modal-parametre");


        event.target.reset();


    }

    catch (error) {

        console.error(
            "Erreur enregistrement paramètre :",
            error
        );


        alert(
            "حدث خطأ أثناء حفظ البيانات"
        );

    }

}


// ============================================================
// UNE SEULE ANNÉE COURANTE
// ============================================================

async function rendreAnneesNonCourantes(
    idCourante
) {

    if (!idCourante) return;


    try {

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

    catch (error) {

        console.error(
            "Erreur mise à jour année courante :",
            error
        );

    }

}


// ============================================================
// SUPPRIMER PARAMÈTRE
// ============================================================

async function supprimerParametre(
    type,
    id
) {

    const confirmation =
        confirm(
            "هل أنت متأكد من حذف هذا العنصر ؟"
        );


    if (!confirmation) return;


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
            "حدث خطأ أثناء الحذف"
        );

    }

}


// ============================================================
// ETABLISSEMENT - CHARGER
// ============================================================

async function chargerEtablissement() {

    try {

        const snapshot =
            await etablissementRef
                .doc("principal")
                .get();


        if (!snapshot.exists) {

            console.log(
                "Aucune information établissement"
            );

            return;

        }


        const data =
            snapshot.data();


        parametresData.etablissement =
            data;


        // ----------------------------------------------------
        // NOM
        // ----------------------------------------------------

        const nom =
            document.getElementById(
                "etablissement-nom"
            );

        if (nom) {

            nom.value =
                data.nom || "";

        }


        // ----------------------------------------------------
        // UNIVERSITÉ
        // ----------------------------------------------------

        const universite =
            document.getElementById(
                "etablissement-universite"
            );

        if (universite) {

            universite.value =
                data.universite || "";

        }


        // ----------------------------------------------------
        // CODE
        // ----------------------------------------------------

        const code =
            document.getElementById(
                "etablissement-code"
            );

        if (code) {

            code.value =
                data.code || "";

        }


        // ----------------------------------------------------
        // ADRESSE
        // ----------------------------------------------------

        const adresse =
            document.getElementById(
                "etablissement-adresse"
            );

        if (adresse) {

            adresse.value =
                data.adresse || "";

        }


        // ----------------------------------------------------
        // TÉLÉPHONE
        // ----------------------------------------------------

        const tel =
            document.getElementById(
                "etablissement-tel"
            );

        if (tel) {

            tel.value =
                data.tel || "";

        }


        // ----------------------------------------------------
        // EMAIL
        // ----------------------------------------------------

        const email =
            document.getElementById(
                "etablissement-email"
            );

        if (email) {

            email.value =
                data.email || "";

        }

    }

    catch (error) {

        console.error(
            "Erreur chargement établissement :",
            error
        );

    }

}


// ============================================================
// ETABLISSEMENT - ENREGISTRER
// ============================================================

async function enregistrerEtablissement(event) {

    event.preventDefault();


    const nom =
        document.getElementById(
            "etablissement-nom"
        ).value.trim();


    const universite =
        document.getElementById(
            "etablissement-universite"
        ).value.trim();


    const code =
        document.getElementById(
            "etablissement-code"
        ).value.trim();


    const adresse =
        document.getElementById(
            "etablissement-adresse"
        ).value.trim();


    const tel =
        document.getElementById(
            "etablissement-tel"
        ).value.trim();


    const email =
        document.getElementById(
            "etablissement-email"
        ).value.trim();


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!nom) {

        alert(
            "يرجى إدخال اسم المؤسسة"
        );

        return;

    }


    // --------------------------------------------------------
    // DATA
    // --------------------------------------------------------

    const data = {

        nom: nom,

        universite: universite,

        code: code,

        adresse: adresse,

        tel: tel,

        email: email,

        updatedAt:
            firebase.firestore.FieldValue
                .serverTimestamp()

    };


    // --------------------------------------------------------
    // FIREBASE
    // --------------------------------------------------------

    try {

        await etablissementRef
            .doc("principal")
            .set(
                data,
                {
                    merge: true
                }
            );


        parametresData.etablissement =
            data;


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
            "حدث خطأ أثناء حفظ معلومات المؤسسة"
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
// BOUTONS FERMER
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        const bouton =
            event.target.closest(
                ".close-modal"
            );


        if (!bouton) return;


        const modalId =
            bouton.dataset.modal;


        if (modalId) {

            fermerModal(modalId);

        }

    }
);


// ============================================================
// SÉCURITÉ HTML
// ============================================================

function echapperHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// FONCTIONS PUBLIQUES
// UTILISÉES PAR enseignants.js
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


function getEtablissementData() {

    return parametresData.etablissement;

}


// ============================================================
// FIN
// ============================================================

console.log(
    "SIGE - parametres.js chargé complètement"
);
