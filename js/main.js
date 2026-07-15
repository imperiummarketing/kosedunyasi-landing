(function () {
  'use strict';

  const config = window.KD_CONFIG || {};
  const whatsapp = config.whatsapp || {};

  function buildWhatsAppUrl() {
    const phone = (whatsapp.phone || '').replace(/\D/g, '');
    const message = encodeURIComponent(whatsapp.message || 'Merhaba, bilgi almak istiyorum.');
    return `https://wa.me/${phone}?text=${message}`;
  }

  function setupWhatsAppButtons() {
    const url = buildWhatsAppUrl();
    const buttons = document.querySelectorAll('[data-whatsapp-button]');
    buttons.forEach((button) => {
      const buttonText = whatsapp.buttonText || button.textContent.trim();
      button.setAttribute('aria-label', buttonText);
      button.dataset.ctaText = buttonText;
      button.replaceChildren(
        createWhatsAppIcon(),
        createWhatsAppLabel(buttonText)
      );
      button.setAttribute('href', url);
      // ponytail: tracking handled by inline script in index.html (single dataLayer push + Meta CAPI)
      // KD_TRACKING.trackWhatsAppClick would cause a duplicate dataLayer.push on the same click
    });
  }

  function createWhatsAppIcon() {
    const icon = document.createElement('span');
    icon.className = 'sticky-whatsapp__icon';
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  function createWhatsAppLabel(buttonText) {
    const label = document.createElement('span');
    label.className = 'sticky-whatsapp__label';
    label.textContent = buttonText;
    return label;
  }

  function updateYear() {
    const el = document.querySelector('[data-current-year]');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupWhatsAppButtons();
    updateYear();
  });
})();
