# SAMUEL OS — Checklist final de pruebas (Fase 25)

Este checklist reemplaza/actualiza al de `FASE8_checklist_pruebas.md` (que quedó desactualizado tras las Fases 14-24: juegos, fichas, comunicación, historias, gamificación, misiones y reordenamiento de navegación).

Convención: ✅ = verificado por mí revisando el código fuente (sin errores de sintaxis, IDs o funciones rotas). ⬜ = requiere prueba real en el dispositivo (depende de audio, touch, tiempo o varios días) — no lo puedo verificar desde aquí.

## 1. Integridad de archivos y consola

- ✅ Auditoría cruzada de `getElementById()` vs `id=` en `child.html`, `juegos.html`, `youtube.html`, `adult.html`, `app.js` y `progreso.html`: todas las referencias activas resuelven correctamente. No hay llamadas que vayan a fallar con "Cannot read properties of null".
- ✅ Encontré y corregí un bug silencioso: en `adult.html` el botón "Probar" voz (`id="testVoice"`) nunca se conectaba porque `app.js` buscaba `'settingsTest'`. Ya corregido — ahora el botón funciona.
- ⬜ Abrir cada página (`child.html`, `juegos.html`, `youtube.html`, `adult.html`, `progreso.html`) con la consola del navegador abierta (F12 → Console) y confirmar visualmente que no aparece ningún error en rojo.
- ⬜ Confirmar que Netlify sirve todos los archivos sin 404 (ver punto 9).

## 2. Home (`child.html`)

- ✅ 4 tarjetas principales (Jugar/Videos/Hablar/Ayuda), cumple la regla de máximo 4 opciones por pantalla (Fase 24).
- ⬜ Misión del día muestra 3 casilleros (⬜ Jugar, ⬜ Hablar, ⬜ Aprender) en 0 al empezar el día.
- ⬜ Completar cada misión la marca ✅ y suma estrella con animación + sonido.
- ⬜ Insignia de nivel (🌱 Explorador, etc.) se actualiza al sumar estrellas y sube de nivel en los umbrales correctos (15/40/80/150).
- ⬜ Zona de Papás (⚙️) sigue pidiendo la cuenta matemática y entra a `adult.html` con la respuesta correcta.
- ⬜ Modal "Hablar" (11 frases) dice cada frase en voz al tocarla.

## 3. Centro de Juegos (`juegos.html`) — estructura nueva (Fase 24)

- ✅ Home del Centro de Juegos: 4 tarjetas (Juegos simples, Juegos didácticos, Aprender, Comunicación).
- ⬜ "Juegos simples" abre un sub-hub de 3 tarjetas: 🔊 Sonidos, 🎈 Para tocar, 🚗 Movimiento.
  - ⬜ Sonidos → Tocar y escuchar, Autos y sirenas, Piano de animales, Piano de vehículos. Cada uno suena y el botón "⬅️ Sonidos" vuelve bien.
  - ⬜ Para tocar → Burbujas, Globos, Estrellas mágicas. Vuelve con "⬅️ Para tocar".
  - ⬜ Movimiento → Carrera de toques, Esquivar en la calle, Luces y colores. Vuelve con "⬅️ Movimiento".
- ⬜ "Juegos didácticos" abre Memotest, Clasificar colores, Arrastrar, Tetris, Rompecabezas — los 5 funcionan y vuelven a "Juegos didácticos".
- ⬜ "Aprender" abre un sub-hub de 2 tarjetas: Fichas de aprendizaje, Historias sociales. Cada una vuelve con "⬅️ Centro de juegos" desde Aprender, y desde Fichas/Historias vuelve a "Aprender" (no directo al home).
- ⬜ "Comunicación" muestra las 11 frases y cada una suena al tocarla.
- ⬜ Las estrellas ganadas en Fichas e Historias suman a la misión "Aprender" (no a "Jugar").
- ⬜ El resto de los juegos (causa-efecto, memotest, clasificar, arrastrar, tetris, puzzle) siguen sumando a la misión "Jugar" como antes.

## 4. Estrellas, niveles, insignias y misiones (localStorage)

- ⬜ Las estrellas del día (`samuel_progress_YYYY-MM-DD`) y el total histórico (`samuel_total_stars`) persisten al cerrar y reabrir la app el mismo día.
- ⬜ Al pasar la medianoche, la misión del día vuelve a 0, pero el total histórico y el nivel/insignias NO bajan nunca (regla "no perder / no castigo").
- ⬜ `progreso.html` (pestaña "📈 Progreso" en `adult.html`) muestra el nivel actual, insignias desbloqueadas/grises, y el gráfico de estrellas de los últimos 7 días, coincidiendo con lo guardado en `localStorage`.

## 5. Voz generada (speechSynthesis)

- ⬜ Todas las frases, juegos y misiones usan voz sintetizada clara (no requiere audios grabados, según la regla del proyecto).
- ⬜ Confirmar que el dispositivo final tiene una voz en español instalada y que se escucha clara (puede variar según el navegador/SO).

## 6. Videos (`youtube.html`)

- ⬜ Límite de 30 minutos sigue funcionando: forzar con
  ```js
  localStorage.setItem('video_start_time', Date.now() - 31*60*1000)
  ```
  y esperar a que vuelva solo a `child.html` con el modal de aviso.
- ⬜ Modal de límite: "🎮 Jugar" va a `juegos.html`, "🗣️ Hablar" abre el modal de frases, "Está bien 👍" cierra sin forzar nada.

## 7. Vuelta al inicio / navegación

- ⬜ Desde cualquier juego o pantalla profunda (ej. Tetris, Rompecabezas, Historias) se puede volver paso a paso hasta `child.html` sin pantallas en blanco ni botones que no respondan.
- ⬜ Ningún botón "volver" salta a una pantalla equivocada (ver mapa de navegación de la sección 3).

## 8. `adult.html` (zona de papás)

- ⬜ Pestañas Juegos / Videos / Progreso navegan correctamente.
- ⬜ Botón "Probar" voz en Configuración de voz ahora funciona (bug corregido esta fase) — confirmar que se escucha la voz de prueba al tocarlo.
- ⬜ Edición de tarjetas (editar/agregar/eliminar frases), exportar/importar, y bloqueo/desbloqueo siguen funcionando igual que antes.

## 9. Mobile / Desktop / Modo kiosco / Netlify

- ⬜ Probar en el tamaño de pantalla real de la tablet de Samuel — los nuevos sub-hubs (Sonidos/Para tocar/Movimiento, Aprender) se ven bien y son fáciles de tocar.
- ⬜ Probar en desktop/navegador de escritorio que todo se vea igual de bien (grilla se adapta de 3 a 2 a 1 columna).
- ⬜ Modo pantalla completa / kiosco sigue activándose desde el botón correspondiente.
- ⬜ Confirmar que Netlify publicó la última versión (revisar fecha de deploy) y que el Service Worker actualizó a `samuel-app-v30-fase25` (forzar recarga o esperar a que el SW tome el control en la próxima visita).

---

**Nota:** Los ítems ✅ ya fueron verificados por mí leyendo el código fuente completo (sin acceso a un navegador real desde este entorno). Los ítems ⬜ dependen de audio, touch, tiempo real o el dispositivo físico, y deben probarse en la tablet/kiosko real.
