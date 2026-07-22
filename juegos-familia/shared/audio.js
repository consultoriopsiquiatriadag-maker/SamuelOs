/* ============================================================
   JUEGOS EN FAMILIA — Audio y voz
   Sonidos procedurales (sin archivos externos).
   API: window.FamiliaAudio
   ============================================================ */

(function (global) {
  'use strict';

  var _ctx      = null;   /* AudioContext (se crea en el primer uso) */
  var _sonidoOn = true;

  /* ── Crear contexto de audio (requiere gesto del usuario) ── */
  function getCtx() {
    if (!_ctx) {
      try {
        _ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { return null; }
    }
    if (_ctx.state === 'suspended') { _ctx.resume(); }
    return _ctx;
  }

  /* ── Beep genérico ── */
  function beep(frecuencia, duracion, tipo, volumen) {
    if (!_sonidoOn) return;
    var ctx = getCtx();
    if (!ctx) return;
    try {
      var osc  = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type      = tipo    || 'sine';
      osc.frequency.value  = frecuencia || 440;
      gain.gain.setValueAtTime(volumen || 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (duracion || 0.3));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (duracion || 0.3));
    } catch (e) {}
  }

  /* ── Secuencia de beeps ── */
  function secuencia(notas) {
    /* notas: [{f, d, t, v, delay}] */
    notas.forEach(function (n) {
      setTimeout(function () {
        beep(n.f, n.d, n.t, n.v);
      }, n.delay || 0);
    });
  }

  /* ── SpeechSynthesis ── */
  function hablar(texto, opciones) {
    if (!_sonidoOn) return;
    if (!('speechSynthesis' in window)) return;
    opciones = opciones || {};
    try {
      var u = new SpeechSynthesisUtterance(texto);
      u.lang  = opciones.lang  || 'es-AR';
      u.rate  = opciones.rate  || 0.95;
      u.pitch = opciones.pitch || 1;
      u.volume = opciones.volume || 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ════════════════════════════════════════════════════════════
     API PÚBLICA
  ════════════════════════════════════════════════════════════ */
  var FamiliaAudio = {

    /* Activar / desactivar sonido */
    setSonido: function (activo) {
      _sonidoOn = !!activo;
      if (FamiliaStorage) FamiliaStorage.setSonido(_sonidoOn);
      if (!_sonidoOn && 'speechSynthesis' in window) speechSynthesis.cancel();
    },
    getSonido: function () { return _sonidoOn; },

    /* Cargar preferencia guardada */
    cargarPreferencia: function () {
      _sonidoOn = FamiliaStorage ? FamiliaStorage.getSonido() : true;
      return _sonidoOn;
    },

    /* ── Sonidos de juego ── */

    /* Respuesta correcta / acierto */
    acierto: function () {
      secuencia([
        { f: 523, d: 0.12, t: 'sine',     delay: 0   },
        { f: 659, d: 0.12, t: 'sine',     delay: 120 },
        { f: 784, d: 0.20, t: 'triangle', delay: 240 }
      ]);
    },

    /* Error / fallo (suave, no agresivo) */
    error: function () {
      secuencia([
        { f: 370, d: 0.15, t: 'sine', delay: 0   },
        { f: 300, d: 0.18, t: 'sine', delay: 160 }
      ]);
    },

    /* Cambio de turno */
    turno: function () {
      secuencia([
        { f: 440, d: 0.10, t: 'sine', delay: 0   },
        { f: 550, d: 0.10, t: 'sine', delay: 110 }
      ]);
    },

    /* Celebración final */
    celebracion: function () {
      secuencia([
        { f: 523, d: 0.10, t: 'triangle', delay: 0   },
        { f: 659, d: 0.10, t: 'triangle', delay: 100 },
        { f: 784, d: 0.10, t: 'triangle', delay: 200 },
        { f: 1047,d: 0.22, t: 'triangle', delay: 300 },
        { f: 784, d: 0.08, t: 'triangle', delay: 520 },
        { f: 1047,d: 0.30, t: 'triangle', delay: 620 }
      ]);
    },

    /* Voltear carta / seleccionar */
    tap: function () {
      beep(600, 0.08, 'sine', 0.18);
    },

    /* Dado / tirar */
    dado: function () {
      secuencia([
        { f: 300, d: 0.06, t: 'square', v: 0.12, delay: 0   },
        { f: 400, d: 0.06, t: 'square', v: 0.12, delay: 80  },
        { f: 500, d: 0.10, t: 'sine',   v: 0.20, delay: 160 }
      ]);
    },

    /* ── Voz ── */

    /* Anunciar turno: "Turno de Samuel" */
    anunciarTurno: function (nombre) {
      hablar('Turno de ' + nombre);
    },

    /* Anunciar resultado */
    anunciarAcierto: function () {
      hablar('¡Muy bien!');
    },
    anunciarError: function () {
      hablar('Probemos otra vez');
    },
    anunciarGanador: function (nombre) {
      hablar(nombre ? '¡Ganó ' + nombre + '! ¡Felicitaciones a todos!' : '¡Empataron! ¡Muy bien todos!');
    },

    /* Leer texto en voz alta (para preguntas, etc.) */
    leer: function (texto, opciones) {
      hablar(texto, opciones);
    },

    /* Cancelar voz */
    cancelarVoz: function () {
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    },

    /* ── Botón de sonido (toggle UI) ── */
    renderBotonSonido: function (containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var btn = document.createElement('button');
      btn.className = 'fg-sound-btn' + (_sonidoOn ? '' : ' muted');
      btn.setAttribute('aria-label', 'Activar o desactivar sonido');
      btn.title = _sonidoOn ? 'Silenciar' : 'Activar sonido';
      btn.textContent = _sonidoOn ? '🔊' : '🔇';

      btn.addEventListener('click', function () {
        FamiliaAudio.setSonido(!_sonidoOn);
        btn.textContent = _sonidoOn ? '🔊' : '🔇';
        btn.title       = _sonidoOn ? 'Silenciar' : 'Activar sonido';
        btn.classList.toggle('muted', !_sonidoOn);
      });

      container.innerHTML = '';
      container.appendChild(btn);
    }
  };

  global.FamiliaAudio = FamiliaAudio;

}(window));
