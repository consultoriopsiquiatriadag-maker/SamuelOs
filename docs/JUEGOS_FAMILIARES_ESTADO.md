# JUEGOS FAMILIARES — ESTADO DEL PROYECTO

## ESTADO ACTUAL
✅ **PLAN MAESTRO COMPLETADO** — Fases 0 a 10 finalizadas.
Versión SW activa: `samuel-app-v94-fase9-fixes`

---

## JUEGOS DISPONIBLES EN PRODUCCIÓN

| Juego | Ruta | Estado |
|---|---|---|
| 🧠 Memotest | `juegos-familia/memotest/` | ✅ Listo |
| 🎯 Preguntados | `juegos-familia/preguntados/` | ✅ Listo |
| 🪿 La Oca | `juegos-familia/oca/` | ✅ Listo |
| 🏗️ Constructor | `juegos-familia/constructor/` | ✅ Listo |
| 🪵 Jenga 3D V2 | `juegos-familia/jenga-v2/` | ✅ Listo |

---

## MÓDULOS COMPARTIDOS

| Módulo | Ruta | Propósito |
|---|---|---|
| `family-game.css` | `shared/` | Estilos, variables, componentes UI |
| `players.js` | `shared/` | Jugadores, turnos, puntaje, selector, chips |
| `storage.js` | `shared/` | localStorage con prefijo `samuel_familia_*` |
| `audio.js` | `shared/` | Sonidos procedurales + SpeechSynthesis |

---

## DECISIONES TÉCNICAS (no olvidar)

- **Prefijo localStorage:** `samuel_familia_*` — no colisiona con el resto de la app
- **Cada archivo nuevo → agregar a ASSETS en sw-aac.js + bump CACHE_VERSION**
- **juegos.html:** editar solo con Edit quirúrgico, nunca reescribir completo
- **Three.js para Jenga V2:** CDN r128, pre-cacheado en SW. Para copia local futura: `jenga-v2/vendor/three.min.js`
- **Modo kiosco:** sin target="_blank", sin dependencias CDN en producción (excepción: Three.js ya cacheado)
- **No correr git desde Cowork** — el usuario lo hace manualmente

---

## ARQUITECTURA DE RUTAS

```
juegos-familia/
├── index.html                  ← portal de entrada (desde juegos.html → goFamilia)
├── shared/
│   ├── family-game.css
│   ├── players.js              (window.FamiliaJugadores)
│   ├── storage.js              (window.FamiliaStorage)
│   └── audio.js               (window.FamiliaAudio)
├── memotest/index.html
├── preguntados/index.html
├── oca/index.html
├── constructor/index.html
└── jenga-v2/index.html
```

---

## CLAVES localStorage EN USO (no colisionar)

| Clave | Archivo | Propósito |
|---|---|---|
| `samuel_board_v1` | app.js | Tablero AAC |
| `samuel_voice_v1` | app.js | Config de voz |
| `samuel_admin_unlock_until` | app.js | Sesión admin |
| `samuel_contacts_v1` | app.js | Contactos |
| `samuel_total_stars` | juegos.html | Estrellas |
| `samuel_last_phrase` | juegos.html | Última frase AAC |
| `samuel_horario` | escuela.html | Horario |
| `samuel_familia_*` | juegos-familia/ | **Prefijo juegos familiares** |

---

## HISTORIAL DE VERSIONES SW

| Versión | Cambio |
|---|---|
| v85 | jenga bugfix |
| v86 | juegos-familia/index.html |
| v87 | shared modules (players, storage, audio, css) |
| v88 | memotest |
| v89 | preguntados |
| v90 | oca |
| v91 | constructor |
| v92 | jenga-v2 |
| v93 | Three.js pre-cacheado offline |
| v94 | bugfixes fase 9 |

---

## PENDIENTES FUTUROS (fuera del plan maestro)

- Copiar `three.min.js` localmente a `jenga-v2/vendor/` para offline total sin depender del CDN
- Evaluar agregar más categorías de preguntas a Preguntados
- Temáticas adicionales para Memotest (vehículos, frutas, letras)
- Resolver bug pendiente de `jenga.html` original (Lote 2 — botón Empezar)

---
*Actualizado: Fase 10 — Plan Maestro completado*
