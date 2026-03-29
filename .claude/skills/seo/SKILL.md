---
name: seo
description: SEO audit, technical SEO, on-page optimization, structured data, Core Web Vitals, and content strategy for better search visibility.
origin: ECC (everything-claude-code)
---

# SEO

Improve search visibility through technical correctness, performance, and content relevance.

## When to Use

- Auditing crawlability, indexability, canonicals, redirects
- Improving title tags, meta descriptions, heading structure
- Adding or validating structured data
- Improving Core Web Vitals
- Keyword research and URL mapping
- Internal linking or sitemap/robots changes

## Principles

1. Fix technical blockers before content optimization
2. One page = one clear primary search intent
3. Long-term quality signals over manipulation
4. Mobile-first (indexing is mobile-first)
5. Recommendations must be page-specific

## Technical SEO Checklist

### Crawlability
- `robots.txt` allows important pages
- No unintentional `noindex`
- Shallow click depth to important pages
- No redirect chains > 2 hops
- Consistent canonical tags

### Performance (Core Web Vitals)
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

### Structured Data
- Homepage: `Organization` / `LodgingBusiness`
- Room pages: `Product` + `Offer`
- Interior pages: `BreadcrumbList`
- FAQ sections: `FAQPage` (only when real Q&A)

## On-Page Rules

### Titles (50-60 chars)
```
Habitaciones en Vigo - Alquiler desde 300EUR | Casas Vigo
```

### Meta descriptions (120-160 chars)
```
Alquila una habitacion en Vigo centro desde 300 EUR/mes. 27 habitaciones amuebladas con wifi y gastos incluidos.
```

### Headings
- One clear H1
- H2/H3 reflect content hierarchy

## JSON-LD Example

```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Casas Vigo",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Alfonso XIII 9",
    "addressLocality": "Vigo",
    "postalCode": "36201",
    "addressCountry": "ES"
  },
  "priceRange": "300-400 EUR/mes"
}
```

## Multilingual SEO

- Use `hreflang` for ES, EN, GL, FR, DE, KO, PT, PL
- Each language gets its own URL path
- Canonical points to language-specific URL
- Sitemaps include all language variants

## Keyword Mapping

1. Define search intent
2. Gather keyword variants
3. Prioritize by value and competition
4. Map one keyword/theme per URL
5. Avoid cannibalization

## Anti-Patterns

| Problem | Fix |
|---|---|
| Keyword stuffing | Write for users first |
| Thin duplicate pages | Consolidate or differentiate |
| Schema for absent content | Match schema to reality |
| Generic "improve SEO" | Tie to specific pages |
