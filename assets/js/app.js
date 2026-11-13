/* ==========================================================================
   Portfolio site behaviour.
   Content comes from content/*.js and portfolio/*.js - there is normally no
   reason to edit this file when updating text or photographs.
   ========================================================================== */
(function () {
  'use strict';

  var SITE = window.SITE_CONFIG || {};
  var DESIGNER = window.DESIGNER || {};
  var CONTACT = window.CONTACT || {};
  var PORTFOLIO = window.PORTFOLIO || {};
  var MANIFEST = window.PORTFOLIO_MANIFEST || {};
  var DATA = { site: SITE, designer: DESIGNER, contact: CONTACT };

  var TOKEN = /\[[A-Z0-9_ ]{3,}\]/;
  var TOKEN_SPLIT = /(\[[A-Z0-9_ ]{3,}\])/;
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ helpers */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, DATA);
  }
  function isPlaceholder(v) { return TOKEN.test(String(v == null ? '' : v)); }

  function h(tag, attrs) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'text') setText(el, v);
      else if (k === 'class') el.className = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (child == null || child === false) continue;
      el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return el;
  }

  /* Writes text; any [PLACEHOLDER] token is wrapped so it is visibly unfinished. */
  function setText(el, value) {
    var str = String(value == null ? '' : value);
    el.textContent = '';
    str.split(TOKEN_SPLIT).forEach(function (part) {
      if (!part) return;
      if (TOKEN.test(part) && part.charAt(0) === '[') {
        var s = document.createElement('span');
        s.className = 'token';
        s.textContent = part;
        el.appendChild(s);
      } else {
        el.appendChild(document.createTextNode(part));
      }
    });
  }

  function arrow() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon-arrow');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#icon-arrow');
    svg.appendChild(use);
    return svg;
  }

  /* ------------------------------------------------------- contact links */
  function whatsappUrl(number, message) {
    var digits = String(number == null ? '' : number).replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) return null;
    var url = 'https://wa.me/' + digits;
    if (message) url += '?text=' + encodeURIComponent(message);
    return url;
  }
  function emailUrl(email) {
    var e = String(email || '').trim();
    return /^[^\s@\[\]]+@[^\s@\[\]]+\.[^\s@\[\]]+$/.test(e) ? 'mailto:' + e : null;
  }
  function webUrl(url) {
    var u = String(url || '').trim();
    return /^https?:\/\/[^\s\[\]]+$/i.test(u) ? u : null;
  }
  function instagramHandle() {
    var ig = CONTACT.instagram || {};
    if (ig.handle) return ig.handle.charAt(0) === '@' ? ig.handle : '@' + ig.handle;
    var m = String(ig.url || '').match(/instagram\.com\/([^\/?#]+)/i);
    return m ? '@' + m[1] : 'Instagram';
  }

  function initContact() {
    var wa = CONTACT.whatsapp || {};
    var waHref = whatsappUrl(wa.number, wa.message);
    $$('[data-whatsapp]').forEach(function (a) {
      if (!waHref) { a.hidden = true; return; }
      a.href = waHref;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', 'Chat on WhatsApp (opens in a new tab)');
      a.hidden = false;
    });
    $$('[data-whatsapp-item]').forEach(function (li) { li.hidden = !waHref; });
    $$('[data-whatsapp-missing]').forEach(function (n) { n.hidden = !!waHref; });
    root.classList.toggle('has-whatsapp', !!waHref);

    var links = {
      email: { href: emailUrl(CONTACT.email), value: CONTACT.email, shown: CONTACT.email },
      instagram: {
        href: webUrl((CONTACT.instagram || {}).url),
        value: (CONTACT.instagram || {}).url,
        shown: instagramHandle(),
        external: true
      }
    };
    $$('[data-link]').forEach(function (a) {
      var link = links[a.getAttribute('data-link')];
      if (!link) return;
      var showsValue = a.getAttribute('data-show') === 'value';
      if (link.href) {
        a.href = link.href;
        if (link.external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        if (showsValue) a.textContent = link.shown;
        return;
      }
      // Not configured yet: never present it as a working link.
      if (showsValue) {
        var span = h('span', { class: a.className, text: link.value || '' });
        a.parentNode.replaceChild(span, a);
      } else if (a.closest('.contact__actions')) {
        a.hidden = true;
      } // elsewhere the label simply leads to the contact section (#contact)
    });

    var more = $('#social-more');
    var footer = $('#footer-contact');
    (CONTACT.social || []).forEach(function (s) {
      var href = s && webUrl(s.url);
      if (!href || !s.label) return;
      [more, footer].forEach(function (list) {
        if (!list) return;
        list.appendChild(h('li', null, h('a', { href: href, target: '_blank', rel: 'noopener noreferrer' }, s.label)));
      });
    });
  }

  /* ------------------------------------------------------------- binding */
  function initBindings() {
    $$('[data-bind]').forEach(function (el) {
      var value = get(el.getAttribute('data-bind'));
      if (value == null) value = '';
      if (el.hasAttribute('data-hide-empty') && !String(value).trim()) { el.hidden = true; return; }
      setText(el, value);
    });
    $$('[data-bind-paragraphs]').forEach(function (el) {
      var value = get(el.getAttribute('data-bind-paragraphs'));
      var list = Array.isArray(value) ? value : (value ? [value] : []);
      el.textContent = '';
      list.forEach(function (p) { el.appendChild(h('p', { text: p })); });
    });
    var year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
    if (DESIGNER.name && !isPlaceholder(DESIGNER.name)) {
      document.title = DESIGNER.name + ' — ' + ((SITE.hero || {}).eyebrow || 'Portfolio');
    }
  }

  /* -------------------------------------------------------------- images */
  function emptyFrame(frame, label) {
    frame.classList.add('frame--empty');
    frame.style.backgroundColor = '';
    frame.setAttribute('role', 'img');
    frame.setAttribute('aria-label', (label || 'Image') + ' — photograph to be added');
    frame.appendChild(h('span', { class: 'frame__mark' }, label || 'Image'));
    frame.appendChild(h('span', { class: 'frame__note' }, 'Photograph to be added'));
    return frame;
  }

  /* Builds a fixed-ratio frame so nothing shifts while the image loads. */
  function frame(img, o) {
    o = o || {};
    var f = h('div', { class: 'frame' + (o.cls ? ' ' + o.cls : '') });
    var ratio = o.ratio || (img ? img.width + ' / ' + img.height : '4 / 5');
    f.style.setProperty('--ratio', ratio);
    if (!img) return emptyFrame(f, o.label);

    f.style.backgroundColor = img.color || '';
    var el = document.createElement('img');
    var sources = img.sources || [];
    el.alt = o.alt != null ? o.alt : (img.alt || '');
    el.width = img.width;
    el.height = img.height;
    el.decoding = 'async';
    el.loading = o.eager ? 'eager' : 'lazy';
    if (o.eager) el.setAttribute('fetchpriority', 'high');
    el.sizes = o.sizes || '100vw';
    el.srcset = sources.map(function (s) { return encodeURI(s.src) + ' ' + s.w + 'w'; }).join(', ');
    el.addEventListener('load', function () { f.classList.add('is-loaded'); });
    el.addEventListener('error', function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      emptyFrame(f, o.label);
    });
    el.src = encodeURI((sources[Math.min(1, sources.length - 1)] || {}).src || img.src || '');
    if (el.complete && el.naturalWidth) f.classList.add('is-loaded');
    f.appendChild(el);
    return f;
  }

  function findImage(ref) {
    if (!ref || !ref.collection) return null;
    var c = bySlug[ref.collection];
    if (!c) return null;
    if (!ref.file) return c.images[0] || null;
    return c.images.filter(function (i) { return i.file === ref.file; })[0] || null;
  }

  /* --------------------------------------------------------- collections */
  function titleFromSlug(slug) {
    return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function buildCollections() {
    var listed = Array.isArray(PORTFOLIO.collections) ? PORTFOLIO.collections : [];
    var seen = {};
    var out = [];
    listed.forEach(function (c) {
      if (!c || !c.slug || seen[c.slug]) return;
      seen[c.slug] = true;
      if (!c.hidden) out.push(c);
    });
    Object.keys(MANIFEST).forEach(function (slug) {
      if (!seen[slug]) out.push({ slug: slug, title: titleFromSlug(slug) });
    });

    return out.map(function (c, i) {
      var meta = c.images || {};
      var images = (MANIFEST[c.slug] || []).slice();
      if (Array.isArray(c.order)) {
        var rank = function (im) { var n = c.order.indexOf(im.file); return n < 0 ? 1e6 : n; };
        images = images.map(function (im, n) { return { im: im, n: n }; })
          .sort(function (a, b) { return rank(a.im) - rank(b.im) || a.n - b.n; })
          .map(function (x) { return x.im; });
      }
      if (c.cover) {
        var idx = images.map(function (im) { return im.file; }).indexOf(c.cover);
        if (idx > 0) images.unshift(images.splice(idx, 1)[0]);
      }
      var title = c.title || titleFromSlug(c.slug);
      return {
        slug: c.slug,
        title: title,
        category: c.category || '',
        year: c.year ? String(c.year) : '',
        description: c.description || '',
        number: pad(i + 1),
        index: i,
        images: images.map(function (im, n) {
          var m = meta[im.file] || {};
          return {
            file: im.file, width: im.width, height: im.height, color: im.color, sources: im.sources,
            caption: m.caption || '',
            alt: m.alt || (title + (c.category ? ', ' + c.category : '') + ' — image ' + (n + 1))
          };
        })
      };
    });
  }

  var collections = buildCollections();
  var bySlug = {};
  collections.forEach(function (c) { bySlug[c.slug] = c; });

  function metaLine(c) {
    var bits = [];
    if (c.category) bits.push(c.category);
    if (c.year) bits.push(c.year);
    if (c.images.length) bits.push(c.images.length + (c.images.length === 1 ? ' piece' : ' pieces'));
    return bits.join('  ·  ');
  }
  function collectionHref(c) { return '#/collection/' + c.slug; }

  /* --------------------------------------------------------------- works */
  var VARIANTS = ['a', 'b', 'c'];

  function renderSpreads() {
    var host = $('#spreads');
    if (!host) return;
    host.textContent = '';

    if (!collections.length) {
      host.appendChild(h('p', { class: 'notice' },
        'No collections yet. Add a folder of photographs to portfolio/images/ and run tools/build_portfolio.py.'));
      return;
    }

    collections.forEach(function (c, i) {
      var variant = VARIANTS[i % VARIANTS.length];
      var href = collectionHref(c);
      var coverRatio = variant === 'b' ? '1 / 1' : '4 / 5';
      var art = h('article', { class: 'spread spread--' + variant, 'data-category': c.category });

      var cover = h('a', { class: 'spread__cover', href: href, tabindex: '-1', 'aria-hidden': 'true', 'data-reveal': 'image' },
        frame(c.images[0], {
          ratio: coverRatio, label: c.title, alt: '',
          sizes: '(min-width: 900px) 55vw, 100vw'
        }));

      var text = h('div', { class: 'spread__text', 'data-reveal': true },
        h('p', { class: 'spread__index' }, c.number),
        h('h3', { class: 'spread__title' }, h('a', { href: href, text: c.title })),
        metaLine(c) ? h('p', { class: 'caps spread__meta' }, metaLine(c)) : null,
        c.description ? h('p', { class: 'spread__desc', text: c.description }) : null,
        h('a', { class: 'link-arrow', href: href, 'aria-label': 'View collection: ' + c.title }, 'View collection', arrow())
      );

      art.appendChild(cover);
      art.appendChild(text);

      var minors = c.images.slice(1, variant === 'c' ? 3 : 2);
      if (!c.images.length) minors = [null];
      minors.forEach(function (img, n) {
        art.appendChild(h('a', {
          class: 'spread__minor spread__minor--' + (n + 1), href: href, tabindex: '-1', 'aria-hidden': 'true',
          'data-reveal': 'image'
        }, frame(img, {
          ratio: variant === 'a' ? '1 / 1' : (variant === 'b' ? '4 / 5' : '3 / 4'),
          label: c.title, alt: '', sizes: '(min-width: 900px) 28vw, 60vw'
        })));
      });

      host.appendChild(art);
    });
  }

  function renderFilters() {
    var host = $('#filters');
    if (!host) return;
    var used = {};
    collections.forEach(function (c) { if (c.category) used[c.category] = true; });
    var cats = (PORTFOLIO.categories || []).filter(function (c) { return used[c]; });
    Object.keys(used).forEach(function (c) { if (cats.indexOf(c) < 0) cats.push(c); });
    if (cats.length < 2) { host.hidden = true; return; }

    var status = $('#filter-status');
    function apply(cat, btn) {
      $$('.filter', host).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var shown = 0;
      $$('.spread').forEach(function (s) {
        var match = !cat || s.getAttribute('data-category') === cat;
        s.hidden = !match;
        if (match) shown++;
      });
      if (status) status.textContent = shown + (shown === 1 ? ' collection shown' : ' collections shown');
    }
    [''].concat(cats).forEach(function (cat, i) {
      var btn = h('button', { class: 'filter', type: 'button', 'aria-pressed': String(i === 0) }, cat || 'All');
      btn.addEventListener('click', function () { apply(cat, btn); });
      host.appendChild(btn);
    });
  }

  /* ------------------------------------------------------- page sections */
  function renderSlots() {
    var refs = SITE.images || {};
    var slots = {
      hero:       { label: 'Hero image', eager: true, cls: 'frame--fill', sizes: '(min-width: 900px) 50vw, 100vw' },
      heroDetail: { label: 'Detail', eager: true, ratio: '1 / 1', sizes: '(min-width: 900px) 22vw, 40vw' },
      process:    { label: 'Process', ratio: '4 / 5', sizes: '(min-width: 900px) 30vw, 100vw' }
    };
    Object.keys(slots).forEach(function (name) {
      var host = $('[data-slot="' + name + '"]');
      if (host) host.appendChild(frame(findImage(refs[name]), slots[name]));
    });

    var portraitHost = $('[data-slot="portrait"]');
    if (portraitHost) {
      var f = h('div', { class: 'frame' });
      f.style.setProperty('--ratio', '4 / 5');
      if (DESIGNER.portrait) {
        var img = h('img', { alt: DESIGNER.portraitAlt || 'Portrait of the designer', loading: 'lazy', decoding: 'async' });
        img.addEventListener('load', function () { f.classList.add('is-loaded'); });
        img.addEventListener('error', function () { f.removeChild(img); emptyFrame(f, 'Portrait'); });
        img.src = encodeURI(DESIGNER.portrait);
        f.appendChild(img);
      } else {
        emptyFrame(f, 'Portrait');
      }
      portraitHost.appendChild(f);
    }
  }

  function renderLists() {
    var details = $('#about-details');
    (DESIGNER.details || []).forEach(function (d) {
      details.appendChild(h('div', { 'data-reveal': true }, h('dt', { text: d.label }), h('dd', { text: d.text })));
    });

    var principles = $('#principles');
    (DESIGNER.philosophy || []).forEach(function (p, i) {
      principles.appendChild(h('li', { class: 'principle', 'data-reveal': true, style: '--d:' + (i % 3) * 90 + 'ms' },
        h('span', { class: 'principle__no', 'aria-hidden': 'true' }, pad(i + 1)),
        h('h3', { class: 'principle__title', text: p.title }),
        h('p', { text: p.text })));
    });

    var stages = $('#stages');
    (((DESIGNER.process || {}).stages) || []).forEach(function (s, i) {
      stages.appendChild(h('li', { class: 'stage', 'data-reveal': true },
        h('span', { class: 'stage__no', 'aria-hidden': 'true' }, pad(i + 1)),
        h('div', { class: 'stage__body' },
          h('h3', { class: 'stage__title', text: s.title }),
          h('p', { text: s.text }))));
    });
  }

  function renderStrip() {
    var host = $('#strip');
    if (!host) return;
    var count = Math.max(0, ((SITE.social || {}).stripCount) || 5);
    var heroRef = (SITE.images || {}).hero || {};
    var picks = [];
    // one image per collection first (prefer the second image so covers are not repeated), then fill up
    [1, 0, 2, 3].forEach(function (n) {
      collections.forEach(function (c) {
        var img = c.images[n];
        if (!img || picks.length >= count) return;
        if (c.slug === heroRef.collection && img.file === heroRef.file) return;
        if (n !== 1 && picks.some(function (p) { return p.c === c; }) && collections.length >= count) return;
        picks.push({ c: c, img: img });
      });
    });
    if (!picks.length) { host.hidden = true; return; }
    picks.forEach(function (p, i) {
      host.appendChild(h('a', {
        class: 'strip__item', href: collectionHref(p.c), 'data-reveal': 'image', style: '--d:' + i * 70 + 'ms',
        'aria-label': 'View collection: ' + p.c.title
      }, frame(p.img, { ratio: i % 2 ? '1 / 1' : '4 / 5', alt: '', sizes: '(min-width: 900px) 19vw, 33vw' })));
    });
  }

  /* ---------------------------------------------------- collection sheet */
  var sheet = $('#sheet');
  var sheetOpen = false;
  var openedInPage = false;
  var lastFocus = null;
  var outside = ['#site-header', '#menu', '#main', '#site-footer', '.wa-fab'];

  function renderSheet(c) {
    var content = $('#sheet-content');
    content.textContent = '';
    $('#sheet-count').textContent = c.number + ' / ' + pad(collections.length);

    content.appendChild(h('header', { class: 'sheet__head' },
      h('p', { class: 'eyebrow' }, h('span', null, c.number), c.category || 'Collection'),
      h('h2', { class: 'display display--xl', id: 'sheet-title', text: c.title }),
      h('div', { class: 'sheet__intro' },
        metaLine(c) ? h('p', { class: 'caps' }, metaLine(c)) : null,
        c.description ? h('p', { class: 'sheet__desc', text: c.description }) : null)));

    var gallery = h('div', { class: 'sheet__gallery' });
    var images = c.images.length ? c.images : [null, null, null];
    images.forEach(function (img, i) {
      gallery.appendChild(h('figure', { class: 'sheet__figure', 'data-reveal': 'image' },
        frame(img, { label: c.title, eager: i === 0, sizes: '(min-width: 900px) 60vw, 100vw' }),
        h('figcaption', { class: 'caption' },
          h('span', null, pad(i + 1)),
          img && img.caption ? img.caption : (img ? c.title : 'Photograph to be added'))));
    });
    content.appendChild(gallery);

    if (collections.length > 1) {
      var prev = collections[(c.index - 1 + collections.length) % collections.length];
      var next = collections[(c.index + 1) % collections.length];
      var nav = h('nav', { class: 'sheet__nav', 'aria-label': 'More collections' },
        h('a', { class: 'sheet__step', href: collectionHref(prev), 'data-step': prev.slug },
          h('span', { class: 'caps' }, 'Previous'), h('span', { class: 'sheet__step-title', text: prev.title })),
        h('a', { class: 'sheet__step sheet__step--next', href: collectionHref(next), 'data-step': next.slug },
          h('span', { class: 'caps' }, 'Next'), h('span', { class: 'sheet__step-title', text: next.title })));
      content.appendChild(nav);
    }
    sheet.setAttribute('data-slug', c.slug);
    $('#sheet-scroll').scrollTop = 0;
    observeReveals(content);
  }

  function showSheet(slug) {
    var c = bySlug[slug];
    if (!c) return;
    renderSheet(c);
    if (sheetOpen) return;
    sheetOpen = true;
    lastFocus = document.activeElement;
    closeMenu();
    sheet.hidden = false;
    root.classList.add('is-locked');
    outside.forEach(function (sel) { var el = $(sel); if (el) el.inert = true; });
    // next frame so the entrance transition runs
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { sheet.classList.add('is-open'); });
    });
    $('#sheet-close').focus({ preventScroll: true });
  }

  function hideSheet() {
    if (!sheetOpen) return;
    sheetOpen = false;
    openedInPage = false;
    sheet.classList.remove('is-open');
    root.classList.remove('is-locked');
    outside.forEach(function (sel) { var el = $(sel); if (el) el.inert = false; });
    var done = function () { if (!sheetOpen) sheet.hidden = true; };
    if (reduceMotion) done(); else window.setTimeout(done, 520);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  function requestClose() {
    if (openedInPage && window.history.length > 1) {
      window.history.back();           // returns to the exact scroll position
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search + '#work');
      hideSheet();
      var work = $('#work');
      if (work) work.scrollIntoView();
    }
  }

  function stepTo(slug) {
    if (!bySlug[slug]) return;
    window.history.replaceState(null, '', window.location.pathname + window.location.search + '#/collection/' + slug);
    renderSheet(bySlug[slug]);
    $('#sheet-close').focus({ preventScroll: true });
  }

  function route() {
    var m = window.location.hash.match(/^#\/collection\/([\w-]+)$/);
    if (m && bySlug[m[1]]) showSheet(m[1]);
    else hideSheet();
  }

  function initSheet() {
    if (!sheet) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#/collection/"]') : null;
      if (!a) return;
      var step = a.getAttribute('data-step');
      if (step && sheetOpen) { e.preventDefault(); stepTo(step); return; }
      if (!sheetOpen) openedInPage = true;
    });
    $('#sheet-close').addEventListener('click', requestClose);
    document.addEventListener('keydown', function (e) {
      if (!sheetOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); requestClose(); return; }
      if (collections.length < 2 || e.altKey || e.ctrlKey || e.metaKey) return;
      var current = bySlug[sheet.getAttribute('data-slug')];
      if (!current) return;
      if (e.key === 'ArrowRight') stepTo(collections[(current.index + 1) % collections.length].slug);
      if (e.key === 'ArrowLeft') stepTo(collections[(current.index - 1 + collections.length) % collections.length].slug);
    });
    window.addEventListener('hashchange', route);
    route();
  }

  /* ---------------------------------------------------------- navigation */
  var header = $('#site-header');
  var menu = $('#menu');
  var toggle = $('#menu-toggle');
  var menuOpen = false;

  function openMenu() {
    if (menuOpen || !menu) return;
    menuOpen = true;
    root.classList.add('menu-open', 'is-locked');
    menu.setAttribute('aria-hidden', 'false');
    menu.inert = false;
    toggle.setAttribute('aria-expanded', 'true');
    $('.menu-toggle__label', toggle).textContent = 'Close';
    ['#main', '#site-footer', '.wa-fab'].forEach(function (sel) { var el = $(sel); if (el) el.inert = true; });
  }
  function closeMenu(returnFocus) {
    if (!menuOpen) return;
    menuOpen = false;
    root.classList.remove('menu-open');
    if (!sheetOpen) root.classList.remove('is-locked');
    menu.setAttribute('aria-hidden', 'true');
    menu.inert = true;
    toggle.setAttribute('aria-expanded', 'false');
    $('.menu-toggle__label', toggle).textContent = 'Menu';
    if (!sheetOpen) ['#main', '#site-footer', '.wa-fab'].forEach(function (sel) { var el = $(sel); if (el) el.inert = false; });
    if (returnFocus) toggle.focus();
  }

  function initNav() {
    if (menu) menu.inert = true;
    if (toggle) toggle.addEventListener('click', function () { menuOpen ? closeMenu(true) : openMenu(); });
    if (menu) menu.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) closeMenu(true);
    });
    var desktop = window.matchMedia('(min-width: 900px)');
    var onChange = function () { if (desktop.matches) closeMenu(); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange); else desktop.addListener(onChange);

    // Header: transparent over the hero, solid afterwards; steps aside while reading down.
    var lastY = window.scrollY;
    var ticking = false;
    function update() {
      var y = window.scrollY;
      header.classList.toggle('is-solid', y > 24);
      if (!menuOpen) header.classList.toggle('is-hidden', y > lastY && y > 320);
      root.classList.toggle('past-hero', y > window.innerHeight * 0.7);
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
    update();
  }

  /* ------------------------------------------------------------ masthead */
  /* The name is set like a magazine masthead: sized to span the full width. */
  function initMasthead() {
    var el = $('#masthead');
    var host = el && $('.masthead__lines', el);
    if (!host) return;
    var name = String(DESIGNER.name || '').trim() || '[DESIGNER_NAME]';
    var display = isPlaceholder(name) ? name.replace(/_/g, ' ') : name;
    var words = display.split(/\s+/);
    var mode = null;

    function build(stacked) {
      var lines = [display];
      if (stacked && words.length > 1) {
        // two balanced lines
        var best = 1, bestDiff = Infinity;
        for (var i = 1; i < words.length; i++) {
          var diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
          if (diff < bestDiff) { bestDiff = diff; best = i; }
        }
        lines = [words.slice(0, best).join(' '), words.slice(best).join(' ')];
      }
      host.textContent = '';
      lines.forEach(function (line, i) {
        host.appendChild(h('span', { class: 'masthead__line' },
          h('span', { class: 'masthead__text', style: '--d:' + i * 110 + 'ms' }, line)));
      });
    }

    function fit() {
      var stacked = window.innerWidth < 700;
      if (stacked !== mode) { mode = stacked; build(stacked); }
      el.style.fontSize = '100px';
      var widest = 0;
      $$('.masthead__text', host).forEach(function (t) { widest = Math.max(widest, t.getBoundingClientRect().width); });
      if (!widest) return;
      var size = 100 * el.clientWidth / widest;
      size = Math.min(size * 0.992, window.innerWidth * 0.3, window.innerHeight * (stacked ? 0.2 : 0.34));
      el.style.fontSize = Math.max(34, Math.floor(size)) + 'px';
    }

    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    var timer;
    window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(fit, 120); });
  }

  /* ------------------------------------------------------------- reveals */
  var observer = null;
  function observeReveals(ctx) {
    var items = $$('[data-reveal]', ctx);
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    }
    items.forEach(function (el) { if (!el.classList.contains('is-in')) observer.observe(el); });
  }

  /* ---------------------------------------------------------------- init */
  function init() {
    initBindings();
    initContact();
    renderSlots();
    renderSpreads();
    renderFilters();
    renderLists();
    renderStrip();
    initMasthead();
    initNav();
    initSheet();
    observeReveals(document);

    // Entrance: wait briefly for the display font so the masthead does not jump.
    var ready = function () { root.classList.add('is-ready'); };
    if (document.fonts && document.fonts.ready && !reduceMotion) {
      var fallback = window.setTimeout(ready, 900);
      document.fonts.ready.then(function () { window.clearTimeout(fallback); requestAnimationFrame(ready); });
    } else {
      ready();
    }
  }

  // Exposed for quick checks from the browser console.
  window.__portfolio = { whatsappUrl: whatsappUrl, collections: collections };

  try {
    init();
  } catch (error) {
    // Never leave the page hidden behind an entrance animation if something fails.
    root.classList.remove('js');
    root.classList.add('is-ready');
    if (window.console) console.error(error);
  }
})();
