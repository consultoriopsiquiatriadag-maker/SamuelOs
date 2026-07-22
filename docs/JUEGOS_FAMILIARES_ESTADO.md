# JUEGOS FAMILIARES — ESTADO DEL PROYECTO

## FASE ACTUAL
Fase 0 — Auditoría completada. Esperando autorización para Fase 1.

## LOTE TERMINADO
Lote 0.1 — Auditoría mínima

## ARCHIVOS INSPECCIONADOS
- `juegos.html` — Hub de juegos existente
- `jenga.html` — Jenga 3D en desarrollo (Lote 2 activo)
- `sw-aac.js` — Service Worker
- `manifest.webmanifest`
- `app.js` — Sistema AAC principal
- `escuela.html` — referencia localStorage
- `adult.html`, `mundo.html`, `youtube.html`, `progreso.html` — referencia SW

## ARCHIVOS MODIFICADOS
Ninguno en esta fase.

## ESTRUCTURA ACTUAL DE juegos.html

### Navegación interna (views)
- `viewHome` — pantalla raíz con 4 tarjetas SVG grandes
- `viewSimples` — hub "Jugar": Sonidos, Para tocar, Movimiento, Desafíos
- `viewAprender` — hub "Aprender": Fichas, Historias, Cuentos
- `viewInstrumentos` — hub "Música": Tocar, Guitarra, Batería, Piano
- `viewInstrumentosTocar` — instrumentos individuales
- `viewDidacticos` — Desafíos: Tetris, Simón, Laberinto, Contar
- `viewComunicacion` — frases AAC

### Sistema de navegación
- Función `showView(key)` centraliza cambio de vistas
- Sin sistema de router — todo en un solo archivo HTML monolítico
- Botón "Volver" navega a `child.html`

### Juegos externos existentes
- `mundo.html` — vinculado como `<a href="./mundo.html">` (card #goMundo)
- `jenga.html` — NO integrado todavía en juegos.html (pendiente Lote 4 de Jenga)

## SERVICE WORKER
- **Existe:** `sw-aac.js` — caché offline activo
- **Versión actual:** `samuel-app-v85-jenga-bugfix`
- **Estrategia:** cache-first con fallback a fetch
- **Registrado en:** `adult.html`, `juegos.html`, `mundo.html`, `youtube.html`, `progreso.html`, `escuela.html`
- **NO registrado en:** `index.html`, `child.html` (punto de entrada principal)
- **REGLA:** cada nuevo archivo HTML/JS/CSS que se agregue a `juegos-familia/` debe añadirse al array `ASSETS` y bumpearse `CACHE_VERSION`

## localStorage — CLAVES EN USO (no colisionar)
| Clave | Archivo | Propósito |
|---|---|---|
| `samuel_board_v1` | app.js | Configuración del tablero AAC |
| `samuel_voice_v1` | app.js | Configuración de voz |
| `samuel_admin_unlock_until` | app.js | Sesión del panel adulto |
| `samuel_contacts_v1` | app.js | Contactos |
| `samuel_total_stars` | juegos.html | Estrellas acumuladas |
| `samuel_last_phrase` | juegos.html | Última frase AAC |
| `samuel_horario` | escuela.html | Horario editable de Samuel |

**Para juegos familiares usar prefijo:** `samuel_familia_*`

## BIBLIOTECA EXTERNA EN USO
- `Three.js r128` — solo en `jenga.html`, desde CDN (cdnjs.cloudflare.com)
- Ninguna otra biblioteca externa en juegos.html ni en el resto

## PROPUESTA DE RUTAS CONFIRMADA

```
juegos-familia/
├── index.html                  ← portal de entrada
├── juegos-familia.css
├── juegos-familia.js
├── shared/
│   ├── players.js
│   ├── storage.js
│   ├── audio.js
│   └── family-game.css
├── memotest/
│   ├── index.html
│   ├── memotest.css
│   └── memotest.js
├── preguntados/
│   ├── index.html
│   ├── preguntados.css
│   ├── preguntados.js
│   └── preguntas.js
├── oca/
│   ├── index.html
│   ├── oca.css
│   ├── oca.js
│   ├── tablero.js
│   └── desafios.js
├── constructor/
│   ├── index.html
│   ├── constructor.css
│   ├── constructor.js
│   └── vendor/           ← Isomer u equiv. local
└── jenga-v2/
    ├── index.html
    ├── jenga-v2.css
    ├── jenga-v2.js
    └── vendor/           ← Three.js + Cannon-es local
```

## INTEGRACIÓN EN juegos.html (Lote 1.2)
- Agregar 1 tarjeta en `viewSimples` o nueva sección en `viewHome`
- Tarjeta abre `./juegos-familia/index.html` (href externo, no showView)
- No reestructurar nada más del archivo

## CONFLICTOS / RIESGOS IDENTIFICADOS

1. **SW desactualizado:** cada lote debe bumpearse `CACHE_VERSION` y agregar nuevos assets. Olvidar esto hace que Netlify sirva versiones viejas.
2. **jenga.html en desarrollo activo:** Lote 2 de Jenga aún no verificado (botón Empezar reportado con bug). No tocar hasta resolver.
3. **juegos.html es monolítico (>5000 líneas):** ediciones quirúrgicas únicamente. No reescribir el archivo completo.
4. **Three.js desde CDN:** en modo offline no carga. Para Jenga V2 se copiará local bajo `jenga-v2/vendor/`.
5. **Sin `docs/` previo:** directorio creado en este lote.

## PRUEBAS REALIZADAS
Solo auditoría de código — sin cambios funcionales.

## PRÓXIMO LOTE PROPUESTO
**Fase 1 — Lote 1.1:** Crear `juegos-familia/index.html` con portal de 5 tarjetas.
**Fase 1 — Lote 1.2:** Agregar tarjeta en `juegos.html` → `./juegos-familia/index.html`.

## DECISIONES TÉCNICAS QUE NO DEBEN OLVIDARSE
- Prefijo localStorage: `samuel_familia_*`
- Cada archivo nuevo → agregar a ASSETS en sw-aac.js + bump CACHE_VERSION
- juegos.html: editar solo con Edit quirúrgico, nunca reescribir completo
- Three.js para Jenga V2: copiar local en `jenga-v2/vendor/three.min.js`
- Cannon-es para física: evaluar en Lote 7.2 antes de comprometerse
- No crear branch desde Cowork (sin acceso a git); el usuario crea la rama manualmente
- Botón Volver siempre: grande, arriba izquierda, naranja (#f97316), mismo estilo que juegos.html `.btn-volver`
- Modo kiosco: sin target="_blank", sin enlaces externos, sin dependencias CDN en producción

---
*Actualizado: Fase 0 — Lote 0.1*
