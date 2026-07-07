import type { I18nText, Lang } from '../i18n/translations';

/** A place or activity recommended for families. */
export interface FamilyPlace {
  /** Proper name — not translated. */
  name: string;
  description: I18nText;
  /** Travel time/distance from Samil. */
  distance?: I18nText;
  /** Approximate price (verified). Omit if unknown. */
  price?: I18nText;
  /** Mark clearly free attractions. */
  free?: boolean;
  /** Needs advance booking/authorization. */
  booking?: boolean;
  /** Practical family tip. */
  tip?: I18nText;
  /** Official website. */
  url?: string;
}

export interface FamilySection {
  id: string;
  emoji?: string;
  /** Optional banner image (repo-hosted, licensed). */
  image?: string;
  title: I18nText;
  intro: I18nText;
  places: FamilyPlace[];
}

/** Image credit for the attribution list (licensed reuse). */
export interface ImageCredit {
  title: string;
  author: string;
  license: string;
  url: string;
}

/** Hero image at the top of the guide. */
export const familyHero = '/casas-vigo/images/vigo/hero.jpg';

/** Photo attributions (Wikimedia Commons, free licenses). */
export const familyCredits: ImageCredit[] = [
  { title: 'Praia de Rodas, Illas Cíes', author: 'Mario Sánchez', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Praia_de_Rodas,_Illas_C%C3%ADes,_Vigo,_Galiza.jpg' },
  { title: 'Praia de Samil, Vigo', author: 'Alberto', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Praia_de_Samil,_Navia,_Vigo.jpg' },
  { title: 'Vigo desde o Monte do Castro', author: 'kai670', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Vigo_dende_o_monte_do_castro.jpg' },
  { title: 'Faro das Illas Cíes', author: 'Julesvernex2', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Pathway_to_the_Faro_lighthouse,_Ci%C3%A9s_Islands,_Spain_(PPL1-Corrected)_julesvernex2.jpg' },
  { title: 'Parador de Baiona', author: 'Juan Mejuto', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Parador_de_Baiona,_Galiza.jpg' },
  { title: 'Polbo á feira', author: 'Luis Miguel Bugallo Sánchez (Lmbuga)', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Polbo_%C3%A1_feira._Galiza.jpg' },
];

export interface ItineraryDay {
  day: number;
  title: I18nText;
  plan: I18nText;
}

export interface FamilyQuestion {
  q: I18nText;
  a: I18nText;
}

export const familyIntro: I18nText = {
  es: 'Con base en Samil tenéis la mejor playa urbana de Vigo a la puerta y, a pocos minutos, parques, museos y una de las excursiones más bonitas de España: las Islas Cíes. Esta guía reúne planes pensados para disfrutar Vigo en familia con niños.',
  en: 'Based in Samil you have Vigo\'s best urban beach on your doorstep and, just minutes away, parks, museums and one of Spain\'s most beautiful day trips: the Cíes Islands. This guide gathers plans designed to enjoy Vigo as a family with kids.',
  gl: 'Con base en Samil tedes a mellor praia urbana de Vigo á porta e, a poucos minutos, parques, museos e unha das excursións máis bonitas de España: as Illas Cíes. Esta guía reúne plans pensados para gozar Vigo en familia con nenos.',
  fr: 'Basés à Samil, vous avez la meilleure plage urbaine de Vigo au pied de votre logement et, à quelques minutes, des parcs, des musées et l\'une des plus belles excursions d\'Espagne : les îles Cíes. Ce guide rassemble des idées pour profiter de Vigo en famille avec des enfants.',
  de: 'Von Samil aus haben Sie Vigos besten Stadtstrand direkt vor der Tür und nur wenige Minuten entfernt Parks, Museen und einen der schönsten Ausflüge Spaniens: die Cíes-Inseln. Dieser Führer bündelt Ideen, um Vigo als Familie mit Kindern zu genießen.',
  ko: '사밀에 머물면 비고 최고의 도시 해변이 바로 문 앞에 있고, 몇 분 거리에 공원, 박물관, 그리고 스페인에서 가장 아름다운 여행지 중 하나인 시에스 제도가 있습니다. 이 가이드는 아이와 함께 비고를 즐기기 위한 계획을 모았습니다.',
  pt: 'Com base em Samil têm a melhor praia urbana de Vigo à porta e, a poucos minutos, parques, museus e uma das excursões mais bonitas de Espanha: as Ilhas Cíes. Este guia reúne planos pensados para desfrutar Vigo em família com crianças.',
  pl: 'Mając bazę w Samil, macie najlepszą miejską plażę Vigo tuż za progiem, a kilka minut dalej parki, muzea i jedną z najpiękniejszych wycieczek w Hiszpanii: Wyspy Cíes. Ten przewodnik zbiera pomysły na rodzinne zwiedzanie Vigo z dziećmi.',
};

export const familySections: FamilySection[] = [
  {
    id: 'samil',
    emoji: '🏖️',
    image: '/casas-vigo/images/vigo/samil.jpg',
    title: {
      es: 'En Samil y alrededores', en: 'In Samil and nearby', gl: 'En Samil e arredores',
      fr: 'À Samil et alentours', de: 'In Samil und Umgebung', ko: '사밀과 주변',
      pt: 'Em Samil e arredores', pl: 'W Samil i okolicy',
    },
    intro: {
      es: 'A pie o en pocos minutos desde el paseo de Samil.',
      en: 'On foot or a few minutes from the Samil promenade.',
      gl: 'A pé ou en poucos minutos desde o paseo de Samil.',
      fr: 'À pied ou à quelques minutes de la promenade de Samil.',
      de: 'Zu Fuß oder wenige Minuten von der Strandpromenade von Samil.',
      ko: '사밀 산책로에서 걸어서 또는 몇 분 거리.',
      pt: 'A pé ou a poucos minutos do passeio de Samil.',
      pl: 'Pieszo lub kilka minut od promenady Samil.',
    },
    places: [
      {
        name: 'Playa de Samil',
        description: {
          es: 'La playa más grande de Vigo: 1,7 km de arena, paseo marítimo llano ideal para bici y patinete, parques infantiles y socorristas en temporada.',
          en: 'Vigo\'s largest beach: 1.7 km of sand, a flat seafront promenade great for bikes and scooters, playgrounds and lifeguards in season.',
          gl: 'A praia máis grande de Vigo: 1,7 km de area, paseo marítimo chan ideal para bici e patinete, parques infantís e socorristas en temporada.',
          fr: 'La plus grande plage de Vigo : 1,7 km de sable, une promenade plate idéale pour le vélo et la trottinette, des aires de jeux et des sauveteurs en saison.',
          de: 'Vigos größter Strand: 1,7 km Sand, eine flache Promenade ideal für Fahrrad und Roller, Spielplätze und in der Saison Rettungsschwimmer.',
          ko: '비고에서 가장 큰 해변: 1.7km의 모래사장, 자전거와 킥보드에 좋은 평평한 해안 산책로, 놀이터, 성수기 안전요원.',
          pt: 'A maior praia de Vigo: 1,7 km de areia, passeio marítimo plano ideal para bicicleta e trotinete, parques infantis e nadadores-salvadores na época.',
          pl: 'Największa plaża Vigo: 1,7 km piasku, płaska promenada idealna na rower i hulajnogę, place zabaw i ratownicy w sezonie.',
        },
        distance: { es: '0 min', en: '0 min', gl: '0 min', fr: '0 min', de: '0 Min.', ko: '0분', pt: '0 min', pl: '0 min' },
        free: true,
        tip: {
          es: 'El agua está más resguardada en el extremo sur; llevad sombrilla, hay poca sombra natural.',
          en: 'The water is calmer at the southern end; bring a parasol, there is little natural shade.',
          gl: 'A auga está máis resgardada no extremo sur; levade sombreiro, hai pouca sombra natural.',
          fr: 'L\'eau est plus abritée à l\'extrémité sud ; apportez un parasol, il y a peu d\'ombre naturelle.',
          de: 'Am südlichen Ende ist das Wasser ruhiger; bringen Sie einen Sonnenschirm mit, es gibt wenig natürlichen Schatten.',
          ko: '남쪽 끝이 물이 더 잔잔합니다. 자연 그늘이 적으니 파라솔을 챙기세요.',
          pt: 'A água é mais calma no extremo sul; levem chapéu de sol, há pouca sombra natural.',
          pl: 'Woda jest spokojniejsza na południowym krańcu; zabierzcie parasol, jest mało naturalnego cienia.',
        },
      },
      {
        name: 'Piscinas de Samil',
        description: {
          es: 'Piscinas públicas al aire libre junto a la playa, con vaso infantil y césped. Perfectas cuando el mar está frío.',
          en: 'Outdoor public pools next to the beach, with a children\'s pool and lawn. Perfect when the sea is cold.',
          gl: 'Piscinas públicas ao aire libre xunto á praia, con vaso infantil e céspede. Perfectas cando o mar está frío.',
          fr: 'Piscines publiques en plein air à côté de la plage, avec bassin pour enfants et pelouse. Parfaites quand la mer est froide.',
          de: 'Öffentliche Freibäder direkt am Strand, mit Kinderbecken und Liegewiese. Perfekt, wenn das Meer kalt ist.',
          ko: '해변 옆 야외 공공 수영장으로, 어린이 풀과 잔디밭이 있습니다. 바다가 차가울 때 완벽합니다.',
          pt: 'Piscinas públicas ao ar livre junto à praia, com tanque infantil e relvado. Perfeitas quando o mar está frio.',
          pl: 'Publiczne baseny odkryte przy plaży, z brodzikiem dla dzieci i trawnikiem. Idealne, gdy morze jest zimne.',
        },
        distance: {
          es: 'En el paseo', en: 'On the promenade', gl: 'No paseo', fr: 'Sur la promenade',
          de: 'An der Promenade', ko: '산책로에', pt: 'No passeio', pl: 'Na promenadzie',
        },
        free: true,
        tip: {
          es: 'Gratuitas y con socorrista. Suelen abrir de finales de mayo a septiembre, de 12:00 a 21:00; id pronto los días de calor.',
          en: 'Free and with a lifeguard. Usually open late May to September, 12:00–21:00; go early on hot days.',
          gl: 'Gratuítas e con socorrista. Adoitan abrir de finais de maio a setembro, de 12:00 a 21:00; ide cedo os días de calor.',
          fr: 'Gratuites et surveillées. Généralement ouvertes de fin mai à septembre, 12h–21h ; venez tôt les jours de chaleur.',
          de: 'Kostenlos und mit Rettungsschwimmer. Meist von Ende Mai bis September geöffnet, 12–21 Uhr; an heißen Tagen früh kommen.',
          ko: '무료이며 안전요원이 있습니다. 보통 5월 말부터 9월까지, 12:00–21:00 개장; 더운 날에는 일찍 가세요.',
          pt: 'Gratuitas e com nadador-salvador. Costumam abrir de final de maio a setembro, das 12:00 às 21:00; vão cedo nos dias de calor.',
          pl: 'Bezpłatne i z ratownikiem. Zwykle otwarte od końca maja do września, 12:00–21:00; w upalne dni przyjdźcie wcześnie.',
        },
      },
      {
        name: 'Parques infantiles del paseo',
        description: {
          es: 'Varias zonas de juegos repartidas por el paseo, con columpios, toboganes y tirolina.',
          en: 'Several play areas along the promenade, with swings, slides and a zip line.',
          gl: 'Varias zonas de xogos repartidas polo paseo, con randeeiras, esvaradoiros e tirolina.',
          fr: 'Plusieurs aires de jeux le long de la promenade, avec balançoires, toboggans et tyrolienne.',
          de: 'Mehrere Spielbereiche entlang der Promenade, mit Schaukeln, Rutschen und Seilbahn.',
          ko: '산책로를 따라 그네, 미끄럼틀, 짚라인이 있는 여러 놀이 공간.',
          pt: 'Várias zonas de jogos ao longo do passeio, com baloiços, escorregas e tirolesa.',
          pl: 'Kilka placów zabaw wzdłuż promenady, z huśtawkami, zjeżdżalniami i tyrolką.',
        },
        distance: {
          es: 'En el paseo', en: 'On the promenade', gl: 'No paseo', fr: 'Sur la promenade',
          de: 'An der Promenade', ko: '산책로에', pt: 'No passeio', pl: 'Na promenadzie',
        },
        free: true,
      },
      {
        name: 'Museo do Mar de Galicia',
        description: {
          es: 'Museo sobre la pesca y el mar en Alcabre, con acuario y un faro con vistas. Muy entretenido para niños.',
          en: 'Museum about fishing and the sea in Alcabre, with an aquarium and a lighthouse with views. Very entertaining for kids.',
          gl: 'Museo sobre a pesca e o mar en Alcabre, con acuario e un faro con vistas. Moi entretido para nenos.',
          fr: 'Musée sur la pêche et la mer à Alcabre, avec un aquarium et un phare offrant des vues. Très divertissant pour les enfants.',
          de: 'Museum über Fischerei und Meer in Alcabre, mit Aquarium und einem Leuchtturm mit Aussicht. Sehr unterhaltsam für Kinder.',
          ko: '알카브레에 있는 어업과 바다에 관한 박물관으로, 수족관과 전망 좋은 등대가 있습니다. 아이들에게 매우 재미있습니다.',
          pt: 'Museu sobre a pesca e o mar em Alcabre, com aquário e um farol com vistas. Muito divertido para crianças.',
          pl: 'Muzeum poświęcone rybołówstwu i morzu w Alcabre, z akwarium i latarnią morską z widokami. Bardzo ciekawe dla dzieci.',
        },
        distance: {
          es: '~25 min a pie / 5 min coche', en: '~25 min walk / 5 min drive', gl: '~25 min a pé / 5 min coche',
          fr: '~25 min à pied / 5 min en voiture', de: '~25 Min. zu Fuß / 5 Min. mit dem Auto',
          ko: '도보 약 25분 / 차로 5분', pt: '~25 min a pé / 5 min de carro', pl: '~25 min pieszo / 5 min autem',
        },
        price: {
          es: 'Adultos 3 €, niños 8-18 años 1,50 €, menores de 8 gratis',
          en: 'Adults €3, kids 8-18 €1.50, under 8 free',
          gl: 'Adultos 3 €, nenos 8-18 anos 1,50 €, menores de 8 gratis',
          fr: 'Adultes 3 €, enfants 8-18 ans 1,50 €, moins de 8 ans gratuit',
          de: 'Erwachsene 3 €, Kinder 8-18 J. 1,50 €, unter 8 kostenlos',
          ko: '성인 3 €, 8-18세 1,50 €, 8세 미만 무료',
          pt: 'Adultos 3 €, crianças 8-18 anos 1,50 €, menores de 8 grátis',
          pl: 'Dorośli 3 €, dzieci 8-18 lat 1,50 €, poniżej 8 lat za darmo',
        },
        url: 'https://museodomar.xunta.gal',
        tip: {
          es: 'El paseo de la costa desde Samil hasta el museo es precioso.',
          en: 'The coastal walk from Samil to the museum is beautiful.',
          gl: 'O paseo da costa desde Samil ata o museo é precioso.',
          fr: 'La promenade côtière de Samil au musée est magnifique.',
          de: 'Der Küstenspaziergang von Samil zum Museum ist wunderschön.',
          ko: '사밀에서 박물관까지 이어지는 해안 산책로가 아름답습니다.',
          pt: 'O passeio costeiro de Samil até ao museu é lindo.',
          pl: 'Nadmorski spacer z Samil do muzeum jest przepiękny.',
        },
      },
      {
        name: 'Praia do Vao / A Fontaíña',
        description: {
          es: 'Playas familiares con bandera azul, aguas tranquilas y zona de juegos, a un paso de Samil.',
          en: 'Family beaches with Blue Flag status, calm waters and a play area, right next to Samil.',
          gl: 'Praias familiares con bandeira azul, augas tranquilas e zona de xogos, a un paso de Samil.',
          fr: 'Plages familiales avec Pavillon Bleu, eaux calmes et aire de jeux, tout près de Samil.',
          de: 'Familienstrände mit Blauer Flagge, ruhigem Wasser und Spielbereich, gleich neben Samil.',
          ko: '블루 플래그 인증의 가족 해변으로, 잔잔한 바다와 놀이 공간이 있으며 사밀 바로 옆입니다.',
          pt: 'Praias familiares com bandeira azul, águas calmas e zona de jogos, mesmo ao lado de Samil.',
          pl: 'Rodzinne plaże z Błękitną Flagą, spokojną wodą i placem zabaw, tuż obok Samil.',
        },
        distance: {
          es: '~15 min a pie', en: '~15 min walk', gl: '~15 min a pé', fr: '~15 min à pied',
          de: '~15 Min. zu Fuß', ko: '도보 약 15분', pt: '~15 min a pé', pl: '~15 min pieszo',
        },
        free: true,
      },
      {
        name: 'Jardín Botánico Fundación Sales',
        description: {
          es: 'Pequeño jardín botánico de camino a Samil, con aparcamiento propio y visitas guiadas en varios idiomas. Un respiro verde muy cerca de la playa.',
          en: 'Small botanical garden on the way to Samil, with its own parking and guided tours in several languages. A green break very close to the beach.',
          gl: 'Pequeno xardín botánico de camiño a Samil, con aparcamento propio e visitas guiadas en varios idiomas. Un respiro verde moi preto da praia.',
          fr: 'Petit jardin botanique sur le chemin de Samil, avec parking et visites guidées en plusieurs langues. Une pause verte tout près de la plage.',
          de: 'Kleiner botanischer Garten auf dem Weg nach Samil, mit eigenem Parkplatz und Führungen in mehreren Sprachen. Eine grüne Pause ganz nah am Strand.',
          ko: '사밀로 가는 길에 있는 작은 식물원으로, 자체 주차장과 여러 언어의 가이드 투어가 있습니다. 해변 아주 가까이의 녹색 쉼터.',
          pt: 'Pequeno jardim botânico a caminho de Samil, com estacionamento próprio e visitas guiadas em vários idiomas. Uma pausa verde muito perto da praia.',
          pl: 'Mały ogród botaniczny w drodze do Samil, z własnym parkingiem i zwiedzaniem z przewodnikiem w kilku językach. Zielona odskocznia bardzo blisko plaży.',
        },
        distance: {
          es: '~5 min coche', en: '~5 min drive', gl: '~5 min coche', fr: '~5 min en voiture',
          de: '~5 Min. mit dem Auto', ko: '차로 약 5분', pt: '~5 min de carro', pl: '~5 min autem',
        },
        url: 'https://www.fundacionsales.org',
        tip: {
          es: 'Visitas guiadas con reserva (tel. 986 240 882). Ideal combinar con una tarde de playa.',
          en: 'Guided tours by appointment (tel. 986 240 882). Great to combine with a beach afternoon.',
          gl: 'Visitas guiadas con reserva (tel. 986 240 882). Ideal combinar cunha tarde de praia.',
          fr: 'Visites guidées sur réservation (tél. 986 240 882). Idéal à combiner avec un après-midi plage.',
          de: 'Führungen nach Vereinbarung (Tel. 986 240 882). Ideal mit einem Strandnachmittag zu verbinden.',
          ko: '예약제 가이드 투어(전화 986 240 882). 해변 오후와 함께하기 좋습니다.',
          pt: 'Visitas guiadas com marcação (tel. 986 240 882). Ideal combinar com uma tarde de praia.',
          pl: 'Zwiedzanie z przewodnikiem po rezerwacji (tel. 986 240 882). Idealne w połączeniu z popołudniem na plaży.',
        },
      },
    ],
  },
  {
    id: 'city',
    emoji: '🎡',
    image: '/casas-vigo/images/vigo/city.jpg',
    title: {
      es: 'En la ciudad', en: 'In the city', gl: 'Na cidade', fr: 'En ville',
      de: 'In der Stadt', ko: '시내에서', pt: 'Na cidade', pl: 'W mieście',
    },
    intro: {
      es: 'A menos de 20 minutos en coche o autobús.',
      en: 'Less than 20 minutes by car or bus.',
      gl: 'A menos de 20 minutos en coche ou autobús.',
      fr: 'À moins de 20 minutes en voiture ou en bus.',
      de: 'Weniger als 20 Minuten mit Auto oder Bus.',
      ko: '차나 버스로 20분 이내.',
      pt: 'A menos de 20 minutos de carro ou autocarro.',
      pl: 'Mniej niż 20 minut samochodem lub autobusem.',
    },
    places: [
      {
        name: 'Monte do Castro',
        description: {
          es: 'Parque en lo alto con una fortaleza, cañones antiguos y vistas de 360° de la ría. A los niños les encanta explorar las murallas.',
          en: 'Hilltop park with a fortress, old cannons and 360° views of the estuary. Kids love exploring the walls.',
          gl: 'Parque no alto cunha fortaleza, canóns antigos e vistas de 360° da ría. Aos nenos encántalles explorar as murallas.',
          fr: 'Parc en hauteur avec une forteresse, de vieux canons et une vue à 360° sur la ria. Les enfants adorent explorer les remparts.',
          de: 'Park auf dem Hügel mit einer Festung, alten Kanonen und 360°-Blick auf die Bucht. Kinder lieben es, die Mauern zu erkunden.',
          ko: '요새, 오래된 대포, 만의 360° 전망이 있는 언덕 위 공원. 아이들이 성벽 탐험을 좋아합니다.',
          pt: 'Parque no alto com uma fortaleza, canhões antigos e vistas de 360° da ria. As crianças adoram explorar as muralhas.',
          pl: 'Park na wzgórzu z twierdzą, starymi armatami i widokiem 360° na zatokę. Dzieci uwielbiają zwiedzać mury.',
        },
        distance: {
          es: '~15 min coche', en: '~15 min drive', gl: '~15 min coche', fr: '~15 min en voiture',
          de: '~15 Min. mit dem Auto', ko: '차로 약 15분', pt: '~15 min de carro', pl: '~15 min autem',
        },
        free: true,
        tip: {
          es: 'El poblado celta reconstruido abre en verano de 11:00 a 13:00 y de 17:00 a 19:00. Buen sitio para merendar al atardecer.',
          en: 'The reconstructed Celtic hillfort opens in summer 11:00–13:00 and 17:00–19:00. A great spot for a snack at sunset.',
          gl: 'O poboado celta reconstruído abre no verán de 11:00 a 13:00 e de 17:00 a 19:00. Bo sitio para merendar ao solpor.',
          fr: 'Le village celte reconstruit ouvre en été de 11h à 13h et de 17h à 19h. Un bel endroit pour un goûter au coucher du soleil.',
          de: 'Die rekonstruierte keltische Siedlung öffnet im Sommer 11:00–13:00 und 17:00–19:00 Uhr. Ein toller Ort für eine Jause bei Sonnenuntergang.',
          ko: '복원된 켈트 마을은 여름에 11:00–13:00, 17:00–19:00에 엽니다. 해질녘 간식을 즐기기 좋은 곳입니다.',
          pt: 'O povoado celta reconstruído abre no verão das 11:00 às 13:00 e das 17:00 às 19:00. Um ótimo sítio para um lanche ao pôr do sol.',
          pl: 'Zrekonstruowana celtycka osada latem otwarta jest 11:00–13:00 i 17:00–19:00. Świetne miejsce na przekąskę o zachodzie słońca.',
        },
      },
      {
        name: 'Parque de Castrelos',
        description: {
          es: 'El gran parque de Vigo: praderas enormes, patos, rosaleda y el Pazo Quiñones de León (museo gratuito).',
          en: 'Vigo\'s great park: huge lawns, ducks, a rose garden and the Pazo Quiñones de León (free museum).',
          gl: 'O gran parque de Vigo: pradeiras enormes, patos, roseira e o Pazo Quiñones de León (museo gratuíto).',
          fr: 'Le grand parc de Vigo : immenses pelouses, canards, roseraie et le Pazo Quiñones de León (musée gratuit).',
          de: 'Vigos großer Park: riesige Wiesen, Enten, ein Rosengarten und der Pazo Quiñones de León (kostenloses Museum).',
          ko: '비고의 대공원: 넓은 잔디밭, 오리, 장미 정원, 그리고 파소 키뇨네스 데 레온(무료 박물관).',
          pt: 'O grande parque de Vigo: relvados enormes, patos, roseiral e o Pazo Quiñones de León (museu gratuito).',
          pl: 'Wielki park Vigo: ogromne trawniki, kaczki, ogród różany i Pazo Quiñones de León (bezpłatne muzeum).',
        },
        distance: {
          es: '~15 min coche', en: '~15 min drive', gl: '~15 min coche', fr: '~15 min en voiture',
          de: '~15 Min. mit dem Auto', ko: '차로 약 15분', pt: '~15 min de carro', pl: '~15 min autem',
        },
        free: true,
        tip: {
          es: 'Llevad pelota o frisbee: hay espacio de sobra para correr.',
          en: 'Bring a ball or frisbee: there is plenty of space to run around.',
          gl: 'Levade pelota ou frisbee: hai espazo de sobra para correr.',
          fr: 'Apportez un ballon ou un frisbee : il y a plein d\'espace pour courir.',
          de: 'Bringen Sie einen Ball oder ein Frisbee mit: es gibt viel Platz zum Herumtoben.',
          ko: '공이나 프리스비를 가져가세요. 뛰어놀 공간이 넉넉합니다.',
          pt: 'Levem bola ou frisbee: há espaço de sobra para correr.',
          pl: 'Zabierzcie piłkę lub frisbee: jest mnóstwo miejsca do biegania.',
        },
      },
      {
        name: 'VigoNature (antiguo Vigozoo)',
        description: {
          es: 'El antiguo zoo de A Madroa reabrió en 2026 como VigoNature: un centro de naturaleza y aventura con tirolinas, actividades y buenas vistas de la ría, ya sin animales salvajes en cautividad.',
          en: 'The former A Madroa zoo reopened in 2026 as VigoNature: a nature and adventure centre with zip lines, activities and great estuary views, no longer keeping caged wild animals.',
          gl: 'O antigo zoo da Madroa reabriu en 2026 como VigoNature: un centro de natureza e aventura con tirolinas, actividades e boas vistas da ría, xa sen animais salvaxes en catividade.',
          fr: 'L\'ancien zoo d\'A Madroa a rouvert en 2026 sous le nom de VigoNature : un centre nature et aventure avec tyroliennes, activités et belles vues sur la ria, sans animaux sauvages en captivité.',
          de: 'Der frühere Zoo von A Madroa wurde 2026 als VigoNature wiedereröffnet: ein Natur- und Abenteuerzentrum mit Seilbahnen, Aktivitäten und schöner Aussicht auf die Bucht, ohne Wildtiere in Gefangenschaft.',
          ko: '아 마드로아의 옛 동물원이 2026년 VigoNature로 재개장했습니다: 짚라인, 각종 활동, 만의 멋진 전망을 갖춘 자연·모험 센터로, 이제 야생동물을 가두어 두지 않습니다.',
          pt: 'O antigo zoo de A Madroa reabriu em 2026 como VigoNature: um centro de natureza e aventura com tirolesas, atividades e boas vistas da ria, já sem animais selvagens em cativeiro.',
          pl: 'Dawne zoo w A Madroa otwarto ponownie w 2026 jako VigoNature: centrum przyrody i przygody z tyrolkami, zajęciami i ładnymi widokami na zatokę, już bez dzikich zwierząt w niewoli.',
        },
        distance: {
          es: '~20 min coche', en: '~20 min drive', gl: '~20 min coche', fr: '~20 min en voiture',
          de: '~20 Min. mit dem Auto', ko: '차로 약 20분', pt: '~20 min de carro', pl: '~20 min autem',
        },
        price: {
          es: 'Niños desde 2,70 €, adultos desde 5,45 €',
          en: 'Kids from €2.70, adults from €5.45',
          gl: 'Nenos desde 2,70 €, adultos desde 5,45 €',
          fr: 'Enfants dès 2,70 €, adultes dès 5,45 €',
          de: 'Kinder ab 2,70 €, Erwachsene ab 5,45 €',
          ko: '어린이 2,70 €부터, 성인 5,45 €부터',
          pt: 'Crianças desde 2,70 €, adultos desde 5,45 €',
          pl: 'Dzieci od 2,70 €, dorośli od 5,45 €',
        },
        url: 'https://www.vigonature.es',
        tip: {
          es: 'Ya no es un zoo con animales: ahora es aventura y naturaleza. Consultad qué tirolinas y actividades requieren reserva.',
          en: 'It\'s no longer a zoo with animals: now it\'s adventure and nature. Check which zip lines and activities need booking.',
          gl: 'Xa non é un zoo con animais: agora é aventura e natureza. Consultade que tirolinas e actividades requiren reserva.',
          fr: 'Ce n\'est plus un zoo avec des animaux : c\'est désormais aventure et nature. Vérifiez quelles tyroliennes et activités nécessitent une réservation.',
          de: 'Es ist kein Zoo mit Tieren mehr: jetzt Abenteuer und Natur. Prüfen Sie, welche Seilbahnen und Aktivitäten eine Reservierung erfordern.',
          ko: '더 이상 동물이 있는 동물원이 아니라 모험과 자연 공간입니다. 어떤 짚라인과 활동에 예약이 필요한지 확인하세요.',
          pt: 'Já não é um zoo com animais: agora é aventura e natureza. Verifiquem que tirolesas e atividades exigem reserva.',
          pl: 'To już nie zoo ze zwierzętami: teraz przygoda i natura. Sprawdźcie, które tyrolki i zajęcia wymagają rezerwacji.',
        },
      },
      {
        name: 'Verbum – Casa das Palabras',
        description: {
          es: 'Museo interactivo sobre el lenguaje, con juegos y pantallas para tocar. Ideal para 8-10 años, junto al paseo de Samil.',
          en: 'Interactive museum about language, with games and touchscreens. Ideal for ages 8-10, next to the Samil promenade.',
          gl: 'Museo interactivo sobre a linguaxe, con xogos e pantallas para tocar. Ideal para 8-10 anos, xunto ao paseo de Samil.',
          fr: 'Musée interactif sur le langage, avec des jeux et des écrans tactiles. Idéal pour les 8-10 ans, près de la promenade de Samil.',
          de: 'Interaktives Museum über Sprache, mit Spielen und Touchscreens. Ideal für 8- bis 10-Jährige, nahe der Promenade von Samil.',
          ko: '언어에 관한 인터랙티브 박물관으로, 게임과 터치스크린이 있습니다. 8~10세에게 이상적이며 사밀 산책로 옆에 있습니다.',
          pt: 'Museu interativo sobre a linguagem, com jogos e ecrãs tácteis. Ideal para os 8-10 anos, junto ao passeio de Samil.',
          pl: 'Interaktywne muzeum o języku, z grami i ekranami dotykowymi. Idealne dla dzieci w wieku 8-10 lat, obok promenady Samil.',
        },
        distance: {
          es: '~5 min', en: '~5 min', gl: '~5 min', fr: '~5 min', de: '~5 Min.', ko: '약 5분', pt: '~5 min', pl: '~5 min',
        },
        tip: {
          es: 'Cerrado los lunes; entre semana solo abre por la tarde. Entrada económica (unos 3 €).',
          en: 'Closed Mondays; on weekdays it only opens in the afternoon. Low-cost entry (about €3).',
          gl: 'Pechado os luns; entre semana só abre pola tarde. Entrada económica (uns 3 €).',
          fr: 'Fermé le lundi ; en semaine, ouvert seulement l\'après-midi. Entrée à petit prix (environ 3 €).',
          de: 'Montags geschlossen; werktags nur nachmittags geöffnet. Günstiger Eintritt (etwa 3 €).',
          ko: '월요일 휴관; 평일에는 오후에만 엽니다. 입장료가 저렴합니다(약 3 €).',
          pt: 'Fechado às segundas; durante a semana só abre à tarde. Entrada económica (cerca de 3 €).',
          pl: 'W poniedziałki zamknięte; w dni powszednie otwarte tylko po południu. Tani wstęp (około 3 €).',
        },
      },
      {
        name: 'MARCO',
        description: {
          es: 'Museo de arte contemporáneo en el centro, con talleres y actividades familiares los fines de semana.',
          en: 'Contemporary art museum downtown, with family workshops and activities on weekends.',
          gl: 'Museo de arte contemporánea no centro, con obradoiros e actividades familiares as fins de semana.',
          fr: 'Musée d\'art contemporain au centre, avec des ateliers et des activités familiales le week-end.',
          de: 'Museum für zeitgenössische Kunst im Zentrum, mit Familienworkshops und Aktivitäten am Wochenende.',
          ko: '시내에 있는 현대 미술관으로, 주말에 가족 워크숍과 활동이 열립니다.',
          pt: 'Museu de arte contemporânea no centro, com oficinas e atividades familiares aos fins de semana.',
          pl: 'Muzeum sztuki współczesnej w centrum, z rodzinnymi warsztatami i zajęciami w weekendy.',
        },
        distance: {
          es: '~15 min', en: '~15 min', gl: '~15 min', fr: '~15 min', de: '~15 Min.', ko: '약 15분', pt: '~15 min', pl: '~15 min',
        },
        free: true,
        url: 'https://www.marcovigo.com',
        tip: {
          es: 'Entrada gratuita. Cerrado los lunes; mirad si la exposición del momento es apta para niños.',
          en: 'Free entry. Closed Mondays; check whether the current exhibition suits kids.',
          gl: 'Entrada gratuíta. Pechado os luns; mirade se a exposición do momento é apta para nenos.',
          fr: 'Entrée gratuite. Fermé le lundi ; vérifiez si l\'exposition du moment convient aux enfants.',
          de: 'Freier Eintritt. Montags geschlossen; prüfen Sie, ob die aktuelle Ausstellung für Kinder geeignet ist.',
          ko: '무료 입장. 월요일 휴관; 현재 전시가 아이에게 적합한지 확인하세요.',
          pt: 'Entrada gratuita. Fechado às segundas; vejam se a exposição do momento é adequada a crianças.',
          pl: 'Wstęp wolny. W poniedziałki zamknięte; sprawdźcie, czy bieżąca wystawa jest odpowiednia dla dzieci.',
        },
      },
      {
        name: 'Marikiná Park',
        description: {
          es: 'Parque de aventura en los árboles con tirolinas, puentes colgantes y circuitos, a las afueras de Vigo (Beade). El circuito familiar admite desde 7 años y 1,20 m de altura.',
          en: 'Treetop adventure park with zip lines, rope bridges and circuits, on the edge of Vigo (Beade). The family circuit is for ages 7+ and 1.20 m tall.',
          gl: 'Parque de aventura nas árbores con tirolinas, pontes colgantes e circuítos, ás aforas de Vigo (Beade). O circuíto familiar admite desde 7 anos e 1,20 m de altura.',
          fr: 'Parc aventure dans les arbres avec tyroliennes, ponts de singe et parcours, aux abords de Vigo (Beade). Le parcours familial est accessible dès 7 ans et 1,20 m.',
          de: 'Kletterpark in den Bäumen mit Seilbahnen, Hängebrücken und Parcours, am Rande von Vigo (Beade). Der Familienparcours ist ab 7 Jahren und 1,20 m Größe.',
          ko: '비고 외곽(베아데)에 있는 짚라인, 출렁다리, 코스를 갖춘 수목 어드벤처 파크. 가족 코스는 7세 이상, 키 1.20m부터 이용할 수 있습니다.',
          pt: 'Parque de aventura nas árvores com tirolesas, pontes suspensas e circuitos, nos arredores de Vigo (Beade). O circuito familiar é a partir dos 7 anos e 1,20 m de altura.',
          pl: 'Park linowy w koronach drzew z tyrolkami, mostami linowymi i trasami, na obrzeżach Vigo (Beade). Trasa rodzinna od 7 lat i 1,20 m wzrostu.',
        },
        distance: {
          es: '~15 min coche', en: '~15 min drive', gl: '~15 min coche', fr: '~15 min en voiture',
          de: '~15 Min. mit dem Auto', ko: '차로 약 15분', pt: '~15 min de carro', pl: '~15 min autem',
        },
        booking: true,
        url: 'https://www.marikinapark.com',
        tip: {
          es: 'Perfecto para 8-10 años. Reservad y confirmad la altura mínima de cada niño.',
          en: 'Perfect for ages 8-10. Book ahead and check each child\'s minimum height.',
          gl: 'Perfecto para 8-10 anos. Reservade e confirmade a altura mínima de cada neno.',
          fr: 'Parfait pour les 8-10 ans. Réservez et vérifiez la taille minimale de chaque enfant.',
          de: 'Perfekt für 8- bis 10-Jährige. Vorab buchen und die Mindestgröße jedes Kindes prüfen.',
          ko: '8~10세에게 안성맞춤. 예약하고 각 아이의 최소 키를 확인하세요.',
          pt: 'Perfeito para os 8-10 anos. Reservem e confirmem a altura mínima de cada criança.',
          pl: 'Idealne dla 8-10 lat. Zarezerwujcie i sprawdźcie minimalny wzrost każdego dziecka.',
        },
      },
      {
        name: 'Naturnova',
        description: {
          es: 'Exposición interactiva sobre el universo, el planeta y el medio ambiente (5.000 m²) en el centro. Muy manipulativa, ideal para niños.',
          en: 'Interactive exhibition about the universe, the planet and the environment (5,000 m²) downtown. Very hands-on, ideal for kids.',
          gl: 'Exposición interactiva sobre o universo, o planeta e o medio ambiente (5.000 m²) no centro. Moi manipulativa, ideal para nenos.',
          fr: 'Exposition interactive sur l\'univers, la planète et l\'environnement (5 000 m²) au centre. Très ludique, idéale pour les enfants.',
          de: 'Interaktive Ausstellung über das Universum, den Planeten und die Umwelt (5.000 m²) im Zentrum. Sehr zum Anfassen, ideal für Kinder.',
          ko: '우주, 지구, 환경에 관한 인터랙티브 전시(5,000㎡)로 시내에 있습니다. 체험형이라 아이들에게 이상적입니다.',
          pt: 'Exposição interativa sobre o universo, o planeta e o ambiente (5.000 m²) no centro. Muito manipulativa, ideal para crianças.',
          pl: 'Interaktywna wystawa o wszechświecie, planecie i środowisku (5000 m²) w centrum. Bardzo praktyczna, idealna dla dzieci.',
        },
        distance: {
          es: '~15 min', en: '~15 min', gl: '~15 min', fr: '~15 min', de: '~15 Min.', ko: '약 15분', pt: '~15 min', pl: '~15 min',
        },
        tip: {
          es: 'Perfecto para un día de lluvia. Consultad el horario de visitas.',
          en: 'Perfect for a rainy day. Check visiting hours.',
          gl: 'Perfecto para un día de choiva. Consultade o horario de visitas.',
          fr: 'Parfait pour un jour de pluie. Vérifiez les horaires de visite.',
          de: 'Perfekt für einen Regentag. Besuchszeiten prüfen.',
          ko: '비 오는 날에 안성맞춤. 관람 시간을 확인하세요.',
          pt: 'Perfeito para um dia de chuva. Consultem o horário de visitas.',
          pl: 'Idealne na deszczowy dzień. Sprawdźcie godziny zwiedzania.',
        },
      },
      {
        name: 'Vigo Vertical y el ascensor HALO',
        description: {
          es: 'Vigo salva sus cuestas con ascensores y rampas mecánicas gratuitos. El ascensor HALO, con su gran anillo, es toda una atracción para los niños.',
          en: 'Vigo tackles its hills with free lifts and mechanical ramps. The HALO lift, with its big ring, is an attraction in itself for kids.',
          gl: 'Vigo salva as súas costas con ascensores e rampas mecánicas gratuítos. O ascensor HALO, co seu gran anel, é toda unha atracción para os nenos.',
          fr: 'Vigo franchit ses côtes avec des ascenseurs et rampes mécaniques gratuits. L\'ascenseur HALO, avec son grand anneau, est une attraction pour les enfants.',
          de: 'Vigo überwindet seine Hügel mit kostenlosen Aufzügen und Rolltreppen. Der HALO-Aufzug mit seinem großen Ring ist für Kinder eine Attraktion.',
          ko: '비고는 무료 엘리베이터와 에스컬레이터로 언덕을 오릅니다. 큰 고리 모양의 HALO 엘리베이터는 그 자체로 아이들에게 볼거리입니다.',
          pt: 'Vigo vence as suas encostas com elevadores e rampas mecânicas gratuitos. O elevador HALO, com o seu grande anel, é uma atração para as crianças.',
          pl: 'Vigo pokonuje wzniesienia darmowymi windami i schodami ruchomymi. Winda HALO z wielkim pierścieniem to atrakcja sama w sobie dla dzieci.',
        },
        distance: {
          es: '~15 min', en: '~15 min', gl: '~15 min', fr: '~15 min', de: '~15 Min.', ko: '약 15분', pt: '~15 min', pl: '~15 min',
        },
        free: true,
        tip: {
          es: 'La app gratuita "Turismo de Vigo" tiene audioguías y rutas; hay también bus turístico por la ciudad.',
          en: 'The free "Turismo de Vigo" app has audio guides and routes; there is also a city tourist bus.',
          gl: 'A app gratuíta "Turismo de Vigo" ten audioguías e rutas; hai tamén bus turístico pola cidade.',
          fr: 'L\'appli gratuite « Turismo de Vigo » propose des audioguides et des itinéraires ; il y a aussi un bus touristique.',
          de: 'Die kostenlose App „Turismo de Vigo“ bietet Audioguides und Routen; es gibt auch einen Touristenbus.',
          ko: '무료 앱 "Turismo de Vigo"에 오디오 가이드와 루트가 있고, 시내 관광버스도 있습니다.',
          pt: 'A app gratuita "Turismo de Vigo" tem audioguias e rotas; há também autocarro turístico pela cidade.',
          pl: 'Bezpłatna aplikacja „Turismo de Vigo” ma audioprzewodniki i trasy; jest też autobus turystyczny po mieście.',
        },
      },
    ],
  },
  {
    id: 'cies',
    emoji: '⛴️',
    image: '/casas-vigo/images/vigo/cies.jpg',
    title: {
      es: 'La excursión estrella: Islas Cíes', en: 'The star trip: Cíes Islands', gl: 'A excursión estrela: Illas Cíes',
      fr: 'L\'excursion star : les îles Cíes', de: 'Der Höhepunkt: die Cíes-Inseln', ko: '최고의 여행: 시에스 제도',
      pt: 'A excursão estrela: Ilhas Cíes', pl: 'Wycieczka marzeń: Wyspy Cíes',
    },
    intro: {
      es: 'Parque Nacional de las Islas Atlánticas. Se necesita autorización y billete de ferry; conviene reservar con antelación.',
      en: 'Atlantic Islands National Park. You need an authorization and a ferry ticket; book in advance.',
      gl: 'Parque Nacional das Illas Atlánticas. Precísase autorización e billete de ferry; convén reservar con antelación.',
      fr: 'Parc national des îles Atlantiques. Une autorisation et un billet de ferry sont nécessaires ; réservez à l\'avance.',
      de: 'Nationalpark der Atlantischen Inseln. Sie brauchen eine Genehmigung und ein Fährticket; buchen Sie im Voraus.',
      ko: '대서양 제도 국립공원. 허가증과 페리 티켓이 필요하며, 미리 예약하는 것이 좋습니다.',
      pt: 'Parque Nacional das Ilhas Atlânticas. É necessária autorização e bilhete de ferry; convém reservar com antecedência.',
      pl: 'Park Narodowy Wysp Atlantyckich. Potrzebne są zezwolenie i bilet na prom; warto rezerwować z wyprzedzeniem.',
    },
    places: [
      {
        name: 'Ferry a las Islas Cíes',
        description: {
          es: 'Barco desde la estación marítima de Vigo (unos 40 min de travesía). Solo en temporada (aprox. Semana Santa y verano).',
          en: 'Boat from Vigo\'s ferry terminal (about a 40-min crossing). Only in season (roughly Easter and summer).',
          gl: 'Barco desde a estación marítima de Vigo (uns 40 min de travesía). Só en temporada (aprox. Semana Santa e verán).',
          fr: 'Bateau depuis la gare maritime de Vigo (environ 40 min de traversée). Seulement en saison (environ Pâques et été).',
          de: 'Schiff vom Fährterminal in Vigo (etwa 40 Min. Überfahrt). Nur in der Saison (etwa Ostern und Sommer).',
          ko: '비고 여객 터미널에서 출발하는 배(약 40분 소요). 성수기(대략 부활절과 여름)에만 운항합니다.',
          pt: 'Barco a partir da estação marítima de Vigo (cerca de 40 min de travessia). Apenas na época (aprox. Páscoa e verão).',
          pl: 'Statek z terminalu promowego w Vigo (rejs około 40 min). Tylko w sezonie (mniej więcej Wielkanoc i lato).',
        },
        booking: true,
        price: {
          es: 'Ida y vuelta: adulto 27,50 €, niño 5-12 años 12 €, menores de 5 gratis',
          en: 'Return: adult €27.50, child 5-12 €12, under 5 free',
          gl: 'Ida e volta: adulto 27,50 €, neno 5-12 anos 12 €, menores de 5 gratis',
          fr: 'Aller-retour : adulte 27,50 €, enfant 5-12 ans 12 €, moins de 5 ans gratuit',
          de: 'Hin- und Rückfahrt: Erwachsene 27,50 €, Kind 5-12 J. 12 €, unter 5 kostenlos',
          ko: '왕복: 성인 27,50 €, 어린이 5-12세 12 €, 5세 미만 무료',
          pt: 'Ida e volta: adulto 27,50 €, criança 5-12 anos 12 €, menores de 5 grátis',
          pl: 'W obie strony: dorosły 27,50 €, dziecko 5-12 lat 12 €, poniżej 5 lat za darmo',
        },
        url: 'https://mardeons.es',
        tip: {
          es: 'Solicitad la autorización en autorizacionillasatlanticas.xunta.gal y comprad el billete con la naviera; reservad con semanas de antelación en verano.',
          en: 'Request the authorization at autorizacionillasatlanticas.xunta.gal and buy the ticket from the ferry company; book weeks ahead in summer.',
          gl: 'Solicitade a autorización en autorizacionillasatlanticas.xunta.gal e comprade o billete coa naviera; reservade con semanas de antelación no verán.',
          fr: 'Demandez l\'autorisation sur autorizacionillasatlanticas.xunta.gal et achetez le billet auprès de la compagnie ; réservez des semaines à l\'avance en été.',
          de: 'Beantragen Sie die Genehmigung auf autorizacionillasatlanticas.xunta.gal und kaufen Sie das Ticket bei der Reederei; im Sommer Wochen im Voraus buchen.',
          ko: 'autorizacionillasatlanticas.xunta.gal에서 허가를 신청하고 선사에서 티켓을 구매하세요; 여름에는 몇 주 전에 예약하세요.',
          pt: 'Solicitem a autorização em autorizacionillasatlanticas.xunta.gal e comprem o bilhete à companhia; reservem com semanas de antecedência no verão.',
          pl: 'Poproś o zezwolenie na autorizacionillasatlanticas.xunta.gal i kup bilet u przewoźnika; latem rezerwuj z kilkutygodniowym wyprzedzeniem.',
        },
      },
      {
        name: 'Praia de Rodas',
        description: {
          es: 'Arena blanca y agua turquesa, con orilla poco profunda perfecta para niños. Considerada una de las mejores playas del mundo.',
          en: 'White sand and turquoise water, with a shallow shore perfect for kids. Rated one of the best beaches in the world.',
          gl: 'Area branca e auga turquesa, con orela pouco profunda perfecta para nenos. Considerada unha das mellores praias do mundo.',
          fr: 'Sable blanc et eau turquoise, avec un rivage peu profond parfait pour les enfants. Considérée comme l\'une des plus belles plages du monde.',
          de: 'Weißer Sand und türkisfarbenes Wasser, mit flachem Ufer, perfekt für Kinder. Gilt als einer der besten Strände der Welt.',
          ko: '흰 모래와 청록색 바다, 아이들에게 완벽한 얕은 물가. 세계 최고의 해변 중 하나로 꼽힙니다.',
          pt: 'Areia branca e água turquesa, com margem pouco profunda perfeita para crianças. Considerada uma das melhores praias do mundo.',
          pl: 'Biały piasek i turkusowa woda, z płytkim brzegiem idealnym dla dzieci. Uznawana za jedną z najlepszych plaż na świecie.',
        },
        free: true,
        tip: {
          es: 'Llevad comida, agua y sombra: en la isla la oferta es limitada.',
          en: 'Bring food, water and shade: options on the island are limited.',
          gl: 'Levade comida, auga e sombra: na illa a oferta é limitada.',
          fr: 'Apportez nourriture, eau et ombre : l\'offre sur l\'île est limitée.',
          de: 'Bringen Sie Essen, Wasser und Schatten mit: das Angebot auf der Insel ist begrenzt.',
          ko: '음식, 물, 그늘을 챙기세요. 섬에는 편의시설이 제한적입니다.',
          pt: 'Levem comida, água e sombra: na ilha a oferta é limitada.',
          pl: 'Zabierzcie jedzenie, wodę i osłonę od słońca: oferta na wyspie jest ograniczona.',
        },
      },
      {
        name: 'Ruta al faro y miradores',
        description: {
          es: 'Caminos señalizados y fáciles hasta faros y miradores, con gaviotas y vistas espectaculares.',
          en: 'Easy, well-marked trails to lighthouses and viewpoints, with gulls and spectacular views.',
          gl: 'Camiños sinalizados e fáciles ata faros e miradoiros, con gaivotas e vistas espectaculares.',
          fr: 'Sentiers faciles et balisés vers les phares et points de vue, avec des mouettes et des panoramas spectaculaires.',
          de: 'Einfache, gut markierte Wege zu Leuchttürmen und Aussichtspunkten, mit Möwen und spektakulärer Aussicht.',
          ko: '갈매기와 멋진 전망이 있는, 등대와 전망대로 이어지는 쉽고 잘 표시된 길.',
          pt: 'Trilhos sinalizados e fáceis até faróis e miradouros, com gaivotas e vistas espetaculares.',
          pl: 'Łatwe, dobrze oznaczone szlaki do latarni i punktów widokowych, z mewami i spektakularnymi widokami.',
        },
        free: true,
        tip: {
          es: 'El faro de Cíes es la ruta más asequible con niños (aprox. 1 h de subida).',
          en: 'The Cíes lighthouse is the most manageable trail with kids (about a 1-hour climb).',
          gl: 'O faro de Cíes é a ruta máis accesible con nenos (aprox. 1 h de subida).',
          fr: 'Le phare de Cíes est le sentier le plus accessible avec des enfants (environ 1 h de montée).',
          de: 'Der Leuchtturm von Cíes ist der machbarste Weg mit Kindern (etwa 1 Std. Aufstieg).',
          ko: '시에스 등대는 아이와 함께 가기 가장 무난한 코스입니다(오르막 약 1시간).',
          pt: 'O farol de Cíes é o trilho mais acessível com crianças (cerca de 1 h de subida).',
          pl: 'Latarnia Cíes to najłatwiejszy szlak z dziećmi (podejście około 1 godz.).',
        },
      },
      {
        name: 'Museo do Parque das Illas Atlánticas',
        description: {
          es: 'Centro de interpretación de las Cíes, Ons, Cortegada y Sálvora, en el casco viejo. Entrada gratuita: perfecto para preparar la excursión a las Cíes con los niños antes de ir.',
          en: 'Interpretation centre for the Cíes, Ons, Cortegada and Sálvora islands, in the old town. Free entry: perfect to prepare the Cíes trip with kids beforehand.',
          gl: 'Centro de interpretación das Cíes, Ons, Cortegada e Sálvora, no casco vello. Entrada gratuíta: perfecto para preparar a excursión ás Cíes cos nenos antes de ir.',
          fr: 'Centre d\'interprétation des îles Cíes, Ons, Cortegada et Sálvora, dans la vieille ville. Entrée gratuite : parfait pour préparer l\'excursion aux Cíes avec les enfants.',
          de: 'Informationszentrum für die Inseln Cíes, Ons, Cortegada und Sálvora, in der Altstadt. Freier Eintritt: ideal, um den Cíes-Ausflug mit Kindern vorzubereiten.',
          ko: '구시가지에 있는 시에스, 온스, 코르테가다, 살보라 제도 해설 센터. 무료 입장: 아이와 함께 시에스 여행을 미리 준비하기에 완벽합니다.',
          pt: 'Centro de interpretação das ilhas Cíes, Ons, Cortegada e Sálvora, no centro histórico. Entrada gratuita: perfeito para preparar a excursão às Cíes com as crianças.',
          pl: 'Centrum informacji o wyspach Cíes, Ons, Cortegada i Sálvora, na starym mieście. Wstęp wolny: idealne, by przygotować wyprawę na Cíes z dziećmi.',
        },
        distance: {
          es: '~15 min', en: '~15 min', gl: '~15 min', fr: '~15 min', de: '~15 Min.', ko: '약 15분', pt: '~15 min', pl: '~15 min',
        },
        free: true,
        tip: {
          es: 'Abierto de martes a domingo, 11:00–14:00 y 16:30–19:30.',
          en: 'Open Tuesday to Sunday, 11:00–14:00 and 16:30–19:30.',
          gl: 'Aberto de martes a domingo, 11:00–14:00 e 16:30–19:30.',
          fr: 'Ouvert du mardi au dimanche, 11h–14h et 16h30–19h30.',
          de: 'Dienstag bis Sonntag geöffnet, 11:00–14:00 und 16:30–19:30 Uhr.',
          ko: '화요일–일요일, 11:00–14:00, 16:30–19:30 개방.',
          pt: 'Aberto de terça a domingo, 11:00–14:00 e 16:30–19:30.',
          pl: 'Otwarte od wtorku do niedzieli, 11:00–14:00 i 16:30–19:30.',
        },
      },
    ],
  },
  {
    id: 'daytrips',
    emoji: '🚗',
    image: '/casas-vigo/images/vigo/daytrips.jpg',
    title: {
      es: 'Excursiones de un día cerca', en: 'Nearby day trips', gl: 'Excursións dun día preto',
      fr: 'Excursions d\'une journée à proximité', de: 'Tagesausflüge in der Nähe', ko: '근처 당일 여행',
      pt: 'Excursões de um dia perto', pl: 'Jednodniowe wycieczki w pobliżu',
    },
    intro: {
      es: 'Todas a menos de 45 minutos de Vigo.',
      en: 'All less than 45 minutes from Vigo.',
      gl: 'Todas a menos de 45 minutos de Vigo.',
      fr: 'Toutes à moins de 45 minutes de Vigo.',
      de: 'Alle weniger als 45 Minuten von Vigo entfernt.',
      ko: '모두 비고에서 45분 이내.',
      pt: 'Todas a menos de 45 minutos de Vigo.',
      pl: 'Wszystkie mniej niż 45 minut od Vigo.',
    },
    places: [
      {
        name: 'Baiona y la carabela Pinta',
        description: {
          es: 'Villa marinera preciosa con una réplica navegable de la carabela Pinta que se visita por dentro: bodegas, cañones y camarotes.',
          en: 'Beautiful seaside town with a sailable replica of the caravel Pinta you can board: holds, cannons and cabins.',
          gl: 'Vila mariñeira preciosa cunha réplica navegable da carabela Pinta que se visita por dentro: adegas, canóns e camarotes.',
          fr: 'Charmante ville maritime avec une réplique navigable de la caravelle Pinta que l\'on visite à l\'intérieur : cales, canons et cabines.',
          de: 'Wunderschöne Küstenstadt mit einem segelfähigen Nachbau der Karavelle Pinta, den man von innen besichtigt: Laderäume, Kanonen und Kabinen.',
          ko: '내부를 둘러볼 수 있는 항해 가능한 카라벨 핀타호 복제선이 있는 아름다운 해안 마을: 선창, 대포, 선실.',
          pt: 'Bela vila marítima com uma réplica navegável da caravela Pinta que se visita por dentro: porões, canhões e camarotes.',
          pl: 'Piękne nadmorskie miasteczko z pływającą repliką karaweli Pinta, którą zwiedza się w środku: ładownie, armaty i kajuty.',
        },
        distance: {
          es: '~25 min coche', en: '~25 min drive', gl: '~25 min coche', fr: '~25 min en voiture',
          de: '~25 Min. mit dem Auto', ko: '차로 약 25분', pt: '~25 min de carro', pl: '~25 min autem',
        },
        price: {
          es: 'Carabela: unos 3 € (martes suele ser gratis)',
          en: 'Caravel: about €3 (Tuesdays often free)',
          gl: 'Carabela: uns 3 € (o martes adoita ser gratis)',
          fr: 'Caravelle : environ 3 € (souvent gratuit le mardi)',
          de: 'Karavelle: etwa 3 € (dienstags oft kostenlos)',
          ko: '카라벨선: 약 3 € (화요일은 보통 무료)',
          pt: 'Caravela: cerca de 3 € (às terças costuma ser grátis)',
          pl: 'Karawela: około 3 € (we wtorki często za darmo)',
        },
        tip: {
          es: 'Cerrado los lunes. Combinadlo con un paseo por la muralla del Parador.',
          en: 'Combine it with a walk along the Parador\'s walls.',
          gl: 'Combinádeo cun paseo pola muralla do Parador.',
          fr: 'Associez-le à une promenade sur les remparts du Parador.',
          de: 'Verbinden Sie es mit einem Spaziergang auf der Mauer des Parador.',
          ko: '파라도르 성벽 산책과 함께 즐기세요.',
          pt: 'Combinem com um passeio pela muralha do Parador.',
          pl: 'Połączcie to ze spacerem po murach Paradoru.',
        },
      },
      {
        name: 'A Guarda y el Monte Santa Trega',
        description: {
          es: 'Poblado celta (castro) que se recorre entrando en las casas circulares, con vistas a la desembocadura del Miño y Portugal.',
          en: 'Celtic hillfort you walk through, stepping into the round houses, with views over the mouth of the Miño and Portugal.',
          gl: 'Poboado celta (castro) que se percorre entrando nas casas circulares, con vistas á desembocadura do Miño e Portugal.',
          fr: 'Village celte (castro) que l\'on parcourt en entrant dans les maisons circulaires, avec vue sur l\'embouchure du Miño et le Portugal.',
          de: 'Keltische Siedlung (Castro), durch die man geht und in die Rundhäuser tritt, mit Blick auf die Mündung des Miño und Portugal.',
          ko: '원형 집에 들어가 볼 수 있는 켈트족 요새 마을(카스트로)로, 미뇨강 하구와 포르투갈이 내려다보입니다.',
          pt: 'Povoado celta (castro) que se percorre entrando nas casas circulares, com vistas à foz do Minho e Portugal.',
          pl: 'Celtycka osada (castro), którą zwiedza się wchodząc do okrągłych domów, z widokiem na ujście Minho i Portugalię.',
        },
        distance: {
          es: '~50 min coche', en: '~50 min drive', gl: '~50 min coche', fr: '~50 min en voiture',
          de: '~50 Min. mit dem Auto', ko: '차로 약 50분', pt: '~50 min de carro', pl: '~50 min autem',
        },
        tip: {
          es: 'Se puede subir en coche casi hasta arriba.',
          en: 'You can drive almost all the way to the top.',
          gl: 'Pódese subir en coche case ata arriba.',
          fr: 'On peut monter en voiture presque jusqu\'au sommet.',
          de: 'Man kann fast bis nach oben fahren.',
          ko: '차로 정상 근처까지 올라갈 수 있습니다.',
          pt: 'Pode subir-se de carro quase até ao cimo.',
          pl: 'Samochodem można wjechać prawie na sam szczyt.',
        },
      },
      {
        name: 'Cangas en ferry',
        description: {
          es: 'La travesía en barco por la ría ya es una aventura; en Cangas hay playas tranquilas como Rodeira.',
          en: 'The boat crossing over the estuary is an adventure in itself; Cangas has calm beaches like Rodeira.',
          gl: 'A travesía en barco pola ría xa é unha aventura; en Cangas hai praias tranquilas como Rodeira.',
          fr: 'La traversée en bateau sur la ria est déjà une aventure ; Cangas a des plages calmes comme Rodeira.',
          de: 'Die Bootsfahrt über die Bucht ist schon ein Abenteuer; Cangas hat ruhige Strände wie Rodeira.',
          ko: '만을 건너는 뱃길 자체가 모험입니다. 칸가스에는 로데이라 같은 잔잔한 해변이 있습니다.',
          pt: 'A travessia de barco pela ria já é uma aventura; em Cangas há praias calmas como Rodeira.',
          pl: 'Sam rejs promem przez zatokę to przygoda; w Cangas są spokojne plaże, jak Rodeira.',
        },
        distance: {
          es: '~25 min en barco', en: '~25 min by boat', gl: '~25 min en barco', fr: '~25 min en bateau',
          de: '~25 Min. mit dem Boot', ko: '배로 약 25분', pt: '~25 min de barco', pl: '~25 min statkiem',
        },
        tip: {
          es: 'El ferry sale cada 15 min desde la estación marítima; el trayecto ya es diversión para los niños.',
          en: 'The ferry leaves every 15 min from the terminal; the ride itself is fun for kids.',
          gl: 'O ferry sae cada 15 min desde a estación marítima; o traxecto xa é diversión para os nenos.',
          fr: 'Le ferry part toutes les 15 min de la gare maritime ; la traversée est déjà un plaisir pour les enfants.',
          de: 'Die Fähre fährt alle 15 Min. vom Terminal; die Fahrt allein macht Kindern Spaß.',
          ko: '페리는 여객터미널에서 15분마다 출발하며, 뱃길 자체가 아이들에게 즐거움입니다.',
          pt: 'O ferry sai a cada 15 min da estação marítima; a travessia já é diversão para as crianças.',
          pl: 'Prom odpływa co 15 min z terminalu; sam rejs to już frajda dla dzieci.',
        },
      },
      {
        name: 'Pontevedra',
        description: {
          es: 'Casco histórico peatonal muy cómodo con niños, con plazas, heladerías y la basílica de Santa María.',
          en: 'Pedestrian old town that\'s very easy with kids, with squares, ice-cream shops and the Santa María basilica.',
          gl: 'Casco histórico peonil moi cómodo con nenos, con prazas, xeadarías e a basílica de Santa María.',
          fr: 'Centre historique piéton très pratique avec des enfants, avec des places, des glaciers et la basilique Santa María.',
          de: 'Autofreie Altstadt, sehr angenehm mit Kindern, mit Plätzen, Eisdielen und der Basilika Santa María.',
          ko: '광장, 아이스크림 가게, 산타 마리아 대성당이 있는, 아이와 다니기 편한 보행자 구시가지.',
          pt: 'Centro histórico pedonal muito cómodo com crianças, com praças, geladarias e a basílica de Santa María.',
          pl: 'Deptakowe stare miasto bardzo wygodne z dziećmi, z placami, lodziarniami i bazyliką Santa María.',
        },
        distance: {
          es: '~30 min', en: '~30 min', gl: '~30 min', fr: '~30 min', de: '~30 Min.', ko: '약 30분', pt: '~30 min', pl: '~30 min',
        },
        free: true,
        tip: {
          es: 'No os perdáis la Illa das Esculturas, un parque junto al río con esculturas, carril bici y zona infantil.',
          en: 'Don\'t miss the Illa das Esculturas, a riverside park with sculptures, a bike lane and a playground.',
          gl: 'Non vos perdades a Illa das Esculturas, un parque á beira do río con esculturas, carril bici e zona infantil.',
          fr: 'Ne manquez pas l\'Illa das Esculturas, un parc au bord du fleuve avec sculptures, piste cyclable et aire de jeux.',
          de: 'Verpassen Sie nicht die Illa das Esculturas, einen Flusspark mit Skulpturen, Radweg und Spielplatz.',
          ko: '강변 공원인 이야 다스 에스쿨투라스를 놓치지 마세요. 조각품, 자전거 도로, 놀이터가 있습니다.',
          pt: 'Não percam a Illa das Esculturas, um parque junto ao rio com esculturas, ciclovia e zona infantil.',
          pl: 'Nie przegapcie Illa das Esculturas, parku nad rzeką z rzeźbami, ścieżką rowerową i placem zabaw.',
        },
      },
      {
        name: 'Cascadas del Barosa',
        description: {
          es: 'Parque natural con molinos y saltos de agua y un paseo corto y sombreado. Refrescante en verano.',
          en: 'Nature park with mills and waterfalls and a short, shaded walk. Refreshing in summer.',
          gl: 'Parque natural con muíños e saltos de auga e un paseo curto e sombreado. Refrescante no verán.',
          fr: 'Parc naturel avec moulins et cascades et une promenade courte et ombragée. Rafraîchissant en été.',
          de: 'Naturpark mit Mühlen und Wasserfällen und einem kurzen, schattigen Spaziergang. Erfrischend im Sommer.',
          ko: '물레방아와 폭포가 있는 자연공원으로, 짧고 그늘진 산책로가 있습니다. 여름에 시원합니다.',
          pt: 'Parque natural com moinhos e quedas de água e um passeio curto e sombreado. Refrescante no verão.',
          pl: 'Park przyrody z młynami i wodospadami oraz krótkim, zacienionym spacerem. Orzeźwiający latem.',
        },
        distance: {
          es: '~40 min coche', en: '~40 min drive', gl: '~40 min coche', fr: '~40 min en voiture',
          de: '~40 Min. mit dem Auto', ko: '차로 약 40분', pt: '~40 min de carro', pl: '~40 min autem',
        },
        free: true,
      },
      {
        name: 'Serra da Groba (caballos salvajes)',
        description: {
          es: 'Sierra litoral entre Baiona y Oia con la mayor concentración de caballos salvajes atlánticos de Europa, en libertad, y miradores sobre el océano.',
          en: 'Coastal range between Baiona and Oia with Europe\'s largest concentration of wild Atlantic horses roaming free, and ocean viewpoints.',
          gl: 'Serra litoral entre Baiona e Oia coa maior concentración de cabalos salvaxes atlánticos de Europa, en liberdade, e miradoiros sobre o océano.',
          fr: 'Chaîne côtière entre Baiona et Oia avec la plus grande concentration de chevaux sauvages atlantiques d\'Europe, en liberté, et des points de vue sur l\'océan.',
          de: 'Küstengebirge zwischen Baiona und Oia mit Europas größter Konzentration frei lebender atlantischer Wildpferde und Aussichtspunkten aufs Meer.',
          ko: '바이오나와 오이아 사이의 해안 산맥으로, 유럽에서 가장 많은 대서양 야생마가 자유롭게 살고 있으며 바다 전망대가 있습니다.',
          pt: 'Serra litoral entre Baiona e Oia com a maior concentração de cavalos selvagens atlânticos da Europa, em liberdade, e miradouros sobre o oceano.',
          pl: 'Nadmorskie pasmo między Baioną a Oią z największym w Europie skupiskiem dziko żyjących koni atlantyckich i punktami widokowymi nad oceanem.',
        },
        distance: {
          es: '~40 min coche', en: '~40 min drive', gl: '~40 min coche', fr: '~40 min en voiture',
          de: '~40 Min. mit dem Auto', ko: '차로 약 40분', pt: '~40 min de carro', pl: '~40 min autem',
        },
        free: true,
        tip: {
          es: 'Se ven desde la carretera del alto de A Groba. No os acerquéis ni les deis comida: son salvajes.',
          en: 'You can spot them from the road at the A Groba pass. Don\'t approach or feed them: they are wild.',
          gl: 'Vense desde a estrada do alto da Groba. Non vos acheguedes nin lles deades comida: son salvaxes.',
          fr: 'On les aperçoit depuis la route du col d\'A Groba. Ne les approchez pas et ne les nourrissez pas : ils sont sauvages.',
          de: 'Man sieht sie von der Straße am Pass A Groba. Nicht nähern oder füttern: sie sind wild.',
          ko: '아 그로바 고갯길 도로에서 볼 수 있습니다. 다가가거나 먹이를 주지 마세요: 야생입니다.',
          pt: 'Veem-se da estrada do alto de A Groba. Não se aproximem nem lhes deem comida: são selvagens.',
          pl: 'Można je zobaczyć z drogi na przełęczy A Groba. Nie podchodźcie i nie karmcie ich: są dzikie.',
        },
      },
    ],
  },
  {
    id: 'rainy',
    emoji: '🌧️',
    title: {
      es: 'Planes para días de lluvia', en: 'Rainy-day plans', gl: 'Plans para días de choiva',
      fr: 'Idées pour les jours de pluie', de: 'Ideen für Regentage', ko: '비 오는 날 계획',
      pt: 'Planos para dias de chuva', pl: 'Plany na deszczowe dni',
    },
    intro: {
      es: 'Opciones a cubierto sin salir de Vigo.',
      en: 'Indoor options without leaving Vigo.',
      gl: 'Opcións a cuberto sen saír de Vigo.',
      fr: 'Options en intérieur sans quitter Vigo.',
      de: 'Optionen im Innenbereich, ohne Vigo zu verlassen.',
      ko: '비고를 벗어나지 않는 실내 옵션.',
      pt: 'Opções interiores sem sair de Vigo.',
      pl: 'Opcje pod dachem bez wyjeżdżania z Vigo.',
    },
    places: [
      {
        name: 'Centro comercial A Laxe',
        description: {
          es: 'Centro comercial en el puerto con cines y vistas a la ría; buena parada si el tiempo falla.',
          en: 'Shopping centre at the port with cinemas and estuary views; a good stop if the weather turns.',
          gl: 'Centro comercial no porto con cines e vistas á ría; boa parada se o tempo falla.',
          fr: 'Centre commercial au port avec cinémas et vue sur la ria ; une bonne halte si le temps se gâte.',
          de: 'Einkaufszentrum am Hafen mit Kinos und Blick auf die Bucht; ein guter Halt bei schlechtem Wetter.',
          ko: '영화관과 만 전망이 있는 항구의 쇼핑센터. 날씨가 나쁠 때 좋은 코스입니다.',
          pt: 'Centro comercial no porto com cinemas e vistas à ria; boa paragem se o tempo piorar.',
          pl: 'Centrum handlowe w porcie z kinami i widokiem na zatokę; dobry przystanek przy złej pogodzie.',
        },
        distance: {
          es: '~15 min', en: '~15 min', gl: '~15 min', fr: '~15 min', de: '~15 Min.', ko: '약 15분', pt: '~15 min', pl: '~15 min',
        },
        free: true,
      },
      {
        name: 'Museos a cubierto',
        description: {
          es: 'Verbum, el Museo do Mar y el MARCO son perfectos para una tarde lluviosa (ver arriba).',
          en: 'Verbum, the Sea Museum and MARCO are perfect for a rainy afternoon (see above).',
          gl: 'Verbum, o Museo do Mar e o MARCO son perfectos para unha tarde chuviosa (ver arriba).',
          fr: 'Verbum, le musée de la Mer et le MARCO sont parfaits pour un après-midi pluvieux (voir ci-dessus).',
          de: 'Verbum, das Meeresmuseum und das MARCO sind perfekt für einen regnerischen Nachmittag (siehe oben).',
          ko: '베르붐, 바다 박물관, MARCO는 비 오는 오후에 안성맞춤입니다(위 참고).',
          pt: 'O Verbum, o Museu do Mar e o MARCO são perfeitos para uma tarde chuvosa (ver acima).',
          pl: 'Verbum, Muzeum Morza i MARCO są idealne na deszczowe popołudnie (patrz wyżej).',
        },
        free: true,
      },
      {
        name: 'Parques de bolas y ocio indoor',
        description: {
          es: 'Vigo tiene varios parques infantiles cubiertos (piscinas de bolas, hinchables, trampolines), como Tierra Ventura o LaNave, ideales para gastar energía si llueve.',
          en: 'Vigo has several indoor play centres (ball pits, inflatables, trampolines), such as Tierra Ventura or LaNave, ideal for burning energy on a rainy day.',
          gl: 'Vigo ten varios parques infantís cubertos (piscinas de bólas, inchables, trampolíns), como Tierra Ventura ou LaNave, ideais para gastar enerxía se chove.',
          fr: 'Vigo compte plusieurs aires de jeux couvertes (piscines à balles, structures gonflables, trampolines), comme Tierra Ventura ou LaNave, idéales pour se défouler quand il pleut.',
          de: 'Vigo hat mehrere Indoor-Spielplätze (Bällebäder, Hüpfburgen, Trampoline), wie Tierra Ventura oder LaNave, ideal zum Auspowern bei Regen.',
          ko: '비고에는 티에라 벤투라나 라나베처럼 볼풀, 에어바운스, 트램펄린을 갖춘 실내 놀이터가 여러 곳 있어 비 오는 날 에너지를 발산하기 좋습니다.',
          pt: 'Vigo tem vários parques infantis cobertos (piscinas de bolas, insufláveis, trampolins), como o Tierra Ventura ou o LaNave, ideais para gastar energia se chover.',
          pl: 'Vigo ma kilka krytych sal zabaw (baseny z kulkami, dmuchańce, trampoliny), jak Tierra Ventura czy LaNave, idealnych na wyładowanie energii, gdy pada.',
        },
        tip: {
          es: 'Consultad horarios y precios de cada centro.',
          en: 'Check each centre\'s hours and prices.',
          gl: 'Consultade horarios e prezos de cada centro.',
          fr: 'Vérifiez les horaires et tarifs de chaque centre.',
          de: 'Prüfen Sie Öffnungszeiten und Preise jedes Zentrums.',
          ko: '각 센터의 운영 시간과 가격을 확인하세요.',
          pt: 'Consultem horários e preços de cada centro.',
          pl: 'Sprawdźcie godziny i ceny każdego centrum.',
        },
      },
    ],
  },
  {
    id: 'food',
    emoji: '🦪',
    image: '/casas-vigo/images/vigo/food.jpg',
    title: {
      es: 'Comer en familia cerca de Samil', en: 'Family dining near Samil', gl: 'Comer en familia preto de Samil',
      fr: 'Manger en famille près de Samil', de: 'Familienessen nahe Samil', ko: '사밀 근처 가족 식사',
      pt: 'Comer em família perto de Samil', pl: 'Rodzinne jedzenie w pobliżu Samil',
    },
    intro: {
      es: 'Sin alejaros del paseo.',
      en: 'Without straying from the promenade.',
      gl: 'Sen afastarvos do paseo.',
      fr: 'Sans vous éloigner de la promenade.',
      de: 'Ohne die Promenade zu verlassen.',
      ko: '산책로에서 멀리 가지 않아도 됩니다.',
      pt: 'Sem se afastarem do passeio.',
      pl: 'Bez oddalania się od promenady.',
    },
    places: [
      {
        name: 'Paseo de Samil',
        description: {
          es: 'Decenas de terrazas, cafeterías y heladerías frente al mar, con menús para niños.',
          en: 'Dozens of seafront terraces, cafés and ice-cream shops, with kids\' menus.',
          gl: 'Decenas de terrazas, cafeterías e xeadarías fronte ao mar, con menús para nenos.',
          fr: 'Des dizaines de terrasses, cafés et glaciers face à la mer, avec des menus enfants.',
          de: 'Dutzende Terrassen, Cafés und Eisdielen am Meer, mit Kindermenüs.',
          ko: '바다를 마주한 수십 개의 테라스, 카페, 아이스크림 가게가 있으며 어린이 메뉴도 있습니다.',
          pt: 'Dezenas de esplanadas, cafés e geladarias em frente ao mar, com menus para crianças.',
          pl: 'Dziesiątki tarasów, kawiarni i lodziarni nad morzem, z menu dla dzieci.',
        },
        distance: { es: '0 min', en: '0 min', gl: '0 min', fr: '0 min', de: '0 Min.', ko: '0분', pt: '0 min', pl: '0 min' },
      },
      {
        name: 'Parrillada Samil',
        description: {
          es: 'Asador junto a la playa con carnes a la parrilla, marisco y cocina tradicional. Tiene columpios para los niños, cenador cubierto y aparcamiento.',
          en: 'Grill house by the beach with grilled meats, seafood and traditional cooking. It has swings for kids, a covered patio and parking.',
          gl: 'Asador xunto á praia con carnes á grella, marisco e cociña tradicional. Ten randeeiras para os nenos, cenador cuberto e aparcamento.',
          fr: 'Grill près de la plage avec viandes grillées, fruits de mer et cuisine traditionnelle. Il a des balançoires pour les enfants, une terrasse couverte et un parking.',
          de: 'Grillrestaurant am Strand mit Grillfleisch, Meeresfrüchten und traditioneller Küche. Mit Schaukeln für Kinder, überdachter Terrasse und Parkplatz.',
          ko: '해변 옆 그릴 레스토랑으로 구운 고기, 해산물, 전통 요리를 제공합니다. 아이들을 위한 그네, 지붕이 있는 야외석, 주차장이 있습니다.',
          pt: 'Churrasqueira junto à praia com carnes grelhadas, marisco e cozinha tradicional. Tem baloiços para as crianças, alpendre coberto e estacionamento.',
          pl: 'Grill przy plaży z grillowanymi mięsami, owocami morza i tradycyjną kuchnią. Ma huśtawki dla dzieci, zadaszony taras i parking.',
        },
        distance: {
          es: '~5 min', en: '~5 min', gl: '~5 min', fr: '~5 min', de: '~5 Min.', ko: '약 5분', pt: '~5 min', pl: '~5 min',
        },
        tip: {
          es: 'Muy familiar. En verano y fines de semana, reservad.',
          en: 'Very family-friendly. Book on summer weekends.',
          gl: 'Moi familiar. No verán e fins de semana, reservade.',
          fr: 'Très familial. Réservez les week-ends d\'été.',
          de: 'Sehr familienfreundlich. An Sommerwochenenden reservieren.',
          ko: '가족 친화적입니다. 여름과 주말에는 예약하세요.',
          pt: 'Muito familiar. No verão e fins de semana, reservem.',
          pl: 'Bardzo rodzinna. Latem i w weekendy rezerwujcie.',
        },
      },
      {
        name: 'Pulpo, empanada y tarta de Santiago',
        description: {
          es: 'No os vayáis sin probar el pulpo á feira, la empanada gallega y, de postre, la tarta de Santiago.',
          en: 'Don\'t leave without trying octopus á feira, Galician empanada and, for dessert, tarta de Santiago.',
          gl: 'Non marchedes sen probar o polbo á feira, a empanada galega e, de sobremesa, a tarta de Santiago.',
          fr: 'Ne partez pas sans goûter le poulpe á feira, l\'empanada galicienne et, en dessert, la tarta de Santiago.',
          de: 'Gehen Sie nicht, ohne Pulpo á feira, galicische Empanada und zum Nachtisch Tarta de Santiago probiert zu haben.',
          ko: '풀포 아 페이라(문어), 갈리시아식 엠파나다, 후식으로 산티아고 타르트를 꼭 맛보세요.',
          pt: 'Não saiam sem provar o polvo à feira, a empanada galega e, de sobremesa, a tarta de Santiago.',
          pl: 'Nie wyjeżdżajcie bez spróbowania ośmiornicy á feira, galicyjskiej empanady i, na deser, tarta de Santiago.',
        },
        tip: {
          es: 'Casi cualquier restaurante del paseo los tiene.',
          en: 'Almost any restaurant on the promenade has them.',
          gl: 'Case calquera restaurante do paseo os ten.',
          fr: 'Presque tous les restaurants de la promenade en proposent.',
          de: 'Fast jedes Restaurant an der Promenade hat sie.',
          ko: '산책로의 거의 모든 식당에서 맛볼 수 있습니다.',
          pt: 'Quase qualquer restaurante do passeio os tem.',
          pl: 'Ma je prawie każda restauracja na promenadzie.',
        },
      },
    ],
  },
  {
    id: 'furanchos',
    emoji: '🍷',
    title: {
      es: 'Furanchos: vino y tapas caseras', en: 'Furanchos: wine and homemade tapas',
      gl: 'Furanchos: viño e tapas caseiras', fr: 'Furanchos : vin et tapas maison',
      de: 'Furanchos: Wein und hausgemachte Tapas', ko: '푸란초: 와인과 집밥 타파스',
      pt: 'Furanchos: vinho e tapas caseiras', pl: 'Furanchos: wino i domowe tapas',
    },
    intro: {
      es: 'Un furancho es una casa particular gallega que abre por temporada (sobre todo en primavera) para vender su vino de cosecha con comida casera sencilla —tortilla, empanada, zorza, pimientos—, casi siempre en efectivo y al aire libre. Son un plan muy familiar y auténtico. Abren y cierran según la campaña del vino, así que conviene confirmar la apertura cada temporada.',
      en: 'A furancho is a private Galician home that opens seasonally (mainly in spring) to sell its home-grown wine with simple homemade food —tortilla, empanada, zorza, peppers—, usually cash only and outdoors. They are a very family-friendly, authentic plan. They open and close with the wine harvest, so check opening each season.',
      gl: 'Un furancho é unha casa particular galega que abre por temporada (sobre todo na primavera) para vender o seu viño de colleita con comida caseira sinxela —tortilla, empanada, zorza, pementos—, case sempre en efectivo e ao aire libre. Son un plan moi familiar e auténtico. Abren e pechan segundo a campaña do viño, así que convén confirmar a apertura cada temporada.',
      fr: 'Un furancho est une maison privée galicienne qui ouvre selon la saison (surtout au printemps) pour vendre son vin de récolte avec une cuisine maison simple —tortilla, empanada, zorza, poivrons—, presque toujours en espèces et en plein air. C\'est un plan très familial et authentique. Ils ouvrent et ferment au rythme des vendanges, vérifiez donc l\'ouverture à chaque saison.',
      de: 'Ein Furancho ist ein privates galicisches Haus, das saisonal (vor allem im Frühling) öffnet, um seinen selbst angebauten Wein mit einfacher hausgemachter Kost —Tortilla, Empanada, Zorza, Paprika— zu verkaufen, meist nur bar und im Freien. Ein sehr familiärer, authentischer Plan. Sie öffnen und schließen mit der Weinlese, prüfen Sie daher die Öffnung jede Saison.',
      ko: '푸란초는 갈리시아의 개인 가정집이 제철(주로 봄)에 문을 열어 자가 재배 와인을 토르티야, 엠파나다, 소르사, 고추 같은 간단한 가정식과 함께 파는 곳으로, 대개 현금만 받고 야외에서 운영합니다. 매우 가족 친화적이고 현지다운 경험입니다. 포도 수확 상황에 따라 열고 닫으니 매 시즌 영업 여부를 확인하세요.',
      pt: 'Um furancho é uma casa particular galega que abre por época (sobretudo na primavera) para vender o seu vinho de colheita com comida caseira simples —tortilha, empanada, zorza, pimentos—, quase sempre a dinheiro e ao ar livre. São um plano muito familiar e autêntico. Abrem e fecham conforme a campanha do vinho, por isso convém confirmar a abertura em cada época.',
      pl: 'Furancho to prywatny galicyjski dom, który otwiera się sezonowo (głównie wiosną), by sprzedawać własne wino z prostym domowym jedzeniem —tortilla, empanada, zorza, papryczki—, zwykle tylko za gotówkę i na świeżym powietrzu. To bardzo rodzinny i autentyczny pomysł. Otwierają i zamykają się w rytmie winobrania, więc sprawdzajcie otwarcie w każdym sezonie.',
    },
    places: [
      {
        name: 'Furancho Reboraina',
        description: {
          es: 'En un pazo con finca en Reboreda (Redondela), el "furancho del magnolio": albariño de la casa, tortilla, empanada de maíz y embutidos.',
          en: 'In a manor with grounds in Reboreda (Redondela), the "magnolia furancho": house albariño, tortilla, corn empanada and cold cuts.',
          gl: 'Nun pazo con finca en Reboreda (Redondela), o "furancho do magnolio": albariño da casa, tortilla, empanada de millo e embutidos.',
          fr: 'Dans un manoir avec parc à Reboreda (Redondela), le « furancho du magnolia » : albariño maison, tortilla, empanada de maïs et charcuterie.',
          de: 'In einem Herrenhaus mit Grundstück in Reboreda (Redondela), der „Magnolien-Furancho“: hauseigener Albariño, Tortilla, Mais-Empanada und Aufschnitt.',
          ko: '레보레다(레돈델라)의 정원 딸린 파소에 있는 "목련 푸란초": 하우스 알바리뇨, 토르티야, 옥수수 엠파나다, 샤퀴테리.',
          pt: 'Num pazo com quinta em Reboreda (Redondela), o "furancho do magnólio": albariño da casa, tortilha, empanada de milho e enchidos.',
          pl: 'W dworze z posiadłością w Reboredzie (Redondela), „furancho magnolii”: domowe albariño, tortilla, empanada kukurydziana i wędliny.',
        },
        distance: {
          es: '~20-25 min coche', en: '~20-25 min drive', gl: '~20-25 min coche', fr: '~20-25 min en voiture',
          de: '~20-25 Min. mit dem Auto', ko: '차로 약 20-25분', pt: '~20-25 min de carro', pl: '~20-25 min autem',
        },
        tip: {
          es: 'Muy familiar: parque infantil enfrente y aparcamiento. Temporada 2026 aprox. 28 mayo–31 julio, desde las 19:30; no abre si llueve.',
          en: 'Very family-friendly: playground opposite and parking. 2026 season approx. 28 May–31 July, from 19:30; closed when it rains.',
          gl: 'Moi familiar: parque infantil enfronte e aparcamento. Temporada 2026 aprox. 28 maio–31 xullo, desde as 19:30; non abre se chove.',
          fr: 'Très familial : aire de jeux en face et parking. Saison 2026 env. 28 mai–31 juillet, à partir de 19h30 ; fermé quand il pleut.',
          de: 'Sehr familienfreundlich: Spielplatz gegenüber und Parkplatz. Saison 2026 ca. 28. Mai–31. Juli, ab 19:30 Uhr; bei Regen geschlossen.',
          ko: '매우 가족 친화적: 맞은편에 놀이터, 주차장 있음. 2026 시즌 약 5월 28일–7월 31일, 19:30부터; 비 오면 열지 않음.',
          pt: 'Muito familiar: parque infantil em frente e estacionamento. Época 2026 aprox. 28 maio–31 julho, a partir das 19:30; não abre se chover.',
          pl: 'Bardzo rodzinny: plac zabaw naprzeciwko i parking. Sezon 2026 ok. 28 maja–31 lipca, od 19:30; nieczynne, gdy pada.',
        },
      },
      {
        name: 'Furancho Villa Preciosa',
        description: {
          es: 'En Pazos de Borbén, con jardín cuidado y un albariño muy valorado. Su plato estrella es la empanada de queso de tetilla con grelos y chorizo.',
          en: 'In Pazos de Borbén, with a well-kept garden and a highly rated albariño. Its signature dish is tetilla cheese empanada with grelos and chorizo.',
          gl: 'En Pazos de Borbén, con xardín coidado e un albariño moi valorado. O seu prato estrela é a empanada de queixo de tetilla con grelos e chourizo.',
          fr: 'À Pazos de Borbén, avec un jardin soigné et un albariño très apprécié. Sa spécialité est l\'empanada au fromage tetilla avec grelos et chorizo.',
          de: 'In Pazos de Borbén, mit gepflegtem Garten und einem hoch geschätzten Albariño. Das Aushängeschild ist die Empanada mit Tetilla-Käse, Grelos und Chorizo.',
          ko: '파소스 데 보르벤에 있으며, 잘 가꾼 정원과 높이 평가받는 알바리뇨가 있습니다. 대표 요리는 그렐로스와 초리소를 넣은 테티야 치즈 엠파나다입니다.',
          pt: 'Em Pazos de Borbén, com jardim cuidado e um albariño muito apreciado. O seu prato estrela é a empanada de queijo de tetilla com grelos e chouriço.',
          pl: 'W Pazos de Borbén, z zadbanym ogrodem i wysoko ocenianym albariño. Popisowe danie to empanada z serem tetilla, grelos i chorizo.',
        },
        distance: {
          es: '~30-35 min coche', en: '~30-35 min drive', gl: '~30-35 min coche', fr: '~30-35 min en voiture',
          de: '~30-35 Min. mit dem Auto', ko: '차로 약 30-35분', pt: '~30-35 min de carro', pl: '~30-35 min autem',
        },
        tip: {
          es: 'Uno de los más cómodos con niños: zona de juegos infantil y acceso adaptado. Confirmad horario y temporada.',
          en: 'One of the easiest with kids: playground and accessible access. Check hours and season.',
          gl: 'Un dos máis cómodos con nenos: zona de xogos infantil e acceso adaptado. Confirmade horario e temporada.',
          fr: 'L\'un des plus pratiques avec des enfants : aire de jeux et accès adapté. Vérifiez horaires et saison.',
          de: 'Einer der bequemsten mit Kindern: Spielplatz und barrierefreier Zugang. Öffnungszeiten und Saison prüfen.',
          ko: '아이와 가기 가장 편한 곳 중 하나: 놀이터와 배리어프리 접근. 운영 시간과 시즌을 확인하세요.',
          pt: 'Um dos mais cómodos com crianças: zona de jogos infantil e acesso adaptado. Confirmem horário e época.',
          pl: 'Jeden z najwygodniejszych z dziećmi: plac zabaw i dostęp bez barier. Sprawdźcie godziny i sezon.',
        },
      },
      {
        name: 'Furancho Almeriz',
        description: {
          es: 'Furancho tradicional en Redondela, de ambiente rústico y auténtico, que se llena por el boca a boca cuando "hay vino".',
          en: 'Traditional furancho in Redondela with an authentic, rustic feel that fills up by word of mouth when "there\'s wine".',
          gl: 'Furancho tradicional en Redondela, de ambiente rústico e auténtico, que se enche polo boca a boca cando "hai viño".',
          fr: 'Furancho traditionnel à Redondela, à l\'ambiance rustique et authentique, qui se remplit par le bouche-à-oreille quand « il y a du vin ».',
          de: 'Traditioneller Furancho in Redondela mit rustikalem, authentischem Ambiente, der sich per Mundpropaganda füllt, wenn es „Wein gibt“.',
          ko: '레돈델라에 있는 전통 푸란초로, 소박하고 현지다운 분위기이며 "와인이 있을 때" 입소문으로 붐빕니다.',
          pt: 'Furancho tradicional em Redondela, de ambiente rústico e autêntico, que se enche pelo boca a boca quando "há vinho".',
          pl: 'Tradycyjny furancho w Redondeli o rustykalnym, autentycznym klimacie, który zapełnia się dzięki poczcie pantoflowej, gdy „jest wino”.',
        },
        distance: {
          es: '~20-25 min coche', en: '~20-25 min drive', gl: '~20-25 min coche', fr: '~20-25 min en voiture',
          de: '~20-25 Min. mit dem Auto', ko: '차로 약 20-25분', pt: '~20-25 min de carro', pl: '~20-25 min autem',
        },
        tip: {
          es: 'Confirmad la apertura antes de ir; suele abrir de viernes a domingo por la tarde.',
          en: 'Check it\'s open before going; usually opens Friday to Sunday afternoons.',
          gl: 'Confirmade a apertura antes de ir; adoita abrir de venres a domingo pola tarde.',
          fr: 'Vérifiez l\'ouverture avant d\'y aller ; ouvre généralement du vendredi au dimanche après-midi.',
          de: 'Vor dem Besuch die Öffnung prüfen; meist Freitag bis Sonntagnachmittag geöffnet.',
          ko: '가기 전에 영업 여부를 확인하세요; 보통 금요일부터 일요일 오후에 엽니다.',
          pt: 'Confirmem a abertura antes de ir; costuma abrir de sexta a domingo à tarde.',
          pl: 'Sprawdźcie otwarcie przed wyjazdem; zwykle otwarte od piątku do niedzieli po południu.',
        },
      },
      {
        name: 'Furancho Fermín',
        description: {
          es: 'Furancho de Redondela con amplia terraza bajo parras y platos caseros gallegos, incluidas opciones vegetarianas.',
          en: 'Redondela furancho with a large terrace under vines and homemade Galician dishes, including vegetarian options.',
          gl: 'Furancho de Redondela con ampla terraza baixo parras e pratos caseiros galegos, incluídas opcións vexetarianas.',
          fr: 'Furancho de Redondela avec une grande terrasse sous les treilles et des plats galiciens maison, y compris des options végétariennes.',
          de: 'Furancho in Redondela mit großer Terrasse unter Weinreben und hausgemachten galicischen Gerichten, auch vegetarisch.',
          ko: '레돈델라의 푸란초로, 포도 덩굴 아래 넓은 테라스와 채식 옵션을 포함한 갈리시아 가정식을 제공합니다.',
          pt: 'Furancho de Redondela com ampla esplanada sob parras e pratos caseiros galegos, incluindo opções vegetarianas.',
          pl: 'Furancho w Redondeli z dużym tarasem pod winoroślą i domowymi daniami galicyjskimi, w tym wegetariańskimi.',
        },
        distance: {
          es: '~20-25 min coche', en: '~20-25 min drive', gl: '~20-25 min coche', fr: '~20-25 min en voiture',
          de: '~20-25 Min. mit dem Auto', ko: '차로 약 20-25분', pt: '~20-25 min de carro', pl: '~20-25 min autem',
        },
        tip: {
          es: 'Solo efectivo y sin reservas; apto para familias y admite perros. Confirmad la temporada.',
          en: 'Cash only and no reservations; family-friendly and dog-friendly. Check the season.',
          gl: 'Só efectivo e sen reservas; apto para familias e admite cans. Confirmade a temporada.',
          fr: 'Espèces uniquement et sans réservation ; adapté aux familles et aux chiens. Vérifiez la saison.',
          de: 'Nur Barzahlung und ohne Reservierung; familien- und hundefreundlich. Saison prüfen.',
          ko: '현금만 받고 예약 불가; 가족과 반려견 동반 가능. 시즌을 확인하세요.',
          pt: 'Só dinheiro e sem reservas; apto para famílias e aceita cães. Confirmem a época.',
          pl: 'Tylko gotówka i bez rezerwacji; przyjazny rodzinom i psom. Sprawdźcie sezon.',
        },
      },
    ],
  },
];

export const familyItinerary: ItineraryDay[] = [
  {
    day: 1,
    title: {
      es: 'Llegada y Samil', en: 'Arrival and Samil', gl: 'Chegada e Samil', fr: 'Arrivée et Samil',
      de: 'Ankunft und Samil', ko: '도착과 사밀', pt: 'Chegada e Samil', pl: 'Przyjazd i Samil',
    },
    plan: {
      es: 'Playa de Samil, piscinas y paseo en bici. Cena en una terraza frente al mar.',
      en: 'Samil beach, pools and a bike ride. Dinner on a seafront terrace.',
      gl: 'Praia de Samil, piscinas e paseo en bici. Cea nunha terraza fronte ao mar.',
      fr: 'Plage de Samil, piscines et balade à vélo. Dîner en terrasse face à la mer.',
      de: 'Strand von Samil, Schwimmbäder und eine Radtour. Abendessen auf einer Terrasse am Meer.',
      ko: '사밀 해변, 수영장, 자전거 타기. 바다가 보이는 테라스에서 저녁 식사.',
      pt: 'Praia de Samil, piscinas e passeio de bicicleta. Jantar numa esplanada em frente ao mar.',
      pl: 'Plaża Samil, baseny i przejażdżka rowerem. Kolacja na tarasie nad morzem.',
    },
  },
  {
    day: 2,
    title: {
      es: 'Islas Cíes', en: 'Cíes Islands', gl: 'Illas Cíes', fr: 'Îles Cíes',
      de: 'Cíes-Inseln', ko: '시에스 제도', pt: 'Ilhas Cíes', pl: 'Wyspy Cíes',
    },
    plan: {
      es: 'Día completo en el Parque Nacional: playa de Rodas y ruta al faro. Reservad ferry y autorización con antelación.',
      en: 'Full day in the National Park: Rodas beach and the lighthouse trail. Book ferry and authorization in advance.',
      gl: 'Día completo no Parque Nacional: praia de Rodas e ruta ao faro. Reservade ferry e autorización con antelación.',
      fr: 'Journée entière dans le parc national : plage de Rodas et sentier du phare. Réservez ferry et autorisation à l\'avance.',
      de: 'Ganzer Tag im Nationalpark: Strand von Rodas und der Leuchtturmweg. Fähre und Genehmigung im Voraus buchen.',
      ko: '국립공원에서 하루 종일: 로다스 해변과 등대 코스. 페리와 허가를 미리 예약하세요.',
      pt: 'Dia completo no Parque Nacional: praia de Rodas e trilho do farol. Reservem ferry e autorização com antecedência.',
      pl: 'Cały dzień w parku narodowym: plaża Rodas i szlak do latarni. Zarezerwujcie prom i zezwolenie z wyprzedzeniem.',
    },
  },
  {
    day: 3,
    title: {
      es: 'Baiona', en: 'Baiona', gl: 'Baiona', fr: 'Baiona', de: 'Baiona', ko: '바이오나', pt: 'Baiona', pl: 'Baiona',
    },
    plan: {
      es: 'Mañana en la carabela Pinta y la muralla del Parador; tarde de playa en Ladeira.',
      en: 'Morning at the caravel Pinta and the Parador walls; beach afternoon at Ladeira.',
      gl: 'Mañá na carabela Pinta e a muralla do Parador; tarde de praia en Ladeira.',
      fr: 'Matinée à la caravelle Pinta et aux remparts du Parador ; après-midi plage à Ladeira.',
      de: 'Vormittag an der Karavelle Pinta und der Mauer des Parador; Nachmittag am Strand von Ladeira.',
      ko: '오전에는 카라벨 핀타호와 파라도르 성벽, 오후에는 라데이라 해변.',
      pt: 'Manhã na caravela Pinta e na muralha do Parador; tarde de praia em Ladeira.',
      pl: 'Rano karawela Pinta i mury Paradoru; popołudnie na plaży Ladeira.',
    },
  },
  {
    day: 4,
    title: {
      es: 'Vigo a fondo', en: 'Vigo in depth', gl: 'Vigo a fondo', fr: 'Vigo en profondeur',
      de: 'Vigo intensiv', ko: '비고 깊이 보기', pt: 'Vigo a fundo', pl: 'Vigo dogłębnie',
    },
    plan: {
      es: 'Monte do Castro, parque de Castrelos y Vigozoo o Verbum según el tiempo.',
      en: 'Monte do Castro, Castrelos park and Vigozoo or Verbum depending on the weather.',
      gl: 'Monte do Castro, parque de Castrelos e Vigozoo ou Verbum segundo o tempo.',
      fr: 'Monte do Castro, parc de Castrelos et Vigozoo ou Verbum selon la météo.',
      de: 'Monte do Castro, Castrelos-Park und Vigozoo oder Verbum je nach Wetter.',
      ko: '몬테 도 카스트로, 카스트렐로스 공원, 날씨에 따라 비고주 또는 베르붐.',
      pt: 'Monte do Castro, parque de Castrelos e Vigozoo ou Verbum consoante o tempo.',
      pl: 'Monte do Castro, park Castrelos i Vigozoo lub Verbum w zależności od pogody.',
    },
  },
  {
    day: 5,
    title: {
      es: 'A Guarda o Pontevedra', en: 'A Guarda or Pontevedra', gl: 'A Guarda ou Pontevedra',
      fr: 'A Guarda ou Pontevedra', de: 'A Guarda oder Pontevedra', ko: '아 과르다 또는 폰테베드라',
      pt: 'A Guarda ou Pontevedra', pl: 'A Guarda lub Pontevedra',
    },
    plan: {
      es: 'Castro de Santa Trega o casco histórico de Pontevedra, según las ganas.',
      en: 'Santa Trega hillfort or Pontevedra\'s old town, whichever you fancy.',
      gl: 'Castro de Santa Trega ou casco histórico de Pontevedra, segundo as ganas.',
      fr: 'Castro de Santa Trega ou centre historique de Pontevedra, selon l\'envie.',
      de: 'Castro von Santa Trega oder Altstadt von Pontevedra, ganz nach Lust.',
      ko: '산타 트레가 카스트로 또는 폰테베드라 구시가지, 취향에 따라.',
      pt: 'Castro de Santa Trega ou centro histórico de Pontevedra, conforme a vontade.',
      pl: 'Castro Santa Trega lub stare miasto Pontevedry, zależnie od ochoty.',
    },
  },
];

export const familyFaq: FamilyQuestion[] = [
  {
    q: {
      es: '¿Cómo se llega a Samil en autobús?', en: 'How do you get to Samil by bus?',
      gl: 'Como se chega a Samil en autobús?', fr: 'Comment aller à Samil en bus ?',
      de: 'Wie kommt man mit dem Bus nach Samil?', ko: '버스로 사밀에 어떻게 가나요?',
      pt: 'Como se chega a Samil de autocarro?', pl: 'Jak dojechać do Samil autobusem?',
    },
    a: {
      es: 'Varias líneas urbanas de Vitrasa conectan el centro de Vigo con Samil y el trayecto es corto. Consultad las líneas y horarios actualizados en la web de Vitrasa.',
      en: 'Several Vitrasa city bus lines connect central Vigo with Samil and the ride is short. Check current lines and timetables on the Vitrasa website.',
      gl: 'Varias liñas urbanas de Vitrasa conectan o centro de Vigo con Samil e o traxecto é curto. Consultade as liñas e horarios actualizados na web de Vitrasa.',
      fr: 'Plusieurs lignes de bus urbaines Vitrasa relient le centre de Vigo à Samil et le trajet est court. Consultez les lignes et horaires à jour sur le site de Vitrasa.',
      de: 'Mehrere Vitrasa-Stadtbuslinien verbinden das Zentrum von Vigo mit Samil, und die Fahrt ist kurz. Prüfen Sie aktuelle Linien und Fahrpläne auf der Vitrasa-Website.',
      ko: '여러 비트라사 시내버스 노선이 비고 중심가와 사밀을 연결하며 소요 시간이 짧습니다. 최신 노선과 시간표는 비트라사 웹사이트에서 확인하세요.',
      pt: 'Várias linhas urbanas da Vitrasa ligam o centro de Vigo a Samil e o trajeto é curto. Consultem as linhas e horários atualizados no site da Vitrasa.',
      pl: 'Kilka miejskich linii Vitrasa łączy centrum Vigo z Samil, a przejazd jest krótki. Sprawdźcie aktualne linie i rozkłady na stronie Vitrasy.',
    },
  },
  {
    q: {
      es: '¿Hace falta coche?', en: 'Do you need a car?', gl: 'Fai falta coche?', fr: 'Faut-il une voiture ?',
      de: 'Braucht man ein Auto?', ko: '차가 필요한가요?', pt: 'É preciso carro?', pl: 'Czy potrzebny jest samochód?',
    },
    a: {
      es: 'No es imprescindible: Samil, las playas cercanas y el centro se cubren en autobús, y a las Cíes se va en ferry. Un coche facilita las excursiones a Baiona, A Guarda o las cascadas.',
      en: 'Not essential: Samil, the nearby beaches and the centre are reachable by bus, and Cíes by ferry. A car makes trips to Baiona, A Guarda or the waterfalls easier.',
      gl: 'Non é imprescindible: Samil, as praias próximas e o centro cóbrense en autobús, e ás Cíes vaise en ferry. Un coche facilita as excursións a Baiona, A Guarda ou as cascadas.',
      fr: 'Pas indispensable : Samil, les plages proches et le centre sont accessibles en bus, et les Cíes en ferry. Une voiture facilite les excursions à Baiona, A Guarda ou aux cascades.',
      de: 'Nicht zwingend nötig: Samil, die nahen Strände und das Zentrum sind mit dem Bus erreichbar, die Cíes mit der Fähre. Ein Auto erleichtert Ausflüge nach Baiona, A Guarda oder zu den Wasserfällen.',
      ko: '필수는 아닙니다: 사밀, 인근 해변, 시내는 버스로, 시에스는 페리로 갈 수 있습니다. 차가 있으면 바이오나, 아 과르다, 폭포 여행이 편리합니다.',
      pt: 'Não é indispensável: Samil, as praias próximas e o centro cobrem-se de autocarro, e às Cíes vai-se de ferry. Um carro facilita as excursões a Baiona, A Guarda ou às cascatas.',
      pl: 'Nie jest niezbędny: Samil, pobliskie plaże i centrum obsługuje autobus, a na Cíes płynie się promem. Samochód ułatwia wyprawy do Baiony, A Guarda czy do wodospadów.',
    },
  },
  {
    q: {
      es: '¿Cuándo y cómo se visitan las Islas Cíes?', en: 'When and how do you visit the Cíes Islands?',
      gl: 'Cando e como se visitan as Illas Cíes?', fr: 'Quand et comment visiter les îles Cíes ?',
      de: 'Wann und wie besucht man die Cíes-Inseln?', ko: '시에스 제도는 언제, 어떻게 방문하나요?',
      pt: 'Quando e como se visitam as Ilhas Cíes?', pl: 'Kiedy i jak zwiedzać Wyspy Cíes?',
    },
    a: {
      es: 'Solo en temporada (aprox. Semana Santa y verano). Hay que solicitar la autorización de la Xunta y comprar el billete de ferry con una naviera; conviene hacerlo con varios días de antelación porque las plazas se agotan.',
      en: 'Only in season (roughly Easter and summer). You must request the regional authorization and buy a ferry ticket from a company; do it several days ahead, as places sell out.',
      gl: 'Só en temporada (aprox. Semana Santa e verán). Hai que solicitar a autorización da Xunta e mercar o billete de ferry cunha naviera; convén facelo con varios días de antelación porque as prazas esgótanse.',
      fr: 'Seulement en saison (environ Pâques et été). Il faut demander l\'autorisation régionale et acheter un billet de ferry auprès d\'une compagnie ; faites-le plusieurs jours à l\'avance, car les places partent vite.',
      de: 'Nur in der Saison (etwa Ostern und Sommer). Man muss die Genehmigung der Region beantragen und ein Fährticket bei einer Reederei kaufen; tun Sie das mehrere Tage im Voraus, da die Plätze ausverkauft sind.',
      ko: '성수기(대략 부활절과 여름)에만 가능합니다. 지방정부 허가를 신청하고 선사에서 페리 티켓을 구매해야 하며, 자리가 매진되므로 며칠 전에 미리 하는 것이 좋습니다.',
      pt: 'Apenas na época (aprox. Páscoa e verão). É preciso solicitar a autorização regional e comprar o bilhete de ferry a uma companhia; convém fazê-lo com vários dias de antecedência porque os lugares esgotam.',
      pl: 'Tylko w sezonie (mniej więcej Wielkanoc i lato). Trzeba złożyć wniosek o zezwolenie regionalne i kupić bilet na prom u przewoźnika; zróbcie to kilka dni wcześniej, bo miejsca się wyprzedają.',
    },
  },
  {
    q: {
      es: '¿Qué playas son mejores con niños pequeños?', en: 'Which beaches are best for young kids?',
      gl: 'Que praias son mellores con nenos pequenos?', fr: 'Quelles plages sont les meilleures avec de jeunes enfants ?',
      de: 'Welche Strände sind mit kleinen Kindern am besten?', ko: '어린아이와 가기 좋은 해변은 어디인가요?',
      pt: 'Que praias são melhores com crianças pequenas?', pl: 'Które plaże są najlepsze z małymi dziećmi?',
    },
    a: {
      es: 'Samil, O Vao y A Fontaíña tienen aguas tranquilas, socorristas en temporada y zonas de juegos. En las Cíes, la playa de Rodas tiene una orilla muy poco profunda.',
      en: 'Samil, O Vao and A Fontaíña have calm waters, lifeguards in season and play areas. On the Cíes, Rodas beach has a very shallow shore.',
      gl: 'Samil, O Vao e A Fontaíña teñen augas tranquilas, socorristas en temporada e zonas de xogos. Nas Cíes, a praia de Rodas ten unha orela moi pouco profunda.',
      fr: 'Samil, O Vao et A Fontaíña ont des eaux calmes, des sauveteurs en saison et des aires de jeux. Aux Cíes, la plage de Rodas a un rivage très peu profond.',
      de: 'Samil, O Vao und A Fontaíña haben ruhiges Wasser, in der Saison Rettungsschwimmer und Spielbereiche. Auf den Cíes hat der Strand von Rodas ein sehr flaches Ufer.',
      ko: '사밀, 오 바오, 아 폰타이냐는 잔잔한 바다, 성수기 안전요원, 놀이 공간이 있습니다. 시에스의 로다스 해변은 물가가 매우 얕습니다.',
      pt: 'Samil, O Vao e A Fontaíña têm águas calmas, nadadores-salvadores na época e zonas de jogos. Nas Cíes, a praia de Rodas tem uma margem muito pouco profunda.',
      pl: 'Samil, O Vao i A Fontaíña mają spokojną wodę, ratowników w sezonie i place zabaw. Na Cíes plaża Rodas ma bardzo płytki brzeg.',
    },
  },
  {
    q: {
      es: '¿Qué llevar a las Cíes?', en: 'What to bring to the Cíes?', gl: 'Que levar ás Cíes?',
      fr: 'Que faut-il emporter aux Cíes ?', de: 'Was sollte man auf die Cíes mitnehmen?',
      ko: '시에스에 무엇을 가져가야 하나요?', pt: 'O que levar às Cíes?', pl: 'Co zabrać na Cíes?',
    },
    a: {
      es: 'Comida, agua, protección solar y algo de sombra: en la isla la oferta es limitada y apenas hay comercios. Calzado cómodo para las rutas y bañador.',
      en: 'Food, water, sunscreen and some shade: options on the island are limited and there are barely any shops. Comfortable shoes for the trails and swimwear.',
      gl: 'Comida, auga, protección solar e algo de sombra: na illa a oferta é limitada e apenas hai comercios. Calzado cómodo para as rutas e bañador.',
      fr: 'Nourriture, eau, crème solaire et un peu d\'ombre : l\'offre sur l\'île est limitée et il n\'y a presque pas de commerces. Chaussures confortables pour les sentiers et maillot de bain.',
      de: 'Essen, Wasser, Sonnenschutz und etwas Schatten: das Angebot auf der Insel ist begrenzt und es gibt kaum Geschäfte. Bequeme Schuhe für die Wege und Badekleidung.',
      ko: '음식, 물, 자외선 차단제, 그늘막을 챙기세요. 섬에는 편의시설이 제한적이고 상점이 거의 없습니다. 트레킹용 편한 신발과 수영복도 필요합니다.',
      pt: 'Comida, água, proteção solar e alguma sombra: na ilha a oferta é limitada e quase não há comércio. Calçado confortável para os trilhos e fato de banho.',
      pl: 'Jedzenie, wodę, krem z filtrem i coś do zacienienia: oferta na wyspie jest ograniczona i prawie nie ma sklepów. Wygodne buty na szlaki i strój kąpielowy.',
    },
  },
  {
    q: {
      es: '¿Hay actividades para niños en verano?', en: 'Are there activities for kids in summer?',
      gl: 'Hai actividades para nenos no verán?', fr: 'Y a-t-il des activités pour enfants en été ?',
      de: 'Gibt es im Sommer Aktivitäten für Kinder?', ko: '여름에 아이들을 위한 활동이 있나요?',
      pt: 'Há atividades para crianças no verão?', pl: 'Czy latem są zajęcia dla dzieci?',
    },
    a: {
      es: 'Sí. En agosto, con las Fiestas de Vigo, hay teatro infantil en el Monte do Castro y espectáculos para niños en las plazas del centro (Constitución, Princesa). Desde julio, la Feria del Libro en la Plaza de Compostela programa actividades infantiles, y el auditorio de Castrelos acoge conciertos al aire libre.',
      en: 'Yes. In August, during the Vigo festivities, there is children\'s theatre at Monte do Castro and kids\' shows in the central squares (Constitución, Princesa). From July, the Book Fair in Plaza de Compostela runs children\'s activities, and the Castrelos auditorium hosts open-air concerts.',
      gl: 'Si. En agosto, coas Festas de Vigo, hai teatro infantil no Monte do Castro e espectáculos para nenos nas prazas do centro (Constitución, Princesa). Desde xullo, a Feira do Libro na Praza de Compostela programa actividades infantís, e o auditorio de Castrelos acolle concertos ao aire libre.',
      fr: 'Oui. En août, pendant les fêtes de Vigo, il y a du théâtre pour enfants au Monte do Castro et des spectacles pour enfants sur les places du centre (Constitución, Princesa). Dès juillet, la Foire du livre de la Plaza de Compostela propose des activités pour enfants, et l\'auditorium de Castrelos accueille des concerts en plein air.',
      de: 'Ja. Im August, während der Feste von Vigo, gibt es Kindertheater am Monte do Castro und Kindershows auf den zentralen Plätzen (Constitución, Princesa). Ab Juli bietet die Buchmesse auf der Plaza de Compostela Kinderaktivitäten, und das Auditorium von Castrelos veranstaltet Open-Air-Konzerte.',
      ko: '네. 8월 비고 축제 기간에는 몬테 도 카스트로에서 어린이 연극이, 중심가 광장(콘스티투시온, 프린세사)에서 어린이 공연이 열립니다. 7월부터는 콤포스텔라 광장의 도서전에서 어린이 활동이 진행되고, 카스트렐로스 야외 공연장에서 콘서트가 열립니다.',
      pt: 'Sim. Em agosto, com as Festas de Vigo, há teatro infantil no Monte do Castro e espetáculos para crianças nas praças do centro (Constitución, Princesa). Desde julho, a Feira do Livro na Praça de Compostela programa atividades infantis, e o auditório de Castrelos acolhe concertos ao ar livre.',
      pl: 'Tak. W sierpniu, podczas świąt Vigo, odbywa się teatr dziecięcy na Monte do Castro i pokazy dla dzieci na centralnych placach (Constitución, Princesa). Od lipca Targi Książki na Plaza de Compostela organizują zajęcia dla dzieci, a amfiteatr Castrelos gości koncerty plenerowe.',
    },
  },
];

/** JSON-LD for SEO/GEO: FAQ + a list of family attractions. */
export function generateFamilyJsonLd(lang: Lang): Array<Record<string, unknown>> {
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: familyFaq.map(item => ({
      '@type': 'Question',
      name: item.q[lang] ?? item.q.es,
      acceptedAnswer: { '@type': 'Answer', text: item.a[lang] ?? item.a.es },
    })),
  };

  const places = familySections.flatMap(s => s.places);
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: lang === 'es' ? 'Qué hacer en Vigo con niños' : 'Vigo with kids',
    itemListElement: places.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'TouristAttraction',
        name: p.name,
        description: p.description[lang] ?? p.description.es,
        ...(p.url ? { url: p.url } : {}),
        address: { '@type': 'PostalAddress', addressLocality: 'Vigo', addressRegion: 'Galicia', addressCountry: 'ES' },
      },
    })),
  };

  return [faqPage, itemList];
}
