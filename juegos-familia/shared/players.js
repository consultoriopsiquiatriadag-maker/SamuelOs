/* ============================================================
   JUEGOS EN FAMILIA — Sistema de jugadores
   Uso: incluir antes del script del juego
   API: window.FamiliaJugadores
   ============================================================ */

(function (global) {
  'use strict';

  /* ── PALETA DE COLORES (sin rojo puro para evitar confusión) ── */
  var COLORES = ['#f59e0b', '#38bdf8', '#4ade80', '#f472b6'];
  var EMOJIS  = ['🧒', '👨‍👩‍👧', '🙂', '😊'];
  var NOMBRES_DEFAULT = ['Samuel', 'Familia', 'Jugador 3', 'Jugador 4'];

  /* ── ESTADO INTERNO ── */
  var _jugadores    = [];   // [{id,name,color,emoji,score,active}]
  var _turnoActual  = 0;
  var _totalJugadores = 2;

  /* ── UTILIDADES ── */
  function clonar(arr) { return JSON.parse(JSON.stringify(arr)); }

  /* ── API PÚBLICA ── */
  var FamiliaJugadores = {

    /* ────────────────────────────────────────────
       init(n, nombres[])
       Inicializa n jugadores. Carga nombres guardados si no se pasan.
    ──────────────────────────────────────────── */
    init: function (n, nombres) {
      n = Math.min(Math.max(n || 2, 2), 4);
      _totalJugadores = n;
      _turnoActual    = 0;

      var savedNames = FamiliaStorage
        ? FamiliaStorage.get('players_names', NOMBRES_DEFAULT)
        : NOMBRES_DEFAULT;

      _jugadores = [];
      for (var i = 0; i < n; i++) {
        _jugadores.push({
          id:     i,
          name:   (nombres && nombres[i]) || savedNames[i] || NOMBRES_DEFAULT[i],
          color:  COLORES[i],
          emoji:  EMOJIS[i],
          score:  0,
          active: i === 0
        });
      }
      return this;
    },

    /* ── Jugador actual ── */
    actual: function () { return _jugadores[_turnoActual]; },

    /* ── Pasar al siguiente turno ── */
    siguiente: function () {
      _jugadores[_turnoActual].active = false;
      _turnoActual = (_turnoActual + 1) % _jugadores.length;
      _jugadores[_turnoActual].active = true;
      return _jugadores[_turnoActual];
    },

    /* ── Sumar puntos al jugador actual ── */
    sumarPuntos: function (n) {
      _jugadores[_turnoActual].score += (n || 1);
      return _jugadores[_turnoActual];
    },

    /* ── Sumar puntos a jugador por id ── */
    sumarPuntosA: function (id, n) {
      var j = _jugadores.find(function (p) { return p.id === id; });
      if (j) j.score += (n || 1);
      return j;
    },

    /* ── Todos los jugadores ── */
    todos: function () { return clonar(_jugadores); },

    /* ── Ganador (mayor puntaje; null si empate) ── */
    ganador: function () {
      var max = Math.max.apply(null, _jugadores.map(function (p) { return p.score; }));
      var ganadores = _jugadores.filter(function (p) { return p.score === max; });
      return ganadores.length === 1 ? clonar(ganadores[0]) : null;
    },

    /* ── Reiniciar solo puntos ── */
    reiniciarPuntos: function () {
      _turnoActual = 0;
      _jugadores.forEach(function (p, i) { p.score = 0; p.active = i === 0; });
      return this;
    },

    /* ── Total de jugadores ── */
    cantidad: function () { return _jugadores.length; },

    /* ── Índice de turno actual ── */
    turnoIndex: function () { return _turnoActual; },

    /* ────────────────────────────────────────────
       renderSelector(containerId, opciones, callback)
       Muestra el overlay de selección de jugadores.
       callback(jugadores[]) se llama al confirmar.
    ──────────────────────────────────────────── */
    renderSelector: function (containerId, opciones, callback) {
      opciones = opciones || {};
      var minJ = opciones.min || 2;
      var maxJ = opciones.max || 4;
      var savedNames = FamiliaStorage
        ? FamiliaStorage.get('players_names', NOMBRES_DEFAULT)
        : NOMBRES_DEFAULT;
      var countActual = FamiliaStorage
        ? FamiliaStorage.get('players_count', 2)
        : 2;
      countActual = Math.min(Math.max(countActual, minJ), maxJ);

      var container = document.getElementById(containerId);
      if (!container) return;

      /* Construir HTML del selector */
      var countBtns = '';
      for (var n = minJ; n <= maxJ; n++) {
        countBtns += '<button class="fg-count-btn' + (n === countActual ? ' selected' : '') +
          '" data-count="' + n + '">' + n + '</button>';
      }

      var playerRows = '';
      for (var i = 0; i < 4; i++) {
        var hidden = i >= countActual ? ' hidden' : '';
        playerRows +=
          '<div class="fg-player-row" id="fg-row-' + i + '"' + hidden + '>' +
            '<div class="fg-player-swatch" style="background:' + COLORES[i] + '"></div>' +
            '<span class="fg-player-emoji">' + EMOJIS[i] + '</span>' +
            '<input class="fg-player-input" id="fg-name-' + i + '" type="text" ' +
              'maxlength="14" placeholder="' + NOMBRES_DEFAULT[i] + '" ' +
              'value="' + (savedNames[i] || NOMBRES_DEFAULT[i]) + '">' +
          '</div>';
      }

      container.innerHTML =
        '<div class="fg-overlay" id="fg-selector-overlay">' +
          '<div class="fg-selector-card">' +
            '<div class="fg-selector-title">👥 ¿Quiénes juegan?</div>' +
            '<div class="fg-count-row" id="fg-count-row">' + countBtns + '</div>' +
            '<div class="fg-player-rows">' + playerRows + '</div>' +
            '<button class="fg-btn fg-btn-primary fg-btn-full" id="fg-btn-empezar">▶ ¡Empezar!</button>' +
          '</div>' +
        '</div>';

      /* Eventos: botones de cantidad */
      var self = this;
      container.querySelectorAll('.fg-count-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          countActual = parseInt(btn.dataset.count, 10);
          container.querySelectorAll('.fg-count-btn').forEach(function (b) {
            b.classList.toggle('selected', b === btn);
          });
          for (var k = 0; k < 4; k++) {
            var row = document.getElementById('fg-row-' + k);
            if (row) row.hidden = k >= countActual;
          }
        });
      });

      /* Evento: empezar */
      document.getElementById('fg-btn-empezar').addEventListener('click', function () {
        var nombres = [];
        for (var k = 0; k < 4; k++) {
          var inp = document.getElementById('fg-name-' + k);
          nombres.push(inp ? inp.value.trim() || NOMBRES_DEFAULT[k] : NOMBRES_DEFAULT[k]);
        }
        /* Guardar */
        if (FamiliaStorage) {
          FamiliaStorage.set('players_names', nombres);
          FamiliaStorage.set('players_count', countActual);
        }
        /* Inicializar */
        self.init(countActual, nombres);
        /* Ocultar overlay */
        var overlay = document.getElementById('fg-selector-overlay');
        if (overlay) overlay.hidden = true;
        /* Callback */
        if (callback) callback(self.todos());
      });
    },

    /* ────────────────────────────────────────────
       renderChips(containerId)
       Renderiza los chips de jugadores con su turno y puntaje.
       Llamar cada vez que cambia el turno o el puntaje.
    ──────────────────────────────────────────── */
    renderChips: function (containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = _jugadores.map(function (p) {
        return '<div class="fg-player-chip' + (p.active ? ' active' : '') + '" ' +
          'style="--player-color:' + p.color + '">' +
          '<div class="fg-chip-dot"></div>' +
          '<span>' + p.emoji + ' ' + p.name + '</span>' +
          '<span class="fg-chip-score">' + p.score + ' pts</span>' +
          '</div>';
      }).join('');
    },

    /* ────────────────────────────────────────────
       renderTurnBanner(containerId)
       Muestra el banner de turno actual.
    ──────────────────────────────────────────── */
    renderTurnBanner: function (containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;
      var p = this.actual();
      container.style.setProperty('--player-color', p.color);
      container.innerHTML =
        '<span class="fg-turn-emoji">' + p.emoji + '</span>' +
        '<div>' +
          '<div class="fg-turn-name">Turno de <strong>' + p.name + '</strong></div>' +
          '<div class="fg-turn-sub">¡Tu momento!</div>' +
        '</div>';
    },

    /* ────────────────────────────────────────────
       renderFinal(containerId)
       Muestra la pantalla de fin de partida.
    ──────────────────────────────────────────── */
    renderFinal: function (containerId, opciones) {
      opciones = opciones || {};
      var container = document.getElementById(containerId);
      if (!container) return;

      var ganador = this.ganador();
      var titulo  = ganador ? '¡Ganó ' + ganador.name + '!' : '¡Empate!';
      var trofeo  = ganador ? '🏆' : '🤝';

      var scoreRows = _jugadores.map(function (p) {
        return '<div class="fg-end-score-row" style="--player-color:' + p.color + '">' +
          '<div class="fg-score-dot"></div>' +
          '<span>' + p.emoji + ' ' + p.name + '</span>' +
          '<span class="fg-score-pts">' + p.score + ' pts</span>' +
          '</div>';
      }).join('');

      var accionesBtns =
        '<button class="fg-btn fg-btn-amber fg-btn-full" id="fg-btn-revancha">🔄 Revancha</button>' +
        '<button class="fg-btn fg-btn-ghost fg-btn-full" id="fg-btn-cambiar">👥 Cambiar jugadores</button>' +
        '<button class="fg-btn fg-btn-ghost fg-btn-full" id="fg-btn-volver-portal">🏠 Volver a Juegos en Familia</button>';

      container.innerHTML =
        '<div class="fg-end-card">' +
          '<div class="fg-end-trophy">' + trofeo + '</div>' +
          '<div class="fg-end-title">' + titulo + '</div>' +
          '<div class="fg-end-sub">¡Todos jugaron genial! 🎉</div>' +
          '<div class="fg-end-scores">' + scoreRows + '</div>' +
          '<div class="fg-end-actions">' + accionesBtns + '</div>' +
        '</div>';

      /* Botones */
      var self = this;
      var btnRevancha = document.getElementById('fg-btn-revancha');
      if (btnRevancha && opciones.onRevancha) {
        btnRevancha.addEventListener('click', function () {
          self.reiniciarPuntos();
          opciones.onRevancha();
        });
      }
      var btnCambiar = document.getElementById('fg-btn-cambiar');
      if (btnCambiar && opciones.onCambiarJugadores) {
        btnCambiar.addEventListener('click', opciones.onCambiarJugadores);
      }
      var btnVolver = document.getElementById('fg-btn-volver-portal');
      if (btnVolver) {
        btnVolver.addEventListener('click', function () {
          window.location.href = '../index.html';
        });
      }
    }
  };

  global.FamiliaJugadores = FamiliaJugadores;

}(window));
