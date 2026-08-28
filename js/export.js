// ====================== EXPORT EXCEL ======================

document.getElementById('btn-export')?.addEventListener('click', () => {
  exportEnseignants(enseignants);
});

document.getElementById('btn-export-siad')?.addEventListener('click', () => {
  exportSIAD();
});

function exportEnseignants(list) {
  if (!list.length) return alert('لا توجد بيانات');

  const headers = ['الرقم','رقم التسجيل CNRPS','اللقب','الاسم','الرتبة','التخصص','القسم','الهاتف 1','الهاتف 2','البريد الإلكتروني','الحالة','الجنس','تاريخ التوظيف','تاريخ الميلاد','تاريخ آخر رتبة'];
  
  const rows = list.map(e => [
    e.numero,
    e.matriculeCNRPS,
    e.nom,
    e.prenom,
    gradesList.find(g => g.id === e.gradeId)?.nom || '',
    specialitesList.find(s => s.id === e.specialiteId)?.nom || '',
    departementsList.find(d => d.id === e.departementId)?.nom || '',
    e.tel1,
    e.tel2 || '',
    e.email,
    {titulaire:'مرسم',contractuel:'متعاقد',vacataire:'عرضي'}[e.statut] || e.statut,
    e.genre === 'homme' ? 'ذكر' : 'أنثى',
    e.dateRecrutement,
    e.dateNaissance,
    e.dateDernierGrade
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'الأساتذة');
  XLSX.writeFile(wb, `قائمة_الأساتذة_${new Date().toISOString().slice(0,10)}.xlsx`);
}

function exportSIAD() {
  const total = enseignants.length || 1;
  const kpis = [
    ['المؤشر','القيمة'],
    ['إجمالي الأساتذة', enseignants.length],
    ['مرسم', enseignants.filter(e => e.statut === 'titulaire').length],
    ['متعاقد', enseignants.filter(e => e.statut === 'contractuel').length],
    ['عرضي', enseignants.filter(e => e.statut === 'vacataire').length],
    ['ذكور', enseignants.filter(e => e.genre === 'homme').length],
    ['إناث', enseignants.filter(e => e.genre === 'femme').length]
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(kpis), 'المؤشرات');
  XLSX.writeFile(wb, `SIAD_${new Date().toISOString().slice(0,10)}.xlsx`);
}
