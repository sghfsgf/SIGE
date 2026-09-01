// ============================================================
// SIGE - PARAMÈTRES
// ============================================================

// Gestion de :
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

  initialiserParametres();

});


// ============================================================
// INITIALISATION PARAMÈTRES
// ============================================================

function initialiserParametres() {

  // Onglets paramètres

  document
    .querySelectorAll(".param-tab-btn")
    .forEach(function (button) {

      button.addEventListener("click", function () {

        const tab = this.dataset.paramTab;

        afficherParametreTab(tab);

      });

    });


  // Boutons Ajouter

  const btnSifah = document.getElementById("btn-add-sifah");

  if (btnSifah) {

    btnSifah.addEventListener("click", function () {

      ouvrirModalParametre("sifah");

    });

  }


  const btnWadhia = document.getElementById("btn-add-wadhia");

  if (btnWadhia) {

    btnWadhia.addEventListener("click", function () {

      ouvrirModalParametre("wadhia");

    });

  }


  const btnAnnee = document.getElementById("btn-add-annee");

  if (btnAnnee) {

    btnAnnee.addEventListener("click", function () {

      ouvrirModalParametre("annee");

    });

  }


  // Formulaire paramètre

  const parametreForm =
    document.getElementById("parametre-form");

  if (parametreForm) {

    parametreForm.addEventListener(
      "submit",
      enregistrerParametre
    );

  }


  // Formulaire établissement

  const etablissementForm =
    document.getElementById("etablissement-form");

  if (etablissementForm) {

    etablissementForm.addEventListener(
      "submit",
      enregistrerEtablissement
    );

  }


  // Chargement initial

  chargerSifah();

  chargerWadhia();

  chargerAnnees();

  chargerEtablissement();

}


// ============================================================
// AFFICHER ONGLET PARAMÈTRE
// ============================================================

function afficherParametreTab(type) {

  document
    .querySelectorAll(".param-tab-btn")
    .forEach(function (button) {

      button.classList.remove("active");

    });


  const boutonActif =
    document.querySelector(
      `.param-tab-btn[data-param-tab="${type}"]`
    );


  if (boutonActif) {

    boutonActif.classList.add("active");

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
          "Erreur chargement sifah :",
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

    const tr = document.createElement("tr");


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
// AFFICHER WADHIA
// ============================================================

function afficherWadhia() {

  const tbody =
    document.getElementById("wadhia-body");

  if (!tbody) return;


  tbody.innerHTML = "";


  parametresData.wadhia.forEach(function (item) {

    const tr = document.createElement("tr");


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
// ANNÉES UNIVERSITAIRES
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
// AFFICHER ANNÉES
// ============================================================

function afficherAnnees() {

  const tbody =
    document.getElementById("annees-body");

  if (!tbody) return;


  tbody.innerHTML = "";


  parametresData.annees.forEach(function (item) {

    const tr = document.createElement("tr");


    tr.innerHTML = `

      <td>${item.ordre ?? ""}</td>

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


  document.getElementById("parametre-id").value =
    id || "";


  document.getElementById("parametre-type").value =
    type;


  const code =
    document.getElementById("parametre-code");

  const nom =
    document.getElementById("parametre-nom");

  const ordre =
    document.getElementById("parametre-ordre");

  const current =
    document.getElementById("parametre-current");

  const currentGroup =
    document.getElementById("parametre-current-group");

  const actif =
    document.getElementById("parametre-actif");


  code.value = "";

  nom.value = "";

  ordre.value = "1";

  current.checked = false;

  actif.checked = true;


  // Pour année universitaire

  if (type === "annee") {

    code.parentElement.style.display = "none";

    currentGroup.style.display = "block";

  }

  else {

    code.parentElement.style.display = "block";

    currentGroup.style.display = "none";

  }


  // Modification

  if (id) {

    let collection;


    if (type === "sifah") {

      collection = parametresData.sifah;

    }

    else if (type === "wadhia") {

      collection = parametresData.wadhia;

    }

    else if (type === "annee") {

      collection = parametresData.annees;

    }


    const item =
      collection.find(function (x) {

        return x.id === id;

      });


    if (item) {

      code.value = item.code || "";

      nom.value = item.nom || "";

      ordre.value = item.ordre || 1;

      current.checked = item.current || false;

      actif.checked =
        item.actif !== false;

    }

  }


  document.getElementById(
    "modal-parametre-title"
  ).textContent = id
    ? "تعديل"
    : "إضافة";


  modal.classList.remove("hidden");

}


// ============================================================
// MODIFIER PARAMÈTRE
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
    document.getElementById("parametre-id").value;


  const type =
    document.getElementById("parametre-type").value;


  const code =
    document.getElementById("parametre-code").value.trim();


  const nom =
    document.getElementById("parametre-nom").value.trim();


  const ordre =
    Number(
      document.getElementById("parametre-ordre").value
    );


  const current =
    document.getElementById("parametre-current").checked;


  const actif =
    document.getElementById("parametre-actif").checked;


  if (!nom) {

    alert("يرجى إدخال الاسم");

    return;

  }


  if (type !== "annee" && !code) {

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
      firebase.firestore.FieldValue.serverTimestamp()

  };


  if (type !== "annee") {

    data.code = code;

  }


  if (type === "annee") {

    data.current = current;

  }


  try {

    // --------------------------------------------------------
    // MODIFICATION
    // --------------------------------------------------------

    if (id) {

      await collection
        .doc(id)
        .update(data);


      // إذا كانت السنة الحالية
      if (type === "annee" && current) {

        await rendreAnneesNonCourantes(id);

      }

    }

    // --------------------------------------------------------
    // AJOUT
    // --------------------------------------------------------

    else {

      data.createdAt =
        firebase.firestore.FieldValue.serverTimestamp();


      const docRef =
        await collection.add(data);


      // السنة الجديدة هي الحالية

      if (type === "annee" && current) {

        await rendreAnneesNonCourantes(
          docRef.id
        );

      }

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

async function rendreAnneesNonCourantes(idCourante) {

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
// SUPPRIMER PARAMÈTRE
// ============================================================

async function supprimerParametre(type, id) {

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
// ETABLISSEMENT
// ============================================================

async function chargerEtablissement() {

  try {

    const snapshot =
      await etablissementRef
        .doc("principal")
        .get();


    if (!snapshot.exists) {

      return;

    }


    const data =
      snapshot.data();


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
      "Erreur chargement établissement :",
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
      firebase.firestore.FieldValue.serverTimestamp()

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
// GESTION DES BOUTONS FERMER
// ============================================================

document.addEventListener(
  "click",
  function (event) {

    const bouton =
      event.target.closest(".close-modal");


    if (!bouton) return;


    const modalId =
      bouton.dataset.modal;


    if (modalId) {

      fermerModal(modalId);

    }

  }
);


// ============================================================
// SÉCURITÉ AFFICHAGE HTML
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

// Ces fonctions pourront être utilisées par enseignants.js

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
  "SIGE - parametres.js chargé"
);
