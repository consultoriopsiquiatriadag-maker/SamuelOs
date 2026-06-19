/* Aplicación de Samuel - lógica principal */
const APP_VERSION = 'v18';

const KEY_BOARD = 'samuel_board_v1';
const KEY_VOICE = 'samuel_voice_v1';
const KEY_ADMIN_UNLOCK = 'samuel_admin_unlock_until';
const KEY_CONTACTS = 'samuel_contacts_v1';

// PIN por defecto (cambiable editando aquí)
const ADMIN_PIN_DEFAULT = '1234';
// Tiempo de desbloqueo en adulto (min)
const ADMIN_UNLOCK_MINUTES = 30;

const uuid = () => Math.random().toString(36).slice(2);

// Normaliza textos para comparar (sin mayúsculas/acentos)
function keyOf(s){
  return String(s||'')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .trim();
}

// Mantiene compatibilidad: agrega/renombra botones aunque el board ya exista en localStorage
function patchBoard(b){
  if (!b || !Array.isArray(b.categories)) return b;
  const pedir = b.categories.find(c => keyOf(c.name) === 'pedir');
  if (!pedir || !Array.isArray(pedir.buttons)) return b;

  const ensure = (btn) => {
    const exists = pedir.buttons.some(x => keyOf(x.label) === keyOf(btn.label));
    if (!exists) pedir.buttons.push({ id: uuid(), ...btn });
  };

  // Renombrar el antiguo “Más” -> “Quiero más”
  const oldMas = pedir.buttons.find(x => keyOf(x.label) === 'mas');
  if (oldMas) {
    oldMas.label = 'Quiero más';
    oldMas.utterance = 'Quiero más';
    oldMas.emoji = oldMas.emoji || '➕';
    oldMas.color = oldMas.color || '#eab308';
  }

  // Asegurar nuevos botones principales
  ensure({ label: 'Quiero ir a casa', utterance: 'Quiero ir a casa', emoji: '🏠', color: '#3b82f6' });
  ensure({ label: 'Vamos al auto', utterance: 'Vamos al auto', emoji: '🚗', color: '#f97316' });
  ensure({ label: 'Quiero ir a dormir', utterance: 'Quiero ir a dormir', emoji: '🛌', color: '#6366f1' });
  // Si no estaba “Quiero más” (porque no existía el viejo “Más”)
  ensure({ label: 'Quiero más', utterance: 'Quiero más', emoji: '➕', color: '#eab308' });

  return b;
}

const defaultBoard = () => ({
  largeText: true,
  categories: [
    { id: uuid(), name: 'Pedir', buttons: [
      { id: uuid(), label: 'Agua', utterance: 'Quiero agua, por favor', emoji: '💧', color: '#22c55e' },
      { id: uuid(), label: 'Comida', utterance: 'Tengo hambre', emoji: '🍽️', color: '#22c55e' },
      { id: uuid(), label: 'Baño', utterance: 'Quiero ir al baño', emoji: '🚻', color: '#a855f7' },
      { id: uuid(), label: 'Quiero ir a casa', utterance: 'Quiero ir a casa', emoji: '🏠', color: '#3b82f6' },
      { id: uuid(), label: 'Vamos al auto', utterance: 'Vamos al auto', emoji: '🚗', color: '#f97316' },
      { id: uuid(), label: 'Jugar', utterance: 'Quiero jugar', emoji: '🎲', color: '#ef4444' },
      { id: uuid(), label: 'Quiero más', utterance: 'Quiero más', emoji: '➕', color: '#eab308' },
      { id: uuid(), label: 'Quiero ir a dormir', utterance: 'Quiero ir a dormir', emoji: '🛌', color: '#6366f1' },
      { id: uuid(), label: 'Pausa', utterance: 'Necesito una pausa', emoji: '⏸️', color: '#ef4444' },
      { id: uuid(), label: 'Ayuda', utterance: 'Ayuda, por favor', emoji: '🆘', color: '#22c55e' }
    ]},
    { id: uuid(), name: 'Estado', buttons: [
      { id: uuid(), label: 'Bien', utterance: 'Estoy bien', emoji: '😊', color: '#22c55e' },
      { id: uuid(), label: 'Triste', utterance: 'Estoy triste', emoji: '😢', color: '#3b82f6' },
      { id: uuid(), label: 'Dolor', utterance: 'Me duele', emoji: '🤕', color: '#ef4444' },
      { id: uuid(), label: 'Cansado', utterance: 'Estoy cansado', emoji: '😴', color: '#a855f7' },
      { id: uuid(), label: 'Terminé', utterance: 'Terminé', emoji: '✅', color: '#22c55e' }
    ]},
    { id: uuid(), name: 'Novedades', buttons: [
      { id: uuid(), label: 'Te cuento', utterance: 'Quiero contarte una novedad', emoji: '🗣️', color: '#a855f7' },
      { id: uuid(), label: 'Escuela', utterance: 'En la escuela me pasó algo', emoji: '🏫', color: '#22c55e' },
      { id: uuid(), label: 'Casa', utterance: 'En casa me pasó algo', emoji: '🏠', color: '#f472b6' },
      { id: uuid(), label: 'Dolor/Accidente', utterance: 'Tuve un golpe o dolor', emoji: '🚑', color: '#a855f7' },
      { id: uuid(), label: 'Amigos', utterance: 'Quiero hablar de mis amigos', emoji: '🧑‍🤝‍🧑', color: '#f59e0b' }
    ]}
  ]
});

const defaultContacts = () => ([
  { id: uuid(), name: 'Papá', phone: '+5491156437958' },
  { id: uuid(), name: 'Mamá', phone: '+5493425451766' }
]);

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function loadBoard() {
  const b = readJSON(KEY_BOARD, null);
  if (!b || !b.categories) {
    const fresh = defaultBoard();
    writeJSON(KEY_BOARD, fresh);
    return fresh;
  }
  const patched = patchBoard(b);
  // Persistir cambios si aplicó parche
  writeJSON(KEY_BOARD, patched);
  return patched;
}

function loadVoice() {
  const v = readJSON(KEY_VOICE, null);
  // Voz “amigable” por defecto
  return v || { name: null, rate: 0.92, pitch: 1.05, volume: 1 };
}

function loadContacts() {
  const c = readJSON(KEY_CONTACTS, null);
  if (!Array.isArray(c) || c.length === 0) {
    const fresh = defaultContacts();
    writeJSON(KEY_CONTACTS, fresh);
    return fresh;
  }
  return c;
}

function isAdultUnlocked() {
  const until = parseInt(localStorage.getItem(KEY_ADMIN_UNLOCK) || '0', 10);
  return Date.now() < until;
}
function setAdultUnlocked() {
  const until = Date.now() + ADMIN_UNLOCK_MINUTES * 60 * 1000;
  localStorage.setItem(KEY_ADMIN_UNLOCK, String(until));
}
function clearAdultUnlocked() {
  localStorage.removeItem(KEY_ADMIN_UNLOCK);
}

function normalizeWa(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.startsWith('54') ? digits : ('54' + digits);
}

// ===== TTS =====
let voiceState = loadVoice();
let lastSpoken = null;
let speakingNow = false;

function setSpeechText(t) {
  const el = document.getElementById('speechText');
  if (el) el.textContent = t || 'Toca un botón para hablar';
}

function speak(text) {
  if (!text) return;
  lastSpoken = text;
  setSpeechText(text);
  try { window.speechSynthesis.cancel(); } catch {}

  const u = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();

  // Prioriza español si existe
  const preferred = voiceState.name
    ? voices.find(v => v.name === voiceState.name)
    : voices.find(v => /(^|\s)(es-|Spanish|español)/i.test((v.lang || '') + ' ' + (v.name || '')));

  if (preferred) u.voice = preferred;
  u.rate = voiceState.rate;
  u.pitch = voiceState.pitch;
  u.volume = voiceState.volume;

  u.onstart = () => { speakingNow = true; };
  u.onend = () => { speakingNow = false; };
  u.onerror = () => { speakingNow = false; };

  window.speechSynthesis.speak(u);
}

// ===== UI base =====
let board = loadBoard();
let activeCatId = board.categories[0]?.id;
let locked = true;
let editMode = false;

function pageKind() {
  // child.html o adult.html
  if (location.pathname.endsWith('adult.html')) return 'adult';
  return 'child';
}

function initHeader() {
  const t = document.getElementById('appTitle');
  if (t) t.textContent = 'Aplicación de Samuel';
  const v = document.getElementById('appVersion');
  if (v) v.textContent = APP_VERSION;

  // Avatar: en child se usa para PIN
  const avatar = document.getElementById('avatar');
  if (avatar && pageKind() === 'child') {
    let pressTimer = null;
    const start = () => { pressTimer = setTimeout(openPin, 700); };
    const clear = () => { if (pressTimer) clearTimeout(pressTimer); pressTimer = null; };
    avatar.addEventListener('pointerdown', start);
    avatar.addEventListener('pointerup', clear);
    avatar.addEventListener('pointercancel', clear);
    avatar.addEventListener('pointerleave', clear);
  }

  const parentsBtn = document.getElementById('parentsBtn');
  if (parentsBtn) parentsBtn.onclick = () => {
    const page = document.body?.dataset?.page || 'child';
    openParents({ requireGate: page === 'child' });
  };

  const fullBtn = document.getElementById('fullBtn');
  if (fullBtn) fullBtn.onclick = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  // Botón volver a niño (adult)
  const toChild = document.getElementById('toChildBtn');
  if (toChild) {
    toChild.onclick = () => {
      clearAdultUnlocked();
      location.href = 'child.html';
    };
  }
}


// ===== Helpers de color (para contraste moderno) =====
function hexToRgb(hex){
  if (!hex) return {r:255,g:255,b:255};
  let h = String(hex).trim();
  if (h.startsWith('rgb')) return {r:255,g:255,b:255};
  if (h[0] === '#') h = h.slice(1);
  if (h.length === 3) h = h.split('').map(ch => ch+ch).join('');
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return {r:255,g:255,b:255};
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
}
function clamp01(x){ return Math.max(0, Math.min(1, x)); }
function mix(a,b,t){ return Math.round(a + (b-a)*t); }
function toHex2(v){ return v.toString(16).padStart(2,'0'); }
function mixHex(hexA, hexB, t){
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  const r = mix(a.r,b.r,t), g = mix(a.g,b.g,t), bb = mix(a.b,b.b,t);
  return '#' + toHex2(r) + toHex2(g) + toHex2(bb);
}
function lighten(hex, amt){ return mixHex(hex, '#ffffff', clamp01(amt)); }
function darken(hex, amt){ return mixHex(hex, '#000000', clamp01(amt)); }
function relLuma(hex){
  const {r,g,b} = hexToRgb(hex);
  const sr = r/255, sg=g/255, sb=b/255;
  const lin = (c)=> (c<=0.03928? c/12.92 : Math.pow((c+0.055)/1.055, 2.4));
  const R=lin(sr), G=lin(sg), B=lin(sb);
  return 0.2126*R + 0.7152*G + 0.0722*B;
}
function isDark(hex){ return relLuma(hex) < 0.42; }

function renderTabs() {
  const tabsEl = document.getElementById('tabs');
  if (!tabsEl) return;
  tabsEl.innerHTML = '';
  board.categories.forEach(cat => {
    const b = document.createElement('button');
    b.className = 'tab' + (activeCatId === cat.id ? ' active' : '');
    b.textContent = cat.name;
    b.onclick = () => { activeCatId = cat.id; render(); };
    tabsEl.appendChild(b);
  });

  // En modo niño, Juegos y Videos están en el dock fijo inferior.
  // Solo agregamos las pestañas en el modo adulto.
  if (pageKind() === 'adult') {
    const juegosBtn = document.createElement('button');
    juegosBtn.className = 'tab';
    juegosBtn.textContent = '🎮 Juegos';
    juegosBtn.onclick = () => { location.href = './juegos.html'; };
    tabsEl.appendChild(juegosBtn);

    const videosBtn = document.createElement('button');
    videosBtn.className = 'tab';
    videosBtn.textContent = '▶️ Videos';
    videosBtn.onclick = () => { location.href = './youtube.html'; };
    tabsEl.appendChild(videosBtn);

    const progresoBtn = document.createElement('button');
    progresoBtn.className = 'tab';
    progresoBtn.textContent = '📈 Progreso';
    progresoBtn.onclick = () => { location.href = './progreso.html'; };
    tabsEl.appendChild(progresoBtn);
  }

  if (pageKind() === 'adult' && !locked && editMode) {
    const add = document.createElement('button');
    add.className = 'tab';
    add.textContent = '+ Categoría';
    add.onclick = () => {
      const name = prompt('Nombre de la categoría', 'Nueva');
      if (!name) return;
      board.categories.push({ id: uuid(), name, buttons: [] });
      writeJSON(KEY_BOARD, board);
      activeCatId = board.categories[board.categories.length - 1].id;
      render();
    };
    tabsEl.appendChild(add);
  }
}

function renderGrid() {
  const gridEl = document.getElementById('grid');
  if (!gridEl) return;
  gridEl.innerHTML = '';
  const cat = board.categories.find(c => c.id === activeCatId) || board.categories[0];
    (cat?.buttons || []).forEach(btn => {
    const el = document.createElement('button');
    // clases compatibles (CSS usa .card/.cardBtn)
    el.className = 'card cardBtn';

    // fondo con gradiente suave + contraste automático
    const base = (btn.color || '#ffffff').trim();
    const top = lighten(base, 0.14);
    const bottom = darken(base, 0.08);
    el.style.background = `linear-gradient(180deg, ${top}, ${bottom})`;
    el.style.backgroundColor = base;

    const darkBg = isDark(bottom);
    el.style.color = darkBg ? '#ffffff' : '#0f172a';
el.onclick = () => {
      el.classList.add('pulse');
      setTimeout(() => el.classList.remove('pulse'), 220);
      speak(btn.utterance || btn.label);
    };

    const icon = document.createElement('div');
    icon.className = 'icon iconBadge';
    icon.innerHTML = `<span>${(btn.emoji || (btn.label||'•').slice(0,1)).trim()}</span>`;
    icon.style.background = darkBg ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.52)';
    icon.style.borderColor = darkBg ? 'rgba(255,255,255,.28)' : 'rgba(255,255,255,.42)';

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = btn.label;
    if (darkBg) label.style.textShadow = '0 2px 10px rgba(0,0,0,.22)';

    el.appendChild(icon);
    el.appendChild(label);

    // edición solo adulto
    if (pageKind() === 'adult' && !locked && editMode) {
      const editIcon = document.createElement('button');
      editIcon.className = 'editIcon';
      editIcon.textContent = '✏️';
      editIcon.onclick = (e) => { e.stopPropagation(); e.preventDefault(); openEdit(btn, cat); };
      el.appendChild(editIcon);
    }

    gridEl.appendChild(el);
  });

  if (pageKind() === 'adult' && !locked && editMode) {
    const add = document.createElement('button');
    add.className = 'card cardBtn';
    add.style.background = '#ffffff';
    add.innerHTML = `<div class="icon"><span>＋</span></div><div class="label">Agregar botón</div>`;
    add.onclick = () => openEdit({ id: uuid(), label: '', utterance: '', emoji: '', color: '#ffffff' }, cat, true);
    gridEl.appendChild(add);
  }
}

function render() {
  renderTabs();
  renderGrid();
  // solo adulto: controles
  if (pageKind() === 'adult') {
    const lockBtn = document.getElementById('lockBtn');
    const editBtn = document.getElementById('editBtn');
    if (lockBtn) lockBtn.textContent = locked ? 'Bloqueado' : 'Desbloqueado';
    if (editBtn) {
      editBtn.disabled = locked;
      editBtn.textContent = editMode ? 'Salir edición' : 'Editar';
    }
    const largeText = document.getElementById('largeText');
    if (largeText) largeText.checked = !!board.largeText;
  }
}

// ===== Padres modal =====
function openParents(opts = {}) {
  const { requireGate = false } = opts;

  // Si estamos en Modo Niño, pedimos una cuenta simple antes de mostrar contactos
  if (requireGate) {
    return openParentsGate(() => openParents({ requireGate: false }));
  }

  const modal = document.getElementById('parentsModal');
  const list = document.getElementById('parentsList');
  if (!modal || !list) return;
  const contacts = loadContacts();

  list.innerHTML = '';
  contacts.forEach(c => {
    const row = document.createElement('div');
    row.className = 'contact';
    const wa = normalizeWa(c.phone);
    row.innerHTML = `
      <div>
        <div style="font-weight:900;">${c.name}</div>
        <div style="color:#475569;font-weight:700;">${c.phone}</div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;">
        <a class="btn" href="tel:${c.phone}">Llamar</a>
        <a class="btn primary" href="https://wa.me/${wa}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    `;
    list.appendChild(row);
  });

  const close = document.getElementById('closeParents');
  if (close) close.onclick = () => modal.close();
  modal.showModal();
}

function openParentsGate(onSuccess) {
  const gate = document.getElementById('parentsGateModal');
  const qEl = document.getElementById('gateQuestion');
  const input = document.getElementById('gateAnswer');
  const msg = document.getElementById('gateMsg');
  const cancel = document.getElementById('gateCancel');
  const ok = document.getElementById('gateOk');

  // Si el HTML no tiene gate (por ejemplo en adult.html), pasamos directo
  if (!gate || !qEl || !input || !ok) return onSuccess?.();

  // Generar cuenta aleatoria (multiplicación 2..9)
  const a = 2 + Math.floor(Math.random() * 8);
  const b = 2 + Math.floor(Math.random() * 8);
  const ans = a * b;

  qEl.textContent = `¿Cuánto es ${a}×${b}?`;
  input.value = '';
  if (msg) msg.textContent = '';
  input.focus?.();

  const cleanup = () => {
    ok.onclick = null;
    if (cancel) cancel.onclick = null;
    input.onkeydown = null;
  };

  const validate = () => {
    const v = parseInt(String(input.value || '').trim(), 10);
    if (v === ans) {
      cleanup();
      gate.close();
      onSuccess?.();
    } else {
      if (msg) msg.textContent = 'Respuesta incorrecta. Probá de nuevo.';
      input.value = '';
      input.focus?.();
      // mini feedback visual
      input.animate?.([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 220 });
    }
  };

  ok.onclick = validate;
  if (cancel) cancel.onclick = () => { cleanup(); gate.close(); };
  input.onkeydown = (e) => { if (e.key === 'Enter') validate(); };

  gate.showModal();
}

// ===== PIN modal (child -> adulto) =====
function openPin() {
  const modal = document.getElementById('pinModal');
  const pinInput = document.getElementById('pinInput');
  if (!modal || !pinInput) return;
  pinInput.value = '';
  modal.showModal();

  const cancel = document.getElementById('pinCancel');
  const ok = document.getElementById('pinOk');
  if (cancel) cancel.onclick = () => modal.close();
  if (ok) ok.onclick = () => {
    const pin = String(pinInput.value || '').trim();
    if (pin === ADMIN_PIN_DEFAULT) {
      setAdultUnlocked();
      modal.close();
      location.href = 'adult.html';
    } else {
      pinInput.value = '';
      pinInput.placeholder = 'PIN incorrecto';
    }
  };
}

// ===== Adulto: gate =====
function guardAdult() {
  if (pageKind() !== 'adult') return;
  if (!isAdultUnlocked()) {
    alert('Modo Adulto requiere PIN. Mantener presionado el avatar en el modo niño.');
    location.href = 'child.html';
  }
}

// ===== Adulto: acciones =====
function bindAdultControls() {
  if (pageKind() !== 'adult') return;

  const lockBtn = document.getElementById('lockBtn');
  const editBtn = document.getElementById('editBtn');
  const fullBtn = document.getElementById('fullBtn');
  const largeText = document.getElementById('largeText');
  const resetBtn = document.getElementById('resetBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const helpBtn = document.getElementById('helpBtn');

  if (lockBtn) lockBtn.onclick = () => { locked = !locked; render(); };
  if (editBtn) editBtn.onclick = () => { editMode = !editMode; render(); };
  if (largeText) largeText.onchange = () => { board.largeText = !!largeText.checked; writeJSON(KEY_BOARD, board); render(); };
  if (resetBtn) resetBtn.onclick = () => {
    if (!confirm('¿Restaurar tablero inicial?')) return;
    board = defaultBoard();
    activeCatId = board.categories[0]?.id;
    writeJSON(KEY_BOARD, board);
    render();
  };
  if (exportBtn) exportBtn.onclick = async () => {
    const data = JSON.stringify(board, null, 2);
    try { await navigator.clipboard.writeText(data); alert('Configuración copiada al portapapeles.'); }
    catch { alert(data); }
  };
  if (importBtn) importBtn.onclick = () => {
    const data = prompt('Pega la configuración exportada:');
    if (!data) return;
    try {
      board = JSON.parse(data);
      activeCatId = board.categories[0]?.id;
      writeJSON(KEY_BOARD, board);
      render();
    } catch {
      alert('No se pudo leer la configuración.');
    }
  };

  // Settings (voz)
  if (settingsBtn) settingsBtn.onclick = () => openVoiceSettings();
  if (helpBtn) helpBtn.onclick = () => {
    const hm = document.getElementById('helpModal');
    if (hm) hm.showModal();
  };

  // Repetir/detener en adulto
  const repeatBtn = document.getElementById('repeatBtn');
  const stopBtn = document.getElementById('stopBtn');
  if (repeatBtn) repeatBtn.onclick = () => { if (lastSpoken) speak(lastSpoken); };
  if (stopBtn) stopBtn.onclick = () => { try { window.speechSynthesis.cancel(); } catch {} };
}

function openVoiceSettings() {
  const modal = document.getElementById('settingsModal');
  if (!modal) return;
  const voiceSelect = document.getElementById('voiceSelect');
  const rate = document.getElementById('rate');
  const pitch = document.getElementById('pitch');
  const volume = document.getElementById('volume');

  const voices = window.speechSynthesis.getVoices();
  if (voiceSelect) {
    voiceSelect.innerHTML = '<option value="">Auto (español si hay)</option>';
    voices.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = `${v.name} (${v.lang})`;
      if (voiceState.name === v.name) opt.selected = true;
      voiceSelect.appendChild(opt);
    });
  }
  if (rate) rate.value = String(voiceState.rate);
  if (pitch) pitch.value = String(voiceState.pitch);
  if (volume) volume.value = String(voiceState.volume);

  modal.showModal();

  const cancel = document.getElementById('settingsCancel');
  const test = document.getElementById('testVoice');
  const ok = document.getElementById('settingsOk');

  if (cancel) cancel.onclick = () => modal.close();
  if (test) test.onclick = () => {
    const tmp = {
      name: voiceSelect?.value || null,
      rate: parseFloat(rate?.value || '0.92'),
      pitch: parseFloat(pitch?.value || '1.05'),
      volume: parseFloat(volume?.value || '1')
    };
    const u = new SpeechSynthesisUtterance('Hola, estoy hablando para Samuel.');
    const pref = tmp.name ? voices.find(v=>v.name===tmp.name) : voices.find(v => /(^|\s)(es-|Spanish|español)/i.test((v.lang||'')+' '+(v.name||'')));
    if (pref) u.voice = pref;
    u.rate = tmp.rate; u.pitch = tmp.pitch; u.volume = tmp.volume;
    try { window.speechSynthesis.cancel(); } catch {}
    window.speechSynthesis.speak(u);
  };
  if (ok) ok.onclick = () => {
    voiceState = {
      name: voiceSelect?.value || null,
      rate: parseFloat(rate?.value || '0.92'),
      pitch: parseFloat(pitch?.value || '1.05'),
      volume: parseFloat(volume?.value || '1')
    };
    writeJSON(KEY_VOICE, voiceState);
    modal.close();
  };
}

window.speechSynthesis.onvoiceschanged = () => {
  // Nada: se rellena al abrir el modal.
};

// ===== Editor de botones (adult) =====
let editCtx = null;
function openEdit(btn, cat, isNew = false) {
  const modal = document.getElementById('editModal');
  if (!modal) return;

  editCtx = { btn, cat, isNew };
  const fLabel = document.getElementById('fLabel');
  const fUtter = document.getElementById('fUtter');
  const fEmoji = document.getElementById('fEmoji');
  const fColor = document.getElementById('fColor');

  if (fLabel) fLabel.value = btn.label || '';
  if (fUtter) fUtter.value = btn.utterance || '';
  if (fEmoji) fEmoji.value = btn.emoji || '';
  if (fColor) fColor.value = btn.color || '#ffffff';

  const delBtn = document.getElementById('delBtn');
  if (delBtn) delBtn.style.display = isNew ? 'none' : 'inline-block';

  modal.showModal();

  const cancel = document.getElementById('editCancel');
  const ok = document.getElementById('editOk');
  if (cancel) cancel.onclick = () => modal.close();
  if (ok) ok.onclick = () => {
    btn.label = (fLabel?.value || '').trim() || 'Nuevo';
    btn.utterance = (fUtter?.value || '').trim() || btn.label;
    btn.emoji = (fEmoji?.value || '').trim();
    btn.color = fColor?.value || btn.color || '#ffffff';
    if (isNew) cat.buttons.push(btn);
    writeJSON(KEY_BOARD, board);
    modal.close();
    render();
  };

  if (delBtn) delBtn.onclick = () => {
    if (!confirm('¿Borrar este botón?')) return;
    cat.buttons = cat.buttons.filter(b => b.id !== btn.id);
    writeJSON(KEY_BOARD, board);
    modal.close();
    render();
  };
}

// ===== Boot =====
(function boot() {
  initHeader();
  guardAdult();
  bindAdultControls();

  // Asegurar “última frase” default
  setSpeechText('Toca un botón para hablar');
  render();
})();
