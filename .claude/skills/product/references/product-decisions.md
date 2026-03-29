# Product Decisions - Flat Management System

Reference document with all confirmed product decisions. Read this before making any implementation or architecture suggestion.

Last updated: 2026-03-29

---

## Properties

- **5 pisos, 27 habitaciones** en Vigo
- 4 pisos en Alfonso XIII 9 (1o Dcha, 3o Izq, 4o Dcha Atico, 4o Izq Atico)
- 1 piso en Irmandinos 23
- Alquiler por temporada, estudiantes y trabajadores
- Precios: 300-400 EUR/mes, habitaciones 10-16 m2
- Habitaciones con nombres tematicos (colores, estaciones, ciudades)

---

## Web Publica (carpeta: web/)

- **Stack**: Astro + Tailwind CSS, GitHub Pages
- **Rol**: Escaparate con disponibilidad por fechas. NO reservas directas.
- **Idiomas**: ES (default), EN, GL - ya implementado
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
  - Fijar citas en calendario (Google Calendar u otro) para visitas
  - Enviar enlace de la web (NO fotos directas por chat)
  - Adaptar idioma al interlocutor
  - Enviar contratos (plantillas multiidioma)
- **Autonomia**: Info y citas autonomo. Dudas complejas escala al propietario por WhatsApp.
- **Horario**: 9:00-13:00, 7 dias/semana. Fuera de horario: mensaje de fuera de horario.
- **Idiomas**: Minimo ES/EN/GL (como la web)

### Agente Post-venta
- **Funcion**: Gestion de inquilinos actuales
- **Capacidades**:
  - Generar y enviar facturas/recibos mensuales
  - Reenviar facturas de suministros recibidas (agua, luz, IBI, internet, seguros)
  - Comunicaciones generales a inquilinos
- **Fuente de facturas de costes**: Email del propietario

### Control del propietario
- **Canal**: WhatsApp (propietario -> agente)
- **Solo 1 persona** gestiona (el propietario)
- **Puede**: Cambiar disponibilidad ("habitacion X cerrada hasta dia Y"), cambiar precios, dar instrucciones adicionales, resolver escalaciones
- **El agente actualiza datos** segun instrucciones del propietario

---

## App Local / Dashboard (carpeta: dashboard/)

- **Decision**: Opcion C - Hibrido
  - Dashboard local de **solo lectura**: ingresos, costes, estado habitaciones, informes
  - Cambios operativos via **WhatsApp al agente** (no duplica canales de escritura)
- **Usuario**: 1 propietario solo. NO es SaaS.
- **Datos a mostrar**:
  - Ingresos por habitacion/piso/mes
  - Costes de suministros (IBI, internet, seguros, agua, luz, reparaciones)
  - Estado de ocupacion por fechas
- **UI**: Lo mas sencillo/barato posible (localhost web o similar)
- **NO conectada a internet** (seguridad)

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
- NO app local con escritura (cambios solo por WhatsApp)
- NO SaaS ni multiusuario
- NO hosting de pago (por ahora)
- NO backend para la web (estatica)
