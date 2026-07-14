/**
 * Köşe Dünyası introduction landing configuration.
 */
window.KD_CONFIG = {
  site: {
    landingName: "kose-dunyasi-tanitim",
    landingVersion: "v1.0.0",
    canonicalUrl: "https://magazamiz.kosedunyasi.com/",
    businessName: "Köşe Dünyası",
  },

  whatsapp: {
    phone: "905357830014",
    message: `Merhaba, Köşe Dünyası tanıtım sayfasından geldim.
    Salon ölçümü paylaşarak bana uygun köşe koltuk modelleri, kumaş seçenekleri ve fiyat bilgisi almak istiyorum.

    Salon ölçüm:
    Renk tercihim:
    Sağ / sol köşe:
    Yataklı / sandıklı olsun mu:
    Bulunduğum şehir:`,
  },

  tracking: {
    /** Recommended: manage GA4, Google Ads and Meta Pixel from GTM. */
    gtmId: "GTM-XXXXXXX",

    /** Optional direct installs. Leave empty if using GTM only. */
    ga4MeasurementId: "",
    metaPixelId: "",

    /** Optional direct Google Ads conversion. Example send_to becomes AW-XXXXXXX/YYYYYYY */
    googleAdsConversionId: "",
    googleAdsConversionLabel: "",

    eventName: "whatsapp_click",
    metaEventName: "Lead",
    pageType: "product_intro_landing",
    trafficTarget: "google_ads",
  },

  consent: {
    /** Disabled because the landing page intentionally has no visible text outside the WhatsApp CTA. */
    enabled: false,
    /** If true, tracking scripts load only after user accepts. */
    requireConsentForTracking: false,
    storageKey: "kd_cookie_consent_v1",
  },
};
