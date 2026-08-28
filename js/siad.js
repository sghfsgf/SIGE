// ====================== SIAD ======================

async function loadSIAD() {
  if (enseignants.length === 0) await loadEnseignants();
  if (gradesList.length === 0) await loadCategories();

  const total = enseignants.length || 1;

  document.getElementById('kpi-total').textContent = enseignants.length;
  document.getElementById('kpi-titulaire').textContent = enseignants.filter(e => e.statut === 'titulaire').length;
  document.getElementById('kpi-contractuel').textContent = enseignants.filter(e => e.statut === 'contractuel').length;
  document.getElementById('kpi-vacataire').textContent = enseignants.filter(e => e.statut === 'vacataire').length;
  document.getElementById('kpi-homme').textContent = enseignants.filter(e => e.genre === 'homme').length;
  document.getElementById('kpi-femme').textContent = enseignants.filter(e => e.genre === 'femme').length;

  renderStatsTable(gradesList, 'gradeId', 'stats-grade-body', total);
  renderStatsTable(departementsList, 'departementId', 'stats-departement-body', total);
  renderStatsTable(specialitesList, 'specialiteId', 'stats-specialite-body', total);
}

function renderStatsTable(list, field, tbodyId, total) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = '';

  list.forEach(item => {
    const count = enseignants.filter(e => e[field] === item.id).length;
    const percent = ((count / total) * 100).toFixed(1);
    tbody.innerHTML += `<tr><td>${item.nom}</td><td>${count}</td><td>${percent}%</td></tr>`;
  });
}
