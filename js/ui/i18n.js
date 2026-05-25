const HTML_LANG_CODES = { es: 'es', ca: 'ca', en: 'en', fr: 'fr', de: 'de', it: 'it' };

function setLang(lang) {
  currentLang = lang;
  const t = i18n[lang] || i18n.es;

  document.documentElement.lang = HTML_LANG_CODES[lang] || 'es';
  document.getElementById('lang-flag').innerHTML = t.flag;
  document.getElementById('lang-label').textContent = t.label;

  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${lang}'`));
  });

  document.getElementById('nav-hogar-btn').textContent = t.tab_hogar;
  document.getElementById('nav-empresas-btn').textContent = t.tab_empresas;
  document.getElementById('nav-faq-btn').textContent = t.tab_faq;
  document.getElementById('nav-contact-btn').textContent = t.tab_contact;
  document.getElementById('hero-eyebrow-text').textContent = t.hero_eyebrow;
  document.getElementById('hero-h1-text').innerHTML = t.hero_h1;
  document.getElementById('hero-sub-text').textContent = t.hero_sub;
  document.getElementById('hero-cta-whatsapp-text').textContent = t.hero_cta_whatsapp;
  const skipLink = document.getElementById('skip-link');
  if (skipLink) skipLink.textContent = t.skip_link;
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle && !document.getElementById('main-header')?.classList.contains('nav-open')) {
    navToggle.setAttribute('aria-label', t.nav_open);
  }
  document.getElementById('section-title-text').textContent = t.section_title;
  document.getElementById('section-count-text').textContent = t.section_count;
  document.getElementById('corp-eyebrow-text').textContent = t.corp_eyebrow;
  document.getElementById('corp-title-text').innerHTML = t.corp_title;
  document.getElementById('corp-sub-text').textContent = t.corp_sub;
  document.getElementById('corp-cta-text').textContent = t.corp_cta;
  document.getElementById('corp-f1t-text').textContent = t.corp_f1t;
  document.getElementById('corp-f1-text').textContent = t.corp_f1;
  document.getElementById('corp-f2t-text').textContent = t.corp_f2t;
  document.getElementById('corp-f2-text').textContent = t.corp_f2;
  document.getElementById('corp-f3t-text').textContent = t.corp_f3t;
  document.getElementById('corp-f3-text').textContent = t.corp_f3;
  document.getElementById('corp-f4t-text').textContent = t.corp_f4t;
  document.getElementById('corp-f4-text').textContent = t.corp_f4;
  document.getElementById('faq-title-text').textContent = t.faq_title;
  document.getElementById('back-label').textContent = t.back;
  document.getElementById('btn-interest-label').textContent = t.btn_interest;
  const stickyWa = document.getElementById('detail-sticky-wa-label');
  const stickyForm = document.getElementById('detail-sticky-form-label');
  if (stickyWa) stickyWa.textContent = t.detail_sticky_wa;
  if (stickyForm) stickyForm.textContent = t.btn_interest;
  document.getElementById('detail-about-h3').textContent = t.detail_about;
  document.getElementById('detail-amenities-h3').textContent = t.detail_amenities;
  document.getElementById('modal-eyebrow-text').textContent = t.modal_eyebrow;
  document.getElementById('modal-title-text').textContent = t.modal_title;
  document.getElementById('modal-intro-text').textContent = t.modal_intro;
  const cookieText = document.getElementById('cookie-banner-text');
  if (cookieText) cookieText.textContent = t.cookie_banner_text;
  document.getElementById('cookie-accept-btn').textContent = t.cookie_accept;
  document.getElementById('cookie-reject-btn').textContent = t.cookie_reject;
  document.getElementById('cookie-config-btn').textContent = t.cookie_configure;
  document.getElementById('label-nombre').textContent = t.label_nombre;
  document.getElementById('label-apellidos').textContent = t.label_apellidos;
  document.getElementById('label-email').textContent = t.label_email;
  document.getElementById('label-telefono').textContent = t.label_telefono;
  document.getElementById('label-nacimiento').textContent = t.label_nacimiento;
  document.getElementById('label-laboral').textContent = t.label_laboral;
  document.getElementById('label-ingresos').textContent = t.label_ingresos;
  document.getElementById('label-personas').textContent = t.label_personas;
  document.getElementById('label-mascotas').textContent = t.label_mascotas;
  document.getElementById('f-nombre').placeholder = t.nombre_ph;
  document.getElementById('f-apellidos').placeholder = t.apellidos_ph;
  document.getElementById('mascotas-no-label').textContent = t.mascotas_no;
  document.getElementById('mascotas-si-label').textContent = t.mascotas_si;

  for (let i = 0; i <= 7; i++) { const el = document.getElementById(`f-laboral-${i}`); if (el) el.textContent = t[`laboral_${i}`]; }
  for (let i = 0; i <= 5; i++) { const el = document.getElementById(`f-ingresos-${i}`); if (el) el.textContent = t[`ingresos_${i}`]; }
  for (let i = 0; i <= 5; i++) { const el = document.getElementById(`f-personas-${i}`); if (el) el.textContent = t[`personas_${i}`]; }

  const privacyLabel = document.getElementById('label-privacidad');
  if (privacyLabel) privacyLabel.innerHTML = t.form_privacy_html;
  document.getElementById('btn-send').textContent = t.btn_send;
  document.getElementById('success-title-text').textContent = t.success_title;
  document.getElementById('success-desc-text').textContent = t.success_desc;
  document.getElementById('contact-eyebrow-text').textContent = t.contact_eyebrow;
  document.getElementById('contact-title-text').innerHTML = t.contact_title;
  document.getElementById('contact-sub-text').textContent = t.contact_sub;
  document.getElementById('contact-wa-hint').textContent = t.contact_wa_hint;
  document.getElementById('contact-whatsapp-text').textContent = t.contact_whatsapp;
  document.getElementById('contact-form-btn-text').textContent = t.contact_form_btn;
  document.getElementById('contact-form-note').textContent = t.contact_form_note;
  const contactWa = document.getElementById('contact-wa-link');
  if (contactWa) {
    const p = currentPropertyId ? properties.find(x => x.id === currentPropertyId) : null;
    contactWa.href = buildWhatsAppUrl(p);
  }
  document.getElementById('contact-location-label').textContent = t.contact_location_label;
  document.getElementById('contact-email-label').textContent = t.contact_email_label;
  document.getElementById('contact-phone-label').textContent = t.contact_phone_label;
  document.getElementById('contact-hours-label').textContent = t.contact_hours_label;
  document.getElementById('contact-hours-value').textContent = t.contact_hours;
  document.getElementById('footer-legal-link').textContent = t.footer_legal;
  document.getElementById('footer-privacy-link').textContent = t.footer_privacy;
  document.getElementById('footer-cookies-link').textContent = t.footer_cookies;
  document.getElementById('footer-legal-id').textContent = t.footer_legal_id;
  document.getElementById('footer-copy-text').textContent = t.footer_copy;

  renderFAQ();
  renderLegalModals(lang);
  renderGrid();
  // If user is viewing a property detail, re-render it in the new language
  if (currentPropertyId && document.getElementById('detail-view').classList.contains('active')) {
    showDetail(currentPropertyId);
  } else {
    updateWhatsAppLinks(null);
  }
  document.getElementById('lang-switcher').classList.remove('open');
}

function toggleLang(e) {
  e.stopPropagation();
  document.getElementById('lang-switcher').classList.toggle('open');
}

document.addEventListener('click', () => {
  document.getElementById('lang-switcher').classList.remove('open');
});
