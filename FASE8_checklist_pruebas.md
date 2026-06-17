# SAMUEL OS — Checklist final de pruebas (Fase 8)

Revisión de código ya hecha por mí (✅ = verificado en el código, sin errores de sintaxis ni de IDs/funciones). Lo marcado como ⬜ requiere que lo prueben ustedes en el dispositivo real (tablet/kiosko), porque depende de hardware, audio real o uso a lo largo de varios días.

## 1. Integridad de archivos

- ✅ `child.html`, `youtube.html` revisados línea por línea — sin errores de sintaxis, sin IDs ni nombres de función duplicados.
- ✅ `index.html`, `adult.html`, `juegos.html`, `app.js`, `sw-aac.js`, `manifest.webmanifest` — no fueron tocados en ninguna fase. `app.js` solo lo usa `adult.html` (sistema de PIN para modo adulto), totalmente separado del gate matemático de `child.html`; no hay conflicto de claves de localStorage entre ambos sistemas.
- ⬜ Abrir la app en el dispositivo final y confirmar que Netlify sirve los 7 archivos sin 404.

## 2. Home / Misión del día / Estrellas

- ⬜ Al entrar a `child.html` por primera vez en el día, la barra de misión muestra los 3 ítems en blanco (⬜) y 0 estrellas.
- ⬜ Tocar "Jugar" suma 1 estrella, marca "Jugar" como hecho (✅ verde) y navega a `juegos.html`.
- ⬜ Tocar "Hablar" → elegir una frase suma 1 estrella, marca "Hablar" como hecho, y se escucha la voz sintetizada.
- ⬜ Cambiar de actividad (ej. de Jugar a Hablar) suma 2 estrellas extra y marca "Descansar" como hecho.
- ⬜ Aparece la estrella flotante "+N ⭐" cerca del contador y se escucha el sonido "ding" (distinto del sonido de tap normal).
- ⬜ Recargar la página al día siguiente: la misión y las estrellas vuelven a 0 (reset automático por fecha).

## 3. Audio parental (con y sin archivos grabados)

Actualmente no existen los 6 archivos de audio en `audio/` (`bienvenido.mp3`, `tiempo-videos.mp3`, `cambiar-actividad.mp3`, `vamos-a-jugar.mp3`, `descanso.mp3`, `ayuda.mp3`), así que todo cae en la voz sintetizada de respaldo. Esto es esperado.

- ⬜ Al cargar `child.html`, después de ~1 segundo se escucha (en voz) "¡Hola Samuel! Qué bueno verte."
- ⬜ Tocar "Ayuda" reproduce (en voz) "Mamá y Papá ya vienen a ayudarte." y NO suma estrella de "cambiar de actividad" superpuesta.
- ⬜ Si en el futuro suben los archivos .mp3 reales a la carpeta `audio/`, deberían reproducirse en lugar de la voz — probar subiendo uno y confirmando que se escucha el audio grabado, no la voz sintética.

## 4. Control de tiempo de video (30 min)

- ⬜ Simular el límite sin esperar 30 minutos reales: en la consola del navegador, dentro de `youtube.html`, ejecutar:
  ```js
  localStorage.setItem('video_start_time', Date.now() - 31*60*1000)
  ```
  Esperar hasta 15 segundos → debe volver solo a `child.html`.
- ⬜ Al volver, se escucha el aviso "tiempoVideos" y luego aparece el modal "¡Se terminó el tiempito de videos!".
- ⬜ Modal: botón "🎮 Jugar" navega a `juegos.html`; botón "🗣️ Hablar" abre el modal de frases; botón "Está bien 👍" simplemente cierra el modal sin forzar nada.
- ⬜ Probar el uso normal (sin forzar el localStorage): entrar a Videos y quedarse menos de 30 min — no debe aparecer ningún aviso ni modal.

## 5. Zona de Papás (acceso discreto + gate)

- ⬜ Confirmar visualmente que el ícono ⚙️ del footer es chico, tenue, y no llama la atención como los botones de colores.
- ⬜ Tocarlo abre la pregunta matemática (multiplicación de un dígito aleatorio).
- ⬜ Respuesta incorrecta muestra "Respuesta incorrecta, probá de nuevo." y permite reintentar.
- ⬜ Respuesta correcta entra a `adult.html`.
- ⬜ Confirmar que un niño de 7 años no logra resolver la cuenta sin ayuda (criterio subjetivo de los padres).

## 6. Pantalla completa / modo kiosko

- ⬜ Botón "📺 Pantalla Completa" del header activa y desactiva el modo de pantalla completa correctamente en el dispositivo real.
- ⬜ Probar en el navegador/launcher que usarán como kiosko (Chrome, Fully Kiosk Browser, etc.) — el comportamiento de `requestFullscreen()` puede variar según el navegador.

## 7. Mobile / responsive

- ⬜ Probar en el tamaño de pantalla real del dispositivo de Samuel (tablet). La grilla de 4 botones y la barra de misión tienen reglas `@media (max-width: 768px)` para achicarse en pantallas chicas — confirmar que se ven bien y son fáciles de tocar.
- ⬜ Confirmar que los botones grandes (Jugar/Videos/Hablar/Ayuda) siguen siendo fáciles de presionar con el dedo de un niño.

## 8. Accesibilidad

- ✅ El ícono de Zona de Papás tiene `aria-label="Zona de Papás"` para lectores de pantalla.
- ⬜ Si usan algún lector de pantalla o función de accesibilidad del dispositivo, confirmar que los botones principales se anuncian con un nombre claro (actualmente dependen del texto visible: "Jugar", "Videos", "Hablar", "Ayuda").
- ⬜ Confirmar que el contraste y tamaño de letra son cómodos para Samuel en uso real (esto es más una validación clínica/personal que técnica).

## 9. Persistencia entre sesiones

- ⬜ Cerrar y volver a abrir la app (o reiniciar el dispositivo) el mismo día — las estrellas y la misión del día deben mantenerse (quedan guardadas en `localStorage`, no se borran solas).
- ⬜ Si limpian caché/datos del navegador, todo el progreso del día se perderá — esto es esperado, no es un bug.

---

**Nota:** los ítems marcados ✅ ya los verifiqué yo revisando el código fuente. Los ítems ⬜ requieren probarlos en el dispositivo/navegador real porque dependen de audio, hardware táctil, o el paso del tiempo/los días — no los puedo verificar desde aquí.
