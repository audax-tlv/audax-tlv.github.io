/* Accessibility menu: our own, no third-party script. Settings persist per visitor in localStorage. */
(function () {
  'use strict';
  var KEY = 'audax-a11y';
  var root = document.documentElement;

  var ICONS = {
    person: '<circle cx="12" cy="4.5" r="2"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5l-3.5 6.5M12 14.5l3.5 6.5"/>',
    contrast: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" class="fill"/>',
    text: '<path d="M3 18l5-12 5 12M4.7 14h6.6M15 18l3-7 3 7M15.9 16h4.2"/>',
    spacing: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    links: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
    headings: '<path d="M4 5v14M12 5v14M4 12h8M16 9l3-2v12"/>',
    font: '<path d="M5 5h14M12 5v14M9 19h6"/>',
    cursor: '<path d="M5 3l14 7-6 2-2 6z"/>',
    motion: '<circle cx="12" cy="12" r="8.5"/><path d="M10 9v6M14 9v6"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>'
  };
  function svg(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  var EN = root.lang === 'en';
  var R = root.getAttribute('data-root') || '';
  var OFF = EN ? 'Off' : 'כבוי', ON = EN ? 'On' : 'פעיל';
  var U = EN ? {
    menu: 'Accessibility menu', settings: 'Accessibility settings', close: 'Close accessibility menu',
    reset: 'Reset all', statement: 'Accessibility statement'
  } : {
    menu: 'תפריט נגישות', settings: 'הגדרות נגישות', close: 'סגירת תפריט הנגישות',
    reset: 'איפוס הכל', statement: 'הצהרת נגישות'
  };

  /* Each option cycles through its levels; level 0 = off */
  var OPTIONS = EN ? [
    { id: 'contrast', label: 'Contrast', icon: 'contrast', levels: ['Normal', 'High', 'Grayscale'] },
    { id: 'text', label: 'Text size', icon: 'text', levels: ['100%', '115%', '130%', '150%'] },
    { id: 'spacing', label: 'Line spacing', icon: 'spacing', levels: ['Normal', 'Wider', 'Double'] },
    { id: 'links', label: 'Highlight links', icon: 'links', levels: [OFF, ON] },
    { id: 'headings', label: 'Highlight headings', icon: 'headings', levels: [OFF, ON] },
    { id: 'font', label: 'Readable font', icon: 'font', levels: [OFF, ON] },
    { id: 'cursor', label: 'Big cursor', icon: 'cursor', levels: [OFF, ON] },
    { id: 'motion', label: 'Stop animations', icon: 'motion', levels: [OFF, ON] }
  ] : [
    { id: 'contrast', label: 'ניגודיות', icon: 'contrast', levels: ['רגיל', 'גבוהה', 'גווני אפור'] },
    { id: 'text', label: 'גודל טקסט', icon: 'text', levels: ['100%', '115%', '130%', '150%'] },
    { id: 'spacing', label: 'ריווח שורות', icon: 'spacing', levels: ['רגיל', 'מוגדל', 'כפול'] },
    { id: 'links', label: 'הדגשת קישורים', icon: 'links', levels: [OFF, ON] },
    { id: 'headings', label: 'הדגשת כותרות', icon: 'headings', levels: [OFF, ON] },
    { id: 'font', label: 'גופן קריא', icon: 'font', levels: [OFF, ON] },
    { id: 'cursor', label: 'סמן גדול', icon: 'cursor', levels: [OFF, ON] },
    { id: 'motion', label: 'עצירת אנימציות', icon: 'motion', levels: [OFF, ON] }
  ];

  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { state = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  function apply() {
    OPTIONS.forEach(function (o) {
      var lvl = state[o.id] || 0;
      if (lvl) root.setAttribute('data-a11y-' + o.id, String(lvl));
      else root.removeAttribute('data-a11y-' + o.id);
    });
    var zoom = [1, 1.15, 1.3, 1.5][state.text || 0];
    root.style.zoom = zoom === 1 ? '' : zoom;
    /* stop media that moves on its own */
    var still = !!state.motion;
    document.querySelectorAll('.hero-wall video').forEach(function (v) { if (still) v.pause(); });
    var hp = document.getElementById('heroPause');
    if (still && hp && hp.getAttribute('aria-pressed') !== 'true') hp.click();
    var mq = document.querySelector('.marquee');
    if (mq) mq.classList.toggle('paused', still || mq.classList.contains('paused-by-user'));
    window.dispatchEvent(new Event('scroll'));
  }

  /* ---------- UI ---------- */
  var btn = document.createElement('button');
  btn.className = 'a11y-btn';
  btn.setAttribute('aria-label', U.menu);
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'a11yPanel');
  btn.innerHTML = svg('person');

  var panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.id = 'a11yPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', U.settings);
  panel.hidden = true;
  /* the statement sits next to each language's page: /accessibility.html and /en/accessibility.html */
  panel.innerHTML =
    '<div class="a11y-head"><span class="a11y-title">' + svg('person') + U.settings + '</span>' +
    '<button class="a11y-close" aria-label="' + U.close + '">' + svg('close') + '</button></div>' +
    '<div class="a11y-grid"></div>' +
    '<div class="a11y-foot"><a href="accessibility.html">' + U.statement + '</a><kbd dir="ltr">Alt+A</kbd></div>';
  var grid = panel.querySelector('.a11y-grid');

  function tile(o) {
    var b = document.createElement('button');
    b.className = 'a11y-tile';
    b.innerHTML = svg(o.icon) + '<span class="a11y-label">' + o.label + '</span><span class="a11y-state"></span>';
    function render() {
      var lvl = state[o.id] || 0;
      b.querySelector('.a11y-state').textContent = o.levels[lvl];
      b.classList.toggle('on', lvl > 0);
      b.setAttribute('aria-pressed', String(lvl > 0));
      b.setAttribute('aria-label', o.label + ': ' + o.levels[lvl]);
    }
    b.addEventListener('click', function () {
      state[o.id] = ((state[o.id] || 0) + 1) % o.levels.length;
      save(); apply(); render();
    });
    b._render = render;
    render();
    return b;
  }
  var tiles = OPTIONS.map(tile);
  tiles.forEach(function (t) { grid.appendChild(t); });

  var reset = document.createElement('button');
  reset.className = 'a11y-tile';
  reset.innerHTML = svg('reset') + '<span class="a11y-label">' + U.reset + '</span><span class="a11y-state"></span>';
  reset.addEventListener('click', function () {
    state = {}; save(); apply();
    tiles.forEach(function (t) { t._render(); });
  });
  grid.appendChild(reset);

  function open(show) {
    panel.hidden = !show;
    btn.setAttribute('aria-expanded', String(show));
    if (show) panel.querySelector('.a11y-close').focus(); else btn.focus();
  }
  btn.addEventListener('click', function () { open(panel.hidden); });
  panel.querySelector('.a11y-close').addEventListener('click', function () { open(false); });
  document.addEventListener('keydown', function (e) {
    if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ש' || e.code === 'KeyA')) { e.preventDefault(); open(panel.hidden); }
    else if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); open(false); }
  }, true);
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
  });

  document.body.appendChild(btn);
  document.body.appendChild(panel);
  apply();
})();
