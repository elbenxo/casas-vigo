import type { I18nText } from '../i18n/translations';

export interface VigoSection {
  id: string;
  title: I18nText;
  content: I18nText;
  items: { name: string; description: I18nText }[];
}

export const vigoSections: VigoSection[] = [
  {
    id: 'neighborhoods',
    title: { es: 'Barrios', en: 'Neighborhoods', gl: 'Barrios', fr: 'Quartiers', de: 'Stadtteile', ko: '동네', pt: 'Bairros', pl: 'Dzielnice' },
    content: {
      es: 'Vigo tiene barrios con personalidad propia, cada uno con su encanto.',
      en: 'Vigo has neighborhoods with their own personality, each with its charm.',
      gl: 'Vigo ten barrios con personalidade propia, cada un co seu encanto.',
      fr: 'Vigo a des quartiers avec une personnalité propre, chacun avec son charme.',
      de: 'Vigo hat Stadtviertel mit eigener Persönlichkeit, jedes mit seinem Charme.',
      ko: '비고에는 각각 고유한 매력을 지닌 개성 있는 동네들이 있습니다.',
      pt: 'Vigo tem bairros com personalidade própria, cada um com o seu encanto.',
      pl: 'Vigo ma dzielnice z własną osobowością, każda ze swoim urokiem.',
    },
    items: [
      { name: 'Centro / Gran Vía', description: { es: 'Zona comercial y de negocios, bien conectada por transporte público.', en: 'Commercial and business area, well connected by public transport.', gl: 'Zona comercial e de negocios, ben conectada por transporte público.', fr: 'Zone commerciale et d\'affaires, bien desservie par les transports en commun.', de: 'Geschäfts- und Handelsviertel, gut angebunden an den öffentlichen Nahverkehr.', ko: '상업 및 비즈니스 지구로 대중교통이 잘 연결되어 있습니다.', pt: 'Zona comercial e de negócios, bem conectada por transportes públicos.', pl: 'Strefa handlowa i biznesowa, dobrze skomunikowana transportem publicznym.' } },
      { name: 'Casco Vello', description: { es: 'El barrio histórico con calles empedradas, bares de tapas y ambiente bohemio.', en: 'The historic quarter with cobblestone streets, tapas bars, and bohemian vibe.', gl: 'O barrio histórico con rúas empedradas, bares de tapas e ambiente bohemio.', fr: 'Le quartier historique avec des rues pavées, des bars à tapas et une ambiance bohème.', de: 'Das historische Viertel mit Kopfsteinpflasterstraßen, Tapas-Bars und Bohème-Atmosphäre.', ko: '자갈길, 타파스 바, 보헤미안 분위기가 있는 역사적인 구시가지입니다.', pt: 'O bairro histórico com ruas de calçada, bares de tapas e ambiente boémio.', pl: 'Historyczna dzielnica z brukowanymi uliczkami, barami tapas i artystyczną atmosferą.' } },
      { name: 'Bouzas', description: { es: 'Barrio marinero tradicional con acceso directo al mar y ambiente familiar.', en: 'Traditional fishing neighborhood with direct sea access and family atmosphere.', gl: 'Barrio mariñeiro tradicional con acceso directo ao mar e ambiente familiar.', fr: 'Quartier de pêcheurs traditionnel avec accès direct à la mer et ambiance familiale.', de: 'Traditionelles Fischerviertel mit direktem Meerzugang und familiärer Atmosphäre.', ko: '바다에 직접 접근할 수 있는 전통 어촌 마을로 가족적인 분위기입니다.', pt: 'Bairro piscatório tradicional com acesso direto ao mar e ambiente familiar.', pl: 'Tradycyjna dzielnica rybacka z bezpośrednim dostępem do morza i rodzinną atmosferą.' } },
      { name: 'Navia', description: { es: 'Zona residencial tranquila cerca de la universidad y zonas verdes.', en: 'Quiet residential area near the university and green spaces.', gl: 'Zona residencial tranquila preto da universidade e zonas verdes.', fr: 'Zone résidentielle calme près de l\'université et des espaces verts.', de: 'Ruhige Wohngegend nahe der Universität und Grünflächen.', ko: '대학교와 녹지 공간 근처의 조용한 주거 지역입니다.', pt: 'Zona residencial tranquila perto da universidade e espaços verdes.', pl: 'Spokojna dzielnica mieszkaniowa blisko uniwersytetu i terenów zielonych.' } },
    ],
  },
  {
    id: 'beaches',
    title: { es: 'Playas', en: 'Beaches', gl: 'Praias', fr: 'Plages', de: 'Strände', ko: '해변', pt: 'Praias', pl: 'Plaże' },
    content: {
      es: 'Vigo cuenta con algunas de las mejores playas urbanas de España.',
      en: 'Vigo has some of the best urban beaches in Spain.',
      gl: 'Vigo conta con algunhas das mellores praias urbanas de España.',
      fr: 'Vigo compte certaines des meilleures plages urbaines d\'Espagne.',
      de: 'Vigo hat einige der besten Stadtstrände Spaniens.',
      ko: '비고에는 스페인 최고의 도시 해변이 있습니다.',
      pt: 'Vigo conta com algumas das melhores praias urbanas de Espanha.',
      pl: 'Vigo ma jedne z najlepszych plaż miejskich w Hiszpanii.',
    },
    items: [
      { name: 'Playa de Samil', description: { es: 'La playa más grande y popular de Vigo, con paseo marítimo y piscinas.', en: 'The largest and most popular beach in Vigo, with promenade and pools.', gl: 'A praia máis grande e popular de Vigo, con paseo marítimo e piscinas.', fr: 'La plus grande et la plus populaire plage de Vigo, avec promenade et piscines.', de: 'Der größte und beliebteste Strand von Vigo, mit Strandpromenade und Schwimmbädern.', ko: '비고에서 가장 크고 인기 있는 해변으로, 산책로와 수영장이 있습니다.', pt: 'A maior e mais popular praia de Vigo, com passeio marítimo e piscinas.', pl: 'Największa i najpopularniejsza plaża w Vigo, z promenadą i basenami.' } },
      { name: 'Playa de Vao', description: { es: 'Playa familiar con aguas tranquilas y zona de juegos infantiles.', en: 'Family beach with calm waters and playground area.', gl: 'Praia familiar con augas tranquilas e zona de xogos infantís.', fr: 'Plage familiale avec eaux calmes et aire de jeux pour enfants.', de: 'Familienstrand mit ruhigem Wasser und Kinderspielplatz.', ko: '잔잔한 바다와 어린이 놀이터가 있는 가족 해변입니다.', pt: 'Praia familiar com águas calmas e zona de jogos infantis.', pl: 'Rodzinna plaża ze spokojną wodą i placem zabaw dla dzieci.' } },
      { name: 'Islas Cíes', description: { es: 'Parque natural con playas paradisíacas, accesible en barco desde Vigo.', en: 'Natural park with paradise beaches, accessible by boat from Vigo.', gl: 'Parque natural con praias paradisíacas, accesible en barco desde Vigo.', fr: 'Parc naturel avec des plages paradisiaques, accessible en bateau depuis Vigo.', de: 'Naturpark mit paradiesischen Stränden, erreichbar per Boot von Vigo.', ko: '비고에서 보트로 갈 수 있는 천국 같은 해변이 있는 자연공원입니다.', pt: 'Parque natural com praias paradisíacas, acessível de barco desde Vigo.', pl: 'Park przyrodniczy z rajskimi plażami, dostępny łodzią z Vigo.' } },
    ],
  },
  {
    id: 'transport',
    title: { es: 'Transporte', en: 'Transport', gl: 'Transporte', fr: 'Transport', de: 'Verkehr', ko: '교통', pt: 'Transportes', pl: 'Transport' },
    content: {
      es: 'Vigo está bien conectada por tierra, mar y aire.',
      en: 'Vigo is well connected by land, sea, and air.',
      gl: 'Vigo está ben conectada por terra, mar e aire.',
      fr: 'Vigo est bien desservie par terre, mer et air.',
      de: 'Vigo ist gut angebunden über Land, See und Luft.',
      ko: '비고는 육상, 해상, 항공으로 잘 연결되어 있습니다.',
      pt: 'Vigo está bem conectada por terra, mar e ar.',
      pl: 'Vigo jest dobrze skomunikowane drogą lądową, morską i powietrzną.',
    },
    items: [
      { name: 'Autobuses urbanos', description: { es: 'Red de Vitrasa con cobertura por toda la ciudad. Tarjeta TUI para descuentos.', en: 'Vitrasa network covering the whole city. TUI card for discounts.', gl: 'Rede de Vitrasa con cobertura por toda a cidade. Tarxeta TUI para descontos.', fr: 'Réseau Vitrasa couvrant toute la ville. Carte TUI pour les réductions.', de: 'Vitrasa-Netz mit Abdeckung der ganzen Stadt. TUI-Karte für Ermäßigungen.', ko: '도시 전역을 커버하는 Vitrasa 버스 네트워크. TUI 카드로 할인 가능.', pt: 'Rede Vitrasa com cobertura por toda a cidade. Cartão TUI para descontos.', pl: 'Sieć Vitrasa pokrywająca całe miasto. Karta TUI na zniżki.' } },
      { name: 'Tren', description: { es: 'Estación Urzáiz con conexiones a Santiago, Ourense, Porto y Madrid.', en: 'Urzáiz station with connections to Santiago, Ourense, Porto, and Madrid.', gl: 'Estación Urzáiz con conexións a Santiago, Ourense, Porto e Madrid.', fr: 'Gare Urzáiz avec connexions vers Santiago, Ourense, Porto et Madrid.', de: 'Bahnhof Urzáiz mit Verbindungen nach Santiago, Ourense, Porto und Madrid.', ko: 'Urzáiz역에서 Santiago, Ourense, Porto, Madrid로 연결됩니다.', pt: 'Estação Urzáiz com ligações a Santiago, Ourense, Porto e Madrid.', pl: 'Dworzec Urzáiz z połączeniami do Santiago, Ourense, Porto i Madrytu.' } },
      { name: 'Aeropuerto', description: { es: 'Aeropuerto de Vigo-Peinador con vuelos nacionales e internacionales.', en: 'Vigo-Peinador airport with domestic and international flights.', gl: 'Aeroporto de Vigo-Peinador con voos nacionais e internacionais.', fr: 'Aéroport de Vigo-Peinador avec des vols nationaux et internationaux.', de: 'Flughafen Vigo-Peinador mit nationalen und internationalen Flügen.', ko: '국내선 및 국제선이 운항하는 Vigo-Peinador 공항.', pt: 'Aeroporto de Vigo-Peinador com voos nacionais e internacionais.', pl: 'Lotnisko Vigo-Peinador z lotami krajowymi i międzynarodowymi.' } },
    ],
  },
  {
    id: 'gastronomy',
    title: { es: 'Gastronomía', en: 'Gastronomy', gl: 'Gastronomía', fr: 'Gastronomie', de: 'Gastronomie', ko: '미식', pt: 'Gastronomia', pl: 'Gastronomia' },
    content: {
      es: 'Vigo es la capital del marisco y la cocina gallega.',
      en: 'Vigo is the capital of seafood and Galician cuisine.',
      gl: 'Vigo é a capital do marisco e a cociña galega.',
      fr: 'Vigo est la capitale des fruits de mer et de la cuisine galicienne.',
      de: 'Vigo ist die Hauptstadt der Meeresfrüchte und der galicischen Küche.',
      ko: '비고는 해산물과 갈리시아 요리의 수도입니다.',
      pt: 'Vigo é a capital do marisco e da cozinha galega.',
      pl: 'Vigo to stolica owoców morza i kuchni galicyjskiej.',
    },
    items: [
      { name: 'Rúa de las Ostras', description: { es: 'Famosa calle donde degustar ostras frescas de la ría.', en: 'Famous street to taste fresh oysters from the estuary.', gl: 'Famosa rúa onde degustar ostras frescas da ría.', fr: 'Rue célèbre pour déguster des huîtres fraîches de la ria.', de: 'Berühmte Straße zum Probieren frischer Austern aus der Bucht.', ko: '하구에서 잡은 신선한 굴을 맛볼 수 있는 유명한 거리입니다.', pt: 'Rua famosa para degustar ostras frescas da ria.', pl: 'Słynna ulica, gdzie można kosztować świeżych ostryg z zatoki.' } },
      { name: 'Mercado da Pedra', description: { es: 'Mercado tradicional con productos frescos del mar y la tierra.', en: 'Traditional market with fresh products from sea and land.', gl: 'Mercado tradicional con produtos frescos do mar e da terra.', fr: 'Marché traditionnel avec des produits frais de la mer et de la terre.', de: 'Traditioneller Markt mit frischen Produkten von Meer und Land.', ko: '바다와 육지의 신선한 제품을 판매하는 전통 시장입니다.', pt: 'Mercado tradicional com produtos frescos do mar e da terra.', pl: 'Tradycyjny targ ze świeżymi produktami z morza i lądu.' } },
      { name: 'Tapas en el Casco Vello', description: { es: 'Decenas de bares con tapas y raciones a precios populares.', en: 'Dozens of bars with tapas and portions at popular prices.', gl: 'Decenas de bares con tapas e racións a prezos populares.', fr: 'Des dizaines de bars avec tapas et portions à prix populaires.', de: 'Dutzende Bars mit Tapas und Portionen zu günstigen Preisen.', ko: '합리적인 가격의 타파스와 라시온을 제공하는 수십 개의 바가 있습니다.', pt: 'Dezenas de bares com tapas e rações a preços populares.', pl: 'Dziesiątki barów z tapas i porcjami w przystępnych cenach.' } },
    ],
  },
];
