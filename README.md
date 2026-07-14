# Köşe Dünyası Tanıtım Landing Page

Prod-ready static product introduction page for `magazamiz.kosedunyasi.com`.

Purpose:
- Present Köşe Dünyası’s özel ölçü köşe koltuk models with a fast, visual page.
- Turn paid, direct and social traffic into qualified WhatsApp conversations.
- Keep the existing WordPress site at `kosedunyasi.com` unchanged.
- Use one primary conversion event: `whatsapp_click`.
- Deploy on Cloudflare Pages or any static host.

## 1. Folder structure

```txt
index.html
privacy.html
cookies.html
404.html
_headers
_redirects
robots.txt
sitemap.xml
assets/
  banners/
  icons/
css/styles.css
js/config.js
js/tracking.js
js/main.js
docs/
```

## 2. Visual assets

The page uses exported banner visuals from:

```txt
assets/banners/banner_1.webp
assets/banners/banner_2.webp
assets/banners/banner_3.webp
assets/banners/banner_4.webp
assets/banners/banner_5.webp
assets/banners/banner_6.webp
assets/banners/banner_7.webp
```

Recommended export settings:
- Main banners: `1080x1920` WebP
- Keep each file as light as the final visual quality allows
- Keep filenames stable unless you also update `index.html`

## 3. WhatsApp and tracking

Open:

```txt
js/config.js
```

Current WhatsApp phone:

```js
phone: '905357830014'
```

Before launch, set your real GTM ID if you use Google Tag Manager:

```js
gtmId: 'GTM-XXXXXXX'
```

Recommended production setup: manage GA4, Google Ads and Meta Pixel from GTM, then leave direct GA4 / Meta / Google Ads fields empty.

## 4. Conversion event

The main event is:

```txt
whatsapp_click
```

WhatsApp buttons fire:
- GTM `dataLayer` event: `whatsapp_click`
- GA4 event if direct GA4 is configured
- Meta `Lead` if direct Meta Pixel is configured
- Google Ads conversion if direct conversion fields are configured

Default page classification:

```txt
page_type: product_intro_landing
landing_name: kose-dunyasi-tanitim
```

## 5. Cloudflare Pages Deployment

**Project name:** `kosedunyasi-magazamiz`
**Production custom domain:** `magazamiz.kosedunyasi.com`

| Setting | Value |
|---|---|
| Package manager | bun |
| Build command | `bun run build` |
| Build output directory | `dist` |
| Framework preset | None |

### Local preview

```bash
bun run dev:pages
```

### Deploy

```bash
bun run deploy:pages
```

### Environment variables

None required. All configuration is client-side in `js/config.js`.

### Cloudflare Pages dashboard

1. Create project `kosedunyasi-magazamiz`.
2. Set build command: `bun run build`
3. Set build output directory: `dist`
4. Add custom domain: `magazamiz.kosedunyasi.com`

## 6. Before going live

Checklist:

- [ ] Confirm WhatsApp phone in `js/config.js`.
- [ ] Set GTM ID in `js/config.js`, or intentionally leave tracking direct fields empty.
- [ ] Confirm `sitemap.xml`, canonical and OG URLs match the production host.
- [ ] Test mobile rendering on iPhone Safari and Android Chrome.
- [ ] Test WhatsApp click opens the prefilled message.
- [ ] Test cookie consent behavior.
- [ ] Test GTM Preview, GA4 DebugView, Meta Pixel Helper and Google Ads conversion if used.
- [ ] Check final banner file sizes after image export.

## 7. Google Ads final URL

Use the static page directly as final URL:

```txt
https://magazamiz.kosedunyasi.com/?utm_source=google&utm_medium=cpc&utm_campaign=kose_koltuk_tanitim&utm_content={creative}&utm_term={keyword}
```

Do not send ad traffic through WordPress redirects before this page.

## 8. Production notes

- Keep the main WordPress site on `kosedunyasi.com`.
- Use this page as a focused tanıtım and WhatsApp lead experience.
- Keep HTML CTA targets limited so conversion attribution stays clean.
- Banner text is visual support; indexable SEO copy lives in `index.html` metadata, visible intro copy, alt text and JSON-LD.
