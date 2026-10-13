(function () {
  'use strict';
  var S = window.SITE;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var meta = {};

  /* Language: pages under /en/ set lang="en" and data-root="../" on <html> */
  var EN = document.documentElement.lang === 'en';
  var R = document.documentElement.getAttribute('data-root') || '';
  var T = EN ? {
    one: 'one video', many: ' videos', watch: 'Watch: ',
    heroPlay: 'Play background videos', heroPause: 'Pause background videos',
    play: 'Play', pause: 'Pause', menuOpen: 'Open menu', menuClose: 'Close menu',
    title: 'AUDAX · Barak Avner · AI Content & Advertising'
  } : {
    one: 'סרטון אחד', many: ' סרטונים', watch: 'צפייה: ',
    heroPlay: 'הפעלת הסרטונים ברקע', heroPause: 'עצירת הסרטונים ברקע',
    play: 'הפעלה', pause: 'עצירה', menuOpen: 'פתיחת תפריט', menuClose: 'סגירת תפריט',
    title: 'AUDAX · ברק אבנר · תוכן ופרסום ב-AI'
  };

  /* English texts live in data.en.js as overrides keyed by id, so order and videos stay in one place */
  var L = EN && window.SITE_EN;
  if (L) {
    S.clients.concat(S.spec).forEach(function (p) {
      var o = L.projects[p.id] || {};
      if (o.tag) p.tag = o.tag;
      if (o.about) p.about = o.about;
      p.groups.forEach(function (g) {
        if (g.title && L.groups[g.title]) g.title = L.groups[g.title];
        g.videos.forEach(function (v) { if (L.videos[v.id]) v.title = L.videos[v.id]; });
      });
    });
    S.films.forEach(function (f) { var o = L.films[f.id]; if (o) { f.title = o.title; f.tag = o.tag; } });
    S.process = L.process;
  }

  /* Client logos: white on transparent, all on the same 1772x424 canvas */
  var LOGOS = {
    snips: 'Snips', particle: 'Particle', maison: 'Maison du Miel', sacara: 'SACARA',
    nooshka: 'Studio Nooshka', deel: 'Deel', legeneral: 'Le Général'
  };

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function logoImg(key, extra) {
    if (!LOGOS[key]) return null;
    return el('img', { src: R + 'media/logos/' + key + '.png?v=' + S.version, alt: LOGOS[key], class: ('logo ' + (extra || '')).trim(), width: 600, height: 144, loading: 'lazy' });
  }
  function poster(id) { return R + 'media/posters/' + id + '.webp?v=' + S.version; }
  function allVideos(p) { return p.groups.reduce(function (a, g) { return a.concat(g.videos); }, []); }
  function fmtDur(s) { if (!s) return ''; s = Math.round(s); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function plural(n) { return n === 1 ? T.one : n + T.many; }
  var PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>';

  /* Lookup: video id -> { brand, title } */
  var TITLES = {};
  S.clients.concat(S.spec).forEach(function (p) {
    allVideos(p).forEach(function (v) { TITLES[v.id] = { brand: p.name, title: p.name === v.title ? '' : v.title }; });
  });
  S.films.forEach(function (f) { TITLES[f.id] = { brand: '', title: f.title }; });
  function label(id) {
    var t = TITLES[id]; if (!t) return '';
    return [t.brand, t.title].filter(Boolean).join(' · ');
  }
  /* Caption with each part isolated so mixed Hebrew/English keeps its order */
  function captionNodes(id) {
    var t = TITLES[id] || {}, out = [];
    [t.brand, t.title].filter(Boolean).forEach(function (s, i) {
      if (i) out.push(document.createTextNode(' · '));
      out.push(el('bdi', { text: s }));
    });
    return out;
  }

  /* ---------- Contact links ---------- */
  function wireContacts() {
    var c = S.contact;
    document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
      if (c.whatsapp) { a.href = 'https://wa.me/' + c.whatsapp; a.target = '_blank'; a.rel = 'noopener'; }
    });
    document.querySelectorAll('[data-email]').forEach(function (a) { if (c.email) a.href = 'mailto:' + c.email; });
    document.querySelectorAll('[data-instagram]').forEach(function (a) {
      if (c.instagram) { a.href = c.instagram; a.target = '_blank'; a.rel = 'noopener'; }
    });
  }

  /* ---------- Hero wall ---------- */
  var heroVideos = [];
  var heroPaused = reduceMotion;
  function buildHero() {
    var wall = $('#heroWall');
    S.hero.forEach(function (id) {
      var v = el('video', { muted: '', loop: '', playsinline: '', preload: 'none', poster: R + 'media/hero/' + id + '.webp', 'aria-hidden': 'true' });
      v.muted = true;
      v.src = R + 'media/hero/' + id + '.mp4';
      heroVideos.push(v);
      wall.appendChild(el('button', {
        class: 'tile', 'data-label': (TITLES[id] || {}).brand || label(id), 'aria-label': T.watch + label(id),
        onclick: function () { openPlayer(id); }
      }, [v]));
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !heroPaused) e.target.play().catch(function () {});
        else e.target.pause();
      });
    }, { threshold: 0.1 });
    heroVideos.forEach(function (v) { io.observe(v); });

    var btn = $('#heroPause');
    function sync() {
      btn.setAttribute('aria-pressed', String(heroPaused));
      btn.querySelector('.sr').textContent = heroPaused ? T.heroPlay : T.heroPause;
    }
    btn.addEventListener('click', function () {
      heroPaused = !heroPaused;
      heroVideos.forEach(function (v) { heroPaused ? v.pause() : v.play().catch(function () {}); });
      sync();
    });
    sync();
  }

  /* ---------- Logos ---------- */
  /* Endless strip: the logo set is repeated so the loop has no visible seam;
     copies after the first are hidden from screen readers. */
  function buildLogos() {
    var track = $('#logos');
    var keys = ['snips', 'particle', 'maison', 'sacara', 'nooshka', 'deel', 'legeneral'];
    for (var copy = 0; copy < 4; copy++) {
      keys.forEach(function (k) {
        var img = logoImg(k);
        img.loading = 'eager';   // lazy images far outside the strip's view may never load
        if (copy) img.alt = '';
        track.appendChild(el('li', copy ? { 'aria-hidden': 'true' } : null, [img]));
      });
    }
    var btn = $('#marqueeToggle');
    btn.addEventListener('click', function () {
      var paused = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(paused));
      btn.textContent = paused ? T.play : T.pause;
      track.parentNode.classList.toggle('paused', paused || document.documentElement.hasAttribute('data-a11y-motion'));
      track.parentNode.classList.toggle('paused-by-user', paused);
    });
  }

  /* ---------- Cards ---------- */
  function clientCard(p, big) {
    var vids = allVideos(p);
    var media = el('div', { class: 'card-media' });
    /* p.cover (optional) picks which videos' frames show on the card; default = first ones */
    var cover = p.cover || vids.map(function (v) { return v.id; });
    cover.slice(0, big ? 3 : 1).forEach(function (id) {
      media.appendChild(el('img', { src: poster(id), alt: '', loading: 'lazy' }));
    });
    /* p.coverImage (optional): one horizontal image (media/posters/<name>.webp) for the whole card */
    if (p.coverImage) {
      media.innerHTML = '';
      media.appendChild(el('img', { src: poster(p.coverImage), alt: '', loading: 'lazy' }));
    }
    var name = p.logo ? logoImg(p.logo) : el('span', { class: 'card-name', text: p.name });
    return el('button', {
      class: 'card reveal', 'aria-label': p.name + ', ' + plural(vids.length),
      onclick: function () { go('c', p.id); }
    }, [
      media,
      el('div', { class: 'card-body' }, [
        el('div', null, [name, el('p', { class: 'card-meta', text: p.tag })]),
        el('span', { class: 'card-count', text: plural(vids.length) })
      ])
    ]);
  }
  function specCard(p) {
    var vids = allVideos(p);
    return el('button', {
      class: 'card reveal', 'aria-label': p.name + ', ' + p.tag,
      onclick: function () { vids.length > 1 ? go('s', p.id) : openPlayer(vids[0].id); }
    }, [
      el('div', { class: 'card-media' }, [el('img', { src: poster(vids[0].id), alt: '', loading: 'lazy' })]),
      el('span', { class: 'play-badge', html: PLAY_SVG }),
      el('div', { class: 'card-body' }, [
        el('span', { class: 'card-name', text: p.name }),
        el('span', { class: 'card-meta', text: vids.length > 1 ? p.tag + ' · ' + plural(vids.length) : p.tag })
      ])
    ]);
  }
  function filmCard(f) {
    return el('button', {
      class: 'card reveal' + (f.landscape ? ' card--wide' : ''), 'aria-label': f.title + ', ' + f.tag,
      onclick: function () { openPlayer(f.id); }
    }, [
      el('div', { class: 'card-media' }, [el('img', { src: poster(f.id), alt: '', loading: 'lazy' })]),
      el('span', { class: 'play-badge', html: PLAY_SVG }),
      el('div', { class: 'card-body' }, [
        el('span', { class: 'card-name', text: f.title }),
        el('span', { class: 'card-meta', text: f.tag })
      ])
    ]);
  }
  function buildGrids() {
    S.clients.forEach(function (p) {
      (p.featured ? $('#clientGrid') : $('#clientGridSmall')).appendChild(clientCard(p, p.featured));
    });
    S.spec.forEach(function (p) {
      var card = specCard(p);
      if (p.wide) { card.classList.add('card--wide'); $('#specFeature').appendChild(card); }
      else $('#specGrid').appendChild(card);
    });
    S.films.forEach(function (f) { $('#filmGrid').appendChild(filmCard(f)); });
    S.process.forEach(function (s) {
      $('#processList').appendChild(el('li', { class: 'reveal' }, [el('h3', { text: s.title }), el('p', { text: s.text })]));
    });
  }

  /* ---------- Project view (routed by hash: #/c/<id> or #/s/<id>) ---------- */
  var project = $('#project');
  var lastFocus = null;
  var openedInSession = false;

  function go(kind, id) {
    history.pushState(null, '', '#/' + kind + '/' + id);
    openedInSession = true;
    route();
  }
  function route() {
    var m = location.hash.match(/^#\/(c|s)\/([\w-]+)$/);
    var list = m && (m[1] === 'c' ? S.clients : S.spec);
    var p = list && list.filter(function (x) { return x.id === m[2]; })[0];
    if (p) showProject(p); else hideProject();
  }
  function showProject(p) {
    if (project.hidden) lastFocus = document.activeElement;
    $('#projectLogo').innerHTML = '';
    if (p.logo) $('#projectLogo').appendChild(logoImg(p.logo));
    $('#projectTag').textContent = p.tag;
    $('#projectTitle').textContent = p.name;
    $('#projectAbout').textContent = p.about || '';
    var groups = $('#projectGroups'); groups.innerHTML = '';
    p.groups.forEach(function (g) {
      var grid = el('div', { class: 'video-grid' + (g.videos.length < 4 ? ' video-grid--few' : '') });
      g.videos.forEach(function (v) {
        grid.appendChild(el('button', { class: 'vcard', onclick: function () { openPlayer(v.id); } }, [
          el('div', { class: 'vcard-media' }, [
            el('img', { src: poster(v.id), alt: '', loading: 'lazy' }),
            el('span', { class: 'play-badge', html: PLAY_SVG })
          ]),
          el('span', { class: 'vcard-title' }, [
            document.createTextNode(v.title),
            el('span', { class: 'vcard-dur', text: fmtDur(meta[v.id] && meta[v.id].duration) })
          ])
        ]));
      });
      groups.appendChild(el('section', { class: 'group' }, [g.title ? el('h3', { class: 'group-title', text: g.title }) : null, grid]));
    });
    project.hidden = false;
    project.scrollTop = 0;
    document.body.classList.add('locked');
    document.title = p.name + ' · AUDAX';
    $('[data-close-project]').focus();
  }
  function hideProject() {
    if (project.hidden) return;
    project.hidden = true;
    document.body.classList.remove('locked');
    document.title = T.title;
    if (lastFocus) lastFocus.focus();
  }
  function closeProject() {
    if (openedInSession) { openedInSession = false; history.back(); }
    else { history.replaceState(null, '', location.pathname); route(); }
  }
  $('[data-close-project]').addEventListener('click', closeProject);
  window.addEventListener('popstate', route);

  /* ---------- Player ---------- */
  var player = $('#player');
  var pv = $('#playerVideo');
  var playerFocus = null;
  function openPlayer(id) {
    playerFocus = document.activeElement;
    pv.poster = poster(id);
    pv.src = R + 'media/videos/' + id + '.mp4';
    var cap = $('#playerCaption'); cap.innerHTML = '';
    captionNodes(id).forEach(function (n) { cap.appendChild(n); });
    player.hidden = false;
    document.body.classList.add('locked');
    heroVideos.forEach(function (v) { v.pause(); });
    $('[data-close-player]').focus();
    pv.play().catch(function () {});
  }
  function closePlayer() {
    pv.pause(); pv.removeAttribute('src'); pv.load();
    player.hidden = true;
    if (project.hidden) document.body.classList.remove('locked');
    if (!heroPaused) heroVideos.forEach(function (v) {
      var r = v.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) v.play().catch(function () {});
    });
    if (playerFocus) playerFocus.focus();
  }
  $('[data-close-player]').addEventListener('click', closePlayer);
  player.addEventListener('click', function (e) { if (e.target === player) closePlayer(); });

  /* Keyboard: Esc closes the top layer; Tab stays inside open dialogs */
  document.addEventListener('keydown', function (e) {
    var layer = !player.hidden ? player : (!project.hidden ? project : null);
    if (!layer) return;
    if (e.key === 'Escape') { layer === player ? closePlayer() : closeProject(); return; }
    if (e.key === 'Tab') {
      var f = layer.querySelectorAll('button, a[href], video[controls]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Carousels: arrows move one card at a time ----------
     In RTL "next" scrolls toward the left (negative scrollLeft); in LTR toward the right. */
  function wireCarousels() {
    document.querySelectorAll('.carousel-nav').forEach(function (nav) {
      var track = document.getElementById(nav.getAttribute('data-carousel'));
      var dir = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
      var prev = nav.querySelector('[data-dir="prev"]'), next = nav.querySelector('[data-dir="next"]');
      function step() {
        var first = track.firstElementChild;
        return first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth;
      }
      function update() {
        var max = track.scrollWidth - track.clientWidth, pos = Math.abs(track.scrollLeft);
        prev.disabled = pos < 4;
        next.disabled = pos > max - 4;
        nav.hidden = max < 4;
      }
      prev.addEventListener('click', function () { track.scrollBy({ left: -dir * step() }); });
      next.addEventListener('click', function () { track.scrollBy({ left: dir * step() }); });
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  /* ---------- Header, nav, reveal ---------- */
  function wireHeader() {
    var header = $('.site-header');
    var bar = $('#scrollProgress'), ticking = false;
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    var toggle = $('.menu-toggle'), nav = $('#nav');
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
      nav.classList.toggle('open', open); header.classList.toggle('menu-open', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && toggle.getAttribute('aria-expanded') === 'true') toggle.click();
    });

    var links = {};
    nav.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (k) { var s = document.getElementById(k); if (s) spy.observe(s); });
  }
  function wireReveal() {
    var items = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) { items.forEach(function (i) { i.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (i) { io.observe(i); });
  }

  /* ---------- Init ---------- */
  wireContacts();
  buildHero();
  buildLogos();
  buildGrids();
  wireHeader();
  wireCarousels();
  wireReveal();
  fetch(R + 'media/meta.json').then(function (r) { return r.json(); }).then(function (list) {
    list.forEach(function (m) { meta[m.id] = m; });
  }).catch(function () {}).then(route);
})();
