// ============================================================
// SIGE - PARAMETRES
// ============================================================
// Gestion :
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
    annees: []
};


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("SIGE - parametres.js démarrage");

    initialiserParametres();

});


// ============================================================
// INITIALISATION
// ============================================================

function initialiserParametres() {

    console.log("Initialisation des paramètres...");


    // --------------------------------------------------------
    // ONGLETS
    // --------------------------------------------------------

    document.querySelectorAll(".param-tab-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            const type =
                this.dataset.paramTab;

            afficherParametreTab(type);

        });

    });


    // --------------------------------------------------------
    // AJOUT SIFAH
    // --------------------------------------------------------

    const btnSifah =
        document.getElementById("btn-add-sifah");

    if (btnSifah) {

        btnSifah.addEventListener("click", function () {

            ouvrirModalParametre("sifah");

        });

    }


    // --------------------------------------------------------
    // AJOUT WADHIA
    // --------------------------------------------------------

    const btnWadhia =
        document.getElementById("btn-add-wadhia");

    if (btnWadhia) {

        btnWadhia.addEventListener("click", function () {

            ouvrirModalParametre("wadhia");

        });

    }


    // --------------------------------------------------------
    // AJOUT ANNEE
    // --------------------------------------------------------

    const btnAnnee =
        document.getElementById("btn-add-annee");

    if (btnAnnee) {

        btnAnnee.addEventListener("click", function () {

            ouvrirModalParametre("annee");

        });

    }


    // --------------------------------------------------------
    // FORMULAIRE PARAMETRE
    // --------------------------------------------------------

    const formParametre =
        document.getElementById("parametre-form");

    if (formParametre) {

        formParametre.addEventListener(
            "submit",
            enregistrerParametre
        );

    }


    // --------------------------------------------------------
    // FORMULAIRE ETABLISSEMENT
    // --------------------------------------------------------

    const formEtablissement =
        document.getElementById("etablissement-form");

    if (formEtablissement) {

        formEtablissement.addEventListener(
            "submit",
            enregistrerEtablissement
        );

    }


    // --------------------------------------------------------
    // CHARGEMENT
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

    document
        .querySelectorAll(".param-tab-btn")
        .forEach(function (button) {

            button.classList.remove("active");

        });


    const bouton =
        document.querySelector(
            '.param-tab-btn[data-param-tab="' +
            type +
            '"]'
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

    if (typeof sifahRef === "undefined") {

        console.error("ERREUR : sifahRef non défini");

        return;

    }


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
                    "ERREUR chargement sifah :",
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
// WADHIA
// ============================================================

function chargerWadhia() {

    if (typeof wadhiaRef === "undefined") {

        console.error("ERREUR : wadhiaRef non défini");

        return;

    }


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
                    "ERREUR chargement wadhia :",
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
// ANNEES UNIVERSITAIRES
// ============================================================

function chargerAnnees() {

    if (typeof anneesRef === "undefined") {

        console.error(
            "ERREUR : anneesRef non défini"
        );

        return;

    }


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
                    "ERREUR chargement anneesUniversitaires :",
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


    if (parametresData.annees.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="5"
                    style="text-align:center">

                    لا توجد سنوات جامعية مسجلة

                </td>

            </tr>

        `;

        return;

    }


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
                    item.actif !== false
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
// OUVRIR MODAL
// ============================================================

function ouvrirModalParametre(
    type,
    id = null
) {

    const modal =
        document.getElementById(
            "modal-parametre"
        );

    if (!modal) {

        console.error(
            "modal-parametre introuvable"
        );

        return;

    }


    const idInput =
        document.getElementById(
            "parametre-id"
        );

    const typeInput =
        document.getElementById(
            "parametre-type"
        );

    const codeInput =
        document.getElementById(
            "parametre-code"
        );

    const nomInput =
        document.getElementById(
            "parametre-nom"
        );

    const ordreInput =
        document.getElementById(
            "parametre-ordre"
        );

    const currentInput =
        document.getElementById(
            "parametre-current"
        );

    const currentGroup =
        document.getElementById(
            "parametre-current-group"
        );

    const actifInput =
        document.getElementById(
            "parametre-actif"
        );


    idInput.value = id || "";

    typeInput.value = type;

    codeInput.value = "";

    nomInput.value = "";

    ordreInput.value = "1";

    currentInput.checked = false;

    actifInput.checked = true;


    // --------------------------------------------------------
    // ANNEE
    // --------------------------------------------------------

    if (type === "annee") {

        codeInput
            .parentElement
            .style
            .display = "none";

        codeInput.required = false;

        currentGroup.style.display = "block";

    }

    else {

        codeInput
            .parentElement
            .style
            .display = "block";

        codeInput.required = true;

        currentGroup.style.display = "none";

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
            collection.find(function (element) {

                return element.id === id;

            });


        if (item) {

            codeInput.value =
                item.code || "";

            nomInput.value =
                item.nom || "";

            ordreInput.value =
                item.ordre || 1;

            currentInput.checked =
                item.current === true;

            actifInput.checked =
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
// MODIFIER
// ============================================================

function modifierParametre(type, id) {

    ouvrirModalParametre(type, id);

}


// ============================================================
// ENREGISTRER SIFAH / WADHIA / ANNEE
// ============================================================

async function enregistrerParametre(event) {

    event.preventDefault();


    console.log(
        "Enregistrement paramètre..."
    );


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


    if (
        !Number.isFinite(ordre) ||
        ordre < 1
    ) {

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
    // COLLECTION
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
    // DONNEES
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


    try {

        // ----------------------------------------------------
        // MODIFICATION
        // ----------------------------------------------------

        if (id) {

            console.log(
                "Modification du document :",
                id
            );


            await collection
                .doc(id)
                .set(
                    data,
                    {
                        merge: true
                    }
                );

        }

        // ----------------------------------------------------
        // AJOUT
        // ----------------------------------------------------

        else {

            console.log(
                "Ajout dans la collection :",
                type
            );


            const docRef =
                await collection.add(data);


            console.log(
                "Document créé :",
                docRef.id
            );


            // Si nouvelle année courante
            if (
                type === "annee" &&
                current === true
            ) {

                await rendreAnneesNonCourantes(
                    docRef.id
                );

            }

        }


        // ----------------------------------------------------
        // SI MODIFICATION D'UNE ANNEE COURANTE
        // ----------------------------------------------------

        if (
            type === "annee" &&
            current === true
        ) {

            await rendreAnneesNonCourantes(id);

        }


        fermerModal(
            "modal-parametre"
        );


        document
            .getElementById("parametre-form")
            .reset();


        alert(
            "تم حفظ البيانات بنجاح"
        );

    }

    catch (error) {

        console.error(
            "ERREUR FIREBASE ENREGISTREMENT :",
            error
        );


        alert(
            "حدث خطأ أثناء حفظ البيانات :\n\n" +
            error.code +
            "\n" +
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

    if (!idCourante) {
        return;
    }


    const snapshot =
        await anneesRef.get();


    const batch =
        db.batch();


    let modifications = 0;


    snapshot.forEach(function (doc) {

        if (
            doc.id !== idCourante &&
            doc.data().current === true
        ) {

            batch.update(
                doc.ref,
                {
                    current: false
                }
            );

            modifications++;

        }

    });


    if (modifications > 0) {

        await batch.commit();

    }

}


// ============================================================
// SUPPRIMER
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


        alert(
            "تم حذف البيانات بنجاح"
        );

    }

    catch (error) {

        console.error(
            "ERREUR SUPPRESSION :",
            error
        );


        alert(
            "حدث خطأ أثناء الحذف :\n\n" +
            error.code +
            "\n" +
            error.message
        );

    }

}


// ============================================================
// CHARGER ETABLISSEMENT
// ============================================================

async function chargerEtablissement() {

    if (
        typeof etablissementRef ===
        "undefined"
    ) {

        console.error(
            "ERREUR : etablissementRef non défini"
        );

        return;

    }


    try {

        const doc =
            await etablissementRef
                .doc("principal")
                .get();


        if (!doc.exists) {

            console.log(
                "Aucune information établissement"
            );

            return;

        }


        const data =
            doc.data();


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


        console.log(
            "Informations établissement chargées"
        );

    }

    catch (error) {

        console.error(
            "ERREUR CHARGEMENT ETABLISSEMENT :",
            error
        );


        alert(
            "حدث خطأ أثناء تحميل معلومات المؤسسة :\n\n" +
            error.code +
            "\n" +
            error.message
        );

    }

}


// ============================================================
// ENREGISTRER ETABLISSEMENT
// ============================================================

async function enregistrerEtablissement(
    event
) {

    event.preventDefault();


    console.log(
        "Enregistrement établissement..."
    );


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


    try {

        if (
            typeof etablissementRef ===
            "undefined"
        ) {

            throw new Error(
                "etablissementRef غير موجود"
            );

        }


        console.log(
            "Sauvegarde dans etablissement/principal..."
        );


        await etablissementRef
            .doc("principal")
            .set(
                data,
                {
                    merge: true
                }
            );


        console.log(
            "Informations établissement sauvegardées"
        );


        alert(
            "تم حفظ معلومات المؤسسة بنجاح"
        );

    }

    catch (error) {

        console.error(
            "ERREUR FIREBASE ETABLISSEMENT :",
            error
        );


        alert(
            "حدث خطأ أثناء حفظ معلومات المؤسسة :\n\n" +
            error.code +
            "\n" +
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
// FERMETURE MODAL
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
// FONCTIONS PUBLIQUES
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


function getAnneeCourante() {

    return parametresData.annees.find(
        function (item) {

            return (
                item.current === true &&
                item.actif !== false
            );

        }
    ) || null;

}


// ============================================================
// FIN
// ============================================================

console.log(
    "SIGE - parametres.js chargé"
);
