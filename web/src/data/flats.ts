import availabilityData from './availability.json';
import type { I18nText } from '../i18n/translations';

export interface Review {
  name: string;
  text: I18nText;
}

export interface Room {
  id: string;
  name: I18nText;
  price: number;
  available: boolean;
  size: string;
  features: string[];
  images: string[];
}

export interface Flat {
  slug: string;
  name: I18nText;
  address: string;
  neighborhood: I18nText;
  description: I18nText;
  image: string;
  images: string[];
  rooms: Room[];
  amenities: string[];
  coordinates: { lat: number; lng: number };
  reviews: Review[];
}

const IMG = '/casas-vigo/images';

export const flats: Flat[] = [
  // ─────────────────────────────────────────────
  // 1. IRMANDIÑOS (Rúa Irmandiños 23)
  // ─────────────────────────────────────────────
  {
    slug: 'irmandinhos',
    name: {
      es: 'Piso Rúa Irmandiños',
      en: 'Rúa Irmandiños Flat',
      gl: 'Piso Rúa Irmandiños',
      fr: 'Appartement Rúa Irmandiños',
      de: 'Wohnung Rúa Irmandiños',
      ko: 'Rúa Irmandiños 아파트',
      pt: 'Apartamento Rúa Irmandiños',
      pl: 'Mieszkanie Rúa Irmandiños',
    },
    address: 'Rúa Irmandiños 23, Vigo',
    neighborhood: { es: 'Casco Urbano', en: 'City Center', gl: 'Casco Urbano', fr: 'Centre-ville', de: 'Stadtzentrum', ko: '시내 중심', pt: 'Centro da Cidade', pl: 'Centrum Miasta' },
    description: {
      es: 'Espectacular piso reformado a estrenar en una de las mejores calles de Vigo. Amplias habitaciones con luz natural todo el día, acabados de primera calidad y una distribución perfecta para compartir. Zona tranquila y residencial pero a cinco minutos andando del centro y de todos los servicios. Sin duda, nuestra joya.',
      en: 'Spectacular newly renovated flat on one of the best streets in Vigo. Spacious rooms with natural light all day, top-quality finishes, and a perfect layout for sharing. A quiet residential area just five minutes on foot from the city center and all amenities. Without a doubt, our crown jewel.',
      gl: 'Espectacular piso reformado a estrear nunha das mellores rúas de Vigo. Amplas habitacións con luz natural todo o día, acabados de primeira calidade e unha distribución perfecta para compartir. Zona tranquila e residencial pero a cinco minutos andando do centro e de todos os servizos. Sen dúbida, a nosa xoia.',
      fr: 'Spectaculaire appartement rénové à étrenner dans l\'une des meilleures rues de Vigo. Chambres spacieuses avec lumière naturelle toute la journée, finitions de première qualité et une distribution parfaite pour la colocation. Quartier calme et résidentiel mais à cinq minutes à pied du centre et de tous les services. Sans aucun doute, notre joyau.',
      de: 'Spektakuläre neu renovierte Wohnung in einer der besten Straßen von Vigo. Geräumige Zimmer mit Tageslicht den ganzen Tag, erstklassige Ausstattung und eine perfekte Aufteilung zum Teilen. Ruhige Wohngegend, nur fünf Gehminuten vom Zentrum und allen Einrichtungen entfernt. Zweifellos unser Juwel.',
      ko: '비고 최고의 거리 중 하나에 위치한 새로 리노베이션한 멋진 아파트입니다. 하루 종일 자연광이 들어오는 넓은 방, 최고급 마감재, 공유에 완벽한 구조. 조용한 주거 지역이지만 도심과 모든 편의시설까지 도보 5분. 의심할 여지 없이 우리의 보석입니다.',
      pt: 'Espetacular apartamento renovado a estrear numa das melhores ruas de Vigo. Quartos espaçosos com luz natural o dia todo, acabamentos de primeira qualidade e uma distribuição perfeita para partilhar. Zona tranquila e residencial mas a cinco minutos a pé do centro e de todos os serviços. Sem dúvida, a nossa jóia.',
      pl: 'Spektakularnie odnowione mieszkanie na jednej z najlepszych ulic Vigo. Przestronne pokoje z naturalnym światłem przez cały dzień, wykończenie najwyższej jakości i idealny układ do współdzielenia. Spokojna dzielnica mieszkaniowa, zaledwie pięć minut pieszo od centrum i wszystkich udogodnień. Bez wątpienia nasza perła.',
    },
    image: `${IMG}/irmandinhos/hab-otono-1.jpg`,
    images: [
      `${IMG}/irmandinhos/hab-otono-1.jpg`,
      `${IMG}/irmandinhos/hab-primavera-1.jpg`,
      `${IMG}/irmandinhos/cocina.jpg`,
      `${IMG}/irmandinhos/bano.jpg`,
      `${IMG}/irmandinhos/cocina-2.jpg`,
      `${IMG}/irmandinhos/cocina-3.jpg`,
    ],
    rooms: [
      {
        id: 'ir-primavera',
        name: { es: 'Habitación Primavera', en: 'Spring Room', gl: 'Habitación Primavera', fr: 'Chambre Printemps', de: 'Zimmer Frühling', ko: '봄 객실', pt: 'Quarto Primavera', pl: 'Pokój Wiosna' },
        price: 380, available: true, size: '14m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado', 'Lámpara de araña'],
        images: [`${IMG}/irmandinhos/hab-primavera-1.jpg`, `${IMG}/irmandinhos/hab-primavera-2.jpg`],
      },
      {
        id: 'ir-verano',
        name: { es: 'Habitación Verano', en: 'Summer Room', gl: 'Habitación Verán', fr: 'Chambre Été', de: 'Zimmer Sommer', ko: '여름 객실', pt: 'Quarto Verão', pl: 'Pokój Lato' },
        price: 350, available: true, size: '12m²',
        features: ['Cama individual', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/irmandinhos/hab-verano-1.jpg`, `${IMG}/irmandinhos/hab-verano-2.jpg`],
      },
      {
        id: 'ir-otono',
        name: { es: 'Habitación Otoño', en: 'Autumn Room', gl: 'Habitación Outono', fr: 'Chambre Automne', de: 'Zimmer Herbst', ko: '가을 객실', pt: 'Quarto Outono', pl: 'Pokój Jesień' },
        price: 370, available: true, size: '13m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado', 'Lámpara de araña'],
        images: [`${IMG}/irmandinhos/hab-otono-1.jpg`, `${IMG}/irmandinhos/hab-otono-2.jpg`],
      },
      {
        id: 'ir-invierno',
        name: { es: 'Habitación Invierno', en: 'Winter Room', gl: 'Habitación Inverno', fr: 'Chambre Hiver', de: 'Zimmer Winter', ko: '겨울 객실', pt: 'Quarto Inverno', pl: 'Pokój Zima' },
        price: 340, available: true, size: '11m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/irmandinhos/hab-invierno-1.jpg`],
      },
    ],
    amenities: ['WiFi fibra', 'Cocina equipada', 'Lavadora', 'Secadora', 'Calefacción', 'Aire acondicionado', 'Ascensor', 'Trastero'],
    coordinates: { lat: 42.2365, lng: -8.7145 },
    reviews: [
      { name: 'Sofía T.', text: { es: 'El mejor piso en el que he vivido en Vigo. Las habitaciones son enormes y la reforma es impecable. Se nota que está todo hecho con cariño.', en: 'The best flat I have ever lived in in Vigo. The rooms are huge and the renovation is impeccable. You can tell everything was done with care.', gl: 'O mellor piso no que vivín en Vigo. As habitacións son enormes e a reforma é impecable. Nótase que está todo feito con cariño.', fr: 'Le meilleur appartement où j\'ai vécu à Vigo. Les chambres sont immenses et la rénovation est impeccable. On voit que tout est fait avec soin.', de: 'Die beste Wohnung, in der ich in Vigo gelebt habe. Die Zimmer sind riesig und die Renovierung ist tadellos. Man merkt, dass alles mit Liebe gemacht wurde.', ko: '비고에서 살았던 최고의 아파트입니다. 방이 넓고 리노베이션이 완벽합니다. 모든 것이 정성으로 만들어졌다는 것을 느낄 수 있습니다.', pt: 'O melhor apartamento onde vivi em Vigo. Os quartos são enormes e a renovação é impecável. Nota-se que tudo foi feito com carinho.', pl: 'Najlepsze mieszkanie, w jakim mieszkałam w Vigo. Pokoje są ogromne, a remont jest nienaganny. Widać, że wszystko zostało zrobione z miłością.' } },
      { name: 'Pablo N.', text: { es: 'Increíble relación calidad-precio. La zona es muy tranquila pero tienes todo a mano. El casero es un diez, siempre pendiente de todo.', en: 'Incredible value for money. The area is very quiet but everything is within reach. The landlord is a ten out of ten, always on top of things.', gl: 'Incrible relación calidade-prezo. A zona é moi tranquila pero tes todo a man. O caseiro é un dez, sempre pendente de todo.', fr: 'Rapport qualité-prix incroyable. Le quartier est très calme mais tout est à portée de main. Le propriétaire est au top, toujours attentif.', de: 'Unglaubliches Preis-Leistungs-Verhältnis. Die Gegend ist sehr ruhig, aber alles ist in Reichweite. Der Vermieter ist erstklassig, immer aufmerksam.', ko: '놀라운 가성비입니다. 조용한 지역이지만 모든 것이 가까이에 있습니다. 집주인이 항상 세심하게 신경 써줍니다.', pt: 'Relação qualidade-preço incrível. A zona é muito tranquila mas tem tudo à mão. O senhorio é excelente, sempre atento a tudo.', pl: 'Niesamowity stosunek jakości do ceny. Okolica jest bardzo spokojna, ale wszystko jest pod ręką. Właściciel jest świetny, zawsze uważny.' } },
      { name: 'Elena F.', text: { es: 'Vine para una estancia de 6 meses y acabé quedándome dos años. El piso tiene algo especial que te hace sentir en casa desde el primer día.', en: 'I came for a 6-month stay and ended up staying two years. The flat has something special that makes you feel at home from day one.', gl: 'Vin para unha estancia de 6 meses e acabei quedándome dous anos. O piso ten algo especial que te fai sentir na casa dende o primeiro día.', fr: 'Je suis venue pour un séjour de 6 mois et j\'ai fini par rester deux ans. L\'appartement a quelque chose de spécial qui vous fait sentir chez vous dès le premier jour.', de: 'Ich kam für einen 6-monatigen Aufenthalt und blieb am Ende zwei Jahre. Die Wohnung hat etwas Besonderes, das einem vom ersten Tag an ein Zuhause-Gefühl gibt.', ko: '6개월 체류하러 왔다가 결국 2년을 살았습니다. 이 아파트는 첫날부터 집처럼 느끼게 해주는 특별한 무언가가 있습니다.', pt: 'Vim para uma estadia de 6 meses e acabei por ficar dois anos. O apartamento tem algo especial que nos faz sentir em casa desde o primeiro dia.', pl: 'Przyjechałam na 6 miesięcy, a skończyło się na dwóch latach. Mieszkanie ma coś wyjątkowego, co sprawia, że czujesz się jak w domu od pierwszego dnia.' } },
    ],
  },

  // ─────────────────────────────────────────────
  // 2. 1º DERECHA (Alfonso XIII, 9 – 1st Right)
  // ─────────────────────────────────────────────
  {
    slug: 'alfonso-1-derecha',
    name: {
      es: 'Piso Alfonso XIII – 1º Derecha',
      en: 'Alfonso XIII Flat – 1st Right',
      gl: 'Piso Alfonso XIII – 1º Dereita',
      fr: 'Appartement Alfonso XIII – 1er Droite',
      de: 'Wohnung Alfonso XIII – 1. Rechts',
      ko: 'Alfonso XIII 아파트 – 1층 오른쪽',
      pt: 'Apartamento Alfonso XIII – 1º Direita',
      pl: 'Mieszkanie Alfonso XIII – 1. Prawe',
    },
    address: 'Alfonso XIII, 9, Vigo',
    neighborhood: { es: 'Estación AVE', en: 'HST Station Area', gl: 'Estación AVE', fr: 'Gare TGV', de: 'Hochgeschwindigkeitsbahnhof', ko: '고속철도역 지역', pt: 'Estação de Alta Velocidade', pl: 'Dworzec Szybkiej Kolei' },
    description: {
      es: 'Amplio piso de seis habitaciones en primera planta con galería acristalada y vistas a la ciudad. Decoración temática única en cada habitación, dos baños completos, salón luminoso y patio privado. A un paso de la estación de alta velocidad y del centro.',
      en: 'Spacious six-bedroom first-floor flat with a glazed gallery and city views. Each room features unique themed décor, two full bathrooms, a bright living room, and a private courtyard. Steps from the high-speed train station and the city center.',
      gl: 'Amplo piso de seis habitacións na primeira planta con galería acristalada e vistas á cidade. Decoración temática única en cada habitación, dous baños completos, salón luminoso e patio privado. A un paso da estación de alta velocidade e do centro.',
      fr: 'Spacieux appartement de six chambres au premier étage avec galerie vitrée et vues sur la ville. Décoration thématique unique dans chaque chambre, deux salles de bains complètes, salon lumineux et cour privée. À deux pas de la gare à grande vitesse et du centre-ville.',
      de: 'Geräumige Sechs-Zimmer-Wohnung im ersten Stock mit verglaster Galerie und Blick auf die Stadt. Jedes Zimmer hat ein einzigartiges Themendekor, zwei vollständige Badezimmer, ein helles Wohnzimmer und einen privaten Innenhof. Nur wenige Schritte vom Hochgeschwindigkeitsbahnhof und dem Stadtzentrum entfernt.',
      ko: '유리 갤러리와 도시 전망을 갖춘 1층 6실 넓은 아파트입니다. 각 방마다 독특한 테마 인테리어, 화장실 2개, 밝은 거실, 개인 안뜰을 갖추고 있습니다. 고속철도역과 도심에서 도보 거리입니다.',
      pt: 'Amplo apartamento de seis quartos no primeiro andar com galeria envidraçada e vistas para a cidade. Decoração temática única em cada quarto, duas casas de banho completas, sala luminosa e pátio privado. A um passo da estação de alta velocidade e do centro.',
      pl: 'Przestronne sześciopokojowe mieszkanie na pierwszym piętrze z przeszklonym balkonem i widokiem na miasto. Unikalna dekoracja tematyczna w każdym pokoju, dwie łazienki, jasny salon i prywatne patio. Kilka kroków od dworca szybkiej kolei i centrum miasta.',
    },
    image: `${IMG}/1-derecha/salon.jpg`,
    images: [
      `${IMG}/1-derecha/salon.jpg`,
      `${IMG}/1-derecha/entrada-hall.jpg`,
      `${IMG}/1-derecha/galeria-vistas.jpg`,
      `${IMG}/1-derecha/vistas-galeria.jpg`,
      `${IMG}/1-derecha/bano-grande.jpg`,
      `${IMG}/1-derecha/bano-cascada.jpg`,
      `${IMG}/1-derecha/cocina.jpg`,
      `${IMG}/1-derecha/pasillo.jpg`,
      `${IMG}/1-derecha/patio.jpg`,
    ],
    rooms: [
      {
        id: '1d-blue',
        name: { es: 'Habitación Blue', en: 'Blue Room', gl: 'Habitación Blue', fr: 'Chambre Bleue', de: 'Blaues Zimmer', ko: '블루 객실', pt: 'Quarto Azul', pl: 'Pokój Niebieski' },
        price: 350, available: true, size: '13m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/1-derecha/hab-blue.jpg`],
      },
      {
        id: '1d-bambu',
        name: { es: 'Habitación Bambú', en: 'Bamboo Room', gl: 'Habitación Bambú', fr: 'Chambre Bambou', de: 'Bambus-Zimmer', ko: '대나무 객실', pt: 'Quarto Bambu', pl: 'Pokój Bambusowy' },
        price: 330, available: true, size: '11m²',
        features: ['Cama individual', 'Escritorio', 'Armario', 'Estantería'],
        images: [`${IMG}/1-derecha/hab-bambu.jpg`],
      },
      {
        id: '1d-estrella',
        name: { es: 'Habitación Estrella', en: 'Star Room', gl: 'Habitación Estrela', fr: 'Chambre Étoile', de: 'Stern-Zimmer', ko: '별 객실', pt: 'Quarto Estrela', pl: 'Pokój Gwiazda' },
        price: 360, available: true, size: '14m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/1-derecha/hab-estrella.jpg`],
      },
      {
        id: '1d-mundo',
        name: { es: 'Habitación Mundo', en: 'World Room', gl: 'Habitación Mundo', fr: 'Chambre Monde', de: 'Welt-Zimmer', ko: '세계 객실', pt: 'Quarto Mundo', pl: 'Pokój Świat' },
        price: 340, available: true, size: '12m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado', 'Mural decorativo'],
        images: [`${IMG}/1-derecha/hab-mundo.jpg`],
      },
      {
        id: '1d-arroba',
        name: { es: 'Habitación Arroba', en: 'Arroba Room', gl: 'Habitación Arroba', fr: 'Chambre Arobase', de: 'Arroba-Zimmer', ko: '아로바 객실', pt: 'Quarto Arroba', pl: 'Pokój Arroba' },
        price: 320, available: true, size: '10m²',
        features: ['Cama individual', 'Escritorio', 'Armario', 'Papel pintado temático'],
        images: [`${IMG}/1-derecha/hab-arroba.jpg`],
      },
      {
        id: '1d-prensa',
        name: { es: 'Habitación Prensa', en: 'Press Room', gl: 'Habitación Prensa', fr: 'Chambre Presse', de: 'Presse-Zimmer', ko: '프레스 객실', pt: 'Quarto Imprensa', pl: 'Pokój Prasa' },
        price: 300, available: true, size: '16m²',
        features: ['Dos camas individuales', 'Escritorio', 'Armario', 'Separador de ambientes'],
        images: [`${IMG}/1-derecha/hab-prensa.jpg`],
      },
    ],
    amenities: ['WiFi fibra', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Galería acristalada', 'Patio privado', 'Dos baños'],
    coordinates: { lat: 42.2318, lng: -8.7154 },
    reviews: [
      { name: 'María L.', text: { es: 'Viví aquí 2 años y fue genial. El piso está impecable y la ubicación al lado del AVE es perfecta para moverse.', en: 'I lived here for 2 years and it was great. The flat is spotless and the location next to the HST is perfect for getting around.', gl: 'Vivín aquí 2 anos e foi xenial. O piso está impecable e a ubicación ao lado do AVE é perfecta para moverse.', fr: 'J\'ai vécu ici 2 ans et c\'était super. L\'appartement est impeccable et l\'emplacement à côté du TGV est parfait pour se déplacer.', de: 'Ich habe hier 2 Jahre gelebt und es war großartig. Die Wohnung ist makellos und die Lage neben dem Bahnhof ist perfekt zum Pendeln.', ko: '여기서 2년 살았는데 정말 좋았습니다. 아파트가 깨끗하고 고속철도역 옆이라 이동이 편리합니다.', pt: 'Vivi aqui 2 anos e foi ótimo. O apartamento está impecável e a localização junto à estação é perfeita para deslocações.', pl: 'Mieszkałam tu 2 lata i było świetnie. Mieszkanie jest nieskazitelne, a lokalizacja obok dworca idealna do dojazdów.' } },
      { name: 'Carlos R.', text: { es: 'Mejor relación calidad-precio de Vigo. Los compañeros de piso fueron estupendos y el casero muy atento.', en: 'Best value for money in Vigo. The flatmates were wonderful and the landlord very attentive.', gl: 'Mellor relación calidade-prezo de Vigo. Os compañeiros de piso foron estupendos e o caseiro moi atento.', fr: 'Meilleur rapport qualité-prix de Vigo. Les colocataires étaient formidables et le propriétaire très attentif.', de: 'Bestes Preis-Leistungs-Verhältnis in Vigo. Die Mitbewohner waren wunderbar und der Vermieter sehr aufmerksam.', ko: '비고 최고의 가성비입니다. 룸메이트들이 좋았고 집주인이 매우 세심했습니다.', pt: 'Melhor relação qualidade-preço de Vigo. Os companheiros de apartamento foram fantásticos e o senhorio muito atencioso.', pl: 'Najlepsza relacja jakości do ceny w Vigo. Współlokatorzy byli wspaniali, a właściciel bardzo uważny.' } },
    ],
  },

  // ─────────────────────────────────────────────
  // 3. 3º IZQUIERDA (Alfonso XIII, 9 – 3rd Left)
  // ─────────────────────────────────────────────
  {
    slug: 'alfonso-3-izquierda',
    name: {
      es: 'Piso Alfonso XIII – 3º Izquierda',
      en: 'Alfonso XIII Flat – 3rd Left',
      gl: 'Piso Alfonso XIII – 3º Esquerda',
      fr: 'Appartement Alfonso XIII – 3e Gauche',
      de: 'Wohnung Alfonso XIII – 3. Links',
      ko: 'Alfonso XIII 아파트 – 3층 왼쪽',
      pt: 'Apartamento Alfonso XIII – 3º Esquerda',
      pl: 'Mieszkanie Alfonso XIII – 3. Lewe',
    },
    address: 'Alfonso XIII, 9, Vigo',
    neighborhood: { es: 'Estación AVE', en: 'HST Station Area', gl: 'Estación AVE', fr: 'Gare TGV', de: 'Hochgeschwindigkeitsbahnhof', ko: '고속철도역 지역', pt: 'Estação de Alta Velocidade', pl: 'Dworzec Szybkiej Kolei' },
    description: {
      es: 'Piso señorial de seis habitaciones en tercera planta con salón con chimenea de mármol y vistas panorámicas a la ría de Vigo. Reformado con baño nuevo en 2025. Habitaciones amplias con decoración por colores, comedor para ocho personas y cocina equipada.',
      en: 'Stately six-bedroom flat on the third floor with a marble fireplace lounge and panoramic views of the Vigo estuary. Renovated with a new bathroom in 2025. Spacious color-themed rooms, an eight-seat dining room, and a fully equipped kitchen.',
      gl: 'Piso señorial de seis habitacións na terceira planta con salón con cheminea de mármore e vistas panorámicas á ría de Vigo. Reformado con baño novo en 2025. Habitacións amplas con decoración por cores, comedor para oito persoas e cociña equipada.',
      fr: 'Appartement majestueux de six chambres au troisième étage avec salon avec cheminée en marbre et vues panoramiques sur la ria de Vigo. Rénové avec nouvelle salle de bains en 2025. Chambres spacieuses décorées par couleurs, salle à manger pour huit personnes et cuisine équipée.',
      de: 'Herrschaftliche Sechs-Zimmer-Wohnung im dritten Stock mit Wohnzimmer mit Marmorkamin und Panoramablick auf die Bucht von Vigo. 2025 mit neuem Badezimmer renoviert. Geräumige farblich gestaltete Zimmer, Esszimmer für acht Personen und voll ausgestattete Küche.',
      ko: '대리석 벽난로 라운지와 비고 하구의 파노라마 전망을 갖춘 3층 6실 격조 높은 아파트입니다. 2025년 새 욕실로 리노베이션. 색상별 테마의 넓은 방, 8인용 식당, 완비된 주방을 갖추고 있습니다.',
      pt: 'Apartamento senhorial de seis quartos no terceiro andar com sala com lareira de mármore e vistas panorâmicas para a ria de Vigo. Renovado com nova casa de banho em 2025. Quartos espaçosos decorados por cores, sala de jantar para oito pessoas e cozinha equipada.',
      pl: 'Dostojne sześciopokojowe mieszkanie na trzecim piętrze z salonem z marmurowym kominkiem i panoramicznym widokiem na zatokę Vigo. Odnowione z nową łazienką w 2025 roku. Przestronne pokoje dekorowane kolorami, jadalnia na osiem osób i wyposażona kuchnia.',
    },
    image: `${IMG}/3-izquierda/vistas.jpg`,
    images: [
      `${IMG}/3-izquierda/vistas.jpg`,
      `${IMG}/3-izquierda/salon-comedor.jpg`,
      `${IMG}/3-izquierda/entrada.jpg`,
      `${IMG}/3-izquierda/cocina.jpg`,
      `${IMG}/3-izquierda/bano.jpg`,
    ],
    rooms: [
      {
        id: '3i-azul',
        name: { es: 'Habitación Azul', en: 'Blue Room', gl: 'Habitación Azul', fr: 'Chambre Bleue', de: 'Blaues Zimmer', ko: '파란 객실', pt: 'Quarto Azul', pl: 'Pokój Niebieski' },
        price: 320, available: true, size: '12m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/3-izquierda/hab-azul-1.jpg`, `${IMG}/3-izquierda/hab-azul-2.jpg`],
      },
      {
        id: '3i-roja',
        name: { es: 'Habitación Roja', en: 'Red Room', gl: 'Habitación Vermella', fr: 'Chambre Rouge', de: 'Rotes Zimmer', ko: '빨간 객실', pt: 'Quarto Vermelho', pl: 'Pokój Czerwony' },
        price: 310, available: true, size: '11m²',
        features: ['Dos camas individuales', 'Armario empotrado'],
        images: [`${IMG}/3-izquierda/hab-roja.jpg`],
      },
      {
        id: '3i-amarilla',
        name: { es: 'Habitación Amarilla', en: 'Yellow Room', gl: 'Habitación Amarela', fr: 'Chambre Jaune', de: 'Gelbes Zimmer', ko: '노란 객실', pt: 'Quarto Amarelo', pl: 'Pokój Żółty' },
        price: 300, available: true, size: '10m²',
        features: ['Cama individual', 'Escritorio', 'Armario'],
        images: [],
      },
      {
        id: '3i-verde',
        name: { es: 'Habitación Verde', en: 'Green Room', gl: 'Habitación Verde', fr: 'Chambre Verte', de: 'Grünes Zimmer', ko: '초록 객실', pt: 'Quarto Verde', pl: 'Pokój Zielony' },
        price: 330, available: true, size: '12m²',
        features: ['Cama individual', 'Escritorio grande', 'Armario empotrado'],
        images: [`${IMG}/3-izquierda/hab-verde.jpg`, `${IMG}/3-izquierda/hab-verde-escritorio.jpg`],
      },
      {
        id: '3i-blanca',
        name: { es: 'Habitación Blanca', en: 'White Room', gl: 'Habitación Branca', fr: 'Chambre Blanche', de: 'Weißes Zimmer', ko: '하얀 객실', pt: 'Quarto Branco', pl: 'Pokój Biały' },
        price: 340, available: true, size: '14m²',
        features: ['Cama doble', 'Cristalera al baño', 'Armario empotrado'],
        images: [`${IMG}/3-izquierda/hab-blanca.jpg`, `${IMG}/3-izquierda/hab-blanca-2.jpg`],
      },
      {
        id: '3i-gris',
        name: { es: 'Habitación Gris', en: 'Grey Room', gl: 'Habitación Gris', fr: 'Chambre Grise', de: 'Graues Zimmer', ko: '회색 객실', pt: 'Quarto Cinzento', pl: 'Pokój Szary' },
        price: 310, available: true, size: '11m²',
        features: ['Dos camas individuales', 'Estantería', 'Armario'],
        images: [`${IMG}/3-izquierda/hab-gris.jpg`, `${IMG}/3-izquierda/hab-gris-2.jpg`],
      },
    ],
    amenities: ['WiFi fibra', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Chimenea', 'Ascensor', 'Vistas panorámicas'],
    coordinates: { lat: 42.2318, lng: -8.7154 },
    reviews: [
      { name: 'Ana P.', text: { es: 'Un piso súper cómodo y bien cuidado. La cocina tiene de todo y el barrio es muy tranquilo por la noche.', en: 'A super comfortable and well-maintained flat. The kitchen has everything and the neighborhood is very quiet at night.', gl: 'Un piso súper cómodo e ben coidado. A cociña ten de todo e o barrio é moi tranquilo pola noite.', fr: 'Un appartement super confortable et bien entretenu. La cuisine a tout ce qu\'il faut et le quartier est très calme la nuit.', de: 'Eine super bequeme und gut gepflegte Wohnung. Die Küche hat alles und die Nachbarschaft ist nachts sehr ruhig.', ko: '매우 편안하고 잘 관리된 아파트입니다. 주방에 모든 것이 갖춰져 있고 밤에 동네가 조용합니다.', pt: 'Um apartamento super confortável e bem cuidado. A cozinha tem tudo e o bairro é muito tranquilo à noite.', pl: 'Super wygodne i zadbane mieszkanie. Kuchnia ma wszystko, a okolica jest bardzo spokojna w nocy.' } },
      { name: 'David M.', text: { es: 'Perfecto para ir a la universidad. Cogía el tren todos los días y tardaba nada. Muy recomendable.', en: 'Perfect for commuting to university. I took the train every day and it was no time at all. Highly recommended.', gl: 'Perfecto para ir á universidade. Collía o tren todos os días e non tardaba nada. Moi recomendable.', fr: 'Parfait pour aller à l\'université. Je prenais le train tous les jours et c\'était très rapide. Très recommandable.', de: 'Perfekt zum Pendeln zur Uni. Ich nahm jeden Tag den Zug und es dauerte gar nicht lang. Sehr empfehlenswert.', ko: '대학 통학에 완벽합니다. 매일 기차를 타고 다녔는데 금방이었습니다. 매우 추천합니다.', pt: 'Perfeito para ir à universidade. Apanhava o comboio todos os dias e não demorava nada. Muito recomendável.', pl: 'Idealny do dojazdów na uczelnię. Codziennie jeździłem pociągiem i trwało to chwilę. Bardzo polecam.' } },
    ],
  },

  // ─────────────────────────────────────────────
  // 4. 4º DERECHA – ÁTICO (Alfonso XIII, 9 – 4th Right Attic)
  // ─────────────────────────────────────────────
  {
    slug: 'alfonso-4-derecha-atico',
    name: {
      es: 'Ático Alfonso XIII – 4º Derecha',
      en: 'Alfonso XIII Penthouse – 4th Right',
      gl: 'Ático Alfonso XIII – 4º Dereita',
      fr: 'Penthouse Alfonso XIII – 4e Droite',
      de: 'Penthouse Alfonso XIII – 4. Rechts',
      ko: 'Alfonso XIII 펜트하우스 – 4층 오른쪽',
      pt: 'Sótão Alfonso XIII – 4º Direita',
      pl: 'Penthouse Alfonso XIII – 4. Prawe',
    },
    address: 'Alfonso XIII, 9, Vigo',
    neighborhood: { es: 'Estación AVE', en: 'HST Station Area', gl: 'Estación AVE', fr: 'Gare TGV', de: 'Hochgeschwindigkeitsbahnhof', ko: '고속철도역 지역', pt: 'Estação de Alta Velocidade', pl: 'Dworzec Szybkiej Kolei' },
    description: {
      es: 'Ático único con vistas panorámicas espectaculares de Vigo, la ría y las montañas. Cinco habitaciones con personalidad propia, techos abuhardillados con encanto, dos baños modernos y cocina totalmente equipada. Desde el balcón se disfruta de uno de los mejores miradores de la ciudad.',
      en: 'Unique penthouse with spectacular panoramic views of Vigo, the estuary, and the mountains. Five bedrooms with distinct personalities, charming sloped ceilings, two modern bathrooms, and a fully equipped kitchen. The balcony offers one of the best viewpoints in the city.',
      gl: 'Ático único con vistas panorámicas espectaculares de Vigo, a ría e as montañas. Cinco habitacións con personalidade propia, teitos abufardillados con encanto, dous baños modernos e cociña totalmente equipada. Desde o balcón gózase dun dos mellores miradoiros da cidade.',
      fr: 'Penthouse unique avec des vues panoramiques spectaculaires sur Vigo, la ria et les montagnes. Cinq chambres avec leur propre personnalité, charmants plafonds mansardés, deux salles de bains modernes et cuisine entièrement équipée. Le balcon offre l\'un des meilleurs points de vue de la ville.',
      de: 'Einzigartiges Penthouse mit spektakulärem Panoramablick auf Vigo, die Bucht und die Berge. Fünf Schlafzimmer mit eigenem Charakter, charmante Dachschrägen, zwei moderne Badezimmer und eine voll ausgestattete Küche. Der Balkon bietet einen der besten Aussichtspunkte der Stadt.',
      ko: '비고, 하구, 산의 장엄한 파노라마 전망을 자랑하는 유니크한 펜트하우스입니다. 개성 있는 5개의 침실, 매력적인 경사 천장, 모던한 욕실 2개, 완비된 주방을 갖추고 있습니다. 발코니에서 도시 최고의 전망을 즐길 수 있습니다.',
      pt: 'Sótão único com vistas panorâmicas espetaculares de Vigo, a ria e as montanhas. Cinco quartos com personalidade própria, encantadores tetos mansardados, duas casas de banho modernas e cozinha totalmente equipada. A varanda oferece um dos melhores miradouros da cidade.',
      pl: 'Wyjątkowy penthouse ze spektakularnym panoramicznym widokiem na Vigo, zatokę i góry. Pięć sypialni o własnym charakterze, urokliwe skośne sufity, dwie nowoczesne łazienki i w pełni wyposażona kuchnia. Balkon oferuje jeden z najlepszych punktów widokowych w mieście.',
    },
    image: `${IMG}/4-derecha-atico/vistas-panoramica.jpg`,
    images: [
      `${IMG}/4-derecha-atico/vistas-panoramica.jpg`,
      `${IMG}/4-derecha-atico/vistas-balcon.jpg`,
      `${IMG}/4-derecha-atico/cocina.jpg`,
      `${IMG}/4-derecha-atico/bano-1.jpg`,
      `${IMG}/4-derecha-atico/bano-2.jpg`,
      `${IMG}/4-derecha-atico/salon.jpg`,
      `${IMG}/4-derecha-atico/entrada.jpg`,
    ],
    rooms: [
      {
        id: '4d-oliva',
        name: { es: 'Habitación Oliva', en: 'Olive Room', gl: 'Habitación Oliva', fr: 'Chambre Olive', de: 'Oliv-Zimmer', ko: '올리브 객실', pt: 'Quarto Oliva', pl: 'Pokój Oliwkowy' },
        price: 370, available: true, size: '13m²',
        features: ['Cama doble', 'Viga vista', 'Cama con almacenaje', 'Armario'],
        images: [`${IMG}/4-derecha-atico/hab-oliva.jpg`],
      },
      {
        id: '4d-blanco-negro',
        name: { es: 'Habitación Blanco y Negro', en: 'Black & White Room', gl: 'Habitación Branco e Negro', fr: 'Chambre Noir et Blanc', de: 'Schwarz-Weiß-Zimmer', ko: '흑백 객실', pt: 'Quarto Preto e Branco', pl: 'Pokój Czarno-Biały' },
        price: 350, available: true, size: '12m²',
        features: ['Cama doble', 'Techo abuhardillado', 'Escritorio'],
        images: [`${IMG}/4-derecha-atico/hab-blanco-negro.jpg`],
      },
      {
        id: '4d-pistacho',
        name: { es: 'Habitación Pistacho', en: 'Pistachio Room', gl: 'Habitación Pistacho', fr: 'Chambre Pistache', de: 'Pistazien-Zimmer', ko: '피스타치오 객실', pt: 'Quarto Pistáchio', pl: 'Pokój Pistacjowy' },
        price: 340, available: true, size: '11m²',
        features: ['Cama individual', 'Armario empotrado', 'Escritorio'],
        images: [`${IMG}/4-derecha-atico/hab-pistacho.jpg`],
      },
      {
        id: '4d-roja',
        name: { es: 'Habitación Roja', en: 'Red Room', gl: 'Habitación Vermella', fr: 'Chambre Rouge', de: 'Rotes Zimmer', ko: '빨간 객실', pt: 'Quarto Vermelho', pl: 'Pokój Czerwony' },
        price: 340, available: true, size: '11m²',
        features: ['Cama doble', 'Escritorio', 'Armario'],
        images: [`${IMG}/4-derecha-atico/hab-roja.jpg`, `${IMG}/4-derecha-atico/hab-roja-escritorio.jpg`],
      },
      {
        id: '4d-calabaza',
        name: { es: 'Habitación Calabaza', en: 'Pumpkin Room', gl: 'Habitación Cabaza', fr: 'Chambre Citrouille', de: 'Kürbis-Zimmer', ko: '호박 객실', pt: 'Quarto Abóbora', pl: 'Pokój Dyniowy' },
        price: 360, available: true, size: '12m²',
        features: ['Cama individual', 'Claraboya', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/4-derecha-atico/hab-calabaza.jpg`],
      },
    ],
    amenities: ['WiFi fibra', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Dos baños', 'Vistas panorámicas', 'Balcón'],
    coordinates: { lat: 42.2318, lng: -8.7154 },
    reviews: [
      { name: 'Lucía G.', text: { es: 'Las vistas desde el ático son de las mejores de Vigo. Cada mañana desayunar viendo la ría no tiene precio. Un piso con mucho encanto.', en: 'The views from the penthouse are some of the best in Vigo. Having breakfast every morning overlooking the estuary is priceless. A flat with lots of charm.', gl: 'As vistas desde o ático son das mellores de Vigo. Cada mañá almorzar vendo a ría non ten prezo. Un piso con moito encanto.', fr: 'Les vues depuis le penthouse sont parmi les meilleures de Vigo. Prendre le petit-déjeuner chaque matin en admirant la ria n\'a pas de prix. Un appartement plein de charme.', de: 'Die Aussicht vom Penthouse gehört zu den besten in Vigo. Jeden Morgen beim Frühstück auf die Bucht zu schauen ist unbezahlbar. Eine Wohnung mit viel Charme.', ko: '펜트하우스에서의 전망은 비고 최고입니다. 매일 아침 하구를 보며 식사하는 것은 값을 매길 수 없습니다. 매력이 넘치는 아파트입니다.', pt: 'As vistas desde o sótão são das melhores de Vigo. Tomar o pequeno-almoço todas as manhãs a ver a ria não tem preço. Um apartamento com muito encanto.', pl: 'Widoki z penthouse\'u należą do najlepszych w Vigo. Codzienne śniadanie z widokiem na zatokę jest bezcenne. Mieszkanie z dużym urokiem.' } },
      { name: 'Javier B.', text: { es: 'Vivir en un ático en pleno centro de Vigo con estas vistas es un lujo. Las habitaciones son acogedoras y el casero siempre atento.', en: 'Living in a penthouse right in the center of Vigo with these views is a luxury. The rooms are cozy and the landlord is always attentive.', gl: 'Vivir nun ático no centro de Vigo con estas vistas é un luxo. As habitacións son acolledoras e o caseiro sempre atento.', fr: 'Vivre dans un penthouse en plein centre de Vigo avec ces vues est un luxe. Les chambres sont accueillantes et le propriétaire toujours attentif.', de: 'In einem Penthouse mitten im Zentrum von Vigo mit dieser Aussicht zu leben ist Luxus. Die Zimmer sind gemütlich und der Vermieter immer aufmerksam.', ko: '이런 전망을 가진 비고 중심부의 펜트하우스에 사는 것은 럭셔리입니다. 방이 아늑하고 집주인이 항상 세심합니다.', pt: 'Viver num sótão no centro de Vigo com estas vistas é um luxo. Os quartos são acolhedores e o senhorio sempre atencioso.', pl: 'Mieszkanie w penthousie w samym centrum Vigo z takimi widokami to luksus. Pokoje są przytulne, a właściciel zawsze uważny.' } },
    ],
  },

  // ─────────────────────────────────────────────
  // 5. 4º IZQUIERDA – ÁTICO (Alfonso XIII, 9 – 4th Left Attic)
  // ─────────────────────────────────────────────
  {
    slug: 'alfonso-4-izquierda-atico',
    name: {
      es: 'Ático Alfonso XIII – 4º Izquierda',
      en: 'Alfonso XIII Penthouse – 4th Left',
      gl: 'Ático Alfonso XIII – 4º Esquerda',
      fr: 'Penthouse Alfonso XIII – 4e Gauche',
      de: 'Penthouse Alfonso XIII – 4. Links',
      ko: 'Alfonso XIII 펜트하우스 – 4층 왼쪽',
      pt: 'Sótão Alfonso XIII – 4º Esquerda',
      pl: 'Penthouse Alfonso XIII – 4. Lewe',
    },
    address: 'Alfonso XIII, 9, Vigo',
    neighborhood: { es: 'Estación AVE', en: 'HST Station Area', gl: 'Estación AVE', fr: 'Gare TGV', de: 'Hochgeschwindigkeitsbahnhof', ko: '고속철도역 지역', pt: 'Estação de Alta Velocidade', pl: 'Dworzec Szybkiej Kolei' },
    description: {
      es: 'Espectacular ático abuhardillado con enormes ventanales de suelo a techo y vistas a la ría de Vigo. Salón-comedor diáfano con cocina americana, terraza privada, dos habitaciones con decoración única y baño moderno. La joya de la corona del edificio.',
      en: 'Spectacular attic penthouse with huge floor-to-ceiling windows and views of the Vigo estuary. Open-plan living-dining room with an American kitchen, private terrace, two uniquely decorated bedrooms, and a modern bathroom. The crown jewel of the building.',
      gl: 'Espectacular ático abufardillado con enormes ventanais de chan a teito e vistas á ría de Vigo. Salón-comedor diáfano con cociña americana, terraza privada, dúas habitacións con decoración única e baño moderno. A xoia da coroa do edificio.',
      fr: 'Spectaculaire penthouse mansardé avec d\'immenses baies vitrées du sol au plafond et vues sur la ria de Vigo. Salon-salle à manger décloisonné avec cuisine américaine, terrasse privée, deux chambres à décoration unique et salle de bains moderne. Le joyau de la couronne de l\'immeuble.',
      de: 'Spektakuläres Dachgeschoss-Penthouse mit riesigen bodentiefen Fenstern und Blick auf die Bucht von Vigo. Offener Wohn-Essbereich mit amerikanischer Küche, private Terrasse, zwei einzigartig dekorierte Schlafzimmer und ein modernes Badezimmer. Das Kronjuwel des Gebäudes.',
      ko: '바닥부터 천장까지 거대한 창문과 비고 하구 전망을 자랑하는 멋진 다락방 펜트하우스입니다. 아메리칸 키친이 있는 오픈 리빙-다이닝, 프라이빗 테라스, 유니크한 인테리어의 침실 2개, 모던한 욕실을 갖추고 있습니다. 건물의 최고 보석입니다.',
      pt: 'Espetacular sótão mansardado com enormes janelas do chão ao teto e vistas para a ria de Vigo. Sala-sala de jantar aberta com cozinha americana, terraço privado, dois quartos com decoração única e casa de banho moderna. A jóia da coroa do edifício.',
      pl: 'Spektakularny poddasze-penthouse z ogromnymi oknami od podłogi do sufitu i widokiem na zatokę Vigo. Otwarty salon z aneksem kuchennym w stylu amerykańskim, prywatny taras, dwie unikatowo udekorowane sypialnie i nowoczesna łazienka. Klejnot koronny budynku.',
    },
    image: `${IMG}/4-izquierda-atico/salon-comedor.jpg`,
    images: [
      `${IMG}/4-izquierda-atico/salon-comedor.jpg`,
      `${IMG}/4-izquierda-atico/salon-galeria-cocina.jpg`,
      `${IMG}/4-izquierda-atico/entrada-hall.jpg`,
      `${IMG}/4-izquierda-atico/cocina.jpg`,
      `${IMG}/4-izquierda-atico/bano.jpg`,
      `${IMG}/4-izquierda-atico/terraza-vistas.jpg`,
      `${IMG}/4-izquierda-atico/pasillo.jpg`,
    ],
    rooms: [
      {
        id: '4i-provenzal',
        name: { es: 'Habitación Provenzal', en: 'Provençal Room', gl: 'Habitación Provenzal', fr: 'Chambre Provençale', de: 'Provençal-Zimmer', ko: '프로방스 객실', pt: 'Quarto Provençal', pl: 'Pokój Prowansalski' },
        price: 400, available: true, size: '15m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado', 'Lámpara de araña', 'Decoración provenzal'],
        images: [
          `${IMG}/4-izquierda-atico/hab-provenzal-cama.jpg`,
          `${IMG}/4-izquierda-atico/hab-provenzal-escritorio.jpg`,
          `${IMG}/4-izquierda-atico/hab-provenzal-detalle.jpg`,
        ],
      },
      {
        id: '4i-nueva-york',
        name: { es: 'Habitación Nueva York', en: 'New York Room', gl: 'Habitación Nova York', fr: 'Chambre New York', de: 'New-York-Zimmer', ko: '뉴욕 객실', pt: 'Quarto Nova Iorque', pl: 'Pokój Nowy Jork' },
        price: 370, available: true, size: '12m²',
        features: ['Cama individual', 'Escritorio de cristal', 'Armario', 'Decoración urbana'],
        images: [
          `${IMG}/4-izquierda-atico/hab-nueva-york.jpg`,
          `${IMG}/4-izquierda-atico/hab-nueva-york-2.jpg`,
        ],
      },
    ],
    amenities: ['WiFi fibra', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Terraza privada', 'Claraboya', 'Ventanales panorámicos', 'Vistas a la ría'],
    coordinates: { lat: 42.2318, lng: -8.7154 },
    reviews: [
      { name: 'Laura S.', text: { es: 'El salón con esos ventanales es increíble. La luz natural inunda todo el piso y las vistas a la ría son un espectáculo. La terraza es perfecta para las tardes de verano.', en: 'The living room with those windows is incredible. Natural light floods the entire flat and the estuary views are spectacular. The terrace is perfect for summer evenings.', gl: 'O salón con eses ventanais é incrible. A luz natural inunda todo o piso e as vistas á ría son un espectáculo. A terraza é perfecta para as tardes de verán.', fr: 'Le salon avec ces baies vitrées est incroyable. La lumière naturelle inonde tout l\'appartement et les vues sur la ria sont un spectacle. La terrasse est parfaite pour les soirées d\'été.', de: 'Das Wohnzimmer mit diesen Fenstern ist unglaublich. Natürliches Licht durchflutet die ganze Wohnung und der Blick auf die Bucht ist ein Spektakel. Die Terrasse ist perfekt für Sommerabende.', ko: '그 창문이 있는 거실은 정말 놀랍습니다. 자연광이 아파트 전체를 가득 채우고 하구 전망이 장관입니다. 테라스는 여름 저녁에 완벽합니다.', pt: 'A sala com aquelas janelas é incrível. A luz natural inunda todo o apartamento e as vistas para a ria são um espetáculo. O terraço é perfeito para as tardes de verão.', pl: 'Salon z tymi oknami jest niesamowity. Naturalne światło zalewa całe mieszkanie, a widoki na zatokę są spektakularne. Taras jest idealny na letnie wieczory.' } },
      { name: 'Miguel A.', text: { es: 'Sin duda el mejor piso en el que he vivido. La decoración de las habitaciones es preciosa y el ático tiene una magia especial con esos techos abuhardillados.', en: 'Without a doubt the best flat I have ever lived in. The room décor is beautiful and the attic has a special magic with those sloped ceilings.', gl: 'Sen dúbida o mellor piso no que vivín. A decoración das habitacións é preciosa e o ático ten unha maxia especial con eses teitos abufardillados.', fr: 'Sans aucun doute le meilleur appartement où j\'ai vécu. La décoration des chambres est magnifique et le grenier a une magie spéciale avec ces plafonds mansardés.', de: 'Ohne Zweifel die beste Wohnung, in der ich je gelebt habe. Die Zimmerdekoration ist wunderschön und das Dachgeschoss hat mit seinen Schrägen einen besonderen Zauber.', ko: '의심할 여지 없이 제가 살았던 최고의 아파트입니다. 방 인테리어가 아름답고 경사진 천장이 있는 다락방이 특별한 매력을 줍니다.', pt: 'Sem dúvida o melhor apartamento onde vivi. A decoração dos quartos é linda e o sótão tem uma magia especial com aqueles tetos mansardados.', pl: 'Bez wątpienia najlepsze mieszkanie, w jakim mieszkałem. Dekoracja pokoi jest piękna, a poddasze ma specjalną magię ze swoimi skośnymi sufitami.' } },
    ],
  },
];

// Apply availability overlay from API (auto-generated by scripts/sync-availability.js)
const avail = (availabilityData as { rooms: Record<string, { available: boolean; price: number }> }).rooms;
for (const flat of flats) {
  for (const room of flat.rooms) {
    const data = avail[room.id];
    if (data) {
      room.available = data.available;
      room.price = data.price;
    }
  }
}
