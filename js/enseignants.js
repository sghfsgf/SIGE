```javascript
// ====================== GESTION DES ENSEIGNANTS ======================

let enseignants = [];


// ====================== CHARGEMENT DES ENSEIGNANTS ======================

async function loadEnseignants() {
  try {
    const snap = await db.collection('enseignants').orderBy('numero').get();

    enseignants = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    renderEnseignantsTable(enseignants);
    updateDashboardKPIs();

  } catch (error) {
    console.error('Erreur chargement enseignants :', error);
  }
}


// ====================== AFFICHAGE DU TABLEAU ======================

function renderEnseignantsTable(list) {

  const tbody = document.getElementById('enseignants-body');

  if (!tbody) return;

  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center">
          لا توجد بيانات
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(e => {

    const grade =
      gradesList.find(g => g.id === e.gradeId)?.nom || '-';

    const specialite =
      specialitesList.find(s => s.id === e.specialiteId)?.nom || '-';

    const departement =
      departementsList.find(d => d.id === e.departementId)?.nom || '-';


    // ====================== الصفة ======================

    const sifahText = {
      titulaire: 'مرسم',
      contractuel: 'متعاقد',
      vacataire: 'عرضي'
    }[e.sifah] || e.sifah || '';


    // ====================== الجنس ======================

    const genreText =
      e.genre === 'homme' ? 'ذكر' : 'أنثى';


    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${e.numero || ''}</td>

      <td>${e.matriculeCNRPS || ''}</td>

      <td>${e.nom || ''}</td>

      <td>${e.prenom || ''}</td>

      <td>${grade}</td>

      <td>${specialite}</td>

      <td>${departement}</td>

      <td>${sifahText}</td>

      <td>${genreText}</td>

      <td>
        <button
          class="btn-sm btn-edit"
          onclick="editEnseignant('${e.id}')">
          تعديل
        </button>

        <button
          class="btn-sm btn-delete"
          onclick="deleteEnseignant('${e.id}')">
          حذف
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}


// ====================== AJOUTER UN ENSEIGNANT ======================

document
  .getElementById('btn-add-enseignant')
  ?.addEventListener('click', () => {

    document.getElementById('enseignant-form').reset();

    document.getElementById('enseignant-id').value = '';

    document.getElementById('modal-enseignant-title').textContent =
      'إضافة أستاذ جديد';

    fillSelect('gradeId', gradesList);
    fillSelect('specialiteId', specialitesList);
    fillSelect('departementId', departementsList);

    openModal('modal-enseignant');
  });


// ====================== MODIFIER UN ENSEIGNANT ======================

window.editEnseignant = function(id) {

  const e = enseignants.find(item => item.id === id);

  if (!e) return;


  document.getElementById('enseignant-id').value = e.id;

  document.getElementById('numero').value =
    e.numero || '';

  document.getElementById('matriculeCNRPS').value =
    e.matriculeCNRPS || '';

  document.getElementById('nom').value =
    e.nom || '';

  document.getElementById('prenom').value =
    e.prenom || '';

  document.getElementById('tel1').value =
    e.tel1 || '';

  document.getElementById('tel2').value =
    e.tel2 || '';

  document.getElementById('email').value =
    e.email || '';


  // ====================== الصفة ======================

  document.getElementById('sifah').value =
    e.sifah || 'titulaire';


  // ====================== الجنس ======================

  document.getElementById('genre').value =
    e.genre || 'homme';


  document.getElementById('dateNaissance').value =
    e.dateNaissance || '';

  document.getElementById('dateRecrutement').value =
    e.dateRecrutement || '';

  document.getElementById('dateDernierGrade').value =
    e.dateDernierGrade || '';


  // ====================== LISTES ======================

  fillSelect('gradeId', gradesList);
  fillSelect('specialiteId', specialitesList);
  fillSelect('departementId', departementsList);


  document.getElementById('gradeId').value =
    e.gradeId || '';

  document.getElementById('specialiteId').value =
    e.specialiteId || '';

  document.getElementById('departementId').value =
    e.departementId || '';


  document.getElementById('modal-enseignant-title').textContent =
    'تحيين معطيات الأستاذ';

  openModal('modal-enseignant');
};


// ====================== SUPPRIMER UN ENSEIGNANT ======================

window.deleteEnseignant = async function(id) {

  if (!confirm('هل أنت متأكد من حذف هذا الأستاذ؟')) {
    return;
  }

  try {

    await db
      .collection('enseignants')
      .doc(id)
      .delete();

    alert('تم الحذف بنجاح');

    loadEnseignants();

  } catch (error) {

    console.error('Erreur suppression :', error);

    alert('حدث خطأ أثناء الحذف');
  }
};


// ====================== ENREGISTREMENT ======================

document
  .getElementById('enseignant-form')
  ?.addEventListener('submit', async (e) => {

    e.preventDefault();

    const id =
      document.getElementById('enseignant-id').value;


    // ====================== DONNÉES ENSEIGNANT ======================

    const data = {

      numero:
        Number(document.getElementById('numero').value),

      matriculeCNRPS:
        document.getElementById('matriculeCNRPS').value.trim(),

      nom:
        document.getElementById('nom').value.trim(),

      prenom:
        document.getElementById('prenom').value.trim(),


      // ====================== CATÉGORIES ======================

      gradeId:
        document.getElementById('gradeId').value,

      specialiteId:
        document.getElementById('specialiteId').value,

      departementId:
        document.getElementById('departementId').value,


      // ====================== CONTACT ======================

      tel1:
        document.getElementById('tel1').value.trim(),

      tel2:
        document.getElementById('tel2').value.trim() || null,

      email:
        document.getElementById('email').value.trim(),


      // ====================== الصفة ======================

      sifah:
        document.getElementById('sifah').value,


      // ====================== الجنس ======================

      genre:
        document.getElementById('genre').value,


      // ====================== DATES ======================

      dateNaissance:
        document.getElementById('dateNaissance').value,

      dateRecrutement:
        document.getElementById('dateRecrutement').value,

      dateDernierGrade:
        document.getElementById('dateDernierGrade').value,


      // ====================== DATE MODIFICATION ======================

      updatedAt:
        firebase.firestore.FieldValue.serverTimestamp()
    };


    try {

      // ====================== MODIFICATION ======================

      if (id) {

        await db
          .collection('enseignants')
          .doc(id)
          .update(data);

        alert('تم التحيين بنجاح');

      }

      // ====================== AJOUT ======================

      else {

        data.createdAt =
          firebase.firestore.FieldValue.serverTimestamp();

        await db
          .collection('enseignants')
          .add(data);

        alert('تم الإضافة بنجاح');
      }


      closeModal('modal-enseignant');

      loadEnseignants();


    } catch (error) {

      console.error('Erreur enregistrement :', error);

      alert('حدث خطأ أثناء الحفظ');
    }

  });


// ====================== FILTRES ======================

function applyFilters() {

  let filtered = [...enseignants];


  const matricule =
    document.getElementById('filter-matricule')?.value.trim();

  const grade =
    document.getElementById('filter-grade')?.value;

  const specialite =
    document.getElementById('filter-specialite')?.value;

  const departement =
    document.getElementById('filter-departement')?.value;

  const statut =
    document.getElementById('filter-statut')?.value;

  const genre =
    document.getElementById('filter-genre')?.value;


  // ====================== APPLICATION DES FILTRES ======================

  if (matricule) {

    filtered = filtered.filter(e =>
      e.matriculeCNRPS?.includes(matricule)
    );
  }


  if (grade) {

    filtered = filtered.filter(e =>
      e.gradeId === grade
    );
  }


  if (specialite) {

    filtered = filtered.filter(e =>
      e.specialiteId === specialite
    );
  }


  if (departement) {

    filtered = filtered.filter(e =>
      e.departementId === departement
    );
  }


  // IMPORTANT :
  // Le champ Firebase est maintenant "sifah"

  if (statut) {

    filtered = filtered.filter(e =>
      e.sifah === statut
    );
  }


  if (genre) {

    filtered = filtered.filter(e =>
      e.genre === genre
    );
  }


  renderEnseignantsTable(filtered);
}


// ====================== ÉCOUTE DES FILTRES ======================

[
  'filter-matricule',
  'filter-grade',
  'filter-specialite',
  'filter-departement',
  'filter-statut',
  'filter-genre'
].forEach(id => {

  document
    .getElementById(id)
    ?.addEventListener('input', applyFilters);

});


// ====================== RÉINITIALISER LES FILTRES ======================

document
  .getElementById('btn-reset-filters')
  ?.addEventListener('click', () => {

    document.getElementById('filter-matricule').value = '';

    document.getElementById('filter-grade').value = '';

    document.getElementById('filter-specialite').value = '';

    document.getElementById('filter-departement').value = '';

    document.getElementById('filter-statut').value = '';

    document.getElementById('filter-genre').value = '';


    renderEnseignantsTable(enseignants);
  });


// ====================== KPI DASHBOARD ======================

function updateDashboardKPIs() {

  document.getElementById('dash-total').textContent =
    enseignants.length;


  document.getElementById('dash-titulaire').textContent =
    enseignants.filter(e =>
      e.sifah === 'titulaire'
    ).length;


  document.getElementById('dash-contractuel').textContent =
    enseignants.filter(e =>
      e.sifah === 'contractuel'
    ).length;


  document.getElementById('dash-vacataire').textContent =
    enseignants.filter(e =>
      e.sifah === 'vacataire'
    ).length;
}
```
