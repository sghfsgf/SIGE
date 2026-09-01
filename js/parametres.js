```javascript
// ============================================================
// SIGE - PARAMETRES FIREBASE
// ============================================================
// Gestion de :
// 1. الصفة
// 2. الوضعية
// 3. السنوات الجامعية
// 4. معلومات المؤسسة
//
// Compatible avec firebase-config.js
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

    initialiserParametres();

});


// ============================================================
// INITIALISATION
// ============================================================

function initialiserParametres() {

    console.log("SIGE - Initialisation parametres.js");


    // --------------------------------------------------------
    // ONGLETS
    // --------------------------------------------------------

    document.querySelectorAll(".param-tab-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            const tab = this.dataset.paramTab;

            afficherParametreTab(tab);

        });

    });


    // --------------------------------------------------------
    // BOUTON AJOUT SIFAH
    // --------------------------------------------------------

    const btnSifah =
        document.getElementById("btn-add-sifah");

    if (btnSifah) {

        btnSifah.addEventListener("click", function () {

            ouvrirModalParametre("sifah");

        });

    }


    // --------------------------------------------------------
    // BOUTON AJOUT WADHIA
    // --------------------------------------------------------

    const btnWadhia =
        document.getElementById("btn-add-wadhia");

    if (btnWadhia) {

        btnWadhia.addEventListener("click", function () {

            ouvrirModalParametre("wadhia");

        });

    }


    // --------------------------------------------------------
    // BOUTON AJOUT ANNEE
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

    const parametreForm =
        document.getElementById("parametre-form");

    if (parametreForm) {

        parametreForm.addEventListener(
            "submit",
            enregistrerParametre
        );

    }


    // --------------------------------------------------------
    // FORMULAIRE ETABLISSEMENT
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
// SIFAH - CHARGEMENT
// ============================================================

function chargerSifah() {

    if (typeof sifahRef === "undefined") {

        console.error("sifahRef non défini");

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
                    "Erreur Firebase sifah :",
                    error
                );

            }

        );

}


// ============================================================
// SIFAH - AFFICHAGE
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
// WADHIA - CHARGEMENT
// ============================================================

function chargerWadhia() {

    if (typeof wadhiaRef === "undefined") {

        console.error("wadhiaRef non défini");

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
                    "Erreur Firebase wadhia :",
                    error
                );

            }

        );

}


// ============================================================
// WADHIA - AFFICHAGE
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
// ANNEES UNIVERSITAIRES - CHARGEMENT
// ============================================================

function chargerAnnees() {

    if (typeof anneesRef === "undefined") {

        console.error(
            "anneesRef non défini"
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
                    "Erreur Firebase anneesUniversitaires :",
                    error
                );

            }

        );

}


// ============================================================
// ANNEES - AFFICHAGE
// ============================================================

function afficherAnnees() {

    const tbody =
        document.getElementById("annees-body");

    if (!tbody) return;


    tbody.innerHTML = "";


    if (parametresData.annees.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="5" style="text-align:center">

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
// OUVRIR MODAL PARAMETRE
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


    idInput.value = id || "";

    typeInput.value = type;


    code.value = "";

    nom.value = "";

    ordre.value = "1";

    current.checked = false;

    actif.checked = true;


    // --------------------------------------------------------
    // ANNEE
    // --------------------------------------------------------

    if (type === "annee") {

        code.parentElement.style.display =
            "none";

        currentGroup.style.display =
            "block";

    }

    else {

        code.parentElement.style.display =
            "block";

        currentGroup.style.display =
            "none";

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


    document.getElementById(
        "modal-parametre-title"
    ).textContent =
        id
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


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!nom) {

        alert(
            "يرجى إدخال الاسم"
        );

        return;

    }


    if (!Number.isFinite(ordre) || ordre < 1) {

        alert(
            "يرجى إدخال ترتيب صحيح"
        );

        return;

    }


    if (type !== "annee" && !code) {

        alert(
            "يرجى إدخال الرمز"
        );

        return;

    }


    // --------------------------------------------------------
    // CHOIX COLLECTION
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

        alert(
            "نوع المعلمة غير معروف"
        );

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
            firebase.firestore.FieldValue.serverTimestamp()

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

            await collection
                .doc(id)
                .update(data);


            if (
                type === "annee" &&
                current === true
            ) {

                await rendreAnneesNonCourantes(id);

            }

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


            if (
                type === "annee" &&
                current === true
            ) {

                await rendreAnneesNonCourantes(
                    docRef.id
                );

            }

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
            "Erreur Firebase enregistrement :",
            error
        );


        alert(
            "حدث خطأ أثناء حفظ البيانات :\n" +
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

    if (typeof anneesRef === "undefined") {

        throw new Error(
            "anneesRef غير موجود"
        );

    }


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


        alert(
            "تم حذف البيانات بنجاح"
        );

    }

    catch (error) {

        console.error(
            "Erreur suppression :",
            error
        );


        alert(
            "حدث خطأ أثناء الحذف :\n" +
            error.message
        );

    }

}


// ============================================================
// ETABLISSEMENT - CHARGEMENT
// ============================================================

async function chargerEtablissement() {

    if (
        typeof etablissementRef ===
        "undefined"
    ) {

        console.error(
            "etablissementRef non défini"
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


        const nom =
            document.getElementById(
                "etablissement-nom"
            );

        const universite =
            document.getElementById(
                "etablissement-universite"
            );

        const code =
            document.getElementById(
                "etablissement-code"
            );

        const adresse =
            document.getElementById(
                "etablissement-adresse"
            );

        const tel =
            document.getElementById(
                "etablissement-tel"
            );

        const email =
            document.getElementById(
                "etablissement-email"
            );


        if (nom)
            nom.value =
                data.nom || "";


        if (universite)
            universite.value =
                data.universite || "";


        if (code)
            code.value =
                data.code || "";


        if (adresse)
            adresse.value =
                data.adresse || "";


        if (tel)
            tel.value =
                data.tel || "";


        if (email)
            email.value =
                data.email || "";


    }

    catch (error) {

        console.error(
            "Erreur chargement établissement :",
            error
        );


        alert(
            "حدث خطأ أثناء تحميل معلومات المؤسسة :\n" +
            error.message
        );

    }

}


// ============================================================
// ETABLISSEMENT - ENREGISTREMENT
// ============================================================

async function enregistrerEtablissement(
    event
) {

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
    // DONNEES
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


    try {

        if (
            typeof etablissementRef ===
            "undefined"
        ) {

            throw new Error(
                "etablissementRef غير موجود"
            );

        }


        // ----------------------------------------------------
        // IMPORTANT :
        // Toujours utiliser le document "principal"
        // ----------------------------------------------------

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
            "Erreur Firebase établissement :",
            error
        );


        alert(
            "حدث خطأ أثناء حفظ معلومات المؤسسة :\n" +
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
// FERMETURE MODALS
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
// RECUPERER L'ANNEE COURANTE
// ============================================================

function getAnneeCourante() {

    return parametresData.annees.find(
        function (item) {

            return item.current === true &&
                   item.actif !== false;

        }
    ) || null;

}


// ============================================================
// FIN
// ============================================================

console.log(
    "SIGE - parametres.js chargé correctement"
);
```
