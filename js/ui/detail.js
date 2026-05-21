// Keys that are mutually exclusive variants — only show the one the property has, hide the rest entirely
const HIDE_IF_ABSENT = new Set(['wifi', 'wifi_600']);

function renderAmenities(amenitySet) {
  return getAmenityGroups(currentLang).map(group => {
    const items = group.items
      .filter(item => {
        if (HIDE_IF_ABSENT.has(item.key)) return amenitySet.has(item.key);
        return true;
      })
      .map(item => {
        const has = amenitySet.has(item.key);
        return `
        <li class="amenity-item ${has ? 'has' : 'has-not'}">
          <span class="amenity-icon">${has ? '✓' : '✕'}</span>
          <span>${item.label}</span>
        </li>`;
      }).join('');
    return `
      <div class="amenity-group">
        <div class="amenity-group-title">${group.group}</div>
        <ul class="amenity-list">${items}</ul>
      </div>`;
  }).join('');
}

function propertyUrl(id) {
  const url = new URL(window.location.href);
  url.searchParams.set('inmueble', String(id));
  return url.pathname + url.search;
}

function buildWhatsAppUrl(property) {
  const t = i18n[currentLang] || i18n.es;
  const text = property
    ? (t.wa_msg_property || t.wa_msg_general)
        .replace('{street}', property.street)
        .replace('{city}', property.city)
    : t.wa_msg_general;
  return `https://wa.me/34660688501?text=${encodeURIComponent(text)}`;
}

function updateWhatsAppLinks(property) {
  const url = buildWhatsAppUrl(property);
  const sticky = document.getElementById('detail-sticky-wa');
  if (sticky) sticky.href = url;
  const contact = document.getElementById('contact-wa-link');
  if (contact) contact.href = url;
}

function initPropertyFromUrl() {
  const id = Number(new URLSearchParams(window.location.search).get('inmueble'));
  if (id && properties.some(x => x.id === id)) showDetail(id, { skipUrlUpdate: true });
}

function showDetail(id, options = {}) {
  const p = properties.find(x => x.id === id);
  if (!p) return;
  currentPropertyId = id;

  if (!options.skipUrlUpdate) {
    const url = new URL(window.location.href);
    url.searchParams.set('inmueble', String(id));
    history.replaceState(null, '', url.pathname + url.search);
  }

  const allPhotosArr = [p.mainImage, ...(p.extraPhotos || [])].filter(Boolean);

  const wrap = document.getElementById('detail-hero-img-wrap');
  const imgPos = p.heroImagePosition || 'center center';
  wrap.innerHTML = p.mainImage
    ? `<img src="${p.mainImage}" alt="${p.city}" class="detail-hero-img" style="cursor:zoom-in;object-position:${imgPos}" onclick="openLightbox(currentAllPhotos, 0)">`
    : `<div class="detail-hero-placeholder"><svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#C4B8A4" stroke-width="1.5"><rect x="10" y="30" width="60" height="40" rx="2"/><path d="M10 30L40 8l30 22"/><rect x="30" y="50" width="20" height="20"/></svg></div>`;

  window.currentAllPhotos = allPhotosArr;

  const sl = getSpecLabels();

  document.getElementById('d-tag').textContent = getPropText(p, 'tag');
  document.getElementById('d-title').textContent = p.city;
  document.getElementById('d-address').textContent = p.street;
  document.getElementById('d-price').innerHTML = p.price
    ? `${p.price}€<sub>${getPropText(p,'priceUnit')}</sub>`
    : `<span style="font-size:1.2rem;font-family:var(--font-body);font-weight:300;color:var(--warm-mid)">${(i18n[currentLang]||i18n.es).consult_price}</span>`;

  const badge = document.getElementById('d-availability');
  badge.textContent = getPropText(p, 'availableText');
  badge.className = 'availability-badge ' + (p.available ? 'available' : 'unavailable');

  // Build translated specs
  const specsData = [
    { label: sl.superficie,   value: p.specs[0].value, unit: p.specs[0].unit },
    { label: sl.habitaciones, value: p.specs[1].value, unit: sl.dorm },
    { label: sl.banos,        value: p.specs[2].value, unit: sl.bano },
    { label: sl.planta,       value: p.specs[3].value, unit: p.specs[3].unit },
  ];
  document.getElementById('d-specs').innerHTML = specsData.map(s => `
    <div class="spec-item">
      <span class="spec-label">${s.label}</span>
      <span class="spec-value">${s.value} <span class="spec-unit">${s.unit}</span></span>
    </div>
  `).join('');

  document.getElementById('d-description').textContent = getPropText(p, 'description');

  document.getElementById('d-amenities').innerHTML = renderAmenities(p.amenities);

  const photos = p.extraPhotos.filter(Boolean);
  const photoGrid = document.getElementById('d-photos');
  if (photos.length) {
    photoGrid.innerHTML = photos.map((src, i) => `
      <div class="detail-photo" onclick="openLightbox(currentAllPhotos, ${i + 1})" style="cursor:zoom-in">
        <img src="${src}" alt="Foto ${i+1}" loading="lazy">
      </div>
    `).join('');
  } else {
    photoGrid.innerHTML = [0,1,2].map(() => `
      <div class="detail-photo"><div class="detail-photo-placeholder">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#C4B8A4" stroke-width="1.2">
          <rect x="5" y="8" width="30" height="24" rx="2"/><circle cx="15" cy="16" r="3"/>
          <path d="M5 26l8-6 6 5 5-4 11 7"/>
        </svg>
      </div></div>
    `).join('');
  }

  updateWhatsAppLinks(p);

  document.getElementById('home-view').style.display = 'none';
  document.getElementById('detail-view').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── SHOW HOME ─── */
function showHome() {
  document.getElementById('detail-view').classList.remove('active');
  document.getElementById('home-view').style.display = '';
  currentPropertyId = null;
  updateWhatsAppLinks(null);
  const url = new URL(window.location.href);
  url.searchParams.delete('inmueble');
  history.replaceState(null, '', url.pathname + url.search);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setActiveNav('hogar');
  return false;
}
