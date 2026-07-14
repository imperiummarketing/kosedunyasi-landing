# Image Replacement Guide

## Main rule

Keep the same filenames and dimensions where possible. Replace placeholder files in:

```txt
assets/banners/
```

## Recommended export settings

Main banners:

```txt
Format: WebP
Size: 1080x1920
Target weight: keep each file as light as the final visual quality allows
```

## Current banner order

1. `banner_1.webp`
2. `banner_2.webp`
3. `banner_3.webp`
4. `banner_4.webp`
5. `banner_5.webp`
6. `banner_6.webp`
7. `banner_7.webp`

## If you want to remove a banner

Remove the corresponding `<section>` block from `index.html`.

## If you want to add a banner

1. Add the image into `assets/banners/`.
2. Copy a `<section class="banner-section">` block in `index.html`.
3. Update the image path, width, height and alt text.
