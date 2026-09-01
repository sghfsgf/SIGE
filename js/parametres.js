```javascript
// ============================================================
// SIGE - GESTION DES PARAMÈTRES
// Version locale temporaire
// Les données seront migrées vers Firebase ultérieurement
// ============================================================


// ============================================================
// DONNÉES PAR DÉFAUT
// ============================================================

const PARAMETRES_DEFAUT = {

  sifah: [
    {
      id: 'titulaire',
      code: 'titulaire',
      nom: 'مرسم',
      ordre: 1,
      actif: true
    },
    {
      id: 'contractuel',
      code: 'contractuel',
      nom: 'متعاقد',
      ordre: 2,
      actif: true
    },
    {
      id: 'vacataire',
      code: 'vacataire',
      nom: 'عرضي',
      ordre: 3,
      actif: true
    }
  ],


  wadhia: [
    {
      id: 'moubachira',
      code: 'moubachira',
      nom: 'مباشرة',
      ordre: 1,
      actif: true
    },
    {
      id: 'ilhaq',
      code: 'ilhaq',
      nom: 'إلحاق',
      ordre: 2,
      actif: true
    },
    {
      id: 'non_moubachira',
      code: 'non_moubachira',
      nom: 'عدم مباشرة',
      ordre: 3,
      actif: true
    }
  ],


  annees: [
    {
      id: '2025-2026',
      code: '2025-2026',
      nom: '2025-2026',
      ordre: 1,
      current: true,
      actif: true
    }
  ],


  etablissement: {

    nom: '',
    universite: '',
    code: '',
    adresse: '',
    tel: '',
    email: ''

  }

};


// ============================================================
// CHARGEMENT DES PARAMÈTRES
// ============================================================

function getParametres() {

  const saved =
    localStorage.getItem('SIGE_PARAMETRES');


  if (!saved) {

    localStorage.setItem(
      'SIGE_PARAMETRES',
      JSON.stringify(PARAMETRES_DEFAUT)
    );

    return JSON.parse(
      JSON.stringify(PARAMETRES_DEFAUT)
    );
  }


  try {

    return JSON.parse(saved);

  } catch (error) {

    console.error(
      'Erreur lecture paramètres :',
      error
    );

    return JSON.parse(
      JSON.stringify(PARAMETRES_DEFAUT)
    );
  }
}


// ============================================================
// SAUVEGARDE
// ============================================================

function saveParametres(data) {

  localStorage.setItem(
    'SIGE_PARAMETRES',
    JSON.stringify(data)
  );
}


// ============================================================
// VARIABLE GLOBALE
// ============================================================

let parametres = getParametres();


// ============================================================
// INITIALISATION
// ============================================================

function initParametres() {

  renderSifah();

  renderWadhia();

  renderAnnees();

  loadEtablissement();

  initParamTabs();

  updateTeacherSelects();

}


// ============================================================
// ONGLET PARAMÈTRES
// ============================================================

function initParamTabs() {

  document
    .querySelectorAll('.param-tab-btn')
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const tab =
            button.dataset.paramTab;


          document
            .querySelectorAll('.param-tab-btn')
            .forEach(btn =>
              btn.classList.remove('active')
            );


          document
            .querySelectorAll('.param-tab-content')
            .forEach(content =>
              content.classList.add('hidden')
            );


          button.classList.add('active');


          document
            .getElementById(
              'param-tab-' + tab
            )
            ?.classList.remove('hidden');

        }
      );

    });

}


// ============================================================
// AFFICHAGE SIFAH
// ============================================================

function renderSifah() {

  const tbody =
    document.getElementById('sifah-body');

  if (!tbody) return;


  tbody.innerHTML = '';


  const list =
    [...parametres.sifah]
      .sort((a, b) => a.ordre - b.ordre);


  if (list.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center">
          لا توجد بيانات
        </td>
      </tr>
    `;

    return;
  }


  list.forEach(item => {

    const tr =
      document.createElement('tr');


    tr.innerHTML = `

      <td>
        ${item.ordre}
      </td>

      <td>
        ${escapeHTML(item.code)}
      </td>

      <td>
        ${escapeHTML(item.nom)}
      </td>

      <td>

        <span class="badge ${
          item.actif
            ? 'badge-success'
            : 'badge-danger'
        }">

          ${
            item.actif
              ? 'نشط'
              : 'غير نشط'
          }

        </span>

      </td>

      <td>

        <button
          class="btn-sm btn-edit"
          onclick="editParametre('${item.id}', 'sifah')"
        >
          تعديل
        </button>

        <button
          class="btn-sm btn-delete"
          onclick="deleteParametre('${item.id}', 'sifah')"
        >
          حذف
        </button>

      </td>

    `;


    tbody.appendChild(tr);

  });

}


// ============================================================
// AFFICHAGE WADHIA
// ============================================================

function renderWadhia() {

  const tbody =
    document.getElementById('wadhia-body');

  if (!tbody) return;


  tbody.innerHTML = '';


  const list =
    [...parametres.wadhia]
      .sort((a, b) => a.ordre - b.ordre);


  if (list.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center">
          لا توجد بيانات
        </td>
      </tr>
    `;

    return;
  }


  list.forEach(item => {

    const tr =
      document.createElement('tr');


    tr.innerHTML = `

      <td>
        ${item.ordre}
      </td>

      <td>
        ${escapeHTML(item.code)}
      </td>

      <td>
        ${escapeHTML(item.nom)}
      </td>

      <td>

        <span class="badge ${
          item.actif
            ? 'badge-success'
            : 'badge-danger'
        }">

          ${
            item.actif
              ? 'نشط'
              : 'غير نشط'
          }

        </span>

      </td>

      <td>

        <button
          class="btn-sm btn-edit"
          onclick="editParametre('${item.id}', 'wadhia')"
        >
          تعديل
        </button>

        <button
          class="btn-sm btn-delete"
          onclick="deleteParametre('${item.id}', 'wadhia')"
        >
          حذف
        </button>

      </td>

    `;


    tbody.appendChild(tr);

  });

}


// ============================================================
// AFFICHAGE ANNEES
// ============================================================

function renderAnnees() {

  const tbody =
    document.getElementById('annees-body');

  if (!tbody) return;


  tbody.innerHTML = '';


  const list =
    [...parametres.annees]
      .sort((a, b) => a.ordre - b.ordre);


  if (list.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center">
          لا توجد بيانات
        </td>
      </tr>
    `;

    return;
  }


  list.forEach(item => {

    const tr =
      document.createElement('tr');


    tr.innerHTML = `

      <td>
        ${item.ordre}
      </td>

      <td>
        ${escapeHTML(item.nom)}
      </td>

      <td>

        ${
          item.current
            ? '<span class="badge badge-success">نعم</span>'
            : '<span class="badge badge-danger">لا</span>'
        }

      </td>

      <td>

        <span class="badge ${
          item.actif
            ? 'badge-success'
            : 'badge-danger'
        }">

          ${
            item.actif
              ? 'نشط'
              : 'غير نشط'
          }

        </span>

      </td>

      <td>

        <button
          class="btn-sm btn-edit"
          onclick="editParametre('${item.id}', 'annees')"
        >
          تعديل
        </button>

        <button
          class="btn-sm btn-delete"
          onclick="deleteParametre('${item.id}', 'annees')"
        >
          حذف
        </button>

      </td>

    `;


    tbody.appendChild(tr);

  });

}


// ============================================================
// AJOUTER SIFAH
// ============================================================

document
  .getElementById('btn-add-sifah')
  ?.addEventListener(
    'click',
    () => openParametreModal('sifah')
  );


// ============================================================
// AJOUTER WADHIA
// ============================================================

document
  .getElementById('btn-add-wadhia')
  ?.addEventListener(
    'click',
    () => openParametreModal('wadhia')
  );


// ============================================================
// AJOUTER ANNEE
// ============================================================

document
  .getElementById('btn-add-annee')
  ?.addEventListener(
    'click',
    () => openParametreModal('annees')
  );


// ============================================================
// OUVRIR MODAL
// ============================================================

function openParametreModal(
  type,
  item = null
) {

  document.getElementById(
    'parametre-id'
  ).value =
    item ? item.id : '';


  document.getElementById(
    'parametre-type'
  ).value =
    type;


  document.getElementById(
    'parametre-code'
  ).value =
    item ? item.code : '';


  document.getElementById(
    'parametre-nom'
  ).value =
    item ? item.nom : '';


  document.getElementById(
    'parametre-ordre'
  ).value =
    item ? item.ordre : 1;


  document.getElementById(
    'parametre-actif'
  ).checked =
    item ? item.actif : true;


  document.getElementById(
    'parametre-current'
  ).checked =
    item ? !!item.current : false;


  const currentGroup =
    document.getElementById(
      'parametre-current-group'
    );


  currentGroup.style.display =
    type === 'annees'
      ? 'block'
      : 'none';


  const titles = {

    sifah: 'صفة',

    wadhia: 'وضعية',

    annees: 'سنة جامعية'

  };


  document.getElementById(
    'modal-parametre-title'
  ).textContent =
    item
      ? `تعديل ${titles[type]}`
      : `إضافة ${titles[type]}`;


  openModal('modal-parametre');

}


// ============================================================
// EDITER PARAMETRE
// ============================================================

window.editParametre =
  function(id, type) {

    const list =
      parametres[type];


    const item =
      list.find(
        x => x.id === id
      );


    if (item) {

      openParametreModal(
        type,
        item
      );

    }

  };


// ============================================================
// SUPPRIMER PARAMETRE
// ============================================================

window.deleteParametre =
  function(id, type) {

    if (
      !confirm(
        'هل أنت متأكد من الحذف؟'
      )
    ) {
      return;
    }


    const list =
      parametres[type];


    const index =
      list.findIndex(
        x => x.id === id
      );


    if (index === -1) return;


    list.splice(index, 1);


    saveParametres(parametres);


    renderAllParametres();


    updateTeacherSelects();


    alert(
      'تم الحذف بنجاح'
    );

  };


// ============================================================
// FORMULAIRE PARAMETRE
// ============================================================

document
  .getElementById('parametre-form')
  ?.addEventListener(
    'submit',
    function(e) {

      e.preventDefault();


      const id =
        document.getElementById(
          'parametre-id'
        ).value;


      const type =
        document.getElementById(
          'parametre-type'
        ).value;


      const code =
        document.getElementById(
          'parametre-code'
        ).value
        .trim();


      const nom =
        document.getElementById(
          'parametre-nom'
        ).value
        .trim();


      const ordre =
        Number(
          document.getElementById(
            'parametre-ordre'
          ).value
        );


      const actif =
        document.getElementById(
          'parametre-actif'
        ).checked;


      const current =
        document.getElementById(
          'parametre-current'
        ).checked;


      if (!code || !nom) {

        alert(
          'الرجاء إدخال جميع البيانات'
        );

        return;
      }


      const list =
        parametres[type];


      // ================= EDIT =================

      if (id) {

        const item =
          list.find(
            x => x.id === id
          );


        if (item) {

          item.code = code;

          item.nom = nom;

          item.ordre = ordre;

          item.actif = actif;


          if (type === 'annees') {

            item.current = current;

            if (current) {

              list.forEach(
                x => {

                  if (x.id !== id) {
                    x.current = false;
                  }

                }
              );

            }

          }

        }

      }


      // ================= AJOUT =================

      else {

        const newItem = {

          id:
            generateId(),

          code:
            code,

          nom:
            nom,

          ordre:
            ordre,

          actif:
            actif

        };


        if (type === 'annees') {

          newItem.current =
            current;


          if (current) {

            list.forEach(
              x => {
                x.current = false;
              }
            );

          }

        }


        list.push(newItem);

      }


      saveParametres(
        parametres
      );


      closeModal(
        'modal-parametre'
      );


      renderAllParametres();


      updateTeacherSelects();


      alert(
        'تم الحفظ بنجاح'
      );

    }
  );


// ============================================================
// AFFICHER TOUS LES PARAMETRES
// ============================================================

function renderAllParametres() {

  renderSifah();

  renderWadhia();

  renderAnnees();

}


// ============================================================
// INFORMATIONS ETABLISSEMENT
// ============================================================

function loadEtablissement() {

  const e =
    parametres.etablissement;


  document.getElementById(
    'etablissement-nom'
  ).value =
    e.nom || '';


  document.getElementById(
    'etablissement-universite'
  ).value =
    e.universite || '';


  document.getElementById(
    'etablissement-code'
  ).value =
    e.code || '';


  document.getElementById(
    'etablissement-adresse'
  ).value =
    e.adresse || '';


  document.getElementById(
    'etablissement-tel'
  ).value =
    e.tel || '';


  document.getElementById(
    'etablissement-email'
  ).value =
    e.email || '';

}


// ============================================================
// SAUVEGARDE ETABLISSEMENT
// ============================================================

document
  .getElementById(
    'etablissement-form'
  )
  ?.addEventListener(
    'submit',
    function(e) {

      e.preventDefault();


      parametres.etablissement = {

        nom:
          document.getElementById(
            'etablissement-nom'
          ).value.trim(),

        universite:
          document.getElementById(
            'etablissement-universite'
          ).value.trim(),

        code:
          document.getElementById(
            'etablissement-code'
          ).value.trim(),

        adresse:
          document.getElementById(
            'etablissement-adresse'
          ).value.trim(),

        tel:
          document.getElementById(
            'etablissement-tel'
          ).value.trim(),

        email:
          document.getElementById(
            'etablissement-email'
          ).value.trim()

      };


      saveParametres(
        parametres
      );


      alert(
        'تم حفظ معلومات المؤسسة بنجاح'
      );

    }
  );


// ============================================================
// ACTUALISER LES SELECTS DES ENSEIGNANTS
// ============================================================

function updateTeacherSelects() {

  // ================= SIFAH =================

  const sifahSelect =
    document.getElementById(
      'sifah'
    );


  if (sifahSelect) {

    const current =
      sifahSelect.value;


    sifahSelect.innerHTML =
      '';


    parametres.sifah
      .filter(
        x => x.actif
      )
      .sort(
        (a, b) =>
          a.ordre - b.ordre
      )
      .forEach(
        item => {

          const option =
            document.createElement(
              'option'
            );


          option.value =
            item.code;


          option.textContent =
            item.nom;


          sifahSelect.appendChild(
            option
          );

        }
      );


    if (current) {
      sifahSelect.value =
        current;
    }

  }


  // ================= WADHIA =================

  const wadhiaSelect =
    document.getElementById(
      'wadhia'
    );


  if (wadhiaSelect) {

    const current =
      wadhiaSelect.value;


    wadhiaSelect.innerHTML =
      '';


    parametres.wadhia
      .filter(
        x => x.actif
      )
      .sort(
        (a, b) =>
          a.ordre - b.ordre
      )
      .forEach(
        item => {

          const option =
            document.createElement(
              'option'
            );


          option.value =
            item.code;


          option.textContent =
            item.nom;


          wadhiaSelect.appendChild(
            option
          );

        }
      );


    if (current) {
      wadhiaSelect.value =
        current;
    }

  }


  // ================= ANNEE =================

  const anneeSelect =
    document.getElementById(
      'anneeUniversitaire'
    );


  if (anneeSelect) {

    const current =
      anneeSelect.value;


    anneeSelect.innerHTML =
      '';


    parametres.annees
      .filter(
        x => x.actif
      )
      .sort(
        (a, b) =>
          a.ordre - b.ordre
      )
      .forEach(
        item => {

          const option =
            document.createElement(
              'option'
            );


          option.value =
            item.code;


          option.textContent =
            item.nom;


          anneeSelect.appendChild(
            option
          );

        }
      );


    if (current) {
      anneeSelect.value =
        current;
    }

  }

}


// ============================================================
// OUTILS
// ============================================================

function generateId() {

  return Date.now().toString(36)
    + Math.random()
      .toString(36)
      .substring(2, 8);

}


// ============================================================
// PROTECTION HTML
// ============================================================

function escapeHTML(value) {

  if (value === null ||
      value === undefined) {

    return '';

  }


  return String(value)

    .replace(
      /&/g,
      '&amp;'
    )

    .replace(
      /</g,
      '&lt;'
    )

    .replace(
      />/g,
      '&gt;'
    )

    .replace(
      /"/g,
      '&quot;'
    )

    .replace(
      /'/g,
      '&#039;'
    );

}


// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener(
  'DOMContentLoaded',
  () => {

    initParametres();

  }
);
```
