# Flat Management System - Planning

## Status
- Last updated: 2026-03-29
- Questions answered: 34/36
- Web repo: github.com/elbenxo/web_casas (Astro + Tailwind, GitHub Pages, 3 idiomas)
- Current phase: Gathering requirements

## Answers

### Block 1: Properties & Rooms
**Q1. Cuantos pisos? Habitaciones?** — 5 pisos, 27 habitaciones en total.
- Irmandinhos 23: 1 piso, 4 habitaciones (Primavera, Verano, Otono, Invierno)
- Alfonso XIII 9, 1o Dcha: 6 habitaciones (Blue, Bambu, Estrella, Mundo, Arroba, Prensa)
- Alfonso XIII 9, 3o Izq: 6 habitaciones (Azul, Roja, Amarilla, Verde, Blanca, Gris)
- Alfonso XIII 9, 4o Dcha Atico: 5 habitaciones (Oliva, Blanco y Negro, Pistacho, Roja, Calabaza)
- Alfonso XIII 9, 4o Izq Atico: 2 habitaciones (Provenzal, Nueva York)
**Q2. Ubicacion?** — Vigo. 4 pisos en Alfonso XIII 9, 1 en Irmandinos 23. Zona Estacion AVE / Casco Urbano.
**Q3. Tipo de alquiler?** — Alquiler por temporada principalmente.
**Q4. Perfil inquilino?** — Estudiantes y trabajadores.
**Q5. Info por habitacion?** — Completa en web_casas: nombre, precio (300-400 EUR/mes), metros (10-16m2), cama, muebles, fotos. 3 idiomas (ES/EN/GL). 13 resenas de inquilinos.
**Q6. Zonas comunes?** — Si: cocina equipada, salon, banos compartidos. Algunos pisos tienen terraza, galeria acristalada, patio privado, chimenea.
**Q7. Precios fijos o variables?** — (pendiente confirmar - actualmente fijos en la web, 300-400 EUR/mes)
**Q8. Fotos disponibles?** — Si, 67 fotos reales en el repo web_casas (habitaciones, cocinas, banos, vistas, zonas comunes).

### Block 2: Public Web
**Q9. Dominio?** — GitHub Pages por ahora (elbenxo.github.io/web_casas). Sin dominio propio.
**Q10. Hosting?** — GitHub Pages (gratis, ya desplegado con GitHub Actions).
**Q11. Web solo escaparate o reservas?** — Escaparate con disponibilidad de fechas. No reservas directas.
**Q12. Disponibilidad en tiempo real o boton consultar?** — Casi tiempo real pero barato: un script actualiza un fichero de fechas y hace push o sube al frontend. No automatico, no backend.
**Q13. Idiomas web?** — Ya implementado: ES, EN, GL.
**Q14. SEO keywords?** — (pendiente)
**Q15. Blog u otro contenido SEO?** — (pendiente)
**Q_extra. GEO (Generative Engine Optimization)?** — Si. La web debe estar adaptada para agentes de AI (ChatGPT, Perplexity, etc.), no solo Google. Structured data, contenido parseable por LLMs. Objetivo: que agentes de AI recomienden las habitaciones cuando alguien pregunte "busco habitacion en Vigo".
**Q16. Repo de la web?** — github.com/elbenxo/web_casas (Astro + Tailwind, separado de casasvigo)

### Block 3: AI Agent
**Q17. Canal principal?** — WhatsApp es uno de los canales, debe ser extensible (Telegram, etc).
**Q18. Otros canales?** — Si, Telegram como minimo. Arquitectura extensible.
**Q19. Capacidades?** — Dos agentes:
  - **Agente pre-venta**: gestiona peticiones de info, responde dudas, fija citas en calendario (Google Calendar u otro), envia enlace de la web (no fotos directas). Escala dudas al propietario por WhatsApp.
  - **Agente post-venta**: genera y envia facturas/recibos a inquilinos, reenvia facturas recibidas (agua, luz), comunicaciones generales.
**Q20. Contratos?** — Si, plantillas en varios idiomas. (Pendiente: formato y campos a personalizar)
**Q21. Idiomas agente?** — (pendiente, al menos ES/EN/GL como la web)
**Q22. Autonomia?** — Info y citas: autonomo. Reservas: el propietario confirma por WhatsApp al agente ("cerrada hasta dia X"). Dudas complejas: escala al propietario.
**Q23. Horario?** — 9:00-13:00, 7 dias a la semana. Fuera de horario no responde (o responde que esta fuera de horario).
**Q_extra. Escalacion?** — Solo 1 persona (el propietario). Canal: WhatsApp.
**Q_extra. Datos maestros?** — El propietario envia cambios al agente por WhatsApp (ej. "habitacion X cerrada hasta fecha Y"). El agente actualiza disponibilidad.
**Q_extra. Disponibilidad?** — Por fechas (libre desde X hasta Y), no solo libre/ocupada.

### Block 4: Local Management App
**Q24. Quien la usa?** — Un propietario solo. No es SaaS.
**Q25. Ingresos?** — Si, por habitacion/piso/mes.
**Q26. Costes?** — Si, suministros, IBI, internet, seguros, etc. Facturas llegan por email. Idea: agente/software que las lea automaticamente del email.
**Q27. Informes fiscales?** — (pendiente)
**Q28. Gestion inquilinos?** — (pendiente)
**Q29. Alertas?** — (pendiente)
**Q30. UI?** — Lo mas barato/sencillo posible.

### Block 5: Architecture & Data
**Q31. Fuente de verdad?** — El propietario, via WhatsApp al agente. El agente actualiza un fichero de disponibilidad.
**Q32. Sincronizacion?** — Algo sencillo por ahora. Agente actualiza fichero -> script hace push -> web se actualiza.
**Q33. Estructura repos?** — web_casas (web), casasvigo (agentes WhatsApp), Vigo_room_manager (app local gestion).
**Q_extra. App local?** — Opcion C (hibrido): Dashboard local de solo lectura (consultas, informes, ingresos/costes) + WhatsApp para cambios operativos (disponibilidad, precios, datos). No duplica canales de escritura.

### Block 6: Budget & Priorities
**Q34. Presupuesto?** — Gratis si es posible, sino lo mas barato. No atado a GitHub, lo uso por ser gratis. Abierto a alternativas.
**Q35. Prioridad?** — Definir el producto y planificar la implementacion primero.
**Q36. Urgencia?** — No urgente. Las habitaciones estan ocupadas actualmente.

## Architecture Plan
_(will be generated after enough questions are answered)_

## Implementation Roadmap
_(will be generated after architecture is defined)_
