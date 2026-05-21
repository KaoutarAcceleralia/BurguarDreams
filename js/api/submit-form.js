function getDb() {
  if (window.db) return window.db;
  if (typeof supabase !== 'undefined' && window.SUPABASE_URL && window.SUPABASE_KEY) {
    window.db = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
    return window.db;
  }
  return null;
}

function clearFormErrors() {
  ['error-nombre', 'error-telefono', 'form-global-error'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function showFormError(fieldId, message) {
  const el = document.getElementById(fieldId);
  if (el) el.textContent = message;
}

async function submitForm() {
  clearFormErrors();
  const t = i18n[currentLang] || i18n.es;

  const nombre   = document.getElementById('f-nombre').value.trim();
  const telefono = document.getElementById('f-telefono').value.trim();
  if (!nombre || !telefono) {
    if (!nombre) showFormError('error-nombre', t.form_error_required);
    if (!telefono) showFormError('error-telefono', t.form_error_required);
    if (!nombre && !telefono) showFormError('form-global-error', t.form_error_required);
    document.getElementById('f-nombre').focus();
    return;
  }

  const db = getDb();
  if (!db) {
    showFormError('form-global-error', t.form_error_server);
    return;
  }

  const btn = document.getElementById('btn-send');
  btn.disabled = true;
  btn.textContent = '…';

  const p = properties.find(x => x.id === currentPropertyId);
  const mascotas = document.querySelector('input[name="f-mascotas"]:checked')?.value || 'No';

  try {
    const { error } = await db.from('solicitudes').insert({
      property_id:        currentPropertyId || null,
      property_name:      p ? `${p.city} — ${p.street}` : null,
      nombre:             nombre,
      apellidos:          document.getElementById('f-apellidos').value.trim(),
      telefono:           telefono,
      email:              document.getElementById('f-email').value.trim(),
      fecha_nacimiento:   document.getElementById('f-nacimiento').value || null,
      situacion_laboral:  document.getElementById('f-laboral').value,
      ingresos_mensuales: document.getElementById('f-ingresos').value,
      num_personas:       document.getElementById('f-personas').value,
      mascotas:           mascotas,
    });

    if (error) throw error;

    document.getElementById('modal-form').classList.add('hidden');
    document.getElementById('modal-success').classList.add('active');
    setTimeout(closeModal, 3000);

  } catch (e) {
    console.error('Error guardando solicitud:', e);
    showFormError('form-global-error', t.form_error_generic);
  } finally {
    btn.disabled = false;
    btn.textContent = t.btn_send;
  }
}
