# Tracking Setup

## Main conversion

```txt
Event name: whatsapp_click
```

This event fires when a visitor clicks any WhatsApp CTA.

## Recommended setup

Use GTM as the single control point:

```txt
js/config.js -> tracking.gtmId = 'GTM-XXXXXXX'
```

Then configure inside GTM:

1. GA4 Configuration tag
2. GA4 Event tag: `whatsapp_click`
3. Google Ads Conversion tag
4. Meta Pixel base code
5. Meta Lead event on `whatsapp_click`

## dataLayer event payload

The page pushes an event similar to:

```js
{
  event: 'whatsapp_click',
  page_type: 'product_intro_landing',
  landing_name: 'kose-dunyasi-tanitim',
  landing_version: 'v1.0.0',
  traffic_target: 'google_ads',
  hostname: 'magazamiz.kosedunyasi.com',
  page_location: 'https://magazamiz.kosedunyasi.com/...',
  cta_text: 'WhatsApp’tan ölçü danış',
  cta_location: 'sticky_bottom'
}
```

## GA4

Create a custom event / mark as key event:

```txt
whatsapp_click
```

Useful GA4 dimensions:

```txt
page_type
landing_name
landing_version
cta_location
hostname
source / medium
utm_campaign
```

## Meta

Recommended Meta event:

```txt
Lead
```

Trigger it from the same `whatsapp_click` dataLayer event.

## Google Ads

Create a conversion action:

```txt
WhatsApp Click - Köşe Dünyası Tanıtım
```

Trigger it from `whatsapp_click`.

## Testing checklist

- GTM Preview shows `whatsapp_click`.
- GA4 DebugView receives `whatsapp_click`.
- Meta Pixel Helper shows Lead.
- Google Tag Assistant shows Google Ads conversion tag firing.
- Click opens WhatsApp with the prefilled message.
