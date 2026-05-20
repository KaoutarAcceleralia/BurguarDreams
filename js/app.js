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
  if (document.getElementById('detail-view').classList.contains('active')) {
    document.getElementById('detail-view').classList.remove('active');
    document.getElementById('home-view').style.display = '';
  }

  const section = document.getElementById(sectionId);
  if (!section) return;

  const top = section.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top, behavior: 'smooth' });
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
    <div class="faq-item" id="faq-${i}">
      <button class="faq-question" onclick="toggleFAQ(${i})">
        <span>${f.q}</span>
        <svg class="faq-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 6l5 5 5-5"/>
        </svg>
      </button>
      <div class="faq-answer">${f.a}</div>
    </div>
  `).join('');
}

function toggleFAQ(i) {
  document.getElementById(`faq-${i}`).classList.toggle('open');
}

renderGrid();
renderFAQ();
renderLegalModals('es');
setHeroBg();
initScrollSpy();
window.addEventListener('resize', () => {
  document.documentElement.style.setProperty('--header-offset', getHeaderOffset() + 'px');
});
document.documentElement.style.setProperty('--header-offset', getHeaderOffset() + 'px');
