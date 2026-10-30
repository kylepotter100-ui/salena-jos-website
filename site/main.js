/* Salena-Jo's landing page: the rail, the hero crossfade, the open/closed sign, entrances and the booking flow. */
(function () {
  'use strict';

  var CONFIG = {
    onlineBooking: true // false removes the booking card; the phone number stays as the way to book
  };

  var TREAT = [
    { id: 'nails', name: 'Nails', short: 'nails' },
    { id: 'waxing', name: 'Advanced waxing', short: 'waxing' },
    { id: 'facials', name: 'Facials', short: 'facial' },
    { id: 'browlash', name: 'Brow & lash treatments', short: 'brow and lash' },
    { id: 'tans', name: 'Spray tans', short: 'spray tan' },
    { id: 'caci', name: 'CACI facials', short: 'CACI facial' }
  ];
  // Minutes from midnight, Sunday = 0. Taken from a public directory listing; confirm with the salon.
  // The hours table in index.html shows the same times for visitors without script.
  var HOURS = { 0: null, 1: null, 2: null, 3: [570, 1200], 4: [690, 1200], 5: [570, 1020], 6: [600, 960] };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  var doc = document.documentElement;
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var canAnimate = !reduced && typeof Element.prototype.animate === 'function';
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function settle(a) { a.finished.then(function () { a.cancel(); }).catch(function () {}); }

  /* ---------- Entrances ---------- */

  // The rail and the phone's hero line rise in once on load; everything else enters as it scrolls in.
  function setupIntro() {
    if (!canAnimate) return;
    var rail = $('.rail-inner'), foot = $('.hero-foot');
    [rail, foot].forEach(function (el, i) {
      if (!el) return;
      settle(el.animate([{ opacity: 0, transform: 'translate3d(0,16px,0)' }, { opacity: 1, transform: 'none' }], { duration: 1100, delay: 250 + i * 120, easing: EASE, fill: 'backwards' }));
    });
    var first = $('.hero-frame.is-on');
    if (first) settle(first.animate([{ transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 2400, easing: EASE }));
  }

  // Each part of a section (heading, text, picture) rises 24px with opacity, staggered by its data-delay.
  // The animations start paused at their first frame, so without script the content is simply there.
  function setupReveals() {
    if (!canAnimate || !('IntersectionObserver' in window)) return;
    var K = {
      up: [[{ opacity: 0, transform: 'translate3d(0,24px,0)' }, { opacity: 1, transform: 'none' }], 1000],
      img: [[{ opacity: 0, clipPath: 'inset(12% 0 0 0)', transform: 'translate3d(0,24px,0)' }, { opacity: 1, clipPath: 'inset(0% 0 0 0)', transform: 'none' }], 1300]
    };
    var anims = new Map();
    $$('[data-reveal]').forEach(function (el) {
      var k = K[el.getAttribute('data-reveal')] || K.up;
      var a = el.animate(k[0], { duration: k[1], delay: parseFloat(el.getAttribute('data-delay')) || 0, easing: EASE, fill: 'both' });
      a.pause(); a.currentTime = 0;
      anims.set(el, a);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var a = anims.get(en.target);
        if (a) { a.play(); settle(a); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    anims.forEach(function (a, el) {
      // Anything already on screen at load plays at once.
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { a.play(); settle(a); } else io.observe(el);
    });
  }

  function setupCount() {
    var el = $('#count');
    if (!el || reduced || !('IntersectionObserver' in window)) return;
    var target = parseInt(el.textContent, 10) || 20;
    el.textContent = '0';
    var io = new IntersectionObserver(function (es) {
      if (!es.some(function (e) { return e.isIntersecting; })) return;
      io.disconnect();
      var t0 = performance.now(), dur = 1700;
      (function tick(t) {
        var p = Math.min(1, (t - t0) / dur);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, { threshold: 0.5 });
    io.observe(el);
  }

  /* ---------- Signature: the shopfront slowly crossfades between three framings ---------- */

  function setupCrossfade() {
    var frames = $$('.hero-frame');
    if (!canAnimate || frames.length < 2) return;
    var i = 0, timer = null;
    function next() {
      var cur = frames[i], nxt = frames[(i + 1) % frames.length];
      i = (i + 1) % frames.length;
      nxt.classList.add('is-on');
      var base = getComputedStyle(nxt).transform;
      base = base === 'none' ? '' : base + ' ';
      nxt.animate([{ opacity: 0, transform: base + 'scale(1.02)' }, { opacity: 1, transform: base + 'scale(1)' }], { duration: 1600, easing: 'ease-in-out' });
      var out = cur.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1600, easing: 'ease-in-out' });
      out.finished.then(function () { cur.classList.remove('is-on'); }).catch(function () {});
    }
    function start() { if (!timer) timer = setInterval(next, 5600); }
    function stop() { clearInterval(timer); timer = null; }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    start();
  }

  /* ---------- Rail, menu, scroll-linked pictures ---------- */

  var rail = $('#rail'), menu = $('#menu'), burger = $('#burger'), board = $('.board');
  var menuOpen = false, ticking = false;
  var px = $$('[data-parallax]').map(function (el) { return { el: el, f: parseFloat(el.getAttribute('data-parallax')) || 0.1 }; });
  var scaler = $('[data-scale]');

  function railH() { return rail.getBoundingClientRect().height; }

  function handleScroll() {
    var vh = window.innerHeight || 800;
    // The rail rides over the two photographs, then takes the page ground.
    var boardBottom = board ? board.getBoundingClientRect().bottom : 0;
    rail.classList.toggle('is-docked', boardBottom <= railH());
    if (reduced) return;
    var wide = window.innerWidth >= 900;
    px.forEach(function (p) {
      // On narrow screens the academy photo sits in normal flow, so only the full-bleed visit photo drifts there.
      if (!wide && p.el.classList.contains('about-photo-move')) { p.el.style.transform = ''; return; }
      var r = p.el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      p.el.style.transform = 'translate3d(0,' + (-((r.top + r.height / 2) - vh / 2) * p.f).toFixed(1) + 'px,0)';
    });
    if (scaler && board) {
      var b = board.getBoundingClientRect();
      if (b.bottom > 0 && b.top < vh) {
        var t = Math.min(1, Math.max(0, 1 - b.bottom / (vh + b.height)));
        scaler.style.transform = 'scale(' + (1.12 - t * 0.12).toFixed(4) + ')';
      }
    }
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; handleScroll(); });
  }

  function toggleMenu(force) {
    menuOpen = typeof force === 'boolean' ? force : !menuOpen;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    doc.classList.toggle('menu-open', menuOpen);
    burger.setAttribute('aria-expanded', String(menuOpen));
    burger.textContent = menuOpen ? 'Close' : 'Menu';
    menu.setAttribute('aria-hidden', String(!menuOpen));
    $$('a', menu).forEach(function (a) { a.tabIndex = menuOpen ? 0 : -1; });
  }

  function scrollToY(top) { window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' }); }
  function scrollToId(id) {
    var el = id === 'top' ? null : document.getElementById(id);
    scrollToY(el ? el.getBoundingClientRect().top + window.scrollY - railH() : 0);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-nav]');
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute('data-nav');
    if (menuOpen) { toggleMenu(false); setTimeout(function () { scrollToId(id); }, 380); } else scrollToId(id);
  });
  burger.addEventListener('click', function () { toggleMenu(); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) { toggleMenu(false); burger.focus(); } });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------- The live thing: the door sign, flipped to match the real hours ---------- */

  function fmtTime(m, compact) {
    var h = Math.floor(m / 60), mm = m % 60, h12 = ((h + 11) % 12) + 1, sfx = h < 12 ? 'am' : 'pm';
    if (compact && mm === 0) return h12 + sfx;
    return h12 + ':' + String(mm).padStart(2, '0') + sfx;
  }

  function openStatus(now) {
    var dow = now.getDay(), mins = now.getHours() * 60 + now.getMinutes(), h = HOURS[dow];
    if (h && mins >= h[0] && mins < h[1]) {
      var left = h[1] - mins;
      return { open: true, word: 'Open now', sub: 'Until ' + fmtTime(h[1], true) + ' today' + (left <= 60 ? ', closing in ' + left + ' min' : '') };
    }
    if (h && mins < h[0]) return { open: false, word: 'Closed', sub: 'Opens today at ' + fmtTime(h[0], true) };
    for (var i = 1; i <= 7; i++) {
      var d = (dow + i) % 7, hh = HOURS[d];
      if (hh) return { open: false, word: 'Closed', sub: 'Opens ' + (i === 1 ? 'tomorrow' : DAYS[d]) + ' at ' + fmtTime(hh[0], true) };
    }
    return { open: false, word: 'Closed', sub: '' };
  }

  var lastSign = null;
  function renderSign() {
    var now = new Date(), st = openStatus(now), sign = $('#sign');
    var key = st.word + st.sub;
    if (key === lastSign) return;
    var first = lastSign === null;
    lastSign = key;
    var apply = function () {
      $('#sign-word').textContent = st.word;
      $('#sign-sub').textContent = st.sub;
      sign.classList.toggle('is-open', st.open);
    };
    if (!canAnimate || first) apply();
    if (canAnimate && !first) {
      sign.animate([{ transform: 'rotateX(0)' }, { transform: 'rotateX(90deg)' }], { duration: 260, easing: 'cubic-bezier(.5,0,.75,0)' }).finished.then(function () {
        apply();
        sign.animate([{ transform: 'perspective(600px) rotateX(-90deg)' }, { transform: 'perspective(600px) rotateX(0)' }], { duration: 700, easing: 'cubic-bezier(.34,1.56,.64,1)' });
      }).catch(apply);
    }
    var dow = now.getDay();
    $$('#hours tr').forEach(function (tr) {
      tr.classList.toggle('is-today', tr.getAttribute('data-day').split(',').indexOf(String(dow)) >= 0);
    });
  }

  // The sign swings once as the card comes into view, like the one on the door.
  function setupSignSwing() {
    var sign = $('#sign');
    if (!canAnimate || !sign || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      if (!es.some(function (e) { return e.isIntersecting; })) return;
      io.disconnect();
      sign.animate([
        { transform: 'perspective(600px) rotateX(-70deg)', opacity: 0 },
        { transform: 'perspective(600px) rotateX(14deg)', opacity: 1, offset: 0.55 },
        { transform: 'perspective(600px) rotateX(-5deg)', offset: 0.8 },
        { transform: 'perspective(600px) rotateX(0)' }
      ], { duration: 1400, delay: 350, easing: 'ease-out', fill: 'backwards' });
    }, { threshold: 0.6 });
    io.observe(sign);
  }

  /* ---------- Booking ---------- */

  var card = $('#book-card');
  var bk = {
    step: 1, treatment: null, dayKey: null, slot: null,
    form: { name: '', phone: '', email: '', notes: '', first: false },
    touched: {}, submitted: false, sending: false, done: false
  };
  var advT, sendT, daysCache = { key: null, days: null };

  // Placeholder availability: a stable pseudo-random ~30% of slots show as taken.
  // Replace with real availability once a booking service is connected.
  function rand(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return ((h >>> 0) % 1000) / 1000;
  }

  function getDays() {
    var now = new Date(), nowM = now.getHours() * 60 + now.getMinutes();
    var key = now.toDateString() + '|' + (bk.treatment || '') + '|' + Math.floor(nowM / 30);
    if (daysCache.key === key) return daysCache.days;
    var out = [];
    for (var i = 0; i < 21; i++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      var dow = d.getDay(), hrs = HOURS[dow];
      var dkey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      var slots = [];
      if (hrs) {
        for (var m = hrs[0]; m <= hrs[1] - 60; m += 30) {
          if (i === 0 && m < nowM + 60) continue;
          slots.push({ m: m, off: rand(dkey + ':' + m + ':' + (bk.treatment || '')) < 0.3 });
        }
      }
      out.push({ key: dkey, date: d, dow: dow, i: i, closed: !hrs, full: !!hrs && !slots.some(function (x) { return !x.off; }), slots: slots });
    }
    daysCache = { key: key, days: out };
    return out;
  }

  function sel() { return TREAT.find(function (t) { return t.id === bk.treatment; }) || null; }
  function selDay() { var k = bk.dayKey; return getDays().find(function (d) { return d.key === k; }) || null; }
  function dayShort(d) { return DAYS[d.dow].slice(0, 3) + ' ' + d.date.getDate() + ' ' + MON[d.date.getMonth()]; }
  function dayLong(d) { return DAYS[d.dow] + ' ' + d.date.getDate() + ' ' + MONL[d.date.getMonth()]; }
  function sumWhen() { var d = selDay(); return d && bk.slot != null ? dayShort(d) + ', ' + fmtTime(bk.slot, true) : ''; }

  function validate(f) {
    var e = {}, digits = f.phone.replace(/\D/g, '');
    if (f.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!digits) e.phone = 'Please enter your mobile number.';
    else if (!/^(07\d{9}|447\d{9})$/.test(digits)) e.phone = 'Enter a UK mobile number, for example 07700 900123.';
    if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Check your email address.';
    return e;
  }

  function step1Html() {
    return '<div data-step-panel><h3>Choose a treatment</h3><p class="bk-sub">Pick the closest match, then a day and time. You can add details at the end.</p>' +
      '<div class="bk-options" role="radiogroup" aria-label="Treatment">' + TREAT.map(function (t) {
        return '<button type="button" class="bk-opt" role="radio" aria-checked="' + (bk.treatment === t.id) + '" data-pick="' + t.id + '">' +
          '<span class="bk-opt-radio"></span><span class="bk-opt-name">' + esc(t.name) + '</span><span class="bk-opt-arrow" aria-hidden="true">→</span></button>';
      }).join('') + '</div></div>';
  }

  function step2Html() {
    var days = getDays(), day = selDay(), can = !!(day && bk.slot != null);
    var dayBtns = days.map(function (d) {
      var off = d.closed || d.full;
      return '<button type="button" class="bk-day" data-day="' + d.key + '"' + (off ? ' disabled' : '') + ' aria-pressed="' + (bk.dayKey === d.key) + '" aria-label="' +
        esc(dayLong(d) + (d.closed ? ', closed' : d.full ? ', fully booked' : '')) + '">' +
        '<span class="bk-day-wk">' + (d.i === 0 ? 'Today' : DAYS[d.dow].slice(0, 3)) + '</span><span class="bk-day-num">' + d.date.getDate() + '</span>' +
        '<span class="bk-day-sub">' + (d.closed ? 'Closed' : d.full ? 'Full' : MON[d.date.getMonth()]) + '</span></button>';
    }).join('');
    var groups = '';
    if (day && !day.closed) {
      [['Morning', function (m) { return m < 720; }], ['Afternoon', function (m) { return m >= 720 && m < 1020; }], ['Evening', function (m) { return m >= 1020; }]].forEach(function (g) {
        var sl = day.slots.filter(function (x) { return g[1](x.m); });
        if (!sl.length) return;
        groups += '<div class="bk-group"><p class="bk-group-label">' + g[0] + '</p><div class="bk-slots">' + sl.map(function (x) {
          return '<button type="button" class="bk-slot" data-slot="' + x.m + '"' + (x.off ? ' disabled aria-label="' + fmtTime(x.m) + ', taken"' : '') + ' aria-pressed="' + (bk.slot === x.m) + '">' + fmtTime(x.m) + '</button>';
        }).join('') + '</div></div>';
      });
    }
    if (!day) groups = '<p class="bk-empty">No times are free in the next three weeks. Please call us to book.</p>';
    return '<div data-step-panel>' +
      '<button type="button" class="bk-summary" data-go="1"><span class="bk-summary-name">' + esc(sel() ? sel().name : '') + '</span><span class="bk-change">Change</span></button>' +
      '<h3>Choose a day</h3><div class="bk-days" id="bk-days">' + dayBtns + '</div>' +
      '<div class="bk-time-head"><h3>Choose a time</h3><span>' + (day ? esc(dayLong(day)) : '') + '</span></div>' + groups +
      '<div class="bk-actions"><button type="button" class="bk-back" data-go="1">Back</button>' +
      '<button type="button" class="bk-next" data-go="3"' + (can ? '' : ' disabled') + '>' + (can ? 'Continue' : 'Select a time') + '</button></div></div>';
  }

  function field(name, label, type, extra) {
    return '<label class="bk-field"><span class="bk-field-label">' + label + '</span>' +
      '<input class="bk-input" type="' + type + '" name="' + name + '" value="' + esc(bk.form[name]) + '" aria-describedby="err-' + name + '" ' + extra + '>' +
      '<span class="bk-error" role="alert" id="err-' + name + '" data-err="' + name + '"></span></label>';
  }

  function step3Html() {
    return '<div data-step-panel>' +
      '<button type="button" class="bk-summary" data-go="2"><span class="bk-summary-main"><span class="bk-summary-name">' + esc(sel() ? sel().name : '') + '</span>' +
      '<span class="bk-summary-when">' + esc(sumWhen()) + '</span></span><span class="bk-change">Change</span></button>' +
      '<h3 style="margin-bottom:18px">Your details</h3>' +
      '<form class="bk-form" id="bk-form" novalidate>' +
      field('name', 'Full name', 'text', 'autocomplete="name"') +
      field('phone', 'Mobile number', 'tel', 'inputmode="tel" autocomplete="tel" placeholder="07700 900123" style="font-variant-numeric:tabular-nums"') +
      field('email', 'Email <em>(optional)</em>', 'email', 'inputmode="email" autocomplete="email"') +
      '<label class="bk-field"><span class="bk-field-label">Anything we should know? <em>(optional)</em></span>' +
      '<textarea class="bk-input" name="notes" rows="3" placeholder="For example, gel removal or a colour in mind">' + esc(bk.form.notes) + '</textarea></label>' +
      '<label class="bk-check"><input type="checkbox" name="first"' + (bk.form.first ? ' checked' : '') + '><span class="bk-check-box" aria-hidden="true"></span><span>This is my first visit</span></label>' +
      (bk.treatment === 'browlash' ? '<p class="bk-note">Tints need a patch test at least 48 hours before your first appointment. We’ll arrange this when we confirm.</p>' : '') +
      '<button type="submit" class="bk-submit"' + (bk.sending ? ' disabled' : '') + '>' + (bk.sending ? '<span class="bk-spinner"></span>' : '') +
      '<span>' + (bk.sending ? 'Sending request…' : 'Send booking request') + '</span></button>' +
      '<div class="bk-form-foot"><button type="button" data-go="2">← Back</button><span>We only use your details to arrange this visit.</span></div>' +
      '</form></div>';
  }

  function doneHtml() {
    var t = sel(), d = selDay(), first = bk.form.name.trim().split(/\s+/)[0] || '';
    var text = t && d ? 'Thanks' + (first ? ', ' + first : '') + '. We’ll text ' + bk.form.phone + ' to confirm your ' + t.short + ' appointment on ' + dayLong(d) + ' at ' + fmtTime(bk.slot, true) + '.' : '';
    return '<div class="bk-done" data-step-panel><img data-pop src="assets/crown-slate.png" alt="" width="78" height="69">' +
      '<h3>Request sent</h3><p class="bk-done-text">' + esc(text) + '</p>' +
      '<dl class="bk-receipt"><div><dt>Treatment</dt><dd>' + esc(t ? t.name : '') + '</dd></div><div><dt>When</dt><dd>' + esc(sumWhen()) + '</dd></div>' +
      '<div><dt>Where</dt><dd>64 Ashby Road, Loughborough</dd></div></dl>' +
      '<div class="bk-done-actions"><button type="button" class="bk-ics" data-ics>Add to calendar</button><a href="tel:+441509215678" class="bk-done-call">Call 01509 215678</a></div>' +
      '<button type="button" class="bk-reset" data-reset>Make another booking</button></div>';
  }

  // Full re-render of the card. `dir` animates the panel in (1 forward, -1 back, 0 none).
  function renderCard(dir) {
    var fromH = card.getBoundingClientRect().height;
    var daysEl = $('#bk-days', card), scrollX = daysEl ? daysEl.scrollLeft : 0;
    card.innerHTML = bk.done ? doneHtml() : (bk.step === 1 ? step1Html() : bk.step === 2 ? step2Html() : step3Html());
    var newDays = $('#bk-days', card);
    if (newDays && !dir) newDays.scrollLeft = scrollX;
    if (bk.step === 3 && !bk.done) updateErrors();
    if (!dir) return;
    if (canAnimate) {
      var toH = card.getBoundingClientRect().height;
      if (Math.abs(toH - fromH) > 2) {
        card.style.overflow = 'hidden';
        var a = card.animate([{ height: fromH + 'px' }, { height: toH + 'px' }], { duration: 650, easing: EASE });
        var clear = function () { card.style.overflow = ''; };
        a.finished.then(clear).catch(clear);
      }
      var panel = $('[data-step-panel]', card);
      if (panel) panel.animate([{ opacity: 0, transform: 'translate3d(' + (28 * dir) + 'px,0,0)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: EASE });
      var pop = bk.done && $('[data-pop]', card);
      if (pop) pop.animate([{ opacity: 0, transform: 'translate3d(0,-18px,0) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 950, delay: 120, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' });
    }
    var r = card.getBoundingClientRect(), top = railH() + 12;
    if (r.top < top) scrollToY(window.scrollY + r.top - top);
  }

  function goStep(n) {
    var dir = n > bk.step ? 1 : -1;
    bk.step = n; bk.done = false;
    if (n === 2) {
      var ok = function (d) { return !d.closed && !d.full; };
      var days = getDays();
      if (!days.find(function (d) { return d.key === bk.dayKey && ok(d); })) {
        var first = days.find(ok);
        bk.dayKey = first ? first.key : null; bk.slot = null;
      }
    }
    renderCard(dir);
  }

  function updateErrors() {
    var errs = validate(bk.form);
    ['name', 'phone', 'email'].forEach(function (k) {
      var input = $('[name="' + k + '"]', card), msg = $('[data-err="' + k + '"]', card);
      if (!input || !msg) return;
      var show = !!((bk.touched[k] || bk.submitted) && errs[k]);
      input.setAttribute('aria-invalid', String(show));
      msg.textContent = show ? errs[k] : '';
    });
  }

  function setSending(on) {
    var btn = $('.bk-submit', card);
    if (!btn) return;
    btn.disabled = on;
    btn.innerHTML = (on ? '<span class="bk-spinner"></span>' : '') + '<span>' + (on ? 'Sending request…' : 'Send booking request') + '</span>';
  }

  function submit() {
    if (bk.sending) return;
    bk.submitted = true;
    var errs = validate(bk.form);
    updateErrors();
    if (Object.keys(errs).length) {
      var el = $('[aria-invalid="true"]', card);
      if (el) el.focus();
      return;
    }
    bk.sending = true; setSending(true);
    // No booking backend yet: this simulates the request. Connect to a booking service, email or SMS here.
    sendT = setTimeout(function () { bk.sending = false; bk.done = true; renderCard(1); }, 1300);
  }

  function resetBooking() {
    clearTimeout(sendT);
    bk = { step: 1, treatment: null, dayKey: null, slot: null, form: { name: '', phone: '', email: '', notes: '', first: false }, touched: {}, submitted: false, sending: false, done: false };
    renderCard(-1);
  }

  function downloadIcs() {
    var t = sel();
    if (!t || !bk.dayKey || bk.slot == null) return;
    var p = function (n) { return String(n).padStart(2, '0'); };
    var parts = bk.dayKey.split('-').map(Number);
    var start = new Date(parts[0], parts[1] - 1, parts[2], Math.floor(bk.slot / 60), bk.slot % 60), end = new Date(start.getTime() + 3600000);
    var f = function (dt) { return dt.getFullYear() + p(dt.getMonth() + 1) + p(dt.getDate()) + 'T' + p(dt.getHours()) + p(dt.getMinutes()) + '00'; };
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Salena-Jos//Booking//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@salenajos', 'DTSTAMP:' + f(new Date()),
      'DTSTART:' + f(start), 'DTEND:' + f(end), 'SUMMARY:' + t.name + " at Salena-Jo's (awaiting confirmation)", 'LOCATION:64 Ashby Road\\, Loughborough LE11 3AE',
      'DESCRIPTION:Booking request sent. To change it call 01509 215678.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'salena-jos-appointment.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  function scrollToCard() { scrollToY(card.getBoundingClientRect().top + window.scrollY - railH() - 12); }

  function setupBooking() {
    if (!CONFIG.onlineBooking) {
      card.remove();
      $$('[data-book]').forEach(function (a) { a.setAttribute('data-nav', 'book'); });
      return;
    }
    renderCard(0);

    card.addEventListener('click', function (e) {
      var t = e.target.closest('button, a');
      if (!t || t.disabled) return;
      if (t.hasAttribute('data-pick')) {
        bk.treatment = t.getAttribute('data-pick'); bk.slot = null;
        $$('.bk-opt', card).forEach(function (b) { b.setAttribute('aria-checked', String(b === t)); });
        clearTimeout(advT);
        advT = setTimeout(function () { goStep(2); }, 420);
      } else if (t.hasAttribute('data-day')) {
        bk.dayKey = t.getAttribute('data-day'); bk.slot = null; renderCard(0);
      } else if (t.hasAttribute('data-slot')) {
        bk.slot = parseInt(t.getAttribute('data-slot'), 10); renderCard(0);
      } else if (t.hasAttribute('data-go')) {
        var n = parseInt(t.getAttribute('data-go'), 10);
        if (n === 3 && !(selDay() && bk.slot != null)) return;
        goStep(n);
      } else if (t.hasAttribute('data-ics')) downloadIcs();
      else if (t.hasAttribute('data-reset')) resetBooking();
    });

    card.addEventListener('input', function (e) {
      var el = e.target;
      if (!el.name || !(el.name in bk.form)) return;
      bk.form[el.name] = el.type === 'checkbox' ? el.checked : el.value;
      if (bk.touched[el.name] || bk.submitted) updateErrors();
    });
    card.addEventListener('change', function (e) {
      if (e.target.name === 'first') bk.form.first = e.target.checked;
    });
    card.addEventListener('focusout', function (e) {
      var el = e.target, k = el.name;
      if (['name', 'phone', 'email'].indexOf(k) < 0) return;
      if (k === 'phone') {
        var d = bk.form.phone.replace(/\D/g, '');
        if (/^07\d{9}$/.test(d)) { bk.form.phone = d.slice(0, 5) + ' ' + d.slice(5); el.value = bk.form.phone; }
      }
      bk.touched[k] = true;
      updateErrors();
    });
    card.addEventListener('submit', function (e) { e.preventDefault(); submit(); });

    // Each treatment row jumps straight to day and time with that treatment chosen.
    $$('[data-book]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        clearTimeout(advT); clearTimeout(sendT);
        bk.treatment = a.getAttribute('data-book'); bk.slot = null; bk.done = false; bk.sending = false;
        bk.step = 1;
        goStep(2);
        setTimeout(scrollToCard, 40);
      });
    });
  }

  /* ---------- Init ---------- */

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  renderSign();
  setInterval(renderSign, 30000);
  setupBooking();
  setupIntro();
  setupReveals();
  setupCount();
  setupCrossfade();
  setupSignSwing();
  handleScroll();
})();
