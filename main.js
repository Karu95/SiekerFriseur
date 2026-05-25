/**
 * main.js
 * Navigation, gallery lightbox, and minor UI helpers for Sieker Friseur.
 * No external dependencies.
 */

(function () {
  'use strict';

  // ── Navigation ───────────────────────────────────────────────────

  var nav       = document.getElementById('nav');
  var hamburger = document.querySelector('.hamburger');
  var navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    document.body.classList.toggle('nav-open', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Menü öffnen');
      document.body.classList.remove('nav-open');
    });
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && navLinks.classList.contains('is-open')) {
      navLinks.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });

  // ── Footer: current year ─────────────────────────────────────────

  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Gallery lightbox ─────────────────────────────────────────────

  var lightbox     = document.getElementById('lightbox');
  var lbImg        = lightbox && lightbox.querySelector('.lightbox-img');
  var lbClose      = lightbox && lightbox.querySelector('.lightbox-close');
  var lbPrev       = lightbox && lightbox.querySelector('.lightbox-prev');
  var lbNext       = lightbox && lightbox.querySelector('.lightbox-next');
  var galleryImgs  = Array.from(document.querySelectorAll('.gallery-img[data-lightbox]'));
  var currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox) return;
    currentIndex = index;
    lbImg.src    = galleryImgs[currentIndex].src;
    lbImg.alt    = galleryImgs[currentIndex].alt;
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    galleryImgs[currentIndex].focus();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
    lbImg.src    = galleryImgs[currentIndex].src;
    lbImg.alt    = galleryImgs[currentIndex].alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImgs.length;
    lbImg.src    = galleryImgs[currentIndex].src;
    lbImg.alt    = galleryImgs[currentIndex].alt;
  }

  galleryImgs.forEach(function (img, i) {
    img.style.cursor = 'pointer';
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', function () { openLightbox(i); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  if (lightbox) {
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', showPrev);
    lbNext.addEventListener('click', showNext);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  }

  // ── Booking iframe: show fallback if URL is still a placeholder ──

  var bookingIframe   = document.getElementById('booking-iframe');
  var bookingFallback = document.getElementById('booking-fallback');

  if (bookingIframe && bookingFallback) {
    if (bookingIframe.src.includes('IHRE-SUBDOMAIN')) {
      bookingIframe.style.display = 'none';
      bookingFallback.hidden      = false;
    }
    bookingIframe.addEventListener('error', function () {
      bookingIframe.style.display = 'none';
      bookingFallback.hidden      = false;
    });
  }

})();
