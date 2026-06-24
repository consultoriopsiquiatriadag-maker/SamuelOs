# SAMUEL OS — Checklist de pruebas después del push (Fases 28-41b)

Este checklist es para usar **después de hacer `git push` y confirmar que el sitio publicado se actualizó**. Cubre el módulo Mundial, los 3 minijuegos de aventura (Camionero, Conectar animales, Básquet) y los niveles que escalan agregados en la Fase 41/41b.

Convención: ✅ = ya verificado por código (no requiere prueba). ⬜ = hay que probarlo a mano en el dispositivo.

## 0. Antes de probar nada

- ⬜ Confirmar que `git push` se hizo sin errores.
- ⬜ Esperar 1-2 minutos a que el hosting (Netlify/Vercel) termine de publicar.
- ⬜ En el dispositivo de Samuel: cerrar la app/pestaña por completo (no minimizar) y volver a abrirla. Si sigue sin verse el cambio, forzar actualización (PWA: "Forzar detención" desde info de la app y reabrir; navegador: recarga forzada).
- ⬜ Confirmar que el Service Worker tomó la versión `samuel-app-v44-fase41b` (se puede ver en la consola del navegador, F12 → Application → Service Workers).

## 1. Mundial de Fútbol 2026 (Fases 28-36, 41)

- ⬜ Centro de Juegos → Juegos didácticos → "⚽ Mundial 2026" abre el selector de 48 países.
- ⬜ Tocar un país abre su ficha (bandera, grupo, dato, ícono de jugador genérico) y lo lee en voz alta.
- ⬜ "🚩 Encontrá la bandera" funciona: acertar suma estrella, errar deja reintentar sin penalizar.
- ⬜ "📅 Fixture" muestra los partidos por fecha; los que no se jugaron dicen "Por jugar" (no un resultado inventado).
- ⬜ "⚽ Patear penales" — tocar la pelota o el botón "¡Patear!" siempre termina en gol, festeja con voz/confetti, y el botón no se traba deshabilitado.
- ⬜ **Niveles (Fase 41):** arranca en "Nivel 1" pidiendo 3 goles; al completarlos sube a "Nivel 2" (5 goles) y cambia el "Rival" (bandera/país) mostrado en la insignia. Seguir hasta el Nivel 5 (11 goles) y confirmar que se mantiene ahí después (no rompe ni reinicia solo).

## 2. Juegos de aventura (Fases 37, 39, 40, 41b) — sub-hub nuevo

- ⬜ Centro de Juegos → Juegos didácticos → "🚛 Juegos de aventura" muestra las 3 tarjetas: Camionero, Conectar animales, Básquet.
- ⬜ El botón "⬅️ Juegos didácticos" desde ahí vuelve correctamente al hub anterior.

### 2.1 Camionero (Fase 37, niveles en 41b)

- ⬜ Tocar una caja la "carga" (desaparece con animación) y suma al contador "Cargadas: X/5" (el "5" es la meta del Nivel 1).
- ⬜ Al cargar todas las cajas del nivel, el camión sale animado, festeja con voz/confetti, sube a "Nivel 2" y aparecen 7 cajas nuevas (después 9, 11, 13).
- ⬜ Confirmar que se mantiene en 13 cajas después del Nivel 5 (no sigue creciendo para siempre).
- ✅ No tiene ninguna rama de "fallar" — cada toque siempre carga una caja.

### 2.2 Conectar animales (Fase 39, niveles en 41b)

- ⬜ Tocar un animal adulto lo marca seleccionado (borde azul); tocar su cría correcta conecta el par (ambos quedan "resueltos").
- ⬜ Tocar una cría incorrecta hace un sacudido + "Probemos de nuevo 🙂", sin restar puntos, y se puede reintentar.
- ⬜ Al conectar los 4 pares de la ronda (Nivel 1), festeja con voz/confetti, sube a "Nivel 2" y arranca una ronda nueva con 5 pares; el Nivel 3 pide 6 pares (el máximo, porque hay 6 familias de animales en total).
- ⬜ Confirmar que se mantiene en 6 pares después del Nivel 3 (no pide más de los animales que existen).
- ✅ Usa una mecánica distinta a Memotest (conectar mamá-cría entre dos columnas, no dar vuelta cartas) — confirmado para evitar duplicar contenido.

### 2.3 Básquet (Fase 40, niveles en 41b)

- ⬜ Tocar la pelota o el botón "¡Encestar!" hacen lo mismo: la pelota sube al aro, suena, y siempre encesta.
- ⬜ El botón se deshabilita mientras la pelota "vuela" y se vuelve a habilitar solo (no debería quedar trabado).
- ⬜ Cada canasta suma al contador "Canastas: X/5" (meta del Nivel 1); al completar la meta festeja, sube a "Nivel 2" (7 canastas) y así hasta el Nivel 5 (13).
- ⬜ Confirmar que se mantiene en 13 canastas después del Nivel 5.
- ✅ Sin ninguna rama de "fallar el tiro", igual filosofía que Patear penales.

## 3. Integridad general

- ⬜ Abrir `juegos.html` con la consola del navegador abierta (F12) y navegar por todo (Mundial + Juegos de aventura) sin que aparezca ningún error en rojo.
- ⬜ Confirmar que `child.html`, `youtube.html` y `adult.html` siguen funcionando igual que antes (no deberían haber cambiado en estas fases).
- ⬜ Revisar que ninguna pantalla nueva muestre más de 4 botones a la vez (el sub-hub "Juegos de aventura" tiene 3, está bien).

---

**Nota:** Los ítems ✅ ya fueron verificados leyendo el código fuente. Los ítems ⬜ dependen de audio, touch o el dispositivo físico, y deben probarse en la tablet/kiosko real de Samuel — sobre todo después de confirmar que el push se publicó.

**Sobre los niveles:** en los 4 juegos, subir de nivel solo pide *más cantidad* del mismo objetivo (más goles/cajas/pares/canastas) — nunca menos tiempo, ni más puntería, ni una rama de "perder". El nivel queda guardado solo mientras la pestaña está abierta (no persiste si se cierra la app); si eso se quiere cambiar a futuro, es un ajuste aparte.
