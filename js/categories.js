// ====================== GESTION DES CATÉGORIES ======================

let gradesList = [];
let specialitesList = [];
let departementsList = [];

async function loadCategories() {
  try {
    const snap = await db.collection('categories').orderBy('ordre').get();
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    gradesList = all.filter(c => c.type === 'grade');
    specialitesList = all.filter(c => c.type === 'specialite');
    departementsList = all.filter(c => c.type === 'departement');

    renderCategoriesTable('grade', gradesList, 'grades-body');
    renderCategoriesTable('specialite', specialitesList, 'specialites-body');
    renderCategoriesTable('departement', departementsList, 'departements-body');

    fillFilterSelects();
  } catch (error) {
    console.error(error);
  }
}

function renderCategoriesTable(type, list, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center">لا توجد بيانات</td></tr>`;
    return;
  }

  list.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.ordre}</td>
      <td>${item.nom}</td>
      <td><span class="badge ${item.actif ? 'badge-success' : 'badge-danger'}">${item.actif ? 'نشط' : 'غير نشط'}</span></td>
      <td>
        <button class="btn-sm btn-edit" onclick="editCategorie('${item.id}', '${type}')">تعديل</button>
        <button class="btn-sm btn-delete" onclick="deleteCategorie('${item.id}')">حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function fillFilterSelects() {
  fillSelect('filter-grade', gradesList);
  fillSelect('filter-specialite', specialitesList);
  fillSelect('filter-departement', departementsList);
  fillSelect('gradeId', gradesList);
  fillSelect('specialiteId', specialitesList);
  fillSelect('departementId', departementsList);
}

function fillSelect(id, list) {
  const select = document.getElementById(id);
  if (!select) return;
  const current = select.value;
  select.innerHTML = `<option value="">-- اختر --</option>`;
  list.filter(i => i.actif !== false).forEach(item => {
    select.innerHTML += `<option value="${item.id}">${item.nom}</option>`;
  });
  if (current) select.value = current;
}

// Boutons Ajouter
document.getElementById('btn-add-grade')?.addEventListener('click', () => openCategorieModal('grade'));
document.getElementById('btn-add-specialite')?.addEventListener('click', () => openCategorieModal('specialite'));
document.getElementById('btn-add-departement')?.addEventListener('click', () => openCategorieModal('departement'));

function openCategorieModal(type, item = null) {
  document.getElementById('categorie-type').value = type;
  document.getElementById('categorie-id').value = item ? item.id : '';
  document.getElementById('categorie-nom').value = item ? item.nom : '';
  document.getElementById('categorie-ordre').value = item ? item.ordre : 1;
  document.getElementById('categorie-actif').checked = item ? item.actif : true;

  const titles = { grade: 'رتبة', specialite: 'تخصص', departement: 'قسم' };
  document.getElementById('modal-categorie-title').textContent = item ? `تعديل ${titles[type]}` : `إضافة ${titles[type]}`;
  openModal('modal-categorie');
}

window.editCategorie = function(id, type) {
  const list = type === 'grade' ? gradesList : type === 'specialite' ? specialitesList : departementsList;
  const item = list.find(i => i.id === id);
  if (item) openCategorieModal(type, item);
};

window.deleteCategorie = async function(id) {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  try {
    await db.collection('categories').doc(id).delete();
    alert('تم الحذف بنجاح');
    loadCategories();
  } catch (error) {
    alert('حدث خطأ');
  }
};

document.getElementById('categorie-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('categorie-id').value;
  const data = {
    type: document.getElementById('categorie-type').value,
    nom: document.getElementById('categorie-nom').value.trim(),
    ordre: Number(document.getElementById('categorie-ordre').value),
    actif: document.getElementById('categorie-actif').checked
  };

  try {
    if (id) {
      await db.collection('categories').doc(id).update(data);
    } else {
      await db.collection('categories').add(data);
    }
    closeModal('modal-categorie');
    loadCategories();
    alert('تم الحفظ بنجاح');
  } catch (error) {
    alert('حدث خطأ أثناء الحفظ');
  }
});

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
  });
});
