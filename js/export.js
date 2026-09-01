```javascript
// ====================== EXPORT EXCEL ======================

// Export de la liste des enseignants
document.getElementById('btn-export')?.addEventListener('click', () => {
  exportEnseignants(enseignants);
});


// Export du SIAD
document.getElementById('btn-export-siad')?.addEventListener('click', () => {
  exportSIAD();
});


// ====================== EXPORT ENSEIGNANTS ======================

function exportEnseignants(list) {

  if (!list.length) {
    return alert('لا توجد بيانات');
  }

  const headers = [
    'الرقم',
    'رقم التسجيل CNRPS',
    'اللقب',
    'الاسم',
    'الرتبة',
    'التخصص',
    'القسم',
    'الهاتف 1',
    'الهاتف 2',
    'البريد الإلكتروني',
    'الصفة',
    'الجنس',
    'تاريخ التوظيف',
    'تاريخ الميلاد',
    'تاريخ آخر رتبة'
  ];


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

    // ====================== الصفة ======================
    {
      titulaire: 'مرسم',
      contractuel: 'متعاقد',
      vacataire: 'عرضي'
    }[e.sifah] || e.sifah || '',

    // ====================== الجنس ======================
    e.genre === 'homme' ? 'ذكر' : 'أنثى',

    e.dateRecrutement,

    e.dateNaissance,

    e.dateDernierGrade

  ]);


  const ws = XLSX.utils.aoa_to_sheet([
    headers,
    ...rows
  ]);


  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    'الأساتذة'
  );


  XLSX.writeFile(
    wb,
    `قائمة_الأساتذة_${new Date().toISOString().slice(0,10)}.xlsx`
  );
}


// ====================== EXPORT SIAD ======================

function exportSIAD() {

  const kpis = [

    ['المؤشر', 'القيمة'],

    ['إجمالي الأساتذة', enseignants.length],

    // ====================== الصفة ======================

    [
      'مرسم',
      enseignants.filter(e =>
        e.sifah === 'titulaire'
      ).length
    ],

    [
      'متعاقد',
      enseignants.filter(e =>
        e.sifah === 'contractuel'
      ).length
    ],

    [
      'عرضي',
      enseignants.filter(e =>
        e.sifah === 'vacataire'
      ).length
    ],

    // ====================== الجنس ======================

    [
      'ذكور',
      enseignants.filter(e =>
        e.genre === 'homme'
      ).length
    ],

    [
      'إناث',
      enseignants.filter(e =>
        e.genre === 'femme'
      ).length
    ]

  ];


  const wb = XLSX.utils.book_new();


  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(kpis),
    'المؤشرات'
  );


  XLSX.writeFile(
    wb,
    `SIAD_${new Date().toISOString().slice(0,10)}.xlsx`
  );
}
```
