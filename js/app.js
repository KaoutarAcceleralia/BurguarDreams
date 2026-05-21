function setHeroBg() {
  const heroBg = document.getElementById('hero-bg');
  if (heroBg && properties[0] && properties[0].mainImage) {
    heroBg.style.backgroundImage = `url("${properties[0].mainImage}")`;
  }
}

const navSectionMap = {
  'nav-hogar-btn': 'hogar',
  'nav-empresas-btn': 'empresas',
  'nav-faq-btn': 'faq',
  'nav-contact-btn': 'contacto',
};

function getHeaderOffset() {
  const header = document.querySelector('header');
  return header ? header.offsetHeight + 8 : 120;
}

function setActiveNav(sectionId) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const id = link.id;
    link.classList.toggle('active-nav', navSectionMap[id] === sectionId);
  });
}

function scrollToSection(sectionId) {
  if (typeof closeMobileNav === 'function') closeMobileNav();

  if (document.getElementById('detail-view').classList.contains('active')) {
    const detailView = document.getElementById('detail-view');
    detailView.classList.remove('active');
    document.getElementById('home-view').style.display = '';
    currentPropertyId = null;
    const url = new URL(window.location.href);
    url.searchParams.delete('inmueble');
    history.replaceState(null, '', url.pathname + url.search);
    if (typeof resetRevealIn === 'function') resetRevealIn(detailView);
    if (typeof scheduleScrollReveal === 'function') scheduleScrollReveal();
  }

  const section = document.getElementById(sectionId);
  if (!section) return;

  const top = section.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
  setActiveNav(sectionId);
}

function initScrollSpy() {
  const sections = ['hogar', 'empresas', 'faq', 'contacto']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    if (document.getElementById('detail-view').classList.contains('active')) return;
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible.length) setActiveNav(visible[0].target.id);
  }, {
    rootMargin: `-${getHeaderOffset()}px 0px -55% 0px`,
    threshold: [0, 0.15, 0.35, 0.55],
  });

  sections.forEach(section => observer.observe(section));
}

function renderFAQ() {
  const list = document.getElementById('faq-list');
  const items = faqs[currentLang] || faqs.es;
  list.innerHTML = items.map((f, i) => `
    <div class="faq-item" id="faq-${i}" data-reveal="${i % 2 === 0 ? 'left' : 'right'}">
      <button type="button" class="faq-question" id="faq-btn-${i}" onclick="toggleFAQ(${i})"
              aria-expanded="false" aria-controls="faq-answer-${i}">
        <span>${f.q}</span>
        <svg class="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M3 6l5 5 5-5"/>
        </svg>
      </button>
      <div class="faq-answer" id="faq-answer-${i}" role="region" aria-labelledby="faq-btn-${i}" hidden>${f.a}</div>
    </div>
  `).join('');
  if (typeof scheduleScrollReveal === 'function') scheduleScrollReveal();
}

function toggleFAQ(i) {
  const item = document.getElementById(`faq-${i}`);
  const btn = document.getElementById(`faq-btn-${i}`);
  const answer = document.getElementById(`faq-answer-${i}`);
  const open = !item.classList.contains('open');
  item.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
  answer.hidden = !open;
}

renderGrid();
renderFAQ();
renderLegalModals('es');
setHeroBg();
updateWhatsAppLinks(null);
initPropertyFromUrl();
initScrollSpy();
if (typeof scheduleScrollReveal === 'function') scheduleScrollReveal();
window.addEventListener('resize', () => {
  document.documentElement.style.setProperty('--header-offset', getHeaderOffset() + 'px');
});
document.documentElement.style.setProperty('--header-offset', getHeaderOffset() + 'px');
