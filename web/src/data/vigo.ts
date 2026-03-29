export interface VigoSection {
  id: string;
  title: { es: string; en: string; gl: string };
  content: { es: string; en: string; gl: string };
  items: { name: string; description: { es: string; en: string; gl: string } }[];
}

export const vigoSections: VigoSection[] = [
  {
    id: 'neighborhoods',
    title: { es: 'Barrios', en: 'Neighborhoods', gl: 'Barrios' },
    content: {
      es: 'Vigo tiene barrios con personalidad propia, cada uno con su encanto.',
      en: 'Vigo has neighborhoods with their own personality, each with its charm.',
      gl: 'Vigo ten barrios con personalidade propia, cada un co seu encanto.',
    },
    items: [
      { name: 'Centro / Gran Vía', description: { es: 'Zona comercial y de negocios, bien conectada por transporte público.', en: 'Commercial and business area, well connected by public transport.', gl: 'Zona comercial e de negocios, ben conectada por transporte público.' } },
      { name: 'Casco Vello', description: { es: 'El barrio histórico con calles empedradas, bares de tapas y ambiente bohemio.', en: 'The historic quarter with cobblestone streets, tapas bars, and bohemian vibe.', gl: 'O barrio histórico con rúas empedradas, bares de tapas e ambiente bohemio.' } },
      { name: 'Bouzas', description: { es: 'Barrio marinero tradicional con acceso directo al mar y ambiente familiar.', en: 'Traditional fishing neighborhood with direct sea access and family atmosphere.', gl: 'Barrio mariñeiro tradicional con acceso directo ao mar e ambiente familiar.' } },
      { name: 'Navia', description: { es: 'Zona residencial tranquila cerca de la universidad y zonas verdes.', en: 'Quiet residential area near the university and green spaces.', gl: 'Zona residencial tranquila preto da universidade e zonas verdes.' } },
    ],
  },
  {
    id: 'beaches',
    title: { es: 'Playas', en: 'Beaches', gl: 'Praias' },
    content: {
      es: 'Vigo cuenta con algunas de las mejores playas urbanas de España.',
      en: 'Vigo has some of the best urban beaches in Spain.',
      gl: 'Vigo conta con algunhas das mellores praias urbanas de España.',
    },
    items: [
      { name: 'Playa de Samil', description: { es: 'La playa más grande y popular de Vigo, con paseo marítimo y piscinas.', en: 'The largest and most popular beach in Vigo, with promenade and pools.', gl: 'A praia máis grande e popular de Vigo, con paseo marítimo e piscinas.' } },
      { name: 'Playa de Vao', description: { es: 'Playa familiar con aguas tranquilas y zona de juegos infantiles.', en: 'Family beach with calm waters and playground area.', gl: 'Praia familiar con augas tranquilas e zona de xogos infantís.' } },
      { name: 'Islas Cíes', description: { es: 'Parque natural con playas paradisíacas, accesible en barco desde Vigo.', en: 'Natural park with paradise beaches, accessible by boat from Vigo.', gl: 'Parque natural con praias paradisíacas, accesible en barco desde Vigo.' } },
    ],
  },
  {
    id: 'transport',
    title: { es: 'Transporte', en: 'Transport', gl: 'Transporte' },
    content: {
      es: 'Vigo está bien conectada por tierra, mar y aire.',
      en: 'Vigo is well connected by land, sea, and air.',
      gl: 'Vigo está ben conectada por terra, mar e aire.',
    },
    items: [
      { name: 'Autobuses urbanos', description: { es: 'Red de Vitrasa con cobertura por toda la ciudad. Tarjeta TUI para descuentos.', en: 'Vitrasa network covering the whole city. TUI card for discounts.', gl: 'Rede de Vitrasa con cobertura por toda a cidade. Tarxeta TUI para descontos.' } },
      { name: 'Tren', description: { es: 'Estación Urzáiz con conexiones a Santiago, Ourense, Porto y Madrid.', en: 'Urzáiz station with connections to Santiago, Ourense, Porto, and Madrid.', gl: 'Estación Urzáiz con conexións a Santiago, Ourense, Porto e Madrid.' } },
      { name: 'Aeropuerto', description: { es: 'Aeropuerto de Vigo-Peinador con vuelos nacionales e internacionales.', en: 'Vigo-Peinador airport with domestic and international flights.', gl: 'Aeroporto de Vigo-Peinador con voos nacionais e internacionais.' } },
    ],
  },
  {
    id: 'gastronomy',
    title: { es: 'Gastronomía', en: 'Gastronomy', gl: 'Gastronomía' },
    content: {
      es: 'Vigo es la capital del marisco y la cocina gallega.',
      en: 'Vigo is the capital of seafood and Galician cuisine.',
      gl: 'Vigo é a capital do marisco e a cociña galega.',
    },
    items: [
      { name: 'Rúa de las Ostras', description: { es: 'Famosa calle donde degustar ostras frescas de la ría.', en: 'Famous street to taste fresh oysters from the estuary.', gl: 'Famosa rúa onde degustar ostras frescas da ría.' } },
      { name: 'Mercado da Pedra', description: { es: 'Mercado tradicional con productos frescos del mar y la tierra.', en: 'Traditional market with fresh products from sea and land.', gl: 'Mercado tradicional con produtos frescos do mar e da terra.' } },
      { name: 'Tapas en el Casco Vello', description: { es: 'Decenas de bares con tapas y raciones a precios populares.', en: 'Dozens of bars with tapas and portions at popular prices.', gl: 'Decenas de bares con tapas e racións a prezos populares.' } },
    ],
  },
];
