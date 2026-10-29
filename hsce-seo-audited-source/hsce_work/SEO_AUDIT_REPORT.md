# HSCE Technical SEO Audit — 29 October 2026

## Scope
Audited the uploaded React/Vite project source, React Router route declarations, SEO metadata registry, `index.html`, `vite.config.js`, existing generated `dist` HTML, `public/robots.txt`, `public/sitemap.xml`, and Cloudflare Pages `_redirects`/`_headers` configuration. No live production crawl or Search Console access was available in this task.

## Confirmed findings

1. The project already uses `react-helmet-async` and a build-time SEO registry in `src/data/seoPages.js`.
2. The uploaded `dist` output had distinct title, description, and canonical values for the tested canonical pages: `/`, `/admissions`, `/about`, `/campus-life`, and `/book-a-tour`. Therefore, the uploaded build does **not** prove that all these canonical pages share the homepage description. Live Google snippets can lag or rewrite metadata; inspect Google URL Inspection and the live rendered HTML before attributing the indexed issue solely to source metadata.
3. The SEO registry contains 25 paths, while React Router defines 72 route entries including aliases, redirects, and the catch-all route. Some aliases are handled only by client-side navigation or render the same component; server-side redirect handling was sparse.
4. The original default Open Graph/Twitter image was the 432×432 college logo, which is not ideal for large-image previews. The project already contains a campus hero image measuring 1672×941.
5. The original homepage JSON-LD used `EducationalOrganization`, had basic organization details, but no explicit contact point or university affiliation relationship. Non-home static HTML removed the homepage JSON-LD and did not add route-specific breadcrumbs.
6. The sitemap is generated from the SEO registry and excludes entries marked `indexable: false`; `/search` is marked noindex. `robots.txt` permits crawling and points to the sitemap.
7. The uploaded archive included `.env` and `.env.local`. These files are deliberately excluded from the patched archive. If they contain real secrets or credentials, rotate/revoke them and do not share them publicly. Client-side Firebase web configuration is not the same as a service-account private key, but security rules must still be reviewed.

## Changes made in this patched source

- Improved build-time metadata generation to set route-specific title, description, robots, canonical, Open Graph, and Twitter Card tags consistently.
- Set `max-image-preview:large` for indexable routes.
- Switched the default social preview image to the existing 1672×941 campus hero image and added image dimensions/alt metadata.
- Added static `BreadcrumbList` JSON-LD to generated non-home pages.
- Added `Course` JSON-LD for the B.Ed. course and admissions landing pages, without ratings or invented fee data.
- Updated homepage institutional schema to `CollegeOrUniversity` and added verified-in-project contact details plus the GGSIPU affiliation relationship.
- Added Cloudflare Pages 301 redirects for known legacy/alias routes that should resolve to their canonical equivalents.
- Updated the starter robots directive to permit large image previews.

## Validation status and limitations

- `node --check vite.config.js`: passed.
- Production build: **not completed**. The uploaded `node_modules` is missing Vite/Rolldown's platform-specific optional native binding, and the build fails before application compilation. Reinstall dependencies from the lockfile in a clean environment (for example, remove `node_modules`, then run `npm ci`) before deploying.
- No production deployment, live HTTP status checks, Google Search Console inspection, Rich Results Test, or external schema validation was performed.
- The default social image is a local campus image, not a Cloudinary-transformed URL. It meets the width target based on the source asset dimensions, but confirm the deployed URL returns HTTP 200 and the image is visually appropriate.
- Verify the university affiliation and every institutional approval statement against current official records before relying on them as factual claims.

## Before deployment

1. Review the changes and confirm redirect targets.
2. Run `npm ci`, `npm run build`, and `npm run lint` in a clean environment.
3. Inspect generated HTML for `/`, `/admissions`, `/admissions/eligibility`, `/admissions/procedure`, `/course`, `/mandatory-disclosure`, and `/gallery`.
4. Validate JSON-LD with Google's Rich Results Test and a Schema.org validator.
5. Deploy to Cloudflare Pages and confirm nested URLs, canonical tags, social image URLs, `robots.txt`, and `sitemap.xml` return correctly.
6. Use Google Search Console URL Inspection and request indexing only after the live pages are correct.
