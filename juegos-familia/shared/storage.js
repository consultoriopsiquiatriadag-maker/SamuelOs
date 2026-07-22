/* ============================================================
   JUEGOS EN FAMILIA — Almacenamiento local
   Prefijo: samuel_familia_
   API: window.FamiliaStorage
   ============================================================ */

(function (global) {
  'use strict';

  var PREFIX = 'samuel_familia_';

  var FamiliaStorage = {

    /* Leer valor (devuelve defaultVal si no existe o hay error) */
    get: function (key, defaultVal) {
      try {
        var raw = localStorage.getItem(PREFIX + key);
        if (raw === null) return defaultVal;
        return JSON.parse(raw);
      } catch (e) {
        return defaultVal;
      }
    },

    /* Guardar valor */
    set: function (key, value) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
      } catch (e) { /* cuota llena — ignorar */ }
    },

    /* Borrar valor */
    remove: function (key) {
      try { localStorage.removeItem(PREFIX + key); } catch (e) {}
    },

    /* ── Preferencias de juego ── */
    getSonido:    function ()  { return this.get('sound_on', true); },
    setSonido:    function (v) { this.set('sound_on', !!v); },

    getDificultad:    function ()  { return this.get('difficulty', 'facil'); },
    setDificultad:    function (v) { this.set('difficulty', v); },

    getUltimoJuego:   function ()  { return this.get('last_game', null); },
    setUltimoJuego:   function (v) { this.set('last_game', v); },

    /* ── Jugadores ── */
    getNombres: function () {
      return this.get('players_names', ['Samuel', 'Familia', 'Jugador 3', 'Jugador 4']);
    },
    getCantidadJugadores: function () {
      return this.get('players_count', 2);
    }
  };

  global.FamiliaStorage = FamiliaStorage;

}(window));
