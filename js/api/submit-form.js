function getDb() {
  if (window.db) return window.db;
  if (typeof supabase !== 'undefined' && window.SUPABASE_URL && window.SUPABASE_KEY) {
    window.db = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
    return window.db;
  }
  return null;
}

const FIELD_LIMITS = {
  nombre: 120,
  apellidos: 120,
  telefono: 30,
  email: 254,
  situacion_laboral: 80,
  ingresos_mensuales: 80,
  num_personas: 40,
  mascotas: 10,
  property_name: 200,
};

function clearFormErrors() {
  ['error-nombre', 'error-telefono', 'error-privacidad', 'form-global-error'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function showFormError(fieldId, message) {
  const el = document.getElementById(fieldId);
  if (el) el.textContent = message;
}

function trimField(id, maxLen) {
  const v = document.getElementById(id)?.value?.trim() || '';
  if (!maxLen) return v;
  return v.slice(0, maxLen);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 15 && /^[\d\s+\-().]+$/.test(value);
}

async function submitForm() {
  clearFormErrors();
  const t = i18n[currentLang] || i18n.es;

  const nombre = trimField('f-nombre', FIELD_LIMITS.nombre);
  const telefono = trimField('f-telefono', FIELD_LIMITS.telefono);
  const email = trimField('f-email', FIELD_LIMITS.email);
  const privacyOk = document.getElementById('f-privacidad')?.checked;

  let hasError = false;
  if (!nombre || nombre.length < 2) {
    showFormError('error-nombre', t.form_error_required);
    hasError = true;
  }
  if (!telefono || !isValidPhone(telefono)) {
    showFormError('error-telefono', telefono ? t.form_error_phone : t.form_error_required);
    hasError = true;
  }
  if (email && !isValidEmail(email)) {
    showFormError('form-global-error', t.form_error_email);
    hasError = true;
  }
  if (!privacyOk) {
    showFormError('error-privacidad', t.form_error_privacy);
    hasError = true;
  }
  if (hasError) {
    if (!nombre || nombre.length < 2) document.getElementById('f-nombre').focus();
    else if (!telefono || !isValidPhone(telefono)) document.getElementById('f-telefono').focus();
    else if (!privacyOk) document.getElementById('f-privacidad').focus();
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

  const opt = (id, maxLen) => {
    const v = trimField(id, maxLen);
    return v || null;
  };

  const propertyName = p ? `${p.city} — ${p.street}`.slice(0, FIELD_LIMITS.property_name) : null;

  try {
    const { error } = await db.from('solicitudes').insert({
      property_id: currentPropertyId || null,
      property_name: propertyName,
      nombre,
      apellidos: opt('f-apellidos', FIELD_LIMITS.apellidos),
      telefono,
      email: email || null,
      fecha_nacimiento: opt('f-nacimiento'),
      situacion_laboral: opt('f-laboral', FIELD_LIMITS.situacion_laboral),
      ingresos_mensuales: opt('f-ingresos', FIELD_LIMITS.ingresos_mensuales),
      num_personas: opt('f-personas', FIELD_LIMITS.num_personas),
      mascotas: mascotas.slice(0, FIELD_LIMITS.mascotas),
    });

    if (error) throw error;

    /* Correo: trigger on_solicitud_resend_email (pg_net). Si 401 TU_eyJ_ano → supabase/PEGAR-AHORA.sql */

    document.getElementById('f-privacidad').checked = false;
    document.getElementById('modal-form').classList.add('hidden');
    document.getElementById('modal-success').classList.add('active');
    setTimeout(closeModal, 3000);

  } catch (e) {
    const msg = e?.message || e?.error_description || String(e);
    const code = e?.code || '';
    console.error('[Burguar Dreams] Error guardando solicitud:', {
      code,
      message: msg,
      hint: e?.hint,
      details: e?.details,
    });
    const validationFailed = /invalid nombre|invalid telefono|invalid email/i.test(msg);
    const needsDbSetup =
      !validationFailed &&
      (code === '42501' ||
        code === '3F000' ||
        /row-level security/i.test(msg) ||
        /schema "net"/i.test(msg));
    if (needsDbSetup) {
      console.error(
        '[Burguar Dreams] Ejecuta supabase/fix-urgente.sql y supabase/validate-solicitudes.sql en SQL Editor:',
        'https://supabase.com/dashboard/project/yscbwngotgbkytmzogol/sql/new'
      );
      showFormError(
        'form-global-error',
        t.form_error_db_setup || t.form_error_generic
      );
    } else {
      showFormError('form-global-error', t.form_error_generic);
    }
  } finally {
    btn.disabled = false;
    btn.textContent = t.btn_send;
  }
}
