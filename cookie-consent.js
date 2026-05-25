/**
 * cookie-consent.js
 * Lightweight, self-contained cookie consent for Sieker Friseur.
 * No external dependencies — all state stored in localStorage.
 *
 * Public API (window.CookieConsent):
 *   .init()       — called automatically on script load
 *   .show()       — reopen banner (used by footer link)
 *   .getStatus()  — returns 'all' | 'necessary' | null
 */

const CookieConsent = (function () {
  'use strict';

  const STORAGE_KEY = 'sieker_cookie_consent';
  const BANNER_ID   = 'cookie-banner';

  /* TODO: Google Analytics Measurement-ID eintragen (Format: G-XXXXXXXXXX) */
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  /* TODO: Meta Pixel ID eintragen (16-stellige Zahl) */
  const META_PIXEL_ID = 'XXXXXXXXXXXXXXXXXX';

  // ── Getters / Setters ────────────────────────────────────────────

  function getStatus() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function setStatus(value) {
    localStorage.setItem(STORAGE_KEY, value);
  }

  // ── Tracker loaders ──────────────────────────────────────────────

  function loadGA4() {
    if (document.getElementById('ga4-script')) return;

    const script = document.createElement('script');
    script.id    = 'ga4-script';
    script.async = true;
    script.src   = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function loadMetaPixel() {
    if (document.getElementById('meta-pixel-script')) return;

    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
    n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
    t=b.createElement(e);t.async=!0;t.id='meta-pixel-script';
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
    /* eslint-enable */
  }

  function loadMaps() {
    const iframe      = document.getElementById('google-maps-iframe');
    const placeholder = document.getElementById('map-placeholder');
    if (!iframe) return;

    const src = iframe.getAttribute('data-src');
    if (src) {
      iframe.src           = src;
      iframe.style.display = 'block';
    }
    if (placeholder) placeholder.hidden = true;
  }

  function loadAllTrackers() {
    loadGA4();
    loadMetaPixel();
    loadMaps();
  }

  // ── Banner ───────────────────────────────────────────────────────

  function removeBanner() {
    const banner = document.getElementById(BANNER_ID);
    if (!banner) return;
    banner.classList.remove('is-visible');
    setTimeout(function () { banner.remove(); }, 400);
  }

  function createBanner() {
    if (document.getElementById(BANNER_ID)) return;

    const banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-label', 'Cookie-Einstellungen');
    banner.innerHTML = [
      '<div class="cookie-inner">',
        '<div class="cookie-text">',
          '<strong>Wir verwenden Cookies</strong>',
          '<p>Diese Website nutzt technisch notwendige Cookies sowie – mit deiner Zustimmung –',
          ' Analyse- und Marketing-Cookies (Google Analytics, Meta Pixel) und Google Maps.',
          ' Details findest du in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.</p>',
        '</div>',
        '<div class="cookie-actions">',
          '<button id="cookie-accept-necessary" class="btn btn-secondary btn-sm">Nur notwendige</button>',
          '<button id="cookie-accept-all" class="btn btn-primary btn-sm">Alle akzeptieren</button>',
        '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(banner);

    // Animate in on next paint
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { banner.classList.add('is-visible'); });
    });

    document.getElementById('cookie-accept-all').addEventListener('click', function () {
      setStatus('all');
      loadAllTrackers();
      removeBanner();
    });

    document.getElementById('cookie-accept-necessary').addEventListener('click', function () {
      setStatus('necessary');
      removeBanner();
    });
  }

  // ── Public API ───────────────────────────────────────────────────

  function show() {
    const existing = document.getElementById(BANNER_ID);
    if (existing) {
      existing.classList.add('is-visible');
    } else {
      createBanner();
    }
  }

  function init() {
    var status = getStatus();
    if (status === 'all') {
      // Returning visitor who accepted — load trackers immediately
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllTrackers);
      } else {
        loadAllTrackers();
      }
    } else if (!status) {
      // First visit — show banner after DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBanner);
      } else {
        createBanner();
      }
    }
    // status === 'necessary': no trackers, no banner
  }

  return { init: init, show: show, getStatus: getStatus };
})();

CookieConsent.init();
