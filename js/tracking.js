(function () {
  'use strict';

  const config = window.KD_CONFIG || {};
  const tracking = config.tracking || {};
  const consent = config.consent || {};
  const site = config.site || {};

  window.dataLayer = window.dataLayer || [];

  function hasConsent() {
    if (!consent.enabled) return true;
    if (!consent.requireConsentForTracking) return true;
    return localStorage.getItem(consent.storageKey || 'kd_cookie_consent_v1') === 'accepted';
  }

  function loadScript(src, attrs = {}) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      Object.keys(attrs).forEach((key) => script.setAttribute(key, attrs[key]));
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function initGTM() {
    if (!tracking.gtmId || tracking.gtmId === 'GTM-XXXXXXX') return;
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(tracking.gtmId)}`).catch(() => {});
  }

  function initGA4() {
    if (!tracking.ga4MeasurementId) return;
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tracking.ga4MeasurementId)}`).then(() => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', tracking.ga4MeasurementId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });
    }).catch(() => {});
  }

  function initMetaPixel() {
    if (!tracking.metaPixelId) return;
    if (window.fbq) return;
    /* Meta Pixel base code, loaded only if configured. */
    !(function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', tracking.metaPixelId);
    window.fbq('track', 'PageView');
  }

  function initTracking() {
    initGTM();
    initGA4();
    initMetaPixel();
  }

  function eventPayload(extra = {}) {
    return {
      event: tracking.eventName || 'whatsapp_click',
      page_type: tracking.pageType || 'product_intro_landing',
      landing_name: site.landingName || 'kose-dunyasi-tanitim',
      landing_version: site.landingVersion || 'v1',
      traffic_target: tracking.trafficTarget || 'google_ads',
      hostname: window.location.hostname,
      page_location: window.location.href,
      ...extra
    };
  }

  window.KD_TRACKING = {
    init: initTracking,
    consentAccepted: function () {
      localStorage.setItem(consent.storageKey || 'kd_cookie_consent_v1', 'accepted');
      initTracking();
    },
    consentRejected: function () {
      localStorage.setItem(consent.storageKey || 'kd_cookie_consent_v1', 'rejected');
    },
    trackWhatsAppClick: function (extra = {}) {
      const payload = eventPayload(extra);
      window.dataLayer.push(payload);

      if (window.gtag) {
        window.gtag('event', tracking.eventName || 'whatsapp_click', {
          event_category: 'lead',
          event_label: extra.cta_text || 'whatsapp_cta',
          page_type: payload.page_type,
          landing_name: payload.landing_name,
          landing_version: payload.landing_version
        });

        if (tracking.googleAdsConversionId && tracking.googleAdsConversionLabel) {
          window.gtag('event', 'conversion', {
            send_to: `${tracking.googleAdsConversionId}/${tracking.googleAdsConversionLabel}`
          });
        }
      }

      if (window.fbq) {
        window.fbq('track', tracking.metaEventName || 'Lead', {
          content_name: payload.landing_name,
          content_category: 'WhatsApp lead',
          landing_version: payload.landing_version
        });
      }
    }
  };

  if (hasConsent()) {
    initTracking();
  }
})();
