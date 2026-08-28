// ====================== GESTION DES ENSEIGNANTS ======================

let enseignants = [];

async function loadEnseignants() {
  try {
    const snap = await db.collection('enseignants').orderBy('numero').get();
    enseignants = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderEnseignantsTable(enseignants);
    updateDashboardKPIs();
  } catch (error) {
    console.error(error);
  }
}

function renderEnseignantsTable(list) {
  const tbody = document.getElementById('enseignants-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center">لا توجد بيانات</td></tr>`;
    return;
  }

  list.forEach(e => {
    const grade = gradesList.find(g => g.id === e.gradeId)?.nom || '-';
    const specialite = specialitesList.find(s => s.id === e.specialiteId)?.nom || '-';
    const departement = departementsList.find(d => d.id === e.departementId)?.nom || '-';
    const statutText = { titulaire: 'مرسم', contractuel: 'متعاقد', vacataire: 'متطوع' }[e.statut] || e.statut;
    const genreText = e.genre === 'homme' ? 'ذكر' : 'أنثى';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${e.numero || ''}</td>
      <td>${e.matriculeCNRPS || ''}</td>
      <td>${e.nom || ''}</td>
      <td>${e.prenom || ''}</td>
      <td>${grade}</td>
      <td>${specialite}</td>
      <td>${departement}</td>
      <td>${statutText}</td>
      <td>${genreText}</td>
      <td>
        <button class="btn-sm btn-edit" onclick="editEnseignant('${e.id}')">تعديل</button>
        <button class="btn-sm btn-delete" onclick="deleteEnseignant('${e.id}')">حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('btn-add-enseignant')?.addEventListener('click', () => {
  document.getElementById('enseignant-form').reset();
  document.getElementById('enseignant-id').value = '';
  document.getElementById('modal-enseignant-title').textContent = 'إضافة أستاذ جديد';
  fillSelect('gradeId', gradesList);
  fillSelect('specialiteId', specialitesList);
  fillSelect('departementId', departementsList);
  openModal('modal-enseignant');
});

window.editEnseignant = function(id) {
  const e = enseignants.find(item => item.id === id);
  if (!e) return;

  document.getElementById('enseignant-id').value = e.id;
  document.getElementById('numero').value = e.numero || '';
  document.getElementById('matriculeCNRPS').value = e.matriculeCNRPS || '';
  document.getElementById('nom').value = e.nom || '';
  document.getElementById('prenom').value = e.prenom || '';
  document.getElementById('tel1').value = e.tel1 || '';
  document.getElementById('tel2').value = e.tel2 || '';
  document.getElementById('email').value = e.email || '';
  document.getElementById('statut').value = e.statut || 'titulaire';
  document.getElementById('genre').value = e.genre || 'homme';
  document.getElementById('dateNaissance').value = e.dateNaissance || '';
  document.getElementById('dateRecrutement').value = e.dateRecrutement || '';
  document.getElementById('dateDernierGrade').value = e.dateDernierGrade || '';

  fillSelect('gradeId', gradesList);
  fillSelect('specialiteId', specialitesList);
  fillSelect('departementId', departementsList);

  document.getElementById('gradeId').value = e.gradeId || '';
  document.getElementById('specialiteId').value = e.specialiteId || '';
  document.getElementById('departementId').value = e.departementId || '';

  document.getElementById('modal-enseignant-title').textContent = 'تحيين معطيات الأستاذ';
  openModal('modal-enseignant');
};

window.deleteEnseignant = async function(id) {
  if (!confirm('هل أنت متأكد من حذف هذا الأستاذ؟')) return;
  try {
    await db.collection('enseignants').doc(id).delete();
    alert('تم الحذف بنجاح');
    loadEnseignants();
  } catch (error) {
    alert('حدث خطأ');
  }
};

document.getElementById('enseignant-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('enseignant-id').value;

  const data = {
    numero: Number(document.getElementById('numero').value),
    matriculeCNRPS: document.getElementById('matriculeCNRPS').value.trim(),
    nom: document.getElementById('nom').value.trim(),
    prenom: document.getElementById('prenom').value.trim(),
    gradeId: document.getElementById('gradeId').value,
    specialiteId: document.getElementById('specialiteId').value,
    departementId: document.getElementById('departementId').value,
    tel1: document.getElementById('tel1').value.trim(),
    tel2: document.getElementById('tel2').value.trim() || null,
    email: document.getElementById('email').value.trim(),
    statut: document.getElementById('statut').value,
    genre: document.getElementById('genre').value,
    dateNaissance: document.getElementById('dateNaissance').value,
    dateRecrutement: document.getElementById('dateRecrutement').value,
    dateDernierGrade: document.getElementById('dateDernierGrade').value,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    if (id) {
      await db.collection('enseignants').doc(id).update(data);
      alert('تم التحيين بنجاح');
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('enseignants').add(data);
      alert('تم الإضافة بنجاح');
    }
    closeModal('modal-enseignant');
    loadEnseignants();
  } catch (error) {
    console.error(error);
    alert('حدث خطأ أثناء الحفظ');
  }
});

// Filtres
function applyFilters() {
  let filtered = [...enseignants];

  const matricule = document.getElementById('filter-matricule')?.value.trim();
  const grade = document.getElementById('filter-grade')?.value;
  const specialite = document.getElementById('filter-specialite')?.value;
  const departement = document.getElementById('filter-departement')?.value;
  const statut = document.getElementById('filter-statut')?.value;
  const genre = document.getElementById('filter-genre')?.value;

  if (matricule) filtered = filtered.filter(e => e.matriculeCNRPS?.includes(matricule));
  if (grade) filtered = filtered.filter(e => e.gradeId === grade);
  if (specialite) filtered = filtered.filter(e => e.specialiteId === specialite);
  if (departement) filtered = filtered.filter(e => e.departementId === departement);
  if (statut) filtered = filtered.filter(e => e.statut === statut);
  if (genre) filtered = filtered.filter(e => e.genre === genre);

  renderEnseignantsTable(filtered);
}

['filter-matricule','filter-grade','filter-specialite','filter-departement','filter-statut','filter-genre']
  .forEach(id => document.getElementById(id)?.addEventListener('input', applyFilters));

document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
  document.getElementById('filter-matricule').value = '';
  document.getElementById('filter-grade').value = '';
  document.getElementById('filter-specialite').value = '';
  document.getElementById('filter-departement').value = '';
  document.getElementById('filter-statut').value = '';
  document.getElementById('filter-genre').value = '';
  renderEnseignantsTable(enseignants);
});

function updateDashboardKPIs() {
  document.getElementById('dash-total').textContent = enseignants.length;
  document.getElementById('dash-titulaire').textContent = enseignants.filter(e => e.statut === 'titulaire').length;
  document.getElementById('dash-contractuel').textContent = enseignants.filter(e => e.statut === 'contractuel').length;
  document.getElementById('dash-vacataire').textContent = enseignants.filter(e => e.statut === 'vacataire').length;
}
