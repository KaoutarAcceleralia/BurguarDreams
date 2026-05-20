let lightboxPhotos = [];
let lightboxIndex = 0;

function openLightbox(photos, index) {
  lightboxPhotos = photos;
  lightboxIndex = index;
  updateLightbox();
  document.getElementById('lightbox').classList.add('active');
  updateBodyScrollLock();
}

function updateLightbox() {
  document.getElementById('lightbox-img').src = lightboxPhotos[lightboxIndex];
  document.getElementById('lightbox-counter').textContent = `${lightboxIndex + 1} / ${lightboxPhotos.length}`;
}

function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxPhotos.length) % lightboxPhotos.length;
  updateLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  updateBodyScrollLock();
}

function closeLightboxOnBg(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

document.addEventListener('keydown', e => {
  if (document.getElementById('lightbox').classList.contains('active')) {
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'Escape') closeLightbox();
  }
});
