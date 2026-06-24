# SAMUEL OS — Checklist final: módulo Mundial 2026 y Videos Argentina (Fases 28-36)

Este checklist cubre específicamente lo agregado en las Fases 28 a 36: el banner "Videos Argentina" en `youtube.html`, y el módulo completo del Mundial de Fútbol 2026 en `juegos.html` (selector de países, info, juego de banderas, fixture, ícono de jugador y minijuego de penales). Complementa, no reemplaza, a `FASE25_checklist_final.md` (que cubre el resto de la app).

Convención: ✅ = verificado por mí revisando el código fuente (IDs, funciones y datos correctos, sin errores de sintaxis). ⬜ = requiere prueba real en el dispositivo (audio, touch, tiempo) — no lo puedo verificar desde aquí.

## 1. Videos Argentina (Fase 28)

- ✅ Banner "🇦🇷 Videos Argentina" en `youtube.html` abre la categoría `argentina`, construida a partir del array `videosArgentina`.
- ✅ Cada video de `videosArgentina` tiene `youtubeId` verificado (mismo método que el resto del catálogo, ver README).
- ⬜ Tocar el banner reproduce el primer video y la voz de bienvenida ("Vamos a ver un video de Argentina").
- ⬜ Completar la sección suma a la misión "Aprender" del día (no a "Jugar").

## 2. Selector de países y ficha (Fase 29)

- ✅ `mundial2026` tiene 48 países con `nombre`, `bandera`, `grupo`, `anfitrion`, `dato` — sin datos inventados (ver regla de datos en README).
- ✅ `openPais()` suma 1 estrella a la misión "Aprender" al abrir una ficha.
- ⬜ Tocar un país en la grilla abre su ficha con bandera, nombre, grupo, insignia de anfitrión (solo México/EE.UU./Canadá) y dato leído en voz alta.
- ⬜ Botones ⬅️/➡️/🔊 de la ficha funcionan y "⬅️ Países" vuelve a la grilla.

## 3. "¿Qué es el Mundial?" (Fase 30)

- ✅ `MUNDIAL_INFO` no otorga estrellas (es información pura, mismo criterio que las fichas de "Aprender" originales).
- ⬜ Cada tarjeta lee su texto en voz alta al tocarla y muestra la animación `tapped`.

## 4. "Encontrá la bandera" (Fase 31)

- ✅ `nuevoRound()` evita banderas repetidas entre las 3 opciones (`usedFlags`) y mezcla el orden.
- ✅ Acertar suma 2 estrellas a "Aprender"; errar nunca resta puntos, solo muestra "Probemos otra vez" y deja reintentar.
- ⬜ El juego no se traba si se acierta o se erra varias veces seguidas (probar 10 rondas).

## 5. Gamificación (Fase 32)

- ✅ Las estrellas de todo el módulo Mundial usan `addStarJ()`/`makeStarTicker()` ya existentes — no hay un sistema de puntos paralelo.
- ⬜ Las estrellas ganadas en el Mundial se ven reflejadas en el contador de la cabecera (`#starsBadge`) y en `progreso.html`.

## 6. Fixture (Fase 34)

- ✅ `mundialFixture` está organizado por fecha (12 al 27 de junio), no por grupo — decisión deliberada para no tener que inventar partidos faltantes (ver README, "Regla de datos del Mundial").
- ✅ Los partidos con `resultado:null` se muestran como "Por jugar" en vez de un marcador inventado.
- ✅ Comentario explícito en el código (`// Fase 34: Fixture del Mundial 2026`) documenta la fuente (ESPN México, 24/6/2026) y la instrucción de actualizar según FIFA.
- ⬜ Tocar "📅 Fixture" → un día → un partido reproduce el resultado o "todavía no se jugó" en voz alta.
- ⬜ **Pendiente real (no inventado a propósito):** falta un partido del Grupo A (~11 de junio) que no aparecía en la fuente consultada. Revisar con una fuente oficial (FIFA) y completarlo si corresponde, sin adivinar el resultado.
- ⬜ Revisar y actualizar `mundialFixture` después del 27/6/2026 para sumar octavos de final en adelante, cuando haya fuente oficial confirmada.

## 7. Ícono genérico de jugador (Fase 35)

- ✅ El ícono (👕⚽) es estático e idéntico para los 48 países — no hay fotos reales ni representación de jugadores específicos, tal como se pidió.
- ⬜ Se ve bien en mobile y desktop (revisar `@media (max-width:600px)`).

## 8. Patear penales (Fase 36)

- ✅ `patear()` siempre termina en gol — no existe ninguna rama de código que muestre un resultado negativo o "perdiste".
- ✅ Suma 1 estrella por patada a la misión "Jugar" (`addStarJ('jugar')`), reutilizando `showConfetti()`, `ensureAudio()` y `playTone()` ya existentes (sin duplicar lógica de audio/confetti).
- ⬜ Tocar la pelota y tocar el botón "¡Patear!" hacen lo mismo (probar ambos).
- ⬜ El botón se deshabilita mientras la pelota "vuela" y se vuelve a habilitar solo, sin que se pueda trabar en estado deshabilitado.

## 9. Integridad general del módulo

- ✅ Las 5 sub-vistas (selector, info, juego de banderas, fixture, penales) se ocultan correctamente entre sí — cada función `abrirX()` y `volverSelector()` esconde las otras 4 antes de mostrar la propia.
- ✅ `CACHE_VERSION` en `sw-aac.js` se actualizó en cada fase (`v37-fase34`, `v38-fase35`, `v39-fase36`).
- ⬜ Abrir `juegos.html` con la consola del navegador abierta (F12) y navegar por las 5 sub-vistas del Mundial sin que aparezca ningún error en rojo.
- ⬜ Confirmar que Netlify publicó la última versión y el Service Worker tomó `samuel-app-v39-fase36` (forzar recarga si es necesario).

---

**Nota:** Los ítems ✅ ya fueron verificados por mí leyendo el código fuente completo. Los ítems ⬜ dependen de audio, touch o el dispositivo físico, y deben probarse en la tablet/kiosko real de Samuel.
