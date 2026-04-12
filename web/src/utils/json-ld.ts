import { t, type Lang } from '../i18n/translations';

export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Casas Vigo',
  description: 'Habitaciones amuebladas en alquiler en Vigo, Galicia. 5 pisos, 27 habitaciones.',
  url: 'https://elbenxo.github.io/casas-vigo/',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Alfonso XIII 9',
    addressLocality: 'Vigo',
    addressRegion: 'Galicia',
    postalCode: '36201',
    addressCountry: 'ES',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 42.2318, longitude: -8.7154 },
  priceRange: '300-400 EUR/mes',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00',
    closes: '23:00',
  },
};

const FAQ_COUNT = 6;

export function generateFaqJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Array.from({ length: FAQ_COUNT }, (_, i) => ({
      '@type': 'Question',
      name: t(lang, `faq.q${i + 1}` as keyof typeof import('../i18n/translations').translations['es']),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(lang, `faq.a${i + 1}` as keyof typeof import('../i18n/translations').translations['es']),
      },
    })),
  };
}

export function generateHomeJsonLd(lang: Lang) {
  return [localBusinessJsonLd, generateFaqJsonLd(lang)];
}
