# Product Decisions - Flat Management System

Reference document with all confirmed product decisions. Read this before making any implementation or architecture suggestion.

Last updated: 2026-03-29

---

## Properties

- **5 pisos, 27 habitaciones** en Vigo
- 4 pisos en Alfonso XIII 9 (1o Dcha, 3o Izq, 4o Dcha Atico, 4o Izq Atico)
- 1 piso en Irmandinos 23
- Alquiler por temporada: tipicamente curso academico (~10 meses, sept-junio) para estudiantes, o periodos mas largos (~1 ano) para trabajadores.
- **Excepcion**: 4o Izq Atico (Alfonso XIII 9) admite alquiler corto/turistico ademas de temporada:
  - Tiene licencia turistica (VUT Galicia)
  - Anunciado en Airbnb y Booking
  - Doble pricing: precio/noche (turistico) + precio/mes (temporada)
  - Contrato turistico distinto al de temporada
  - El sales agent debe ofrecer ambas opciones para este piso
  - Reservas de Airbnb/Booking: el propietario comunica al agente por WhatsApp manualmente. NO hay sincronizacion automatica con estas plataformas.
- Precios: 300-400 EUR/mes, habitaciones 10-16 m2
- Fianza: 1 mes, se paga por adelanto. El agent informa, el cobro se gestiona fuera del sistema.
- Metodo de pago: Efectivo actualmente. Debe ser configurable (desde dashboard o via instruccion al agente) para cambiar a transferencia, Bizum, etc. en el futuro.
- Control de pagos: manual. El propietario confirma al agente que se ha recibido el pago. El agente no tiene visibilidad directa sobre cobros.
- Habitaciones con nombres tematicos (colores, estaciones, ciudades)

---

## Web Publica (carpeta: web/)

- **Stack**: Astro + Tailwind CSS, GitHub Pages
- **Rol**: Escaparate con disponibilidad por fechas. NO reservas directas.
- **Idiomas web**: ES (default), EN, GL ya implementados. Pendiente anadir: FR, DE, KO, PT, PL.
- **Disponibilidad**: Casi tiempo real, mecanismo barato. Script actualiza fichero de fechas y hace push. No backend.
- **SEO**: Mejorar meta tags, Schema.org/JSON-LD, sitemap, OG tags
- **GEO (Generative Engine Optimization)**: Adaptada para agentes AI (ChatGPT, Perplexity). Objetivo: que recomienden las habitaciones. Requiere: llms.txt, structured data, contenido semantico limpio.
- **Fotos**: 67 fotos reales ya en el repo
- **Contacto**: Enlace a WhatsApp del agente (no formulario Formspree)
- **Dominio**: GitHub Pages por ahora. Sin dominio propio. Abierto a alternativas gratis/baratas.

---

## Agentes (carpeta: agents/)

### Agente Pre-venta
- **Canales**: WhatsApp principal, extensible a Telegram y otros
- **Capacidades**:
  - Responder preguntas sobre habitaciones (info, precios, fotos via enlace web)
  - Comprobar y comunicar disponibilidad por fechas
  - Fijar citas en calendario (Google Calendar u otro) para visitas. Huecos fijos configurables, intervalos de 15 min por visita.
  - Enviar enlace de la web (NO fotos directas por chat)
  - Adaptar idioma al interlocutor
  - Datos del prospecto: durante la venta solo se guarda nombre y telefono (para contactar por WhatsApp). Datos personales completos (DNI, nacionalidad, etc.) solo se solicitan DESPUES de la visita, cuando el prospecto confirma que quiere la habitacion. Esos datos se usan unicamente para generar el borrador de contrato y NO se almacenan en el sistema.
  - Enviar borradores de contrato (plantillas con placeholders sustituidos). NO vinculante, la firma se hace en persona en la visita.
  - Contratos multiidioma. Contrato turistico distinto al de temporada.
  - Los datos del prospecto se recogen por el canal que sea (WhatsApp, Telegram, etc.), no asumir canal concreto
- **Autonomia**: Info y citas autonomo. Dudas complejas escala al propietario por WhatsApp.
- **Horario**: 8:00-23:00, 7 dias/semana. Fuera de horario: agente apagado, no lee de ningun canal. Los mensajes recibidos fuera de horario se procesan al reanudar a las 8:00.
- **Emergencias fuera de horario**: Los inquilinos contactan directamente al propietario (su numero personal). El software ayuda al propietario, no lo sustituye.
- **Conflicto de reservas**: Si dos prospectos quieren la misma habitacion, se decide en la visita. Si no hay visita, FIFO (primero en pedir).
- **Idiomas**: ES, EN, GL, FR, DE, KO, PT, PL. El agente detecta y adapta el idioma al interlocutor.
- **Idiomas**: Minimo ES/EN/GL (como la web)

### Agente Post-venta
- **Funcion**: Gestion de inquilinos actuales
- **Capacidades**:
  - Generar y enviar recibos mensuales (invoca script que produce el documento):
    - Recibo = alquiler + parte proporcional de suministros del mes anterior
    - Se espera a tener todas las facturas de suministros del mes antes de generar
    - Reparto suministros: a partes iguales entre habitaciones ocupadas del piso
    - Timing: principio de mes siguiente (cuando se tienen las facturas)
  - Reenviar facturas de suministros recibidas (agua, luz, IBI, internet, seguros). Reparto a partes iguales entre habitaciones ocupadas del piso.
  - Comunicaciones generales a inquilinos
- **Fuente de facturas de costes**: Email dedicado (ej. facturas@casasvigo.com o similar). Reglas de redireccion desde emails personales para que las facturas de companias (agua, luz, internet, seguros, IBI) lleguen ahi. El tenant agent solo lee de este email dedicado — no tiene acceso a email personal.

### Routing de mensajes (un solo numero WhatsApp)
- **Owner** (numero registrado) -> modo comandos, siempre
- **Inquilinos** (numeros registrados con contrato activo) -> tenant agent
- **Prospectos** (todo lo demas, incluidos desconocidos) -> sales agent
- **Ciclo de vida**:
  1. Desconocido -> Prospecto (contacta por cualquier canal)
  2. Prospecto -> Visita (agent agenda en huecos fijos, 15 min/visita)
  3. Visita OK -> Owner informa al agente -> Agent genera borrador contrato y lo envia al prospecto
  4. Contrato firmado + fianza recibida -> Owner confirma -> Prospecto pasa a Inquilino (tenant agent)
  5. Fin contrato + 1 mes -> Ex-inquilino (vuelve a pool prospectos / sales agent)
- Se necesita un **registro de contactos** con: numero, rol (owner/inquilino/prospecto), fecha fin contrato

### Control del propietario
- **Canal**: WhatsApp (propietario -> agente)
- **Solo 1 persona** gestiona (el propietario)
- **Puede**: Cambiar disponibilidad ("habitacion X cerrada hasta dia Y"), cambiar precios, dar instrucciones adicionales, resolver escalaciones
- **El agente actualiza datos** segun instrucciones del propietario

---

## App Local / Dashboard (carpeta: dashboard/)

- **Decision**: Dashboard local con lectura Y escritura
  - Ver: ingresos, costes, estado habitaciones, informes
  - Editar: corregir errores del agente, cambiar configuracion (metodo de pago, precios, disponibilidad), gestionar datos de inquilinos
  - Imprimir borradores de contrato
  - El propietario puede operar via WhatsApp al agente O desde el dashboard. Ambos canales de control.
- **Usuario**: 1 propietario solo. NO es SaaS.
- **Datos a mostrar**:
  - Ingresos por habitacion/piso/mes
  - Costes de suministros (IBI, internet, seguros, agua, luz, reparaciones)
  - Estado de ocupacion por fechas
- **UI**: Lo mas sencillo/barato posible (localhost web o similar)
- **NO conectada a internet** (seguridad)
- **Backup**: Sincronizacion con Google Drive
- **Filosofia**: El software ayuda al propietario, no lo sustituye. Check-in, check-out, visitas, firma de contratos son presenciales.
- **Privacidad**: Datos personales (DNI, etc.) solo se solicitan post-visita para generar contrato. No se almacenan. Solo se guarda nombre + telefono de contacto.

---

## Arquitectura de Datos

- **Fuente de verdad**: El propietario, via WhatsApp
- **Flujo de actualizacion**: Propietario -> WhatsApp -> Agente -> Actualiza fichero disponibilidad -> Script push -> Web se actualiza
- **Fichero de disponibilidad**: Algo sencillo por ahora (JSON en repo o similar)
- **Disponibilidad**: Por fechas (libre desde X hasta Y), no solo booleano

---

## Presupuesto y Prioridades

- **Presupuesto**: Gratis si posible, sino lo mas barato. No atado a ninguna plataforma.
- **Prioridad actual**: Definir producto y planificar implementacion
- **Urgencia**: Baja. Habitaciones ocupadas actualmente.
- **No se busca**: SaaS, multiusuario, cloud hosting caro

---

## Decisiones de NO hacer

- NO reservas directas desde la web
- NO fotos por WhatsApp (solo enlaces a la web)
- Dashboard SI tiene escritura (correccion de errores, configuracion). Dos canales de control: WhatsApp + dashboard.
- NO SaaS ni multiusuario
- NO hosting de pago (por ahora)
- NO backend para la web (estatica)
