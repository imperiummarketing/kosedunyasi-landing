# Cloudflare Pages Deployment Guide

## Recommended architecture

```txt
kosedunyasi.com              -> existing WordPress site
www.kosedunyasi.com          -> existing WordPress site
magazamiz.kosedunyasi.com     -> Cloudflare Pages static landing page
```

## Step-by-step

1. Create a Cloudflare Pages project.
2. Project name suggestion: `kosedunyasi-tanitim`.
3. Upload the project folder or connect a GitHub repo.
4. Use no build command.
5. Set output directory to `/` if asked.
6. Test the default `*.pages.dev` URL.
7. Add the custom domain configured in `index.html` and `sitemap.xml`.
8. Make sure the DNS CNAME points to the Pages project if Cloudflare does not create it automatically.
9. Wait for SSL provisioning.
10. Test the custom domain.

## DNS notes

If the main WordPress site is not on Cloudflare DNS, do not change its A/CNAME records. Only add the subdomain record for this static page.

Typical DNS record:

```txt
Type: CNAME
Name: magazamiz
Target: kosedunyasi-magazamiz.pages.dev
```

## Cache notes

`_headers` already includes long cache for `/assets/*` and short cache for HTML. If you replace images without changing filenames, Cloudflare and browser cache may hold the old image. Preferred approach:

1. Replace file.
2. Deploy.
3. Purge Cloudflare cache, or version filenames if needed.

## Rollback

If using Git deployment, Cloudflare Pages lets you rollback to a previous deployment. If using Direct Upload, keep a local zip backup for every production deployment.
