export interface Review {
  name: string;
  text: { es: string; en: string; gl: string };
}

export interface Room {
  id: string;
  name: { es: string; en: string; gl: string };
  price: number;
  available: boolean;
  size: string;
  features: string[];
  images: string[];
}

export interface Flat {
  slug: string;
  name: { es: string; en: string; gl: string };
  address: string;
  neighborhood: { es: string; en: string; gl: string };
  description: { es: string; en: string; gl: string };
  image: string;
  images: string[];
  rooms: Room[];
  amenities: string[];
  coordinates: { lat: number; lng: number };
  reviews: Review[];
}

const IMG = '/web_casas/images';

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
    },
    address: 'Rúa Irmandiños 23, Vigo',
    neighborhood: { es: 'Casco Urbano', en: 'City Center', gl: 'Casco Urbano' },
    description: {
      es: 'Espectacular piso reformado a estrenar en una de las mejores calles de Vigo. Amplias habitaciones con luz natural todo el día, acabados de primera calidad y una distribución perfecta para compartir. Zona tranquila y residencial pero a cinco minutos andando del centro y de todos los servicios. Sin duda, nuestra joya.',
      en: 'Spectacular newly renovated flat on one of the best streets in Vigo. Spacious rooms with natural light all day, top-quality finishes, and a perfect layout for sharing. A quiet residential area just five minutes on foot from the city center and all amenities. Without a doubt, our crown jewel.',
      gl: 'Espectacular piso reformado a estrear nunha das mellores rúas de Vigo. Amplas habitacións con luz natural todo o día, acabados de primeira calidade e unha distribución perfecta para compartir. Zona tranquila e residencial pero a cinco minutos andando do centro e de todos os servizos. Sen dúbida, a nosa xoia.',
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
        name: { es: 'Habitación Primavera', en: 'Spring Room', gl: 'Habitación Primavera' },
        price: 380, available: true, size: '14m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado', 'Lámpara de araña'],
        images: [`${IMG}/irmandinhos/hab-primavera-1.jpg`, `${IMG}/irmandinhos/hab-primavera-2.jpg`],
      },
      {
        id: 'ir-verano',
        name: { es: 'Habitación Verano', en: 'Summer Room', gl: 'Habitación Verán' },
        price: 350, available: true, size: '12m²',
        features: ['Cama individual', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/irmandinhos/hab-verano-1.jpg`, `${IMG}/irmandinhos/hab-verano-2.jpg`],
      },
      {
        id: 'ir-otono',
        name: { es: 'Habitación Otoño', en: 'Autumn Room', gl: 'Habitación Outono' },
        price: 370, available: true, size: '13m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado', 'Lámpara de araña'],
        images: [`${IMG}/irmandinhos/hab-otono-1.jpg`, `${IMG}/irmandinhos/hab-otono-2.jpg`],
      },
      {
        id: 'ir-invierno',
        name: { es: 'Habitación Invierno', en: 'Winter Room', gl: 'Habitación Inverno' },
        price: 340, available: true, size: '11m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/irmandinhos/hab-invierno-1.jpg`],
      },
    ],
    amenities: ['WiFi fibra', 'Cocina equipada', 'Lavadora', 'Secadora', 'Calefacción', 'Aire acondicionado', 'Ascensor', 'Trastero'],
    coordinates: { lat: 42.2365, lng: -8.7145 },
    reviews: [
      { name: 'Sofía T.', text: { es: 'El mejor piso en el que he vivido en Vigo. Las habitaciones son enormes y la reforma es impecable. Se nota que está todo hecho con cariño.', en: 'The best flat I have ever lived in in Vigo. The rooms are huge and the renovation is impeccable. You can tell everything was done with care.', gl: 'O mellor piso no que vivín en Vigo. As habitacións son enormes e a reforma é impecable. Nótase que está todo feito con cariño.' } },
      { name: 'Pablo N.', text: { es: 'Increíble relación calidad-precio. La zona es muy tranquila pero tienes todo a mano. El casero es un diez, siempre pendiente de todo.', en: 'Incredible value for money. The area is very quiet but everything is within reach. The landlord is a ten out of ten, always on top of things.', gl: 'Incrible relación calidade-prezo. A zona é moi tranquila pero tes todo a man. O caseiro é un dez, sempre pendente de todo.' } },
      { name: 'Elena F.', text: { es: 'Vine para una estancia de 6 meses y acabé quedándome dos años. El piso tiene algo especial que te hace sentir en casa desde el primer día.', en: 'I came for a 6-month stay and ended up staying two years. The flat has something special that makes you feel at home from day one.', gl: 'Vin para unha estancia de 6 meses e acabei quedándome dous anos. O piso ten algo especial que te fai sentir na casa dende o primeiro día.' } },
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
    },
    address: 'Alfonso XIII, 9, Vigo',
    neighborhood: { es: 'Estación AVE', en: 'HST Station Area', gl: 'Estación AVE' },
    description: {
      es: 'Amplio piso de seis habitaciones en primera planta con galería acristalada y vistas a la ciudad. Decoración temática única en cada habitación, dos baños completos, salón luminoso y patio privado. A un paso de la estación de alta velocidad y del centro.',
      en: 'Spacious six-bedroom first-floor flat with a glazed gallery and city views. Each room features unique themed décor, two full bathrooms, a bright living room, and a private courtyard. Steps from the high-speed train station and the city center.',
      gl: 'Amplo piso de seis habitacións na primeira planta con galería acristalada e vistas á cidade. Decoración temática única en cada habitación, dous baños completos, salón luminoso e patio privado. A un paso da estación de alta velocidade e do centro.',
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
        name: { es: 'Habitación Blue', en: 'Blue Room', gl: 'Habitación Blue' },
        price: 350, available: true, size: '13m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/1-derecha/hab-blue.jpg`],
      },
      {
        id: '1d-bambu',
        name: { es: 'Habitación Bambú', en: 'Bamboo Room', gl: 'Habitación Bambú' },
        price: 330, available: true, size: '11m²',
        features: ['Cama individual', 'Escritorio', 'Armario', 'Estantería'],
        images: [`${IMG}/1-derecha/hab-bambu.jpg`],
      },
      {
        id: '1d-estrella',
        name: { es: 'Habitación Estrella', en: 'Star Room', gl: 'Habitación Estrela' },
        price: 360, available: true, size: '14m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/1-derecha/hab-estrella.jpg`],
      },
      {
        id: '1d-mundo',
        name: { es: 'Habitación Mundo', en: 'World Room', gl: 'Habitación Mundo' },
        price: 340, available: true, size: '12m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado', 'Mural decorativo'],
        images: [`${IMG}/1-derecha/hab-mundo.jpg`],
      },
      {
        id: '1d-arroba',
        name: { es: 'Habitación Arroba', en: 'Arroba Room', gl: 'Habitación Arroba' },
        price: 320, available: true, size: '10m²',
        features: ['Cama individual', 'Escritorio', 'Armario', 'Papel pintado temático'],
        images: [`${IMG}/1-derecha/hab-arroba.jpg`],
      },
      {
        id: '1d-prensa',
        name: { es: 'Habitación Prensa', en: 'Press Room', gl: 'Habitación Prensa' },
        price: 300, available: true, size: '16m²',
        features: ['Dos camas individuales', 'Escritorio', 'Armario', 'Separador de ambientes'],
        images: [`${IMG}/1-derecha/hab-prensa.jpg`],
      },
    ],
    amenities: ['WiFi fibra', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Galería acristalada', 'Patio privado', 'Dos baños'],
    coordinates: { lat: 42.2318, lng: -8.7154 },
    reviews: [
      { name: 'María L.', text: { es: 'Viví aquí 2 años y fue genial. El piso está impecable y la ubicación al lado del AVE es perfecta para moverse.', en: 'I lived here for 2 years and it was great. The flat is spotless and the location next to the HST is perfect for getting around.', gl: 'Vivín aquí 2 anos e foi xenial. O piso está impecable e a ubicación ao lado do AVE é perfecta para moverse.' } },
      { name: 'Carlos R.', text: { es: 'Mejor relación calidad-precio de Vigo. Los compañeros de piso fueron estupendos y el casero muy atento.', en: 'Best value for money in Vigo. The flatmates were wonderful and the landlord very attentive.', gl: 'Mellor relación calidade-prezo de Vigo. Os compañeiros de piso foron estupendos e o caseiro moi atento.' } },
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
    },
    address: 'Alfonso XIII, 9, Vigo',
    neighborhood: { es: 'Estación AVE', en: 'HST Station Area', gl: 'Estación AVE' },
    description: {
      es: 'Piso señorial de seis habitaciones en tercera planta con salón con chimenea de mármol y vistas panorámicas a la ría de Vigo. Reformado con baño nuevo en 2025. Habitaciones amplias con decoración por colores, comedor para ocho personas y cocina equipada.',
      en: 'Stately six-bedroom flat on the third floor with a marble fireplace lounge and panoramic views of the Vigo estuary. Renovated with a new bathroom in 2025. Spacious color-themed rooms, an eight-seat dining room, and a fully equipped kitchen.',
      gl: 'Piso señorial de seis habitacións na terceira planta con salón con cheminea de mármore e vistas panorámicas á ría de Vigo. Reformado con baño novo en 2025. Habitacións amplas con decoración por cores, comedor para oito persoas e cociña equipada.',
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
        name: { es: 'Habitación Azul', en: 'Blue Room', gl: 'Habitación Azul' },
        price: 320, available: true, size: '12m²',
        features: ['Cama doble', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/3-izquierda/hab-azul-1.jpg`, `${IMG}/3-izquierda/hab-azul-2.jpg`],
      },
      {
        id: '3i-roja',
        name: { es: 'Habitación Roja', en: 'Red Room', gl: 'Habitación Vermella' },
        price: 310, available: true, size: '11m²',
        features: ['Dos camas individuales', 'Armario empotrado'],
        images: [`${IMG}/3-izquierda/hab-roja.jpg`],
      },
      {
        id: '3i-amarilla',
        name: { es: 'Habitación Amarilla', en: 'Yellow Room', gl: 'Habitación Amarela' },
        price: 300, available: true, size: '10m²',
        features: ['Cama individual', 'Escritorio', 'Armario'],
        images: [],
      },
      {
        id: '3i-verde',
        name: { es: 'Habitación Verde', en: 'Green Room', gl: 'Habitación Verde' },
        price: 330, available: true, size: '12m²',
        features: ['Cama individual', 'Escritorio grande', 'Armario empotrado'],
        images: [`${IMG}/3-izquierda/hab-verde.jpg`, `${IMG}/3-izquierda/hab-verde-escritorio.jpg`],
      },
      {
        id: '3i-blanca',
        name: { es: 'Habitación Blanca', en: 'White Room', gl: 'Habitación Branca' },
        price: 340, available: true, size: '14m²',
        features: ['Cama doble', 'Cristalera al baño', 'Armario empotrado'],
        images: [`${IMG}/3-izquierda/hab-blanca.jpg`, `${IMG}/3-izquierda/hab-blanca-2.jpg`],
      },
      {
        id: '3i-gris',
        name: { es: 'Habitación Gris', en: 'Grey Room', gl: 'Habitación Gris' },
        price: 310, available: true, size: '11m²',
        features: ['Dos camas individuales', 'Estantería', 'Armario'],
        images: [`${IMG}/3-izquierda/hab-gris.jpg`, `${IMG}/3-izquierda/hab-gris-2.jpg`],
      },
    ],
    amenities: ['WiFi fibra', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Chimenea', 'Ascensor', 'Vistas panorámicas'],
    coordinates: { lat: 42.2318, lng: -8.7154 },
    reviews: [
      { name: 'Ana P.', text: { es: 'Un piso súper cómodo y bien cuidado. La cocina tiene de todo y el barrio es muy tranquilo por la noche.', en: 'A super comfortable and well-maintained flat. The kitchen has everything and the neighborhood is very quiet at night.', gl: 'Un piso súper cómodo e ben coidado. A cociña ten de todo e o barrio é moi tranquilo pola noite.' } },
      { name: 'David M.', text: { es: 'Perfecto para ir a la universidad. Cogía el tren todos los días y tardaba nada. Muy recomendable.', en: 'Perfect for commuting to university. I took the train every day and it was no time at all. Highly recommended.', gl: 'Perfecto para ir á universidade. Collía o tren todos os días e non tardaba nada. Moi recomendable.' } },
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
    },
    address: 'Alfonso XIII, 9, Vigo',
    neighborhood: { es: 'Estación AVE', en: 'HST Station Area', gl: 'Estación AVE' },
    description: {
      es: 'Ático único con vistas panorámicas espectaculares de Vigo, la ría y las montañas. Cinco habitaciones con personalidad propia, techos abuhardillados con encanto, dos baños modernos y cocina totalmente equipada. Desde el balcón se disfruta de uno de los mejores miradores de la ciudad.',
      en: 'Unique penthouse with spectacular panoramic views of Vigo, the estuary, and the mountains. Five bedrooms with distinct personalities, charming sloped ceilings, two modern bathrooms, and a fully equipped kitchen. The balcony offers one of the best viewpoints in the city.',
      gl: 'Ático único con vistas panorámicas espectaculares de Vigo, a ría e as montañas. Cinco habitacións con personalidade propia, teitos abufardillados con encanto, dous baños modernos e cociña totalmente equipada. Desde o balcón gózase dun dos mellores miradoiros da cidade.',
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
        name: { es: 'Habitación Oliva', en: 'Olive Room', gl: 'Habitación Oliva' },
        price: 370, available: true, size: '13m²',
        features: ['Cama doble', 'Viga vista', 'Cama con almacenaje', 'Armario'],
        images: [`${IMG}/4-derecha-atico/hab-oliva.jpg`],
      },
      {
        id: '4d-blanco-negro',
        name: { es: 'Habitación Blanco y Negro', en: 'Black & White Room', gl: 'Habitación Branco e Negro' },
        price: 350, available: true, size: '12m²',
        features: ['Cama doble', 'Techo abuhardillado', 'Escritorio'],
        images: [`${IMG}/4-derecha-atico/hab-blanco-negro.jpg`],
      },
      {
        id: '4d-pistacho',
        name: { es: 'Habitación Pistacho', en: 'Pistachio Room', gl: 'Habitación Pistacho' },
        price: 340, available: true, size: '11m²',
        features: ['Cama individual', 'Armario empotrado', 'Escritorio'],
        images: [`${IMG}/4-derecha-atico/hab-pistacho.jpg`],
      },
      {
        id: '4d-roja',
        name: { es: 'Habitación Roja', en: 'Red Room', gl: 'Habitación Vermella' },
        price: 340, available: true, size: '11m²',
        features: ['Cama doble', 'Escritorio', 'Armario'],
        images: [`${IMG}/4-derecha-atico/hab-roja.jpg`, `${IMG}/4-derecha-atico/hab-roja-escritorio.jpg`],
      },
      {
        id: '4d-calabaza',
        name: { es: 'Habitación Calabaza', en: 'Pumpkin Room', gl: 'Habitación Cabaza' },
        price: 360, available: true, size: '12m²',
        features: ['Cama individual', 'Claraboya', 'Escritorio', 'Armario empotrado'],
        images: [`${IMG}/4-derecha-atico/hab-calabaza.jpg`],
      },
    ],
    amenities: ['WiFi fibra', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Dos baños', 'Vistas panorámicas', 'Balcón'],
    coordinates: { lat: 42.2318, lng: -8.7154 },
    reviews: [
      { name: 'Lucía G.', text: { es: 'Las vistas desde el ático son de las mejores de Vigo. Cada mañana desayunar viendo la ría no tiene precio. Un piso con mucho encanto.', en: 'The views from the penthouse are some of the best in Vigo. Having breakfast every morning overlooking the estuary is priceless. A flat with lots of charm.', gl: 'As vistas desde o ático son das mellores de Vigo. Cada mañá almorzar vendo a ría non ten prezo. Un piso con moito encanto.' } },
      { name: 'Javier B.', text: { es: 'Vivir en un ático en pleno centro de Vigo con estas vistas es un lujo. Las habitaciones son acogedoras y el casero siempre atento.', en: 'Living in a penthouse right in the center of Vigo with these views is a luxury. The rooms are cozy and the landlord is always attentive.', gl: 'Vivir nun ático no centro de Vigo con estas vistas é un luxo. As habitacións son acolledoras e o caseiro sempre atento.' } },
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
    },
    address: 'Alfonso XIII, 9, Vigo',
    neighborhood: { es: 'Estación AVE', en: 'HST Station Area', gl: 'Estación AVE' },
    description: {
      es: 'Espectacular ático abuhardillado con enormes ventanales de suelo a techo y vistas a la ría de Vigo. Salón-comedor diáfano con cocina americana, terraza privada, dos habitaciones con decoración única y baño moderno. La joya de la corona del edificio.',
      en: 'Spectacular attic penthouse with huge floor-to-ceiling windows and views of the Vigo estuary. Open-plan living-dining room with an American kitchen, private terrace, two uniquely decorated bedrooms, and a modern bathroom. The crown jewel of the building.',
      gl: 'Espectacular ático abufardillado con enormes ventanais de chan a teito e vistas á ría de Vigo. Salón-comedor diáfano con cociña americana, terraza privada, dúas habitacións con decoración única e baño moderno. A xoia da coroa do edificio.',
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
        name: { es: 'Habitación Provenzal', en: 'Provençal Room', gl: 'Habitación Provenzal' },
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
        name: { es: 'Habitación Nueva York', en: 'New York Room', gl: 'Habitación Nova York' },
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
      { name: 'Laura S.', text: { es: 'El salón con esos ventanales es increíble. La luz natural inunda todo el piso y las vistas a la ría son un espectáculo. La terraza es perfecta para las tardes de verano.', en: 'The living room with those windows is incredible. Natural light floods the entire flat and the estuary views are spectacular. The terrace is perfect for summer evenings.', gl: 'O salón con eses ventanais é incrible. A luz natural inunda todo o piso e as vistas á ría son un espectáculo. A terraza é perfecta para as tardes de verán.' } },
      { name: 'Miguel A.', text: { es: 'Sin duda el mejor piso en el que he vivido. La decoración de las habitaciones es preciosa y el ático tiene una magia especial con esos techos abuhardillados.', en: 'Without a doubt the best flat I have ever lived in. The room décor is beautiful and the attic has a special magic with those sloped ceilings.', gl: 'Sen dúbida o mellor piso no que vivín. A decoración das habitacións é preciosa e o ático ten unha maxia especial con eses teitos abufardillados.' } },
    ],
  },
];
