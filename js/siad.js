```javascript
// ====================== SIAD ======================

async function loadSIAD() {

  // Charger les enseignants si nécessaire
  if (enseignants.length === 0) {
    await loadEnseignants();
  }


  // Charger les catégories si nécessaire
  if (gradesList.length === 0) {
    await loadCategories();
  }


  const total = enseignants.length || 1;


  // ====================== KPI ======================

  document.getElementById('kpi-total').textContent =
    enseignants.length;


  // ====================== الصفة ======================

  document.getElementById('kpi-titulaire').textContent =
    enseignants.filter(e =>
      e.sifah === 'titulaire'
    ).length;


  document.getElementById('kpi-contractuel').textContent =
    enseignants.filter(e =>
      e.sifah === 'contractuel'
    ).length;


  document.getElementById('kpi-vacataire').textContent =
    enseignants.filter(e =>
      e.sifah === 'vacataire'
    ).length;


  // ====================== الجنس ======================

  document.getElementById('kpi-homme').textContent =
    enseignants.filter(e =>
      e.genre === 'homme'
    ).length;


  document.getElementById('kpi-femme').textContent =
    enseignants.filter(e =>
      e.genre === 'femme'
    ).length;


  // ====================== STATISTIQUES ======================

  renderStatsTable(
    gradesList,
    'gradeId',
    'stats-grade-body',
    total
  );


  renderStatsTable(
    departementsList,
    'departementId',
    'stats-departement-body',
    total
  );


  renderStatsTable(
    specialitesList,
    'specialiteId',
    'stats-specialite-body',
    total
  );
}


// ====================== TABLEAU STATISTIQUE ======================

function renderStatsTable(
  list,
  field,
  tbodyId,
  total
) {

  const tbody =
    document.getElementById(tbodyId);

  if (!tbody) return;


  tbody.innerHTML = '';


  list.forEach(item => {

    const count =
      enseignants.filter(e =>
        e[field] === item.id
      ).length;


    const percent =
      ((count / total) * 100).toFixed(1);


    tbody.innerHTML += `
      <tr>
        <td>${item.nom}</td>
        <td>${count}</td>
        <td>${percent}%</td>
      </tr>
    `;
  });
}
```
