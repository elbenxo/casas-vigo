# Task Group: Web SEO & GEO

Make the Astro web (web/) SEO and GEO (Generative Engine Optimization) compatible.

## Completed
_(none yet)_

## In Progress
_(none yet)_

## Pending

### SEO
- [ ] Add dynamic meta descriptions per page (flat name, location, price range) — high
- [ ] Add Schema.org JSON-LD structured data (Accommodation, LocalBusiness, BreadcrumbList) — high
- [ ] Create dynamic sitemap.xml — high
- [ ] Add robots.txt — high
- [ ] Add Open Graph tags (og:title, og:image, og:description) for social sharing — medium
- [ ] Add Twitter Card tags — low
- [ ] Add canonical URLs per page — medium
- [ ] Add hreflang tags for multilingual pages (es/en/gl) — high
- [ ] Optimize image alt texts for SEO — medium

### GEO (Generative Engine Optimization)
- [ ] Create llms.txt at site root (machine-readable site summary for AI crawlers) — high
- [ ] Add llms-full.txt with complete property data in structured format — high
- [ ] Ensure clean semantic HTML (headings hierarchy, landmarks) — medium
- [ ] Add FAQ section with common questions (optimizes for AI answer extraction) — medium
- [ ] Ensure all property data is in parseable text, not just images — high
- [ ] Add structured pricing tables in HTML (not just visual) — medium

### Availability Display
- [ ] Web reads from data/availability.json to show dates — high
- [ ] Build component showing "Available from [date]" or "Occupied until [date]" per room — high
- [ ] Script to rebuild/push web when availability.json changes — medium

### Contact
- [ ] Replace Formspree placeholder with WhatsApp link to sales agent — high
- [ ] Replace placeholder phone/email with real contact info — high
- [ ] Update astro.config.mjs site URL — medium
