# SAMUEL OS

Una aplicación web (PWA) pensada como un pequeño "sistema operativo" infantil para Samuel: un launcher simple, accesible y gamificado con juegos, comunicación aumentativa (AAC), historias sociales, fichas didácticas y videos curados de YouTube. Funciona offline gracias a un Service Worker y guarda todo el progreso en el dispositivo (localStorage), sin necesidad de cuentas ni servidores propios.

Principios de diseño del proyecto (no cambian de fase a fase):

- **No perder, no castigo.** Las estrellas y el progreso histórico nunca bajan; como mucho, la misión del día vuelve a cero al día siguiente.
- **Máximo 4 opciones por pantalla**, para no abrumar.
- **Voz por síntesis (`speechSynthesis`)** en vez de audios grabados — frases simples, cálidas y claras.
- **Zona de Papás separada y protegida** (PIN) para toda edición de contenido.

## Estructura de archivos

```
Samuel app/
├── index.html          # Redirige a child.html (punto de entrada de la PWA)
├── child.html           # Home de Samuel: misión del día, accesos a Jugar/Videos/Hablar/Ayuda
├── juegos.html          # Centro de Juegos: juegos simples, didácticos, Aprender (fichas/historias), Comunicación
├── youtube.html         # Catálogo de videos curados, por categoría, con reproductor embebido
├── adult.html           # Zona de Papás: edición de tarjetas AAC, voz, contactos, progreso
├── progreso.html         # Dashboard de progreso (nivel, insignias, estrellas de los últimos 7 días)
├── app.js               # Lógica compartida: tarjetas AAC, voz, contactos, header, modales
├── sw-aac.js             # Service Worker (cache offline) — versión en CACHE_VERSION
├── manifest.webmanifest  # Manifest de la PWA (nombre, ícono, modo standalone)
├── icons/                # Íconos de la PWA (192px, 512px)
├── audio/animales/        # Sonidos de animales (juegos de causa-efecto)
├── audio/vehiculos/       # Sonidos de vehículos (juegos de causa-efecto)
└── FASE25_checklist_final.md, FASE8_checklist_pruebas.md   # Checklists históricos de pruebas
```

No hay backend ni base de datos: todo el contenido editable (frases AAC, contactos, configuración de voz, progreso) vive en `localStorage` del navegador/tablet donde se usa la app.

## Cómo probar localmente

No se necesita instalar nada especial. Las opciones más simples:

1. **Doble clic en `child.html`** y abrirlo directamente en el navegador (Chrome/Edge). Funciona para probar la mayoría de las pantallas, aunque el Service Worker (modo offline) puede no activarse bien con `file://`.
2. **Servidor local simple** (recomendado, para que el Service Worker funcione igual que en producción):
   ```bash
   # Desde la carpeta del proyecto, con Python instalado:
   python -m http.server 8080
   # Luego abrir en el navegador:
   http://localhost:8080/child.html
   ```
   o con Node:
   ```bash
   npx serve .
   ```
3. Para revisar errores de consola: abrir las herramientas de desarrollador del navegador (F12 → pestaña Console) mientras se navega por `child.html`, `juegos.html`, `youtube.html` y `adult.html`.

Para entrar a la Zona de Papás desde `child.html`, tocar el ícono ⚙️ y resolver la cuenta matemática que aparece (o el PIN configurado en `adult.html`).

## Cómo publicar en Netlify

1. Crear una cuenta en [netlify.com](https://www.netlify.com) (gratis) si todavía no se tiene una.
2. **Opción A — Arrastrar y soltar:** en el panel de Netlify, ir a "Sites" y arrastrar la carpeta completa del proyecto (`Samuel app/`) al área de despliegue. Netlify la publica en segundos con una URL tipo `algo.netlify.app`.
3. **Opción B — Conectado a GitHub (recomendado, ya que el proyecto tiene repo):**
   - En Netlify, "Add new site" → "Import an existing project" → conectar la cuenta de GitHub y elegir el repo `SamuelOs`.
   - Build command: dejar vacío (no hay build, son archivos estáticos).
   - Publish directory: `.` (la raíz del repo).
   - Cada `git push origin main` dispara un nuevo deploy automático.
4. Después de cada deploy, abrir la URL en el dispositivo de Samuel y forzar una recarga (o esperar a que el Service Worker tome la versión nueva) para asegurarse de que está viendo la última versión y no una cacheada.
5. **No es necesario configurar variables de entorno ni credenciales** — el proyecto no usa APIs externas con clave ni backend propio.

## Cómo agregar nuevas fichas (Aprender → Fichas)

Las fichas viven en `juegos.html`, en el objeto `FICHAS` (buscar `const FICHAS = {`). Están agrupadas por categoría (`colores`, `numeros`, `formas`, `rutina`). Para agregar una ficha nueva, sumar un objeto al arreglo de la categoría correspondiente:

```js
// Ficha de color:
{ type:'color', hex:'#22c55e', label:'Verde' }

// Ficha con emoji:
{ type:'emoji', emoji:'⭐', label:'Estrella' }

// Ficha de número:
{ type:'numero', n:6, label:'Seis' }
```

Para crear una categoría nueva, agregar una nueva clave al objeto `FICHAS` (ej. `animales: [...]`) y luego agregar el botón correspondiente en la pantalla de selección de categorías de fichas (buscar dónde se listan `colores`/`numeros`/`formas`/`rutina` en el HTML de esa vista, cerca del mismo bloque).

## Cómo agregar nuevas frases (Comunicación / AAC)

Hay dos formas, sin tocar código:

1. **Desde la app, en vivo (recomendado):** entrar a la Zona de Papás (⚙️ en `child.html`) → pestaña de tarjetas/frases en `adult.html` → agregar, editar o eliminar frases y categorías directamente ahí. Los cambios se guardan al instante en el dispositivo.
2. **Editando el set por defecto (solo afecta instalaciones nuevas):** en `app.js`, la función `defaultBoard()` (cerca de la línea 55) define las categorías y frases iniciales. Cada frase tiene esta forma:
   ```js
   { id: uuid(), label: 'Agua', utterance: 'Quiero agua, por favor', emoji: '💧', color: '#22c55e' }
   ```
   - `label`: texto corto que se ve en el botón.
   - `utterance`: lo que se lee en voz alta con `speechSynthesis`.
   - `emoji` y `color`: apariencia del botón.

   Importante: esta función solo se usa la primera vez que se abre la app en un dispositivo (cuando todavía no hay nada guardado en `localStorage`). Si Samuel ya usó la app antes, hay que agregar la frase nueva desde la Zona de Papás (opción 1) para que aparezca.

## Cómo agregar nuevas historias sociales (Aprender → Historias)

Las historias viven en `juegos.html`, en el objeto `HISTORIAS` (buscar `const HISTORIAS = {`). Cada historia es una secuencia de pasos con emoji y texto:

```js
miHistoria: { titulo: 'Ir a la plaza', pasos: [
  { emoji:'🚪', texto:'Salimos de casa.' },
  { emoji:'🛝', texto:'Llegamos a la plaza y juego.' },
  { emoji:'🏠', texto:'Volvemos a casa tranquilos.' }
]}
```

Después de agregar la historia al objeto, agregar también su botón en la pantalla donde se listan las historias existentes (mismo bloque de `juegos.html`, cerca de donde se recorren las claves de `HISTORIAS`). Conviene mantener los textos cortos, simples y en frases cálidas, en línea con el resto de la app.

## Cómo ajustar el tiempo de videos

El límite de tiempo de uso de `youtube.html` está en esa misma página, buscar:

```js
const limit = 30 * 60 * 1000; // 30 minutos
```

Cambiar el `30` por la cantidad de minutos deseada (por ejemplo, `20 * 60 * 1000` para 20 minutos). Al llegar al límite, la app vuelve sola a `child.html` y muestra un aviso amable (no un error ni un bloqueo agresivo).

### Sobre el catálogo de videos (`CATEGORIAS` en `youtube.html`)

Cada video se define así:

```js
{ id: 'XqZsoesa55w', titulo: 'Baby Shark 🦈', canal: 'Pinkfong' }
```

El `id` es el identificador de YouTube (lo que aparece después de `?v=` en la URL del video). Antes de agregar un ID nuevo, conviene verificar que el video todavía existe y permite ser embebido, pegando esta URL en el navegador (debe devolver un JSON, no una respuesta vacía):

```
https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ESE_ID&format=json
```

En la Fase 26 se revisó el catálogo completo porque muchos videos antiguos ya no cargaban (borrados, privados o sin permiso de embed por parte del canal) — todos los IDs actuales fueron verificados con este método antes de subirlos.

## No modificar

Por seguridad y porque no es necesario para el funcionamiento de la app: no agregar credenciales, claves de API ni datos sensibles a ningún archivo del proyecto. La app no necesita ninguna de estas cosas para funcionar — todo el contenido es estático o se guarda localmente en el dispositivo.
